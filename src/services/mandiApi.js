import { INDIAN_LOCATIONS } from '../utils/locations.js';
import { getApiBaseUrl } from '../utils/api.js';

const API_BASE = getApiBaseUrl();
const RESOURCE_ID = '9ef84268-d588-465a-a308-a864a43d0070';

const PROXIES = [
  '', // Direct fetch
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?',
  'https://api.codetabs.com/v1/proxy/?quest='
];

export const getApiKey = () => localStorage.getItem('data_gov_api_key') || '';
export const setApiKey = (key) => localStorage.setItem('data_gov_api_key', key);

// Helper function to fetch from data.gov.in using proxies and parameters
const fetchFromDataGov = async (params) => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('API_KEY_MISSING');

  const queryStr = Object.entries(params)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');

  const targetUrl = `https://api.data.gov.in/resource/${RESOURCE_ID}?api-key=${apiKey}&format=json&${queryStr}`;
  const encodedUrl = encodeURIComponent(targetUrl);

  let lastError = null;

  for (const proxy of PROXIES) {
    try {
      const url = proxy === '' ? targetUrl : `${proxy}${encodedUrl}`;
      console.log(`Trying data.gov.in fetch via: ${proxy === '' ? 'Direct' : proxy}`);
      
      const res = await fetch(url);
      if (!res.ok && res.status !== 400 && res.status !== 403) {
        throw new Error(`HTTP ${res.status}`);
      }
      
      const data = await res.json();
      
      if (data.error) {
        throw new Error(`API_KEY_ERROR: ${data.error}`);
      }
      if (data.status === "failed") {
        throw new Error(`API_KEY_ERROR: ${data.message}`);
      }
      
      return data.records || [];
    } catch (err) {
      console.warn(`Fetch failed for proxy [${proxy}]:`, err.message);
      lastError = err;
      
      if (err.message && err.message.includes('API_KEY_ERROR')) {
        throw new Error('Your API Key is invalid or not authorized.');
      }
    }
  }

  throw new Error(`Network Error: ${lastError?.message}`);
};

export const getStates = async () => {
  return Object.keys(INDIAN_LOCATIONS).sort();
};

export const getDistricts = async (state) => {
  if (!state) return [];
  const cleanState = state.trim();
  return INDIAN_LOCATIONS[cleanState] || INDIAN_LOCATIONS[state] || [];
};

export const getMarkets = async (state, district) => {
  if (!state || !district) return [];
  
  // Try live government API first if key exists
  if (getApiKey()) {
    try {
      const records = await fetchFromDataGov({
        'filters[state]': state,
        'filters[district]': district,
        'limit': 150
      });
      if (records && records.length > 0) {
        const uniqueMarkets = [...new Set(records.map(r => (r.market || r.Market || '').trim()))]
          .filter(Boolean)
          .sort();
        if (uniqueMarkets.length > 0) {
          return uniqueMarkets;
        }
      }
    } catch (e) {
      console.warn("data.gov.in live markets fetch failed, falling back to local:", e.message);
    }
  }

  // Fallback to local Python backend
  try {
    const res = await fetch(`${API_BASE}/meta-data-filtered?state=${encodeURIComponent(state)}&district=${encodeURIComponent(district)}`);
    const data = await res.json();
    if (data.markets && data.markets.length > 0) {
      return data.markets.map(m => m.trim());
    }
  } catch (e) {
    console.warn("Failed fetching markets from backend:", e);
  }

  // Fallback to dynamic APMC names if both fail
  return [`${district.trim()} Mandi`, `APMC ${district.trim()}`, `${district.trim()} Sub-Yard`].sort();
};

export const getCommodities = async () => {
  try {
    const res = await fetch(`${API_BASE}/meta-data`);
    const data = await res.json();
    return data.commodities || [];
  } catch (e) {
    console.warn("Failed fetching commodities from backend, using default list:", e);
    return [
      "Wheat", "Paddy (Rice)", "Potato", "Tomato", "Onion",
      "Cotton", "Soybean", "Sugarcane", "Maize", "Mustard",
      "Gram (Chana)", "Tur (Arhar)", "Moong", "Urad", "Groundnut"
    ];
  }
};

export const getMarketPrices = async (state, district, market) => {
  if (!state || !district || !market) return [];

  // Try live government API first if key exists
  if (getApiKey()) {
    try {
      const records = await fetchFromDataGov({
        'filters[state]': state,
        'filters[district]': district,
        'filters[market]': market,
        'limit': 100
      });
      if (records && records.length > 0) {
        return records.map(r => ({
          commodity: r.commodity || r.Commodity,
          variety: r.variety || r.Variety || 'Other',
          grade: r.grade || r.Grade || 'FAQ',
          min_price: Number(r.min_price || r.Min_Price),
          max_price: Number(r.max_price || r.Max_Price),
          modal_price: Number(r.modal_price || r.Modal_Price),
          arrival_date: r.arrival_date || r.date || r.Date || new Date().toISOString().split('T')[0]
        }));
      }
    } catch (e) {
      console.warn("data.gov.in live prices fetch failed, falling back to local:", e.message);
    }
  }

  // Fallback to local Python backend
  try {
    const res = await fetch(`${API_BASE}/market-data?state=${state}`);
    const data = await res.json();
    // Filter locally since API only filters by state/commodity
    return data
      .filter(r => r.District === district && r.Market === market)
      .map(r => ({
        commodity: r.Commodity,
        variety: 'Other',
        grade: 'FAQ',
        min_price: r.Min_Price,
        max_price: r.Max_Price,
        modal_price: r.Modal_Price,
        arrival_date: r.Date
      }));
  } catch (e) {
    console.warn("Failed fetching market prices from backend:", e);
  }

  return [];
};

export const getDistrictMarketDetails = async (state, district, commodity) => {
  if (!state || !district || !commodity) return [];

  // Try live government API first if key exists
  if (getApiKey()) {
    try {
      const records = await fetchFromDataGov({
        'filters[state]': state,
        'filters[district]': district,
        'filters[commodity]': commodity,
        'limit': 100
      });
      if (records && records.length > 0) {
        return records.map(r => ({
          market: r.market || r.Market,
          min_price: Number(r.min_price || r.Min_Price),
          max_price: Number(r.max_price || r.Max_Price),
          modal_price: Number(r.modal_price || r.Modal_Price),
          date: r.arrival_date || r.date || r.Date || new Date().toISOString().split('T')[0]
        }));
      }
    } catch (e) {
      console.warn("data.gov.in live district details fetch failed, falling back to local:", e.message);
    }
  }

  // Fallback to local Python backend
  try {
    const url = `${API_BASE}/market-data?state=${encodeURIComponent(state)}&district=${encodeURIComponent(district)}&commodity=${encodeURIComponent(commodity)}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.map(r => ({
      market: r.Market,
      min_price: r.Min_Price,
      max_price: r.Max_Price,
      modal_price: r.Modal_Price,
      date: r.Date
    }));
  } catch (e) {
    console.warn("Failed fetching district market details from backend:", e);
  }

  return [];
};
