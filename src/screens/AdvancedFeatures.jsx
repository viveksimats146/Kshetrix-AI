import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { ChevronLeft, Filter } from 'lucide-react';

const Header = ({ title, onBack }) => (
  <div style={{ padding: '20px 20px 20px', display: 'flex', alignItems: 'center', gap: '15px', background: 'var(--white)', borderBottom: '1px solid var(--gray-light)' }}>
    <button onClick={onBack} style={{ background: 'var(--white)', border: 'none', padding: '8px', borderRadius: '10px', boxShadow: 'var(--shadow-sm)', color: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <ChevronLeft />
    </button>
    <h2 style={{ fontSize: '18px', color: 'var(--black)' }}>{title}</h2>
  </div>
);

export const getCropBasePrice = (crop) => {
  const baselines = {
    "Wheat": 2400, "Potato": 1500, "Tomato": 2200, "Onion": 2500,
    "Cotton": 6800, "Soybean": 4500, "Sugarcane": 350, "Maize": 2200, "Mustard": 5600,
    "Gram (Chana)": 5200, "Tur (Arhar)": 7200, "Moong": 7800, "Urad": 7000, "Groundnut": 6200,
    "Coconut": 13500, "Coffee": 16500, "Tea": 200, "Apple": 7500, "Mango": 5500,
    "Garlic": 9500, "Ginger": 8000, "Turmeric": 7400, "Black Pepper": 48000, "Cardamom": 1500
  };
  
  const cleanCrop = crop ? crop.replace(" (Rice)", "").replace(" (Chana)", "").replace(" (Arhar)", "") : 'Onion';
  return baselines[crop] || baselines[cleanCrop] || 2500;
};

const getMockDataForCrop = (crop) => {
  const basePrice = getCropBasePrice(crop);

  return [
    { name: 'Jan', price: basePrice },
    { name: 'Feb', price: Math.round(basePrice * 1.05) },
    { name: 'Mar', price: Math.round(basePrice * 0.85) },
    { name: 'Apr', price: Math.round(basePrice * 1.15) },
    { name: 'May', price: Math.round(basePrice * 1.25) },
    { name: 'Jun', price: Math.round(basePrice * 1.38) }
  ];
};

export const AnalyticsDashboard = ({ onBack, selectedCrop = 'Tomato' }) => {
  const chartData = getMockDataForCrop(selectedCrop);
  
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--off-white)' }}>
      <Header title="Market Analytics" onBack={onBack} />
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--black)' }}>Price Trends ({selectedCrop})</h3>
          <button style={{ background: 'var(--primary-pale)', border: 'none', padding: '8px 12px', borderRadius: '8px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', fontWeight: '600' }}>
            <Filter size={14}/> 6 Months
          </button>
        </div>

        <div className="card" style={{ padding: '20px', height: '300px', marginBottom: '25px', background: 'var(--white)' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--gray-medium)' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--gray-medium)' }} />
              <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: 'var(--shadow-md)', background: 'var(--white)', color: 'var(--black)' }} />
              <Area type="monotone" dataKey="price" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '15px', color: 'var(--black)' }}>Market Drivers</h3>
        <div className="card" style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', background: 'var(--white)' }}>
          <span style={{ fontWeight: '600', color: 'var(--gray-dark)' }}>Export Ban Lifted</span>
          <span style={{ color: 'var(--success)', fontWeight: '700' }}>+8% impact</span>
        </div>
        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--white)' }}>
          <span style={{ fontWeight: '600', color: 'var(--gray-dark)' }}>Unseasonal Rain</span>
          <span style={{ color: 'var(--error)', fontWeight: '700' }}>-5% impact</span>
        </div>
      </div>
    </div>
  );
};

export const MarketMonitoring = ({ onBack }) => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--off-white)' }}>
    <Header title="Live Mandi Prices" onBack={onBack} />
    <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
      {['Lasalgaon (MH)', 'Pimpalgaon (MH)', 'Azadpur (DL)', 'Bangalore (KA)'].map((mandi, i) => (
        <div key={i} className="card" style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--white)' }}>
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--black)' }}>{mandi}</h4>
            <p style={{ fontSize: '12px', color: 'var(--gray-medium)', marginTop: '4px' }}>Updated 10 mins ago</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary)' }}>₹{2400 - (i * 120)}</p>
            <p style={{ fontSize: '12px', color: i % 2 === 0 ? 'var(--success)' : 'var(--error)', marginTop: '4px', fontWeight: '700' }}>{i % 2 === 0 ? '▲ +120' : '▼ -40'}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const ProfitLossAnalysis = ({ onBack, predictionResult, selectedCrop = 'Tomato' }) => {
  const [quintals, setQuintals] = useState(50);

  const isMatchingPrediction = predictionResult && (predictionResult.commodity === selectedCrop);
  const pricePerQuintal = isMatchingPrediction && predictionResult.average_prediction
    ? predictionResult.average_prediction 
    : getCropBasePrice(selectedCrop);

  const sellNow = quintals * pricePerQuintal;
  const sellLater = quintals * pricePerQuintal * 1.15;
  const storageCost = quintals * 40;
  const netExtraProfit = sellLater - sellNow - storageCost;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--off-white)' }}>
      <Header title="Profit / Loss Simulator" onBack={onBack} />
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        <div className="card" style={{ padding: '20px', marginBottom: '20px', background: 'var(--white)' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '15px', color: 'var(--gray-dark)' }}>Estimated Yield (Quintals)</h3>
          <input 
            type="number" 
            value={quintals} 
            onChange={e => setQuintals(Math.max(0, parseFloat(e.target.value) || 0))}
            style={{ 
              width: '100%', 
              padding: '12px', 
              borderRadius: '10px', 
              border: '1px solid var(--gray-light)', 
              fontSize: '18px', 
              fontWeight: '700',
              background: 'var(--white)',
              color: 'var(--black)',
              outline: 'none'
            }} 
          />
        </div>

        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
          <div className="card" style={{ flex: 1, border: '2px solid var(--primary)', background: 'var(--primary-pale)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={{ fontSize: '12px', color: 'var(--gray-dark)' }}>Sell Now</p>
            <h3 style={{ fontSize: '20px', color: 'var(--primary)', marginTop: '5px' }}>₹{Math.round(sellNow).toLocaleString('en-IN')}</h3>
          </div>
          <div className="card" style={{ flex: 1, background: 'var(--white)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={{ fontSize: '12px', color: 'var(--gray-dark)' }}>Sell in 1 Month</p>
            <h3 style={{ fontSize: '20px', color: 'var(--success)', marginTop: '5px' }}>₹{Math.round(sellLater).toLocaleString('en-IN')}</h3>
          </div>
        </div>
        
        <div className="card" style={{ padding: '15px', background: 'var(--black)', color: 'var(--white)' }}>
          <p style={{ fontSize: '14px', lineHeight: '1.5' }}>
            💡 After deducting storage costs (₹{Math.round(storageCost).toLocaleString('en-IN')}), you will make an extra <span style={{fontWeight:'bold'}}>₹{Math.round(netExtraProfit).toLocaleString('en-IN')}</span> by waiting 1 month.
          </p>
        </div>
      </div>
    </div>
  );
};
