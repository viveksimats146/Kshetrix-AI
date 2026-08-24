import React, { useState, useEffect } from 'react';
import { ChevronLeft, MapPin, Search } from 'lucide-react';
import { translate } from '../utils/translations';
import { getStates, getDistricts } from '../services/mandiApi';

import { getCropEmoji } from '../utils/cropHelper.js';

const Header = ({ title, onBack }) => (
  <div style={{ padding: '20px 20px 20px', display: 'flex', alignItems: 'center', gap: '15px', background: 'var(--white)' }}>
    {onBack && <button onClick={onBack} style={{ background: 'var(--white)', border: 'none', padding: '8px', borderRadius: '10px', boxShadow: 'var(--shadow-sm)' }}>
      <ChevronLeft />
    </button>}
    <h2 style={{ fontSize: '18px' }}>{title}</h2>
  </div>
);

export const ProfileSetup = ({ 
  onNext, 
  onBack, 
  profileName, 
  setProfileName, 
  profileState, 
  setProfileState, 
  profileDistrict, 
  setProfileDistrict,
  profileEmail,
  setProfileEmail,
  profilePhone,
  setProfilePhone,
  currentLang
}) => {
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [fetchingStates, setFetchingStates] = useState(true);
  const [fetchingDistricts, setFetchingDistricts] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleContinue = () => {
    setErrorMsg('');
    if (!profileName || !profileName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!profilePhone || !profilePhone.trim()) {
      setErrorMsg('Please enter your phone number.');
      return;
    }
    if (profilePhone.trim().length < 10) {
      setErrorMsg('Please enter a valid 10-digit phone number.');
      return;
    }
    if (!profileEmail || !profileEmail.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    if (!profileEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!profileState) {
      setErrorMsg('Please select your state.');
      return;
    }
    if (!profileDistrict || profileDistrict === 'No districts found') {
      setErrorMsg('Please select your district.');
      return;
    }
    onNext();
  };

  useEffect(() => {
    getStates()
      .then(s => {
        setStates(s);
        setFetchingStates(false);
        if (s.length > 0 && !profileState) {
          setProfileState(s[0]);
        }
      })
      .catch(err => {
        console.error("Error fetching states:", err);
        setFetchingStates(false);
      });
  }, []);

  useEffect(() => {
    if (!profileState) return;
    setFetchingDistricts(true);
    getDistricts(profileState)
      .then(d => {
        setDistricts(d);
        setFetchingDistricts(false);
        if (d.length > 0) {
          if (!d.includes(profileDistrict)) {
            setProfileDistrict(d[0]);
          }
        }
      })
      .catch(err => {
        console.error("Error fetching districts:", err);
        setFetchingDistricts(false);
      });
  }, [profileState]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--white)' }}>
      <Header title={translate('farmDetails', currentLang)} onBack={onBack} />
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        <h3 style={{ fontSize: '24px', marginBottom: '10px' }}>{translate('farmDetails', currentLang)}</h3>
        <p style={{ color: 'var(--gray-medium)', marginBottom: '30px' }}>Fill in your credentials and farming location details.</p>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--gray-dark)' }}>{translate('fullName', currentLang)}</label>
          <input 
            type="text" 
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            placeholder="Enter your name" 
            style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--gray-light)', fontSize: '15px', outline: 'none', background: 'var(--white)', color: 'var(--black)' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--gray-dark)' }}>Phone Number</label>
          <input 
            type="tel" 
            value={profilePhone || ''}
            onChange={(e) => setProfilePhone && setProfilePhone(e.target.value)}
            placeholder="Enter your phone number" 
            style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--gray-light)', fontSize: '15px', outline: 'none', background: 'var(--white)', color: 'var(--black)' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--gray-dark)' }}>Email Address</label>
          <input 
            type="email" 
            value={profileEmail || ''}
            onChange={(e) => setProfileEmail && setProfileEmail(e.target.value)}
            placeholder="Enter your email address" 
            style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--gray-light)', fontSize: '15px', outline: 'none', background: 'var(--white)', color: 'var(--black)' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--gray-dark)' }}>{translate('state', currentLang)}</label>
          <select 
            style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--gray-light)', fontSize: '15px', outline: 'none', background: 'var(--white)', color: 'var(--black)' }}
            value={profileState}
            onChange={(e) => setProfileState(e.target.value)}
            disabled={fetchingStates}
          >
            {fetchingStates && <option>Loading states...</option>}
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', marginBottom: '8px', color: 'var(--gray-dark)' }}>{translate('district', currentLang)}</label>
          <select 
            style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid var(--gray-light)', fontSize: '15px', outline: 'none', background: 'var(--white)', color: 'var(--black)' }}
            value={profileDistrict}
            onChange={(e) => setProfileDistrict(e.target.value)}
            disabled={fetchingDistricts || districts.length === 0}
          >
            {fetchingDistricts && <option>Loading districts...</option>}
            {districts.map(d => <option key={d} value={d}>{d}</option>)}
            {!fetchingDistricts && districts.length === 0 && <option>No districts found</option>}
          </select>
        </div>

        {errorMsg && <p style={{ color: 'var(--error)', fontSize: '13px', fontWeight: '600', marginBottom: '15px' }}>{errorMsg}</p>}

        <button className="btn-primary" onClick={handleContinue} disabled={fetchingStates || fetchingDistricts}>{translate('continue', currentLang)}</button>
      </div>
    </div>
  );
};

