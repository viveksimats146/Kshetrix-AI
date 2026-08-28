from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ml_engine import AgricoML
import os
import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List, Optional

def load_env_file():
    env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
    if os.path.exists(env_path):
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#"):
                    if "=" in line:
                        key, val = line.split("=", 1)
                        val = val.strip().strip('"').strip("'")
                        os.environ[key.strip()] = val

# Load .env variables at startup
load_env_file()

app = FastAPI(title="Kshetrix-AI API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ML Engine
DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "Agriculture_price_dataset.csv")
agrico = AgricoML(DATA_PATH)

def init_supabase_db():
    db_url = os.environ.get("DATABASE_URL")
    if not db_url:
        print("DATABASE_URL env variable not set, skipping DB initialization.")
        return
    
    print("Connecting to Supabase database to initialize tables...")
    try:
        import psycopg2
        conn = psycopg2.connect(db_url)
        conn.autocommit = True
        cur = conn.cursor()
        sql = """
        -- Create User Profiles table
        CREATE TABLE IF NOT EXISTS public.profiles (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL,
            state TEXT NOT NULL,
            district TEXT NOT NULL,
            crop_preferences TEXT[] DEFAULT '{}',
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
        );

        ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
        ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
        ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS photo TEXT;
        ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS theme TEXT DEFAULT 'classic';
        ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS wallpaper TEXT DEFAULT 'none';
        ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS custom_wallpaper TEXT;

        -- Enable Row Level Security (RLS)
        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Allow public access to profiles" ON public.profiles;
        CREATE POLICY "Allow public access to profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

        -- Create Scheme Applications table
        CREATE TABLE IF NOT EXISTS public.scheme_applications (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
            scheme_name TEXT NOT NULL,
            farmer_name TEXT NOT NULL,
            aadhaar TEXT NOT NULL,
            land_area NUMERIC NOT NULL,
            survey_number TEXT NOT NULL,
            bank_account TEXT NOT NULL,
            ifsc TEXT NOT NULL,
            tracking_id TEXT UNIQUE NOT NULL,
            status TEXT DEFAULT 'Under Review' NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
        );

        -- Enable RLS
        ALTER TABLE public.scheme_applications ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Allow public access to applications" ON public.scheme_applications;
        CREATE POLICY "Allow public access to applications" ON public.scheme_applications FOR ALL USING (true) WITH CHECK (true);

        -- Create Mandi Prices table
        CREATE TABLE IF NOT EXISTS public.mandi_prices (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            state TEXT NOT NULL,
            district TEXT NOT NULL,
            market TEXT NOT NULL,
            commodity TEXT NOT NULL,
            modal_price NUMERIC NOT NULL,
            date DATE NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
        );

        -- Add unique constraint to prevent duplicates
        ALTER TABLE public.mandi_prices DROP CONSTRAINT IF EXISTS unique_mandi_price_record;
        ALTER TABLE public.mandi_prices ADD CONSTRAINT unique_mandi_price_record UNIQUE (state, district, market, commodity, date);

        -- Enable RLS for Mandi Prices
        ALTER TABLE public.mandi_prices ENABLE ROW LEVEL SECURITY;

        DROP POLICY IF EXISTS "Allow public access to mandi_prices" ON public.mandi_prices;
        CREATE POLICY "Allow public access to mandi_prices" ON public.mandi_prices FOR ALL USING (true) WITH CHECK (true);
        """
        cur.execute(sql)
        
        # Check if mandi_prices table is empty or has very few records
        cur.execute("SELECT COUNT(*) FROM public.mandi_prices")
        count = cur.fetchone()[0]
        if count < 500:
            print(f"Supabase mandi_prices table has only {count} records. Populating baseline dataset from CSV...")
            csv_path = os.path.join(os.path.dirname(__file__), "..", "Agriculture_price_dataset.csv")
            if os.path.exists(csv_path):
                import pandas as pd
                df = pd.read_csv(csv_path, nrows=15000)
                
                records = []
                for _, row in df.iterrows():
                    r_date = row.get('Date', '')
                    if not r_date:
                        from datetime import date
                        r_date = date.today().strftime("%Y-%m-%d")
                    elif '/' in r_date:
                        parts = r_date.split('/')
                        if len(parts) == 3 and len(parts[2]) == 4:
                            r_date = f"{parts[2]}-{parts[1]}-{parts[0]}"
                    
                    records.append((
                        row['STATE'].strip(),
                        row['District'].strip(),
                        row['Market'].strip(),
                        row['Commodity'].strip(),
                        float(row['Modal_Price']),
                        r_date
                    ))
                
                # Bulk insert in batches of 1000
                batch_size = 1000
                for i in range(0, len(records), batch_size):
                    batch = records[i:i+batch_size]
                    args_str = ",".join(cur.mogrify("(%s,%s,%s,%s,%s,%s)", x).decode('utf-8') for x in batch)
                    cur.execute(f"""
                        INSERT INTO public.mandi_prices (state, district, market, commodity, modal_price, date)
                        VALUES {args_str}
                        ON CONFLICT ON CONSTRAINT unique_mandi_price_record DO NOTHING
                    """)
                print(f"Successfully populated {len(records)} baseline records into Supabase.")
        
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error initializing Supabase DB: {e}")

