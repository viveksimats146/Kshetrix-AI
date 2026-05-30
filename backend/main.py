from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from ml_engine import AgricoML
import os

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
        """
        cur.execute(sql)
        print("Supabase database tables verified/created successfully.")
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
    
    return filtered_df.head(50).to_dict(orient="records")

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