const CROP_CATEGORIES = {
  "Grains & Cereals": ["Wheat", "Paddy (Rice)", "Maize", "Barley", "Bajra", "Jowar", "Ragi"],
  "Vegetables": ["Potato", "Tomato", "Onion", "Garlic", "Ginger", "Cabbage", "Cauliflower", "Brinjal", "Carrot", "Spinach", "Peas", "Pumpkin", "Ladies Finger", "Ivy Gourd", "Bottle Gourd", "Bitter Gourd"],
  "Fruits": ["Mango", "Apple", "Banana", "Coconut", "Orange", "Grapes", "Papaya", "Pomegranate", "Watermelon", "Guava", "Pineapple", "Lemon"],
  "Spices": ["Black Pepper", "Cardamom", "Turmeric", "Coriander", "Chilli", "Cumin", "Cloves"],
  "Cash Crops & Oilseeds": ["Cotton", "Sugarcane", "Soybean", "Mustard", "Groundnut", "Sunflower"]
};

export const CropPreferences = ({ selected = [], setSelected, onNext, onBack }) => {
  const [search, setSearch] = useState('');

  const toggle = c => setSelected(selected.includes(c) ? selected.filter(x => x !== c) : [...selected, c]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--white)' }}>
      <Header title="Crop Selection" onBack={onBack} />
      <div style={{ flex: 1, padding: '0 20px 20px', overflowY: 'auto' }}>
        <h3 style={{ fontSize: '24px', marginBottom: '10px', fontWeight: '800' }}>What do you grow?</h3>
        <p style={{ color: 'var(--gray-medium)', marginBottom: '20px', fontSize: '14px' }}>Select crops to get personalized predictions and alerts.</p>
        
        <div style={{ position: 'relative', marginBottom: '25px' }}>
          <div style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-medium)' }}><Search size={18} /></div>
          <input 
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search crop (e.g. Cardamom, Turmeric)..." 
            style={{ width: '100%', padding: '14px 14px 14px 44px', borderRadius: '12px', border: '1px solid var(--gray-light)', fontSize: '15px', outline: 'none', background: 'var(--off-white)' }} 
          />
        </div>

        {Object.entries(CROP_CATEGORIES).map(([category, list]) => {
          const filtered = list.filter(crop => crop.toLowerCase().includes(search.toLowerCase()));
          if (filtered.length === 0) return null;

          return (
            <div key={category} style={{ marginBottom: '25px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--primary)', marginBottom: '12px', borderBottom: '1px solid var(--gray-light)', paddingBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{category}</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {filtered.map(c => (
                  <button 
                    key={c} 
                    onClick={() => toggle(c)} 
                    style={{ 
                      padding: '10px 18px', 
                      borderRadius: '24px', 
                      fontSize: '14px', 
                      fontWeight: '600', 
                      border: selected.includes(c) ? 'none' : '1px solid var(--gray-light)', 
                      background: selected.includes(c) ? 'var(--primary)' : 'var(--white)', 
                      color: selected.includes(c) ? 'var(--white)' : 'var(--gray-dark)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      boxShadow: selected.includes(c) ? '0 4px 10px rgba(45, 106, 79, 0.2)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span>{getCropEmoji(c)}</span> <span>{c}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ padding: '20px', borderTop: '1px solid var(--gray-light)' }}>
        <button className="btn-primary" onClick={onNext}>Complete Setup</button>
      </div>
    </div>
  );
};
