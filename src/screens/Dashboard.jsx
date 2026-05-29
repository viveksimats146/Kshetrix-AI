import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Activity, CloudRain, ShieldCheck, 
  ChevronRight, ChevronLeft, Calendar, Droplets, MapPin, Search, User
} from 'lucide-react';
import { translate } from '../utils/translations';
import { getCropEmoji } from '../utils/cropHelper.js';

export const MainDashboard = ({ onNav, onBack, profileName, currentLang, selectedCrop = 'Onion' }) => {
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
