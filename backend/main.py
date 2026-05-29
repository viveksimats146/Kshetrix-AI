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

@app.on_event("startup")
async def startup_event():
    print("Starting Kshetrix-AI Backend...")
    try:
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