@app.on_event("startup")
async def startup_event():
    print("Starting Kshetrix-AI Backend...")
    try:
        init_supabase_db()
        agrico.load_and_preprocess()
        agrico.train_price_models()
        agrico.setup_nlp()
        print("Backend ready!")
    except Exception as e:
        print(f"Error during startup: {e}")

class PredictionRequest(BaseModel):
    state: str
    district: str
    market: str
    commodity: str
    date: str

class ChatRequest(BaseModel):
    message: str

@app.get("/")
def read_root():
    return {"status": "Kshetrix-AI API is running"}

@app.post("/chat")
def chat(req: ChatRequest):
    return {"response": agrico.get_chat_response(req.message)}

@app.post("/predict")
def predict(req: PredictionRequest):
    result = agrico.predict_price(req.state, req.district, req.market, req.commodity, req.date)
    if "error" in result:
        raise HTTPException(status_code=400, detail=result["error"])
    return result

@app.get("/similar-markets")
def similar_markets(market: str, commodity: str):
    return agrico.get_similar_markets(market, commodity)

@app.get("/market-data")
def get_market_data(state: str = None, district: str = None, commodity: str = None):
    filtered_df = agrico.df
    if state:
        filtered_df = filtered_df[filtered_df['STATE'] == state]
    if district:
        filtered_df = filtered_df[filtered_df['District'] == district]
    if commodity:
        filtered_df = filtered_df[filtered_df['Commodity'] == commodity]
    
    records = filtered_df.head(50).to_dict(orient="records")
    if not getattr(agrico, 'db_loaded', False):
        crop_baselines = {
            "Wheat": 2700.0, "Paddy (Rice)": 2400.0, "Potato": 2100.0, 
            "Tomato": 3500.0, "Onion": 3800.0, "Cotton": 7500.0, 
            "Soybean": 4800.0, "Sugarcane": 330.0, "Maize": 2200.0, 
            "Mustard": 5600.0, "Gram (Chana)": 5800.0, "Tur (Arhar)": 10500.0, 
            "Moong": 8200.0, "Urad": 8800.0, "Groundnut": 7200.0, 
            "Lemon": 5000.0, "Ladies Finger": 3000.0, "Ivy Gourd": 3200.0, 
            "Bottle Gourd": 1800.0, "Bitter Gourd": 3800.0
        }
        historical_averages = {
            "Wheat": 1800.0, "Paddy (Rice)": 1600.0, "Potato": 1000.0,
            "Tomato": 1500.0, "Onion": 1400.0, "Cotton": 5500.0,
            "Soybean": 3500.0, "Sugarcane": 280.0, "Maize": 1400.0,
            "Mustard": 4200.0, "Gram (Chana)": 4000.0, "Tur (Arhar)": 6000.0,
            "Moong": 5800.0, "Urad": 5500.0, "Groundnut": 4800.0,
            "Lemon": 2500.0, "Ladies Finger": 1800.0, "Ivy Gourd": 1800.0,
            "Bottle Gourd": 1000.0, "Bitter Gourd": 2000.0
        }
        for rec in records:
            comm = rec.get('Commodity', '')
            clean_comm = comm.replace(" (Rice)", "").replace(" (Chana)", "").replace(" (Arhar)", "")
            base_2026 = crop_baselines.get(comm, crop_baselines.get(clean_comm, 3000.0))
            hist_avg = historical_averages.get(comm, historical_averages.get(clean_comm, 1500.0))
            scaling = base_2026 / hist_avg
            
            if 'Modal_Price' in rec:
                rec['Modal_Price'] = round(float(rec['Modal_Price']) * scaling, 2)
            if 'Min_Price' in rec:
                rec['Min_Price'] = round(float(rec['Min_Price']) * scaling, 2)
            if 'Max_Price' in rec:
                rec['Max_Price'] = round(float(rec['Max_Price']) * scaling, 2)
                
    return records

