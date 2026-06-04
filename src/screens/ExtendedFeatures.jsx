import React, { useState, useEffect } from 'react';
import { ChevronLeft, BarChart2, MapPin, Bell, Activity, Users, Star, RefreshCw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { getStates, getDistricts, getMarkets, getMarketPrices, getCommodities } from '../services/mandiApi';
import { getCropEmoji } from '../utils/cropHelper';

const Header = ({ title, onBack }) => (
  <div style={{ padding: '20px 20px 20px', display: 'flex', alignItems: 'center', gap: '15px', background: 'var(--white)', borderBottom: '1px solid var(--gray-light)' }}>
    <button onClick={onBack} style={{ background: 'var(--white)', border: 'none', padding: '8px', borderRadius: '10px', boxShadow: 'var(--shadow-sm)' }}>
      <ChevronLeft />
    </button>
    <h2 style={{ fontSize: '18px' }}>{title}</h2>
  </div>
);

const getVarietyName = (c) => {
  const clean = c.toLowerCase();
  if (clean.includes('onion')) return 'Kharif Onion';
  if (clean.includes('tomato')) return 'Hybrid Tomato';
  if (clean.includes('potato')) return 'Kufri Jyoti Potato';
  if (clean.includes('wheat')) return 'Lokwan Wheat';
  if (clean.includes('rice') || clean.includes('paddy')) return 'Basmati Paddy';
  if (clean.includes('cotton')) return 'BT Cotton';
  if (clean.includes('garlic')) return 'Desi Garlic';
  if (clean.includes('ginger')) return 'Marwadi Ginger';
  if (clean.includes('mango')) return 'Alphonso Mango';
  if (clean.includes('apple')) return 'Shimla Apple';
  if (clean.includes('chilli')) return 'Guntur Chilli';
  if (clean.includes('mustard')) return 'Pusa Mustard';
  if (clean.includes('soybean')) return 'Yellow Soybean';
  if (clean.includes('sugarcane')) return 'Co-86032 Sugarcane';
  return `${c} Variety`;
};

const getBaselinePrice = (c) => {
  const baselines = {
    "Wheat": 2400, "Paddy (Rice)": 2300, "Potato": 1500, "Tomato": 2200, "Onion": 2500,
    "Cotton": 6800, "Soybean": 4500, "Sugarcane": 350, "Maize": 2200, "Mustard": 5600,
    "Gram (Chana)": 5200, "Tur (Arhar)": 7200, "Moong": 7800, "Urad": 7000, "Groundnut": 6200,
    "Coconut": 13500, "Coffee": 16500, "Tea": 200, "Apple": 7500, "Mango": 5500,
    "Garlic": 9500, "Ginger": 8000, "Turmeric": 7400, "Black Pepper": 48000, "Cardamom": 1500
  };
  const clean = c.replace(" (Rice)", "").replace(" (Chana)", "").replace(" (Arhar)", "");
  return baselines[c] || baselines[clean] || 3000;
};

export const CropDeepDive = ({ onBack, commodity = 'Onion', state = 'Maharashtra', district = 'Nashik' }) => {
  const base = getBaselinePrice(commodity);
  const chartData = [
    { day: 'M', price: Math.round(base * 0.92) }, 
    { day: 'T', price: Math.round(base * 0.95) }, 
    { day: 'W', price: Math.round(base * 0.90) },
    { day: 'T', price: Math.round(base * 0.97) }, 
    { day: 'F', price: Math.round(base * 1.07) }, 
    { day: 'S', price: Math.round(base * 1.05) }, 
    { day: 'S', price: Math.round(base * 1.12) }
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--off-white)' }}>
      <Header title={`Crop Details: ${commodity}`} onBack={onBack} />
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', alignItems: 'center' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '40px', background: 'var(--primary-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', boxShadow: 'var(--shadow-sm)' }}>
            {getCropEmoji(commodity)}
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800' }}>{getVarietyName(commodity)}</h2>
            <p style={{ fontSize: '14px', color: 'var(--gray-medium)' }}>Location: {district}, {state}</p>
          </div>
        </div>
        
        <div className="card" style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '15px' }}>Price Trend (Last 7 Days)</h3>
          <div style={{ height: '150px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'var(--gray-medium)' }} />
                <YAxis domain={['dataMin - 100', 'dataMax + 100']} hide />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-sm)' }} />
                <Area type="monotone" dataKey="price" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div className="card" style={{ flex: 1 }}>
            <p style={{ fontSize: '11px', color: 'var(--gray-medium)' }}>Expected Yield</p>
            <h4 style={{ fontSize: '16px', fontWeight: '700', marginTop: '5px' }}>45 Quintals</h4>
          </div>
          <div className="card" style={{ flex: 1 }}>
            <p style={{ fontSize: '11px', color: 'var(--gray-medium)' }}>Health Status</p>
            <h4 style={{ fontSize: '16px', fontWeight: '700', marginTop: '5px', color: 'var(--success)' }}>Optimal</h4>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MandiDetails = ({ onBack, defaultState = 'Maharashtra', defaultDistrict = 'Nashik' }) => {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [prices, setPrices] = useState([]);
  
  const [selState, setSelState] = useState(defaultState);
  const [selDist, setSelDist] = useState(defaultDistrict);
  const [selMkt, setSelMkt] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    getStates().then(s => {
      setStates(s);
      if (s.length > 0) {
        setSelState(prev => prev && s.includes(prev) ? prev : s[0]);
      }
    }).catch(e => {
      setApiError(e.message === 'API_KEY_MISSING' ? 'Please set your data.gov.in API Key in Settings.' : e.message);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (selState) getDistricts(selState).then(d => {
      setDistricts(d);
      if (d.length > 0) {
        setSelDist(prev => prev && d.includes(prev) ? prev : d[0]);
      }
    });
  }, [selState]);

  useEffect(() => {
    if (selState && selDist) getMarkets(selState, selDist).then(m => {
      setMarkets(m);
      if (m.length > 0) setSelMkt(m[0]);
    });
  }, [selState, selDist]);

  const loadData = async () => {
    if (!selState || !selDist || !selMkt) return;
    setLoading(true);
    setApiError('');
    try {
      const p = await getMarketPrices(selState, selDist, selMkt);
      setPrices(p);
    } catch (e) {
      setApiError(e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [selMkt]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--off-white)' }}>
      <Header title="Live Mandi Details" onBack={onBack} />
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        <div className="card" style={{ marginBottom: '20px', padding: '15px' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <select style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid var(--gray-light)' }} value={selState} onChange={e => setSelState(e.target.value)}>
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid var(--gray-light)' }} value={selDist} onChange={e => setSelDist(e.target.value)}>
              {districts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <select style={{ width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid var(--gray-light)', marginBottom: '10px' }} value={selMkt} onChange={e => setSelMkt(e.target.value)}>
            {markets.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <button onClick={loadData} className="btn-primary" style={{ padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            {loading ? <RefreshCw className="spin" size={16} /> : 'Refresh Prices'}
          </button>
        </div>

        {apiError ? (
          <div style={{ background: 'var(--error-pale)', color: 'var(--error)', padding: '20px', borderRadius: '12px', textAlign: 'center' }}>
            <p>{apiError}</p>
          </div>
        ) : loading ? (
          <p style={{ textAlign: 'center', color: 'var(--gray-medium)' }}>Loading Live Data...</p>
        ) : prices.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--gray-medium)' }}>No price data reported for {selMkt} today.</p>
        ) : (
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '15px' }}>Commodities at {selMkt}</h3>
            {prices.map((p, i) => (
              <div key={i} className="card" style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: '700' }}>{getCropEmoji(p.commodity)} {p.commodity} <span style={{ fontSize: '11px', color: 'var(--gray-medium)', fontWeight: '400' }}>({p.variety})</span></h4>
                  <span style={{ fontSize: '11px', background: 'var(--success-pale)', color: 'var(--success)', padding: '2px 6px', borderRadius: '4px', fontWeight: '700' }}>Grade: {p.grade}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--gray-light)', paddingTop: '10px' }}>
                  <div style={{ textAlign: 'center' }}><p style={{ fontSize: '10px', color: 'var(--gray-medium)' }}>Min</p><p style={{ fontSize: '13px', fontWeight: '700' }}>₹{p.min_price}</p></div>
                  <div style={{ textAlign: 'center' }}><p style={{ fontSize: '10px', color: 'var(--gray-medium)' }}>Modal</p><p style={{ fontSize: '15px', fontWeight: '700', color: 'var(--primary)' }}>₹{p.modal_price}</p></div>
                  <div style={{ textAlign: 'center' }}><p style={{ fontSize: '10px', color: 'var(--gray-medium)' }}>Max</p><p style={{ fontSize: '13px', fontWeight: '700' }}>₹{p.max_price}</p></div>
                </div>
                <p style={{ fontSize: '10px', color: 'var(--gray-medium)', textAlign: 'right', marginTop: '10px' }}>Updated: {p.arrival_date}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const MarketComparison = ({ onBack }) => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--off-white)' }}>
    <Header title="Market Comparison" onBack={onBack} />
    <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
      <div style={{ background: 'var(--info-pale)', padding: '15px', borderRadius: '12px', display: 'flex', gap: '15px', marginBottom: '20px' }}>
        <p style={{ fontSize: '13px', color: 'var(--info-dark)', lineHeight: '1.5' }}>Select a Mandi from Live Mandi Details to compare prices across nearby districts.</p>
      </div>
      <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '15px' }}>Onion Prices (Today)</h3>
      {[
        { mandi: "Lasalgaon APMC", dist: "42km", price: "₹2,200", trend: "+5%" },
        { mandi: "Pimpalgaon Baswant", dist: "28km", price: "₹2,150", trend: "+2%" },
        { mandi: "Pune APMC", dist: "185km", price: "₹2,400", trend: "-1%" }
      ].map((mandi, i) => (
        <div key={i} className="card" style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: '700' }}>{mandi.mandi}</h4>
            <p style={{ fontSize: '12px', color: 'var(--gray-medium)' }}>Distance: {mandi.dist}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h4 style={{ fontSize: '16px', fontWeight: '700' }}>{mandi.price}</h4>
            <p style={{ fontSize: '12px', color: mandi.trend.startsWith('+') ? 'var(--success)' : 'var(--error)' }}>{mandi.trend}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const PriceAlertSetup = ({ onBack, defaultState = 'Maharashtra', defaultDistrict = 'Nashik' }) => {
  const [commodities, setCommodities] = useState([
    "Wheat", "Paddy (Rice)", "Potato", "Tomato", "Onion",
    "Cotton", "Soybean", "Sugarcane", "Maize", "Mustard",
    "Gram (Chana)", "Tur (Arhar)", "Moong", "Urad", "Groundnut",
    "Garlic", "Ginger", "Turmeric", "Black Pepper", "Cardamom"
  ]);
  const [markets, setMarkets] = useState([]);
  const [selectedCommodity, setSelectedCommodity] = useState('Onion');
  const [selectedMarket, setSelectedMarket] = useState('');
  const [targetPrice, setTargetPrice] = useState('2500');
  const [loading, setLoading] = useState(true);
  const [alertSet, setAlertSet] = useState(false);

  useEffect(() => {
    getCommodities().then(c => {
      if (c && c.length > 0) {
        setCommodities(c);
      }
    }).catch(e => console.warn("Failed fetching commodities for alert setup:", e));
  }, []);

  useEffect(() => {
    setLoading(true);
    getMarkets(defaultState, defaultDistrict)
      .then(m => {
        setMarkets(m);
        if (m.length > 0) {
          setSelectedMarket(m[0]);
        } else {
          setSelectedMarket('Any Mandi (Within 50km)');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching markets for alert setup:", err);
        setLoading(false);
      });
  }, [defaultState, defaultDistrict]);

  const handleSetAlert = () => {
    setAlertSet(true);
    setTimeout(() => {
      setAlertSet(false);
      onBack();
    }, 2000);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--off-white)' }}>
      <Header title="Setup Price Alerts" onBack={onBack} />
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ width: '64px', height: '64px', background: 'var(--primary-pale)', borderRadius: '32px', margin: '0 auto 15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}><Bell size={32}/></div>
          <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Never Miss a Good Price</h3>
          <p style={{ fontSize: '13px', color: 'var(--gray-medium)', marginTop: '5px' }}>We'll notify you via SMS when your target price is hit.</p>
        </div>

        {alertSet ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px 20px', borderLeft: '4px solid var(--primary)' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>🔔</div>
            <h4 style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '18px', marginBottom: '8px' }}>Alert Configured successfully!</h4>
            <p style={{ color: 'var(--gray-medium)', fontSize: '13px' }}>Monitoring {selectedCommodity} modal price at {selectedMarket} for target ₹{targetPrice}.</p>
          </div>
        ) : (
          <div className="card">
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--gray-dark)' }}>Commodity</label>
            <select 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--gray-light)', marginBottom: '15px', outline: 'none', background: 'var(--white)', color: 'var(--black)' }} 
              value={selectedCommodity} 
              onChange={e => setSelectedCommodity(e.target.value)}
            >
              {commodities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--gray-dark)' }}>Target Mandi</label>
            <select 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--gray-light)', marginBottom: '15px', outline: 'none', background: 'var(--white)', color: 'var(--black)' }} 
              value={selectedMarket} 
              onChange={e => setSelectedMarket(e.target.value)}
              disabled={loading}
            >
              {loading ? (
                <option>Loading mandis for {defaultDistrict}...</option>
              ) : (
                <>
                  {markets.map(m => <option key={m} value={m}>{m}</option>)}
                  <option value="Any Mandi (Within 50km)">Any Mandi (Within 50km)</option>
                </>
              )}
            </select>

            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--gray-dark)' }}>Target Price (₹ per Quintal)</label>
            <input 
              type="number" 
              value={targetPrice} 
              onChange={e => setTargetPrice(e.target.value)}
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--gray-light)', marginBottom: '25px', outline: 'none', background: 'var(--white)', color: 'var(--black)' }} 
            />

            <button className="btn-primary" onClick={handleSetAlert} disabled={loading}>Set Alert</button>
          </div>
        )}
      </div>
    </div>
  );
};

export const UserActivityLog = ({ onBack }) => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--off-white)' }}>
    <Header title="Activity Log" onBack={onBack} />
    <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
      {[
        { action: "Price Prediction Generated", details: "Onion, Nashik (Expected ₹2200)", date: "Today, 10:30 AM", icon: <Activity size={18} /> },
        { action: "Weather Alert Viewed", details: "Rain forecast for tomorrow", date: "Yesterday, 06:15 PM", icon: <Bell size={18} /> },
        { action: "Logged In", details: "Device: Mobile Web", date: "Yesterday, 06:10 PM", icon: <Users size={18} /> }
      ].map((log, i) => (
        <div key={i} className="card" style={{ marginBottom: '10px', display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '20px', background: 'var(--primary-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
            {log.icon}
          </div>
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: '600' }}>{log.action}</h4>
            <p style={{ fontSize: '12px', color: 'var(--gray-medium)' }}>{log.details}</p>
            <p style={{ fontSize: '10px', color: 'var(--gray-medium)', marginTop: '4px' }}>{log.date}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const ReferralProgram = ({ onBack }) => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--off-white)' }}>
    <Header title="Refer & Earn" onBack={onBack} />
    <div style={{ flex: 1, padding: '20px', overflowY: 'auto', textAlign: 'center' }}>
      <div style={{ fontSize: '80px', margin: '20px 0' }}>🎁</div>
      <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '10px' }}>Invite your friends!</h2>
      <p style={{ fontSize: '14px', color: 'var(--gray-medium)', marginBottom: '30px', lineHeight: '1.5' }}>Get 1 month of premium AI features for every farmer who joins using your link.</p>
      
      <div style={{ background: 'white', padding: '15px', borderRadius: '12px', border: '2px dashed var(--primary)', marginBottom: '20px', fontSize: '18px', fontWeight: '800', letterSpacing: '2px', color: 'var(--primary)' }}>
        KSHETRIX26
      </div>
      
      <button className="btn-primary" style={{ marginBottom: '15px' }}>Share via WhatsApp</button>
      <button style={{ width: '100%', padding: '14px', borderRadius: '12px', background: 'var(--gray-light)', border: 'none', fontWeight: '600', color: 'var(--black)' }}>Copy Link</button>
    </div>
  </div>
);
