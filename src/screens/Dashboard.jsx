import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Activity, CloudRain, ShieldCheck, 
  ChevronRight, ChevronLeft, Calendar, Droplets, MapPin, Search, User, Sparkles, Leaf
} from 'lucide-react';
import { translate } from '../utils/translations';
import { getCropEmoji } from '../utils/cropHelper.js';

export const MainDashboard = ({ onNav, onBack, profileName, currentLang, selectedCrop = 'Tomato' }) => {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--off-white)' }}>
      {/* Header Profile Section */}
      <div style={{ padding: '20px 20px 20px', background: 'var(--white)', borderBottom: '1px solid var(--gray-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          {onBack && (
            <button onClick={onBack} style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--gray-light)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ChevronLeft size={20} />
            </button>
          )}
          <div>
            <p style={{ fontSize: '12px', color: 'var(--gray-medium)', fontWeight: '600' }}>{translate('welcome', currentLang)}</p>
            <h2 style={{ fontSize: '18px', fontWeight: '800' }}>{profileName}</h2>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '10px', 
            background: 'linear-gradient(135deg, var(--primary-pale), #D8F3DC)', 
            border: '2px solid var(--primary)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            boxShadow: '0 0 10px rgba(45, 106, 79, 0.2)', 
            cursor: 'pointer' 
          }} onClick={() => onNav('chatbot')} title={translate('aiAssistant', currentLang)}>
            <Sparkles size={20} color="var(--primary)" />
          </button>
          <button style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--white)', border: '1px solid var(--gray-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }} onClick={() => onNav('support')}>
            <Droplets size={20} color="var(--primary)" />
          </button>
          <button style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--white)', border: '1px solid var(--gray-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }} onClick={() => onNav('settings')}>
            <User size={20} color="var(--primary)" />
          </button>
        </div>
      </div>

      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        
        {/* AI Quick Actions */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
          <div className="card" style={{ flex: 1, padding: '15px', background: 'var(--primary)', color: 'white', cursor: 'pointer' }} onClick={() => onNav('prediction-input')}>
            <div style={{ marginBottom: '10px' }}><TrendingUp size={24} /></div>
            <h3 style={{ fontSize: '16px', marginBottom: '5px' }}>{translate('predictPrice', currentLang)}</h3>
            <p style={{ fontSize: '12px', opacity: 0.8 }}>{translate('getAiForecast', currentLang)}</p>
          </div>
          <div className="card" style={{ flex: 1, padding: '15px', background: 'var(--info)', color: 'white', cursor: 'pointer' }} onClick={() => onNav('analytics')}>
            <div style={{ marginBottom: '10px' }}><Activity size={24} /></div>
            <h3 style={{ fontSize: '16px', marginBottom: '5px' }}>{translate('marketData', currentLang)}</h3>
            <p style={{ fontSize: '12px', opacity: 0.8 }}>{translate('viewMandiTrends', currentLang)}</p>
          </div>
        </div>

        {/* Current Crop Status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700' }}>{translate('myCrops', currentLang)}</h3>
          <button onClick={() => onNav('crops')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '14px', fontWeight: '600' }}>{translate('viewAll', currentLang)}</button>
        </div>
        
        <div className="card" style={{ marginBottom: '25px', display: 'flex', gap: '15px', alignItems: 'center', cursor: 'pointer' }} onClick={() => onNav('crop-detail')}>
          <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: 'var(--primary-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px' }}>
            {getCropEmoji(selectedCrop)}
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '16px', fontWeight: '700' }}>{selectedCrop}</h4>
            <p style={{ fontSize: '13px', color: 'var(--gray-medium)', marginTop: '4px' }}>Expected Harvest: <span style={{ color: 'var(--black)', fontWeight: '600' }}>15 June</span></p>
          </div>
          <ChevronRight size={20} color="var(--gray-medium)" />
        </div>

        {/* Bento Farm Widgets */}
        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '15px', color: 'var(--black)' }}>Farm Health & Monitoring</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
          
          {/* Soil Moisture Widget */}
          <div className="card" style={{ padding: '15px', background: 'var(--white)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--gray-medium)', fontWeight: '600' }}>SOIL MOISTURE</span>
              <Droplets size={16} color="var(--primary)" />
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
              <h2 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--primary)' }}>48%</h2>
              <span style={{ fontSize: '11px', color: 'var(--success)', fontWeight: '700' }}>Optimal</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'var(--gray-light)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: '48%', height: '100%', background: 'var(--primary)', borderRadius: '4px' }}></div>
            </div>
            <p style={{ fontSize: '10px', color: 'var(--gray-medium)' }}>Last updated 3 hours ago</p>
          </div>

          {/* Mandi Price Watcher Widget */}
          <div className="card" style={{ padding: '15px', background: 'var(--white)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--gray-medium)', fontWeight: '600' }}>PRICE WATCH ({selectedCrop})</span>
              <TrendingUp size={16} color="var(--info)" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                <span style={{ fontWeight: '600' }}>Lasalgaon</span>
                <span style={{ color: 'var(--primary)', fontWeight: '700' }}>₹2,450</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                <span style={{ fontWeight: '600' }}>Pimpalgaon</span>
                <span style={{ color: 'var(--primary)', fontWeight: '700' }}>₹2,380</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
                <span style={{ fontWeight: '600' }}>Azadpur</span>
                <span style={{ color: 'var(--primary)', fontWeight: '700' }}>₹2,600</span>
              </div>
            </div>
          </div>
        </div>

        {/* Crop Growth Stage Tracker Widget */}
        <div className="card" style={{ padding: '20px', marginBottom: '25px', background: 'var(--white)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <span style={{ fontSize: '12px', color: 'var(--gray-medium)', fontWeight: '600' }}>GROWTH TRACKER</span>
            <Leaf size={16} color="var(--primary)" />
          </div>
          <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '10px' }}>Vegetative Growth Phase (Stage 3 of 5)</h4>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', marginBottom: '15px' }}>
            <div style={{ position: 'absolute', top: '12px', left: '0', right: '0', height: '3px', background: 'var(--gray-light)', zIndex: 1 }}></div>
            <div style={{ position: 'absolute', top: '12px', left: '0', width: '50%', height: '3px', background: 'var(--primary)', zIndex: 2 }}></div>
            {[
              { label: 'Sowing', active: true },
              { label: 'Sprouting', active: true },
              { label: 'Growth', active: true, current: true },
              { label: 'Flowering', active: false },
              { label: 'Harvest', active: false }
            ].map((step, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 3, gap: '4px' }}>
                <div style={{ 
                  width: '26px', 
                  height: '26px', 
                  borderRadius: '13px', 
                  background: step.current ? 'var(--primary)' : (step.active ? 'var(--primary-light)' : 'var(--gray-medium)'), 
                  border: step.current ? '4px solid var(--white)' : 'none',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: 'white', 
                  fontSize: '10px',
                  fontWeight: '700',
                  boxShadow: step.current ? '0 0 0 2px var(--primary)' : 'none'
                }}>
                  {idx + 1}
                </div>
                <span style={{ fontSize: '9px', fontWeight: step.current ? '700' : '500', color: step.current ? 'var(--primary)' : 'var(--gray-medium)' }}>{step.label}</span>
              </div>
            ))}
          </div>
          <div style={{ background: 'var(--primary-pale)', padding: '12px', borderRadius: '10px', fontSize: '12px', color: 'var(--primary-dark)', lineHeight: '1.4' }}>
            🌾 **Recommended Advisory**: Crop requires top-dressing of nitrogen fertilizer (Urea). Maintain consistent watering once every 4 days.
          </div>
        </div>

        {/* Intelligence Highlights */}
        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '15px' }}>{translate('intelligenceHub', currentLang)}</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', paddingBottom: '30px' }}>
          <div className="card" style={{ display: 'flex', gap: '15px', cursor: 'pointer' }} onClick={() => onNav('alerts')}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--info-pale)', color: 'var(--info)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CloudRain size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: '700' }}>{translate('weatherAlert', currentLang)}</h4>
              <p style={{ fontSize: '13px', color: 'var(--gray-medium)', marginTop: '4px' }}>Light rain expected tomorrow. Delay pesticide spray.</p>
            </div>
          </div>
          
          <div className="card" style={{ display: 'flex', gap: '15px', cursor: 'pointer' }} onClick={() => onNav('schemes')}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--success-pale)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: '700' }}>{translate('pmKisan', currentLang)}</h4>
              <p style={{ fontSize: '13px', color: 'var(--gray-medium)', marginTop: '4px' }}>14th installment released. Check your status.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