@app.get("/meta-data")
def get_meta_data():
    return agrico.get_meta_data()

@app.get("/meta-data-filtered")
def get_meta_data_filtered(state: str = None, district: str = None):
    df = agrico.df
    if state and not district:
        districts = sorted(df[df['STATE'] == state]['District'].unique().tolist())
        return {"districts": districts}
    if state and district:
        markets = sorted(df[(df['STATE'] == state) & (df['District'] == district)]['Market'].unique().tolist())
        return {"markets": markets}
    return {"error": "Provide state or state and district"}

@app.get("/dashboard-summary")
def get_dashboard_summary():
    return agrico.get_dashboard_summary()

def get_db_connection():
    db_url = os.environ.get("DATABASE_URL")
    if not db_url:
        print("DATABASE_URL not set in environment.")
        return None
    import psycopg2
    try:
        conn = psycopg2.connect(db_url)
        return conn
    except Exception as e:
        print(f"Error connecting to database: {e}")
        return None

class OTPRequest(BaseModel):
    phone_or_email: str
    phone: Optional[str] = None
    email: Optional[str] = None

class OTPVerifyRequest(BaseModel):
    phone_or_email: str
    code: str

class ProfileSaveRequest(BaseModel):
    id: Optional[str] = None
    name: str
    state: str
    district: str
    email: Optional[str] = None
    phone: Optional[str] = None
    photo: Optional[str] = None
    theme: Optional[str] = None
    wallpaper: Optional[str] = None
    custom_wallpaper: Optional[str] = None
    crop_preferences: Optional[List[str]] = None

class MandiPriceRecord(BaseModel):
    state: str
    district: str
    market: str
    commodity: str
    modal_price: float
    date: str

class MandiPricesSaveRequest(BaseModel):
    records: List[MandiPriceRecord]

class SchemeApplicationRequest(BaseModel):
    profile_id: Optional[str] = None
    scheme_name: str
    farmer_name: str
    aadhaar: str
    land_area: float
    survey_number: str
    bank_account: str
    ifsc: str
    tracking_id: str

otp_store = {}

