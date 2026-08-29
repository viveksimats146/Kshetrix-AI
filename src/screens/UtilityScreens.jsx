import React, { useState, useEffect } from 'react';
import { ChevronLeft, CloudRain, Sun, Wind, ShieldCheck, Send, Settings, User, Bell, Globe, Key, Check } from 'lucide-react';
import { getApiKey, setApiKey } from '../services/mandiApi';
import { supabase } from '../services/supabaseClient';
import { fetchWeatherForDistrict } from '../services/weatherApi';
import { translate } from '../utils/translations';
import { getApiBaseUrl } from '../utils/api';
import { getSpeechLanguageCode } from '../utils/speechHelper';
import { Mic, MicOff } from 'lucide-react';

const Header = ({ title, onBack }) => (
  <div style={{ padding: '20px 20px 20px', display: 'flex', alignItems: 'center', gap: '15px', background: 'var(--white)', borderBottom: '1px solid var(--gray-light)' }}>
    <button onClick={onBack} style={{ background: 'var(--white)', border: 'none', padding: '8px', borderRadius: '10px', boxShadow: 'var(--shadow-sm)' }}>
      <ChevronLeft />
    </button>
    <h2 style={{ fontSize: '18px' }}>{title}</h2>
  </div>
);

export const WeatherDashboard = ({ onBack, state = 'Maharashtra', district = 'Nashik', commodity = 'Onion', date }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Simple hash to get deterministic pseudo-random weather based on district + date as fallback
  let hash = 0;
  const seedString = district + (date || '');
  for (let i = 0; i < seedString.length; i++) {
    hash = seedString.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);

  const formatDate = (dStr) => {
    try {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dStr).toLocaleDateString(undefined, options);
    } catch (e) {
      return dStr;
    }
  };

  const temperatures = [22, 25, 28, 31, 34, 37, 18, 15];
  const humidities = [45, 55, 65, 75, 80, 40, 35, 90];
  const windSpeeds = [8, 12, 15, 10, 5, 20, 25, 18];
  const rainProbs = [10, 20, 40, 80, 90, 5, 0, 95];
  const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Rainy', 'Thunderstorm', 'Clear Sky', 'Windy', 'Heavy Rain'];
  
  const idx = hash % conditions.length;
  
  const defaultWeather = {
    temp: temperatures[idx],
    humidity: humidities[idx],
    wind: windSpeeds[idx],
    rainProb: rainProbs[idx],
    condition: conditions[idx],
    date: date || new Date().toISOString().split('T')[0]
  };

  useEffect(() => {
    setLoading(true);
    fetchWeatherForDistrict(district, date)
      .then(data => {
        if (data) {
          setWeatherData(data);
        } else {
          setWeatherData(defaultWeather);
        }
        setLoading(false);
      })
      .catch(() => {
        setWeatherData(defaultWeather);
        setLoading(false);
      });
  }, [district, date]);

  const activeWeather = weatherData || defaultWeather;
  const { temp, humidity, wind, rainProb, condition } = activeWeather;

  // Weather icon selector
  const renderWeatherIcon = (c) => {
    const size = 64;
    const opacity = 0.8;
    if (c.includes('Sunny') || c.includes('Clear')) return <Sun size={size} opacity={opacity} />;
    if (c.includes('Windy')) return <Wind size={size} opacity={opacity} />;
    return <CloudRain size={size} opacity={opacity} />;
  };

  // Weather-and-Crop Advisories Generator
  const getAdvisories = () => {
    const isWet = condition.includes('Rain') || condition.includes('Cloudy') || rainProb > 50;
    const isHot = temp > 32;
    
    const crop = commodity.toLowerCase();

    if (isWet) {
      if (crop.includes('onion') || crop.includes('garlic')) {
        return [
          { title: "Risk of Bulb Rot & Fungal Infection", desc: "Excess soil moisture increases bulb rot risk. Ensure proper drainage in your onion fields immediately.", severity: "var(--error)" },
          { title: "Delay Pesticide Spraying", desc: "Rain will wash away sprays. Wait for at least 24 hours of dry weather before applying fungicides.", severity: "var(--warning)" }
        ];
      }
      if (crop.includes('tomato') || crop.includes('potato')) {
        return [
          { title: "Early & Late Blight Alert", desc: "Humid and wet conditions are highly conducive for blight. Monitor lower leaves closely and apply copper-based fungicides if spotted.", severity: "var(--error)" },
          { title: "Suspend Irrigation", desc: "Due to heavy rain forecast, pause all drip or canal irrigation to avoid waterlogging and root damage.", severity: "var(--warning)" }
        ];
      }
      if (crop.includes('wheat') || crop.includes('rice') || crop.includes('paddy')) {
        return [
          { title: "Post-Harvest Drying Alert", desc: "If you have recently harvested, shield your grains in a dry shed. Wet grains attract black mold and spoil quickly.", severity: "var(--error)" }
        ];
      }
      return [
        { title: "Delay Harvesting", desc: "Harvesting wet crops causes fungal decay. Postpone harvest until the crop canopy is dry.", severity: "var(--warning)" }
      ];
    } else if (isHot) {
      if (crop.includes('wheat') || crop.includes('mustard')) {
        return [
          { title: "Irrigation Scheduling", desc: "High heat will increase evapotranspiration. Schedule light irrigation in the early morning to cool down root zones.", severity: "var(--warning)" }
        ];
      }
      if (crop.includes('tomato') || crop.includes('chilli')) {
        return [
          { title: "Blossom End Rot & Leaf Curl", desc: "Maintain uniform soil moisture. Mulching is highly recommended to protect soil from moisture loss under direct sun.", severity: "var(--info)" }
        ];
      }
      return [
        { title: "Increase Irrigation frequency", desc: "Due to high temperatures, increase irrigation intervals. Prefer drip irrigation in the evenings to minimize evaporation losses.", severity: "var(--info)" }
      ];
    } else {
      // Normal / Clear Weather
      return [
        { title: "Ideal Spraying Window", desc: "Low wind speed and clear skies offer the perfect window for applying bio-pesticides and micronutrients.", severity: "var(--success)" },
        { title: "Harvest Operations", desc: "Weather conditions are optimal for crop maturity check and manual or machine harvesting.", severity: "var(--success)" }
      ];
    }
  };

  const advisories = getAdvisories();

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--off-white)' }}>
      <Header title="Weather Alerts" onBack={onBack} />
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        {loading ? (
          <p style={{ color: 'var(--gray-medium)', fontSize: '14px', textAlign: 'center', marginTop: '20px' }}>Retrieving live weather forecast...</p>
        ) : (
          <>
            <div className="card" style={{ padding: '20px', marginBottom: '20px', background: 'linear-gradient(135deg, #4A90E2, #50E3C2)', color: 'white', border: 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h1 style={{ fontSize: '48px', fontWeight: '800' }}>{temp}°C</h1>
                  <p style={{ fontSize: '16px', opacity: 0.9 }}>{district}, {state}</p>
                  {date && <p style={{ fontSize: '12px', opacity: 0.8, marginTop: '3px' }}>Forecasted on {formatDate(activeWeather.date)}</p>}
                  <p style={{ fontSize: '13px', opacity: 0.8, marginTop: '5px', fontWeight: '600' }}>Condition: {condition}</p>
                </div>
                {renderWeatherIcon(condition)}
              </div>
              <div style={{ display: 'flex', gap: '15px', marginTop: '20px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                <div style={{ flex: 1 }}><p style={{ fontSize: '12px', opacity: 0.8 }}>Humidity</p><p style={{ fontWeight: '700' }}>{humidity}%</p></div>
                <div style={{ flex: 1 }}><p style={{ fontSize: '12px', opacity: 0.8 }}>Wind</p><p style={{ fontWeight: '700' }}>{wind} km/h</p></div>
                <div style={{ flex: 1 }}><p style={{ fontSize: '12px', opacity: 0.8 }}>Rain Prob.</p><p style={{ fontWeight: '700' }}>{rainProb}%</p></div>
              </div>
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '15px' }}>Agri Advisories ({commodity})</h3>
            {advisories.map((adv, idx) => (
              <div key={idx} className="card" style={{ marginBottom: '15px', borderLeft: `4px solid ${adv.severity}`, background: 'var(--white)' }}>
                <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '5px', color: 'var(--black)' }}>{adv.title}</h4>
                <p style={{ fontSize: '13px', color: 'var(--gray-medium)', lineHeight: '1.5' }}>{adv.desc}</p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export const GovtSchemes = ({ onBack }) => {
  const [schemes, setSchemes] = useState([
    { 
      id: "pmkisan",
      name: "PM-Kisan Samman Nidhi", 
      desc: "Pradhan Mantri Kisan Samman Nidhi provides direct income support of ₹6,000 per year in three equal installments to all landholding farmer families across India.", 
      longDesc: "This is a Central Sector Scheme with 100% funding from the Government of India. The fund is directly transferred to the bank accounts of the beneficiaries. It aims to supplement the financial needs of farmers in procuring various inputs to ensure proper crop health and appropriate yields.",
      eligibility: "All small and marginal landholder farmer families having cultivable land in their names.",
      docs: "Aadhaar Card, Land Holding Papers, Bank Account Details.",
      status: "Active", 
      color: "var(--success)" 
    },
    { 
      id: "pmfby",
      name: "PM Fasal Bima Yojana (PMFBY)", 
      desc: "Comprehensive crop insurance scheme providing financial support to farmers suffering crop loss/damage arising out of unforeseen events and natural calamities.", 
      longDesc: "PMFBY aims to support sustainable production in agriculture by providing financial security. Farmers only pay a very low premium (2% for Kharif, 1.5% for Rabi, and 5% for horticultural crops), with the rest subsidized by the government.",
      eligibility: "All farmers growing notified crops in notified areas including sharecroppers and tenant farmers.",
      docs: "Aadhaar, Land Registry (Survey Number), Sowing Certificate, Bank Account Details.",
      status: "Apply Now", 
      color: "var(--primary)" 
    },
    { 
      id: "kcc",
      name: "Kisan Credit Card (KCC)", 
      desc: "Provides farmers with timely credit for cultivation, crop production, and maintenance requirements, at highly subsidized interest rates starting at 4%.", 
      longDesc: "The Kisan Credit Card scheme was introduced to provide term loans and meet agricultural credit needs. It simplifies borrowing procedures and shields farmers from high-interest rates of local moneylenders.",
      eligibility: "All farmers, owner-cultivators, tenant farmers, and self-help groups of farmers.",
      docs: "Land Ownership Record, Aadhaar Card, Pan Card, Passport size photo.",
      status: "Apply Now", 
      color: "var(--primary)" 
    },
    { 
      id: "pmksy",
      name: "PM Krishi Sinchayee Yojana (PMKSY)", 
      desc: "Provides up to 80% subsidy for micro-irrigation systems (Drip and Sprinkler systems) to maximize crop water-use efficiency under 'More Crop Per Drop'.", 
      longDesc: "PMKSY has been formulated with the vision of extending the coverage of irrigation ('Har Khet Ko Pani') and improving water-use efficiency in a focused manner with end-to-end solutions.",
      eligibility: "Farmers owning agricultural land with a valid water source.",
      docs: "Aadhaar, Land Registry Documents, Drip/Sprinkler quotation from certified dealer.",
      status: "Apply Now", 
      color: "var(--primary)" 
    },
    { 
      id: "rkvity",
      name: "Sub-Mission on Agricultural Mechanization (SMAM / RKVY)", 
      desc: "Provides 40% to 50% subsidy for purchasing farm machinery such as tractors, rotavators, power tillers, and harvesters.", 
      longDesc: "SMAM promotes agricultural mechanization in India by establishing Custom Hiring Centres and providing subsidies for buying essential machinery to reduce manual labour costs and improve productivity.",
      eligibility: "All categories of farmers. Priority is given to small/marginal farmers and women farmers.",
      docs: "Aadhaar, Land Records, Bank Passbook copy, Equipment Quotation.",
      status: "Apply Now", 
      color: "var(--primary)" 
    }
  ]);

  const [selectedScheme, setSelectedScheme] = useState(null); // scheme object for showing details
  const [showApplyForm, setShowApplyForm] = useState(null); // scheme object to show application form
  const [trackingId, setTrackingId] = useState('');
  
  // Application Form Inputs
  const [formInputs, setFormInputs] = useState({
    farmerName: '',
    aadhaar: '',
    landArea: '',
    surveyNo: '',
    bankAccount: '',
    ifsc: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successApply, setSuccessApply] = useState(false);


  // Load existing applications from database on mount
  useEffect(() => {
    const loadApplications = async () => {
      const profileId = localStorage.getItem('agrico_profile_id');
      if (!profileId) return;
      try {
        const apiBase = getApiBaseUrl();
        const res = await fetch(`${apiBase}/get-schemes?profile_id=${profileId}`);
        if (!res.ok) throw new Error("Backend schemes fetch failed");
        const data = await res.json();
        if (data && data.length > 0) {
          setSchemes(prev => prev.map(s => {
            const match = data.find(d => d.scheme_name === s.name);
            if (match) {
              return { 
                ...s, 
                status: match.status === 'Under Review' ? 'Applied / Review' : match.status,
                color: match.status === 'Under Review' ? 'var(--warning)' : 'var(--success)'
              };
            }
            return s;
          }));
          return;
        }
      } catch (err) {
        console.warn("Failed to load scheme applications from backend, calling Supabase client fallback:", err.message);
      }

      // Fallback: client-side Supabase query
      try {
        const { data, error } = await supabase
          .from('scheme_applications')
          .select('scheme_name, status, tracking_id')
          .eq('profile_id', profileId);
        if (error) throw error;
        if (data && data.length > 0) {
          setSchemes(prev => prev.map(s => {
            const match = data.find(d => d.scheme_name === s.name);
            if (match) {
              return { 
                ...s, 
                status: match.status === 'Under Review' ? 'Applied / Review' : match.status,
                color: match.status === 'Under Review' ? 'var(--warning)' : 'var(--success)'
              };
            }
            return s;
          }));
        }
      } catch (err) {
        console.warn("Failed fallback loading schemes from Supabase:", err.message);
      }
    };
    loadApplications();
  }, []);

  const handleApplyClick = (scheme) => {
    setSelectedScheme(null); // close details if open
    setShowApplyForm(scheme);
    setFormInputs({
      farmerName: localStorage.getItem('agrico_profile_name') || '',
      aadhaar: '',
      landArea: '',
      surveyNo: '',
      bankAccount: '',
      ifsc: ''
    });
    setFormErrors({});
    setSuccessApply(false);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!formInputs.farmerName.trim()) errors.farmerName = "Farmer Name is required.";
    if (!/^\d{12}$/.test(formInputs.aadhaar)) errors.aadhaar = "Aadhaar must be exactly 12 digits.";
    if (!formInputs.landArea || isNaN(formInputs.landArea) || Number(formInputs.landArea) <= 0) errors.landArea = "Enter a valid land area in acres.";
    if (!formInputs.surveyNo.trim()) errors.surveyNo = "Survey Number is required.";
    if (!/^\d{9,18}$/.test(formInputs.bankAccount)) errors.bankAccount = "Enter a valid bank account (9-18 digits).";
    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formInputs.ifsc.toUpperCase())) errors.ifsc = "Enter a valid IFSC code (e.g. SBIN0001234).";
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setSubmitting(true);
    const appTrackingId = `KSH-SCH-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const profileId = localStorage.getItem('agrico_profile_id');
    
    // Save to backend database
    try {
      const apiBase = getApiBaseUrl();
      const res = await fetch(`${apiBase}/apply-scheme`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile_id: profileId || null,
          scheme_name: showApplyForm.name,
          farmer_name: formInputs.farmerName,
          aadhaar: formInputs.aadhaar,
          land_area: Number(formInputs.landArea),
          survey_number: formInputs.surveyNo,
          bank_account: formInputs.bankAccount,
          ifsc: formInputs.ifsc.toUpperCase(),
          tracking_id: appTrackingId
        })
      });
      if (!res.ok) throw new Error("Backend apply-scheme request failed");
    } catch (err) {
      console.warn("Failed saving application to backend, calling Supabase fallback:", err.message);
      
      // Fallback: save using Supabase Client
      try {
        const { error } = await supabase
          .from('scheme_applications')
          .insert([{
            profile_id: profileId || null,
            scheme_name: showApplyForm.name,
            farmer_name: formInputs.farmerName,
            aadhaar: formInputs.aadhaar,
            land_area: Number(formInputs.landArea),
            survey_number: formInputs.surveyNo,
            bank_account: formInputs.bankAccount,
            ifsc: formInputs.ifsc.toUpperCase(),
            tracking_id: appTrackingId,
            status: 'Under Review'
          }]);
        if (error) throw error;
      } catch (e2) {
        console.warn("Failed fallback saving application to Supabase:", e2.message);
      }
    }

    setTrackingId(appTrackingId);
    setSubmitting(false);
    setSuccessApply(true);
    
    setSchemes(prev => prev.map(s => {
      if (s.id === showApplyForm.id) {
        return { ...s, status: "Applied / Review", color: "var(--warning)" };
      }
      return s;
    }));
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--off-white)', position: 'relative' }}>
      <Header title="Government Schemes" onBack={onBack} />
      
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        <div style={{ background: 'var(--primary-pale)', padding: '15px', borderRadius: '12px', display: 'flex', gap: '10px', marginBottom: '20px', color: 'var(--primary-dark)', fontSize: '13px', lineHeight: '1.5' }}>
          <span>💡</span>
          <span>Apply directly for official agriculture welfare and subsidy schemes. Track application status inside the portal.</span>
        </div>

        {schemes.map((scheme) => (
          <div key={scheme.id} className="card" style={{ marginBottom: '15px', borderLeft: `4px solid ${scheme.color}`, transition: 'all 0.2s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', gap: '10px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: '800', width: '70%', color: 'var(--black)' }}>{scheme.name}</h4>
              <span style={{ fontSize: '11px', padding: '4px 10px', background: scheme.color, color: 'white', borderRadius: '12px', fontWeight: '700', whiteSpace: 'nowrap' }}>{scheme.status}</span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--gray-medium)', marginBottom: '15px', lineHeight: '1.5' }}>{scheme.desc}</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => setSelectedScheme(scheme)}
                style={{ flex: 1, padding: '12px', background: 'var(--white)', color: 'var(--gray-dark)', border: '1px solid var(--gray-light)', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', fontSize: '13px' }}
              >
                View Details
              </button>
              {scheme.status === 'Apply Now' && (
                <button 
                  onClick={() => handleApplyClick(scheme)}
                  style={{ flex: 1, padding: '12px', background: 'var(--primary)', color: 'var(--white)', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '13px', boxShadow: '0 4px 10px rgba(45, 106, 79, 0.15)' }}
                >
                  Apply Online
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Details Modal */}
      {selectedScheme && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 1100, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ background: 'white', width: '100%', maxHeight: '85%', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', display: 'flex', flexDirection: 'column', padding: '24px', overflowY: 'auto', boxShadow: '0 -8px 32px rgba(0,0,0,0.15)' }}>
            <div style={{ width: '40px', height: '5px', background: 'var(--gray-light)', borderRadius: '3px', alignSelf: 'center', marginBottom: '20px' }}></div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--black)', width: '80%' }}>{selectedScheme.name}</h3>
              <span style={{ fontSize: '11px', padding: '4px 10px', background: selectedScheme.color, color: 'white', borderRadius: '12px', fontWeight: '700' }}>{selectedScheme.status}</span>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h5 style={{ fontSize: '12px', color: 'var(--gray-medium)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: '700' }}>Description</h5>
                <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--gray-dark)' }}>{selectedScheme.longDesc}</p>
              </div>

              <div>
                <h5 style={{ fontSize: '12px', color: 'var(--gray-medium)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: '700' }}>Eligibility Criteria</h5>
                <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--gray-dark)' }}>{selectedScheme.eligibility}</p>
              </div>

              <div>
                <h5 style={{ fontSize: '12px', color: 'var(--gray-medium)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: '700' }}>Required Documents</h5>
                <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--gray-dark)', fontWeight: '600' }}>{selectedScheme.docs}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '30px' }}>
              <button 
                onClick={() => setSelectedScheme(null)}
                style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid var(--gray-light)', background: 'white', fontWeight: '600', cursor: 'pointer' }}
              >
                Close
              </button>
              {selectedScheme.status === 'Apply Now' && (
                <button 
                  onClick={() => handleApplyClick(selectedScheme)}
                  style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: '700', cursor: 'pointer' }}
                >
                  Apply Online
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Application Form Modal */}
      {showApplyForm && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 1200, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ background: 'white', width: '100%', maxHeight: '90%', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', display: 'flex', flexDirection: 'column', padding: '24px', overflowY: 'auto', boxShadow: '0 -8px 32px rgba(0,0,0,0.15)' }}>
            <div style={{ width: '40px', height: '5px', background: 'var(--gray-light)', borderRadius: '3px', alignSelf: 'center', marginBottom: '20px' }}></div>

            {!successApply ? (
              <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--black)', marginBottom: '5px' }}>Application: {showApplyForm.name}</h3>
                
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--gray-dark)', marginBottom: '6px' }}>Farmer Full Name (as per Bank Account)</label>
                  <input 
                    type="text"
                    value={formInputs.farmerName}
                    onChange={e => setFormInputs({...formInputs, farmerName: e.target.value})}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--gray-light)', fontSize: '14px', outline: 'none' }}
                  />
                  {formErrors.farmerName && <p style={{ color: 'var(--error)', fontSize: '11px', marginTop: '4px' }}>{formErrors.farmerName}</p>}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--gray-dark)', marginBottom: '6px' }}>12-Digit Aadhaar Number</label>
                  <input 
                    type="text"
                    maxLength={12}
                    placeholder="123456789012"
                    value={formInputs.aadhaar}
                    onChange={e => setFormInputs({...formInputs, aadhaar: e.target.value.replace(/\D/g, '')})}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--gray-light)', fontSize: '14px', outline: 'none' }}
                  />
                  {formErrors.aadhaar && <p style={{ color: 'var(--error)', fontSize: '11px', marginTop: '4px' }}>{formErrors.aadhaar}</p>}
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--gray-dark)', marginBottom: '6px' }}>Land Area (Acres)</label>
                    <input 
                      type="text"
                      placeholder="e.g. 2.5"
                      value={formInputs.landArea}
                      onChange={e => setFormInputs({...formInputs, landArea: e.target.value})}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--gray-light)', fontSize: '14px', outline: 'none' }}
                    />
                    {formErrors.landArea && <p style={{ color: 'var(--error)', fontSize: '11px', marginTop: '4px' }}>{formErrors.landArea}</p>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--gray-dark)', marginBottom: '6px' }}>Survey / Khasra Number</label>
                    <input 
                      type="text"
                      placeholder="e.g. 104/A"
                      value={formInputs.surveyNo}
                      onChange={e => setFormInputs({...formInputs, surveyNo: e.target.value})}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--gray-light)', fontSize: '14px', outline: 'none' }}
                    />
                    {formErrors.surveyNo && <p style={{ color: 'var(--error)', fontSize: '11px', marginTop: '4px' }}>{formErrors.surveyNo}</p>}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--gray-dark)', marginBottom: '6px' }}>Bank Account Number</label>
                    <input 
                      type="text"
                      placeholder="e.g. 30123456789"
                      value={formInputs.bankAccount}
                      onChange={e => setFormInputs({...formInputs, bankAccount: e.target.value.replace(/\D/g, '')})}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--gray-light)', fontSize: '14px', outline: 'none' }}
                    />
                    {formErrors.bankAccount && <p style={{ color: 'var(--error)', fontSize: '11px', marginTop: '4px' }}>{formErrors.bankAccount}</p>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--gray-dark)', marginBottom: '6px' }}>IFSC Code</label>
                    <input 
                      type="text"
                      placeholder="e.g. SBIN0001234"
                      value={formInputs.ifsc}
                      onChange={e => setFormInputs({...formInputs, ifsc: e.target.value})}
                      style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--gray-light)', fontSize: '14px', outline: 'none' }}
                    />
                    {formErrors.ifsc && <p style={{ color: 'var(--error)', fontSize: '11px', marginTop: '4px' }}>{formErrors.ifsc}</p>}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                  <button 
                    type="button"
                    onClick={() => setShowApplyForm(null)}
                    style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid var(--gray-light)', background: 'white', fontWeight: '600', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={submitting}
                    style={{ flex: 1, padding: '14px', borderRadius: '12px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {submitting ? 'Submitting Form...' : 'Submit Application'}
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '32px', background: 'var(--success-pale)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <Check size={36} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--black)', marginBottom: '10px' }}>Application Submitted!</h3>
                <p style={{ fontSize: '14px', color: 'var(--gray-medium)', lineHeight: '1.6', marginBottom: '20px' }}>
                  Your application for <strong>{showApplyForm.name}</strong> has been uploaded successfully.
                </p>
                <div style={{ background: 'var(--off-white)', padding: '15px', borderRadius: '10px', border: '1px dashed var(--gray-light)', marginBottom: '30px' }}>
                  <p style={{ fontSize: '11px', color: 'var(--gray-medium)', textTransform: 'uppercase', marginBottom: '4px' }}>Application Tracking ID</p>
                  <p style={{ fontSize: '16px', fontWeight: '800', color: 'var(--primary-dark)', letterSpacing: '0.5px' }}>{trackingId}</p>
                </div>
                <button 
                  onClick={() => setShowApplyForm(null)}
                  style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: '700', cursor: 'pointer' }}
                >
                  Return to Schemes
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const AIChatbot = ({ onBack, currentLang = 'English' }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    setMessages([{ sender: 'ai', text: translate('aiChatbotWelcome', currentLang) }]);
  }, [currentLang]);

  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(translate('voiceNotSupported', currentLang));
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = getSpeechLanguageCode(currentLang);

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        setInput(prev => prev ? prev + ' ' + transcript : transcript);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === 'not-allowed') {
        alert(translate('voiceAccessDenied', currentLang));
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    
    try {
      const apiBase = getApiBaseUrl();
      const res = await fetch(`${apiBase}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { sender: 'ai', text: data.response }]);
    } catch (e) {
      setMessages(prev => [...prev, { sender: 'ai', text: translate('aiChatbotError', currentLang) }]);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--white)' }}>
      <Header title={translate('aiChatbotTitle', currentLang)} onBack={onBack} />
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', background: 'var(--off-white)' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start', background: m.sender === 'user' ? 'var(--primary)' : 'var(--primary-pale)', color: m.sender === 'user' ? 'white' : 'var(--black)', padding: '12px 16px', borderRadius: m.sender === 'user' ? '16px 16px 0 16px' : '16px 16px 16px 0', maxWidth: '80%' }}>
            <p style={{ fontSize: '14px', lineHeight: '1.5' }}>{m.text}</p>
          </div>
        ))}
      </div>
      <div style={{ padding: '15px 20px', borderTop: '1px solid var(--gray-light)', display: 'flex', gap: '10px', alignItems: 'center' }}>
        {isListening && (
          <style>{`
            @keyframes pulse-mic {
              0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.4); }
              70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(220, 53, 69, 0); }
              100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(220, 53, 69, 0); }
            }
          `}</style>
        )}
        <input 
          value={input} 
          onChange={e => setInput(e.target.value)} 
          placeholder={isListening ? translate('voiceListening', currentLang) : translate('aiChatbotPlaceholder', currentLang)} 
          style={{ flex: 1, padding: '12px 16px', borderRadius: '20px', border: '1px solid var(--gray-light)', fontSize: '14px', outline: 'none' }} 
          onKeyDown={e => e.key === 'Enter' && handleSend()} 
          disabled={isListening}
        />
        <button 
          onClick={toggleListening} 
          style={{ 
            width: '44px', 
            height: '44px', 
            borderRadius: '22px', 
            background: isListening ? 'var(--error)' : 'var(--primary-pale)', 
            color: isListening ? 'white' : 'var(--primary)', 
            border: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            animation: isListening ? 'pulse-mic 1.5s infinite' : 'none'
          }}
          title="Voice Input"
        >
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
        </button>
        <button 
          onClick={handleSend} 
          style={{ width: '44px', height: '44px', borderRadius: '22px', background: 'var(--primary)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          disabled={isListening}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export const SettingsScreen = ({ onBack, theme, setTheme, wallpaper = 'none', setWallpaper, customWallpaper = '', setCustomWallpaper, onNavigate, language }) => {
  const [apiKeyVal, setApiKeyVal] = useState(getApiKey());
  const [keySaved, setKeySaved] = useState(false);

  const handleSaveApiKey = async () => {
    setApiKey(apiKeyVal);
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2000);
    try {
      const apiBase = getApiBaseUrl();
      const profileId = localStorage.getItem('agrico_profile_id');
      if (profileId) {
        const res = await fetch(`${apiBase}/get-profile?id=${profileId}`);
        const data = await res.json();
        const payload = {
          ...data,
          data_gov_api_key: apiKeyVal
        };
        await fetch(`${apiBase}/save-profile`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
    } catch (e) {
      console.warn("Failed to sync API key to backend:", e);
    }
  };
  const themes = [
    { id: 'classic', label: 'Classic', bg: '#2D6A4F', text: 'white' },
    { id: 'dark', label: 'Dark', bg: '#1E1E1E', text: '#52B788' },
    { id: 'gold', label: 'Gold', bg: '#D4A373', text: '#583101' },
    { id: 'frosted', label: 'Frosted', bg: '#00B4D8', text: '#03045E' },
    { id: 'grey', label: 'Grey', bg: '#4F5D75', text: 'white' },
    { id: 'aqua', label: 'Aqua', bg: '#00C49F', text: '#004D40' },
    { id: 'blue', label: 'Blue', bg: '#0A84FF', text: 'white' },
    { id: 'barbie', label: 'Barbie', bg: '#F72585', text: 'white' },
    { id: 'metal', label: 'Metal', bg: '#6C757D', text: '#F8F9FA' },
    { id: 'batman', label: 'Batman', bg: '#111111', text: '#FEE440' },
    { id: 'olive', label: 'Olive', bg: '#6B705C', text: '#3F4238' },
    { id: 'sunset', label: 'Sunset', bg: '#E76F51', text: '#264653' },
    { id: 'blood', label: 'Blood', bg: '#BA1A1A', text: '#FFDAD6' },
    { id: 'midnight', label: 'Midnight', bg: '#7B2CBF', text: 'white' }
  ];

  const wallpapers = [
    { id: 'none', label: 'None', preview: '#CCCCCC' },
    { id: 'forest', label: 'Forest', preview: 'url(./wallpapers/forest.jpg)' },
    { id: 'ocean', label: 'Ocean', preview: 'url(./wallpapers/ocean.jpg)' },
    { id: 'mountains', label: 'Mountains', preview: 'url(./wallpapers/mountains.jpg)' },
    { id: 'sunset', label: 'Sunset', preview: 'url(./wallpapers/sunset.jpg)' },
    { id: 'meadow', label: 'Meadow', preview: 'url(./wallpapers/meadow.jpg)' },
    { id: 'aurora', label: 'Aurora', preview: 'url(./wallpapers/aurora.jpg)' },
    { id: 'blossoms', label: 'Blossoms', preview: 'url(./wallpapers/blossoms.jpg)' },
    { id: 'tropical', label: 'Tropical', preview: 'url(./wallpapers/tropical.jpg)' },
    { id: 'ruby', label: 'Ruby', preview: 'url(./wallpapers/ruby.jpg)' },
    { id: 'jungle', label: 'Jungle', preview: 'url(./wallpapers/jungle.jpg)' },
    { id: 'autumn', label: 'Autumn', preview: 'url(./wallpapers/autumn.jpg)' },
    { id: 'custom', label: 'Custom 🖼️', preview: customWallpaper ? `url(${customWallpaper})` : 'linear-gradient(135deg, #4a00e0 0%, #8e2de2 100%)' }
  ];

  const handleCustomWallpaperChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setCustomWallpaper(event.target.result);
        setWallpaper('custom');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWallpaperClick = (wId) => {
    if (wId === 'custom') {
      document.getElementById('customWallpaperInput').click();
    } else {
      setWallpaper(wId);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--off-white)' }}>
      <Header title="Settings" onBack={onBack} />
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
        
        {/* Hidden input for custom wallpaper */}
        <input 
          type="file" 
          accept="image/*" 
          id="customWallpaperInput" 
          style={{ display: 'none' }} 
          onChange={handleCustomWallpaperChange} 
        />

        <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '10px', color: 'var(--gray-dark)' }}>App Theme</h3>
        <div className="card" style={{ marginBottom: '20px', padding: '15px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {themes.map(t => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                style={{
                  padding: '12px 6px',
                  borderRadius: '10px',
                  border: theme === t.id ? '2.5px solid var(--primary)' : '1px solid var(--gray-light)',
                  background: t.bg,
                  color: t.text,
                  fontWeight: '700',
                  fontSize: '11px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: theme === t.id ? '0 2px 8px rgba(0,0,0,0.15)' : 'none'
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '10px', color: 'var(--gray-dark)' }}>Background Wallpaper</h3>
        <div className="card" style={{ marginBottom: '20px', padding: '15px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {wallpapers.map(w => (
              <button
                key={w.id}
                onClick={() => handleWallpaperClick(w.id)}
                style={{
                  height: '55px',
                  borderRadius: '10px',
                  border: wallpaper === w.id ? '2.5px solid var(--primary)' : '1px solid var(--gray-light)',
                  background: w.id === 'none' ? w.preview : `${w.preview} no-repeat center`,
                  backgroundSize: 'cover',
                  color: (w.id === 'none' || w.id === 'custom') ? 'var(--black)' : '#FFFFFF',
                  fontWeight: '800',
                  fontSize: '12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textShadow: (w.id === 'none' || w.id === 'custom') ? 'none' : '0 1.5px 3px rgba(0,0,0,0.8)',
                  boxShadow: wallpaper === w.id ? '0 3px 10px rgba(0,0,0,0.25)' : 'none'
                }}
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>

        <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '10px', color: 'var(--gray-dark)' }}>Developer Settings</h3>
        <div className="card" style={{ padding: '15px 20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: 'var(--gray-dark)' }}>Data.gov.in API Key</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="password" 
                value={apiKeyVal} 
                onChange={(e) => setApiKeyVal(e.target.value)} 
                placeholder="Enter your API Key" 
                style={{ flex: 1, padding: '10px 15px', borderRadius: '8px', border: '1px solid var(--gray-light)', fontSize: '14px', background: 'var(--white)', color: 'var(--black)' }}
              />
              <button 
                onClick={handleSaveApiKey} 
                style={{ 
                  background: 'var(--primary)', color: 'white', border: 'none', 
                  padding: '10px 15px', borderRadius: '8px', fontWeight: '700', 
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' 
                }}
              >
                {keySaved ? <Check size={16} /> : 'Save'}
              </button>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--gray-medium)', margin: '0' }}>
              Enter a free API key from data.gov.in to enable live Mandi price feeds.
            </p>
          </div>
        </div>

        <h3 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '10px', color: 'var(--gray-dark)' }}>General Settings</h3>
        <div className="card" style={{ padding: '0' }}>
          <div onClick={() => onNavigate('edit-profile')} style={{ padding: '15px 20px', borderBottom: '1px solid var(--gray-light)', display: 'flex', gap: '15px', alignItems: 'center', cursor: 'pointer' }}>
            <User size={20} color="var(--gray-dark)" /> <span style={{ fontSize: '15px', fontWeight: '600' }}>Account Details</span>
          </div>
          <div onClick={() => onNavigate('notification-settings')} style={{ padding: '15px 20px', borderBottom: '1px solid var(--gray-light)', display: 'flex', gap: '15px', alignItems: 'center', cursor: 'pointer' }}>
            <Bell size={20} color="var(--gray-dark)" /> <span style={{ fontSize: '15px', fontWeight: '600' }}>Notifications</span>
          </div>
          <div onClick={() => onNavigate('language')} style={{ padding: '15px 20px', display: 'flex', gap: '15px', alignItems: 'center', cursor: 'pointer' }}>
            <Globe size={20} color="var(--gray-dark)" /> <span style={{ fontSize: '15px', fontWeight: '600' }}>Language ({language})</span>
          </div>
        </div>
      </div>
    </div>
  );
};
