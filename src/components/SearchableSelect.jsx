import React, { useState } from 'react';
import { Activity } from 'lucide-react';

export const SearchableSelect = ({ label, value, options = [], onChange, loading, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  
  const filteredOptions = options.filter(opt => 
    opt && opt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ marginBottom: '15px', position: 'relative' }}>
      {label && <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px' }}>{label}</label>}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid var(--gray-light)', 
          fontSize: '14px', background: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer'
        }}
      >
        <span style={{ color: value ? 'black' : '#999' }}>{loading ? 'Loading...' : (value || placeholder || `Select ${label}`)}</span>
        <Activity size={14} className={loading ? 'animate-spin' : ''} style={{ color: 'var(--gray-medium)' }} />
      </div>

      {isOpen && (
        <div style={{ 
          position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '1px solid var(--gray-light)', 
          borderRadius: '10px', marginTop: '5px', zIndex: 100, boxShadow: 'var(--shadow-lg)', maxHeight: '300px', display: 'flex', flexDirection: 'column'
        }}>
          <div style={{ padding: '8px', borderBottom: '1px solid var(--gray-light)' }}>
            <input 
              autoFocus
              placeholder={`Search...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--gray-light)', fontSize: '13px' }}
            />
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {filteredOptions.length > 0 ? (
              filteredOptions.slice(0, 100).map(opt => (
                <div 
                  key={opt}
                  onClick={() => { onChange(opt); setIsOpen(false); setSearch(''); }}
                  style={{ padding: '10px 12px', fontSize: '13px', cursor: 'pointer', background: opt === value ? 'var(--primary-pale)' : 'transparent' }}
                  onMouseEnter={(e) => e.target.style.background = 'var(--gray-light)'}
                  onMouseLeave={(e) => e.target.style.background = opt === value ? 'var(--primary-pale)' : 'transparent'}
                >
                  {opt}
                </div>
              ))
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', fontSize: '12px', color: 'var(--gray-medium)' }}>No results found</div>
            )}
            {filteredOptions.length > 100 && (
              <div style={{ padding: '8px', textAlign: 'center', fontSize: '11px', color: 'var(--gray-medium)', background: '#F8F9FA' }}>
                Showing first 100 results...
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