@app.post("/send-otp")
def send_otp(req: OTPRequest):
    otp = str(random.randint(1000, 9999))
    otp_store[req.phone_or_email] = otp
    
    email = req.email
    phone = req.phone
    
    if not email and not phone:
        if "@" in req.phone_or_email:
            email = req.phone_or_email
            otp_store[email] = otp
            conn = get_db_connection()
            if conn:
                try:
                    cur = conn.cursor()
                    cur.execute("SELECT phone FROM public.profiles WHERE email = %s LIMIT 1", (email,))
                    row = cur.fetchone()
                    if row and row[0]:
                        phone = row[0]
                        otp_store[phone] = otp
                    cur.close()
                    conn.close()
                except Exception as e:
                    print(f"Error looking up phone: {e}")
        else:
            phone = req.phone_or_email
            otp_store[phone] = otp
            conn = get_db_connection()
            if conn:
                try:
                    cur = conn.cursor()
                    cur.execute("SELECT email FROM public.profiles WHERE phone = %s LIMIT 1", (phone,))
                    row = cur.fetchone()
                    if row and row[0]:
                        email = row[0]
                        otp_store[email] = otp
                    cur.close()
                    conn.close()
                except Exception as e:
                    print(f"Error looking up email: {e}")
    else:
        if email:
            otp_store[email] = otp
        if phone:
            otp_store[phone] = otp

    print(f"Generated OTP {otp} for phone: {phone}, email: {email}")
    
    email_success = False
    sms_success = False
    channels_attempted = []
    
    if email:
        channels_attempted.append("email")
        brevo_api_key = os.environ.get("BREVO_API_KEY")
        brevo_sender_email = os.environ.get("BREVO_SENDER_EMAIL")
        brevo_sender_name = os.environ.get("BREVO_SENDER_NAME", "Kshetrix AI")
        resend_api_key = os.environ.get("RESEND_API_KEY")
        
        if brevo_api_key and brevo_sender_email:
            try:
                import urllib.request
                import json
                
                url = "https://api.brevo.com/v3/smtp/email"
                headers = {
                    "api-key": brevo_api_key,
                    "Content-Type": "application/json"
                }
                payload = {
                    "sender": {
                        "name": brevo_sender_name,
                        "email": brevo_sender_email
                    },
                    "to": [
                        {
                            "email": email
                        }
                    ],
                    "subject": "Kshetrix-AI Verification Code",
                    "htmlContent": f"<p>Welcome to Kshetrix-AI! Your verification code is: <strong>{otp}</strong></p><p>This code will expire in 10 minutes.</p>"
                }
                
                req = urllib.request.Request(
                    url,
                    data=json.dumps(payload).encode("utf-8"),
                    headers=headers,
                    method="POST"
                )
                
                with urllib.request.urlopen(req) as response:
                    res_body = response.read().decode("utf-8")
                    print(f"Email sent successfully via Brevo to {email}. Response: {res_body}")
                    email_success = True
            except Exception as e:
                print(f"Error sending email via Brevo API: {e}")
        elif resend_api_key:
            try:
                import urllib.request
                import json
                
                url = "https://api.resend.com/emails"
                headers = {
                    "Authorization": f"Bearer {resend_api_key}",
                    "Content-Type": "application/json"
                }
                payload = {
                    "from": "onboarding@resend.dev",
                    "to": email,
                    "subject": "Kshetrix-AI Verification Code",
                    "html": f"<p>Welcome to Kshetrix-AI! Your verification code is: <strong>{otp}</strong></p><p>This code will expire in 10 minutes.</p>"
                }
                
                req = urllib.request.Request(
                    url,
                    data=json.dumps(payload).encode("utf-8"),
                    headers=headers,
                    method="POST"
                )
                
                with urllib.request.urlopen(req) as response:
                    res_body = response.read().decode("utf-8")
                    print(f"Email sent successfully via Resend to {email}. Response: {res_body}")
                    email_success = True
            except Exception as e:
                print(f"Error sending email via Resend API: {e}")
        else:
            smtp_host = os.environ.get("SMTP_HOST", "smtp.gmail.com")
            smtp_port = int(os.environ.get("SMTP_PORT", 587))
            smtp_user = os.environ.get("SMTP_USER")
            smtp_password = os.environ.get("SMTP_PASSWORD")
            sender_email = os.environ.get("SENDER_EMAIL", smtp_user)
            
            if smtp_user and smtp_password:
                try:
                    msg = MIMEMultipart()
                    msg['From'] = sender_email
                    msg['To'] = email
                    msg['Subject'] = "Kshetrix-AI Verification Code"
                    
                    body = f"Welcome to Kshetrix-AI! Your verification code is: {otp}\n\nThis code will expire in 10 minutes."
                    msg.attach(MIMEText(body, 'plain'))
                    
                    if smtp_port == 465:
                        server = smtplib.SMTP_SSL(smtp_host, smtp_port)
                    else:
                        server = smtplib.SMTP(smtp_host, smtp_port)
                        server.starttls()
                    server.login(smtp_user, smtp_password)
                    server.sendmail(sender_email, email, msg.as_string())
                    server.quit()
                    print(f"Email sent successfully to {email}")
                    email_success = True
                except Exception as e:
                    print(f"Error sending email: {e}")
            else:
                print("WARNING: SMTP credentials not set. Cannot send real email.")
            
    if phone:
        channels_attempted.append("sms")
        twilio_sid = os.environ.get("TWILIO_ACCOUNT_SID")
        twilio_auth_token = os.environ.get("TWILIO_AUTH_TOKEN")
        twilio_phone = os.environ.get("TWILIO_PHONE_NUMBER")
        
        if twilio_sid and twilio_auth_token and twilio_phone:
            try:
                formatted_phone = phone if phone.startswith('+') else f"+91{phone}"
                from twilio.rest import Client
                client = Client(twilio_sid, twilio_auth_token)
                message = client.messages.create(
                    body=f"Your Kshetrix-AI verification code is: {otp}",
                    from_=twilio_phone,
                    to=formatted_phone
                )
                print(f"SMS sent successfully to {formatted_phone}, SID: {message.sid}")
                sms_success = True
            except Exception as e:
                print(f"Error sending SMS: {e}")
        else:
            print("WARNING: Twilio credentials not set. Cannot send real SMS.")
            
    real_channels_sent = []
    if email_success:
        real_channels_sent.append("email")
    if sms_success:
        real_channels_sent.append("sms")
        
    if len(real_channels_sent) > 0:
        return {
            "status": "success", 
            "message": f"OTP sent via {', '.join(real_channels_sent)}.",
            "channels": real_channels_sent
        }
    else:
        return {
            "status": "success", 
            "message": "OTP generated (Simulation mode)", 
            "code": otp,
            "channels": channels_attempted
        }

