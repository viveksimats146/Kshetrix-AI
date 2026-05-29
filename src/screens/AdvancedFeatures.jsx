import React from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, BarChart, Bar, Cell, Tooltip } from 'recharts';
import { ChevronLeft, TrendingUp, Filter } from 'lucide-react';

const Header = ({ title, onBack }) => (
  <div style={{ padding: '20px 20px 20px', display: 'flex', alignItems: 'center', gap: '15px', background: 'white', borderBottom: '1px solid var(--gray-light)' }}>
    <button onClick={onBack} style={{ background: 'white', border: 'none', padding: '8px', borderRadius: '10px', boxShadow: 'var(--shadow-sm)' }}>
      <ChevronLeft />
    </button>
    <h2 style={{ fontSize: '18px' }}>{title}</h2>
  </div>
);

const mockData = [
  { name: 'Jan', price: 2100 },
  { name: 'Feb', price: 2200 },
  { name: 'Mar', price: 1800 },
  { name: 'Apr', price: 2400 },
  { name: 'May', price: 2600 },
  { name: 'Jun', price: 2900 }
];

export const AnalyticsDashboard = ({ onBack }) => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#F8F9FA' }}>
    <Header title="Market Analytics" onBack={onBack} />
    <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Price Trends (Onion)</h3>
        <button style={{ background: 'var(--primary-pale)', border: 'none', padding: '8px 12px', borderRadius: '8px', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', fontWeight: '600' }}><Filter size={14}/> 6 Months</button>
      </div>

      <div className="card" style={{ padding: '20px', height: '300px', marginBottom: '25px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--gray-medium)' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--gray-medium)' }} />
            <Tooltip contentStyle={{ borderRadius: '10px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
            <Area type="monotone" dataKey="price" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '15px' }}>Market Drivers</h3>
      <div className="card" style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: '600' }}>Export Ban Lifted</span>
        <span style={{ color: 'var(--success)', fontWeight: '700' }}>+8% impact</span>
      </div>
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: '600' }}>Unseasonal Rain</span>
        <span style={{ color: 'var(--error)', fontWeight: '700' }}>-5% impact</span>
      </div>
    </div>
  </div>
);

export const MarketMonitoring = ({ onBack }) => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#F8F9FA' }}>
    <Header title="Live Mandi Prices" onBack={onBack} />
    <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
      {['Lasalgaon (MH)', 'Pimpalgaon (MH)', 'Azadpur (DL)', 'Bangalore (KA)'].map((mandi, i) => (
        <div key={i} className="card" style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h4 style={{ fontSize: '16px', fontWeight: '700' }}>{mandi}</h4>
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

export const ProfitLossAnalysis = ({ onBack }) => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#F8F9FA' }}>
    <Header title="Profit / Loss Simulator" onBack={onBack} />
    <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
      <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '16px', marginBottom: '15px', color: 'var(--gray-dark)' }}>Estimated Yield (Quintals)</h3>
        <input type="number" defaultValue={50} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--gray-light)', fontSize: '18px', fontWeight: '700' }} />
      </div>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
        <div className="card" style={{ flex: 1, border: '2px solid var(--primary)', background: 'var(--primary-pale)' }}>
          <p style={{ fontSize: '12px', color: 'var(--gray-dark)' }}>Sell Now</p>
          <h3 style={{ fontSize: '20px', color: 'var(--primary)', marginTop: '5px' }}>₹1,20,000</h3>
        </div>
        <div className="card" style={{ flex: 1 }}>
          <p style={{ fontSize: '12px', color: 'var(--gray-dark)' }}>Sell in 1 Month</p>
          <h3 style={{ fontSize: '20px', color: 'var(--success)', marginTop: '5px' }}>₹1,35,000</h3>
        </div>
      </div>
      
      <div className="card" style={{ padding: '15px', background: '#333', color: 'white' }}>
        <p style={{ fontSize: '14px', lineHeight: '1.5' }}>💡 After deducting storage costs (₹2000), you will make an extra <span style={{fontWeight:'bold'}}>₹13,000</span> by waiting 1 month.</p>
      </div>
    </div>
  </div>
);
