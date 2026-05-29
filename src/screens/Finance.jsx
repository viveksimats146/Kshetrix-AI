import React from 'react';
import { ChevronLeft, IndianRupee, ShieldCheck, PieChart, FileText, TrendingUp, AlertTriangle } from 'lucide-react';

const Header = ({ title, onBack }) => (
  <div style={{ padding: '20px 20px 20px', display: 'flex', alignItems: 'center', gap: '15px', background: 'white', borderBottom: '1px solid var(--gray-light)' }}>
    <button onClick={onBack} style={{ background: 'white', border: 'none', padding: '8px', borderRadius: '10px', boxShadow: 'var(--shadow-sm)' }}>
      <ChevronLeft />
    </button>
    <h2 style={{ fontSize: '18px' }}>{title}</h2>
  </div>
);

export const LoanApplication = ({ onBack }) => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#F8F9FA' }}>
    <Header title="Agri Loans" onBack={onBack} />
    <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
      <div style={{ background: 'var(--primary)', color: 'white', padding: '20px', borderRadius: '16px', marginBottom: '25px' }}>
        <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '5px' }}>Pre-approved Limit</p>
        <h2 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '15px' }}>₹ 1,50,000</h2>
        <button style={{ background: 'white', color: 'var(--primary)', border: 'none', padding: '10px 20px', borderRadius: '10px', fontWeight: '700', fontSize: '14px' }}>Apply Now</button>
      </div>

      <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '15px' }}>Active Loans</h3>
      <div className="card" style={{ marginBottom: '15px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: '700' }}>Kisan Credit Card</h4>
            <p style={{ fontSize: '12px', color: 'var(--gray-medium)' }}>State Bank of India</p>
          </div>
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--success)', background: 'var(--success-pale)', padding: '4px 8px', borderRadius: '8px', height: 'fit-content' }}>Active</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--gray-light)', paddingTop: '10px' }}>
          <div>
            <p style={{ fontSize: '11px', color: 'var(--gray-medium)' }}>Outstanding</p>
            <p style={{ fontSize: '14px', fontWeight: '700' }}>₹ 45,000</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '11px', color: 'var(--gray-medium)' }}>Next EMI</p>
            <p style={{ fontSize: '14px', fontWeight: '700', color: 'var(--error)' }}>₹ 4,500 (12 Aug)</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const ExpenseTracker = ({ onBack }) => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#F8F9FA' }}>
    <Header title="Farm Expenses" onBack={onBack} />
    <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Kharif 2026</h3>
        <button style={{ background: 'var(--primary-pale)', color: 'var(--primary)', border: 'none', padding: '6px 12px', borderRadius: '8px', fontWeight: '600', fontSize: '13px' }}>+ Add Entry</button>
      </div>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
        <div className="card" style={{ flex: 1, padding: '15px', textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: 'var(--gray-medium)' }}>Total Budget</p>
          <h4 style={{ fontSize: '16px', fontWeight: '700', marginTop: '5px' }}>₹ 1,00,000</h4>
        </div>
        <div className="card" style={{ flex: 1, padding: '15px', textAlign: 'center', borderLeft: '4px solid var(--error)' }}>
          <p style={{ fontSize: '12px', color: 'var(--gray-medium)' }}>Spent So Far</p>
          <h4 style={{ fontSize: '16px', fontWeight: '700', marginTop: '5px', color: 'var(--error)' }}>₹ 42,500</h4>
        </div>
      </div>

      <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '15px', color: 'var(--gray-dark)' }}>Recent Transactions</h4>
      {[
        { title: "Fertilizers (Urea)", date: "12 May", amount: "-₹4,500", icon: "🌱" },
        { title: "Tractor Rental", date: "10 May", amount: "-₹12,000", icon: "🚜" },
        { title: "Seeds (Onion)", date: "05 May", amount: "-₹8,000", icon: "🌾" }
      ].map((trx, i) => (
        <div key={i} className="card" style={{ padding: '15px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ width: '40px', height: '40px', background: 'var(--gray-light)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{trx.icon}</div>
          <div style={{ flex: 1 }}>
            <h5 style={{ fontSize: '14px', fontWeight: '600' }}>{trx.title}</h5>
            <p style={{ fontSize: '12px', color: 'var(--gray-medium)' }}>{trx.date}</p>
          </div>
          <span style={{ fontSize: '14px', fontWeight: '700', color: 'var(--error)' }}>{trx.amount}</span>
        </div>
      ))}
    </div>
  </div>
);

export const RevenueDashboard = ({ onBack }) => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#F8F9FA' }}>
    <Header title="Revenue Overview" onBack={onBack} />
    <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <PieChart color="var(--primary)" size={64} style={{ marginBottom: '20px', opacity: 0.5 }} />
      <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>Revenue Analytics</h3>
      <p style={{ fontSize: '14px', color: 'var(--gray-medium)', textAlign: 'center', lineHeight: '1.5' }}>Upload your mandi receipts to automatically track your historical revenue against expenses.</p>
      <button className="btn-primary" style={{ marginTop: '20px', width: 'auto', padding: '12px 24px' }}>Upload Receipt</button>
    </div>
  </div>
);

export const InsuranceStatus = ({ onBack }) => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#F8F9FA' }}>
    <Header title="Crop Insurance" onBack={onBack} />
    <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
      <div className="card" style={{ background: 'var(--info-pale)', border: '1px solid var(--info)', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '15px' }}>
          <ShieldCheck color="var(--info)" size={24} style={{ flexShrink: 0 }} />
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--info-dark)', marginBottom: '5px' }}>PM Fasal Bima Yojana</h4>
            <p style={{ fontSize: '13px', color: 'var(--info-dark)', opacity: 0.8 }}>Your Kharif 2026 Onion crop is fully insured against weather anomalies.</p>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: '15px' }}>
        <h4 style={{ fontSize: '12px', color: 'var(--gray-medium)', marginBottom: '5px' }}>Policy Number</h4>
        <p style={{ fontSize: '16px', fontWeight: '700', marginBottom: '15px', letterSpacing: '1px' }}>PMFBY-MH-2026-8941</p>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--gray-light)', paddingTop: '15px' }}>
          <div>
            <h4 style={{ fontSize: '12px', color: 'var(--gray-medium)', marginBottom: '5px' }}>Coverage Amount</h4>
            <p style={{ fontSize: '15px', fontWeight: '700' }}>₹ 1,20,000</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h4 style={{ fontSize: '12px', color: 'var(--gray-medium)', marginBottom: '5px' }}>Premium Paid</h4>
            <p style={{ fontSize: '15px', fontWeight: '700' }}>₹ 2,400</p>
          </div>
        </div>
      </div>

      <button style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid var(--error)', color: 'var(--error)', background: 'white', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
        <AlertTriangle size={18} /> File a Claim
      </button>
    </div>
  </div>
);