@app.post("/verify-otp")
def verify_otp(req: OTPVerifyRequest):
    stored_otp = otp_store.get(req.phone_or_email)
    if stored_otp and stored_otp == req.code:
        del otp_store[req.phone_or_email]
        return {"status": "success", "message": "OTP verified successfully."}
    return {"status": "error", "message": "Invalid verification code."}

@app.post("/save-profile")
def save_profile(req: ProfileSaveRequest):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed.")
    
    try:
        cur = conn.cursor()
        profile_id = req.id
        if profile_id:
            cur.execute("SELECT id FROM public.profiles WHERE id = %s", (profile_id,))
            exists = cur.fetchone()
            if exists:
                cur.execute(
                    "UPDATE public.profiles SET name = %s, state = %s, district = %s, email = %s, phone = %s, photo = %s, theme = %s, wallpaper = %s, custom_wallpaper = %s, crop_preferences = %s, updated_at = NOW() WHERE id = %s",
                    (req.name, req.state, req.district, req.email, req.phone, req.photo, req.theme, req.wallpaper, req.custom_wallpaper, req.crop_preferences, profile_id)
                )
            else:
                profile_id = None
                
        if not profile_id:
            import uuid
            new_id = str(uuid.uuid4())
            cur.execute(
                "INSERT INTO public.profiles (id, name, state, district, email, phone, photo, theme, wallpaper, custom_wallpaper, crop_preferences) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                (new_id, req.name, req.state, req.district, req.email, req.phone, req.photo, req.theme, req.wallpaper, req.custom_wallpaper, req.crop_preferences)
            )
            profile_id = new_id
            
        conn.commit()
        cur.close()
        conn.close()
        return {"status": "success", "id": profile_id}
    except Exception as e:
        conn.rollback()
        print(f"Error in save_profile: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to save profile: {str(e)}")

@app.get("/get-profile")
def get_profile(id: str):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed.")
        
    try:
        cur = conn.cursor()
        cur.execute("SELECT id, name, state, district, email, phone, photo, theme, wallpaper, custom_wallpaper, crop_preferences FROM public.profiles WHERE id = %s", (id,))
        row = cur.fetchone()
        cur.close()
        conn.close()
        if row:
            return {
                "id": row[0], "name": row[1], "state": row[2], "district": row[3], 
                "email": row[4], "phone": row[5], "photo": row[6],
                "theme": row[7], "wallpaper": row[8], "custom_wallpaper": row[9],
                "crop_preferences": row[10]
            }
        raise HTTPException(status_code=404, detail="Profile not found.")
    except Exception as e:
        print(f"Error in get_profile: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch profile: {str(e)}")

@app.post("/apply-scheme")
def apply_scheme(req: SchemeApplicationRequest):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed.")
        
    try:
        cur = conn.cursor()
        cur.execute(
            """INSERT INTO public.scheme_applications 
            (profile_id, scheme_name, farmer_name, aadhaar, land_area, survey_number, bank_account, ifsc, tracking_id, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, 'Under Review')""",
            (req.profile_id, req.scheme_name, req.farmer_name, req.aadhaar, req.land_area, req.survey_number, req.bank_account, req.ifsc, req.tracking_id)
        )
        conn.commit()
        cur.close()
        conn.close()
        return {"status": "success", "message": "Scheme application submitted."}
    except Exception as e:
        conn.rollback()
        print(f"Error in apply_scheme: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to submit scheme application: {str(e)}")

@app.get("/get-schemes")
def get_schemes(profile_id: str):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed.")
        
    try:
        cur = conn.cursor()
        cur.execute(
            "SELECT scheme_name, status, tracking_id FROM public.scheme_applications WHERE profile_id = %s",
            (profile_id,)
        )
        rows = cur.fetchall()
        cur.close()
        conn.close()
        return [{"scheme_name": r[0], "status": r[1], "tracking_id": r[2]} for r in rows]
    except Exception as e:
        print(f"Error in get_schemes: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch scheme applications: {str(e)}")
@app.post("/save-mandi-prices")
def save_mandi_prices(req: MandiPricesSaveRequest):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed.")
    
    try:
        cur = conn.cursor()
        inserted_count = 0
        for rec in req.records:
            try:
                c_state = rec.state.strip()
                c_district = rec.district.strip()
                c_market = rec.market.strip()
                c_commodity = rec.commodity.strip()
                
                from datetime import datetime
                parsed_date = datetime.strptime(rec.date, "%Y-%m-%d").date()
                
                cur.execute(
                    """
                    INSERT INTO public.mandi_prices (state, district, market, commodity, modal_price, date)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    ON CONFLICT ON CONSTRAINT unique_mandi_price_record DO NOTHING
                    """,
                    (c_state, c_district, c_market, c_commodity, rec.modal_price, parsed_date)
                )
                inserted_count += 1
            except Exception as inner_e:
                print(f"Skipping record due to error: {inner_e}")
                
        conn.commit()
        cur.close()
        conn.close()
        
        # Trigger background retraining thread asynchronously so API returns instantly
        import threading
        def retrain_model_in_background():
            try:
                agrico.load_and_preprocess()
                agrico.train_price_models()
                print("Background model retraining completed successfully.")
            except Exception as train_e:
                print(f"Background retraining failed: {train_e}")
                
        threading.Thread(target=retrain_model_in_background, daemon=True).start()
        
        return {"status": "success", "message": f"Processed {inserted_count} records. Background retraining triggered."}
    except Exception as e:
        conn.rollback()
        print(f"Error saving mandi prices: {e}")
        raise HTTPException(status_code=500, detail=str(e))
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
