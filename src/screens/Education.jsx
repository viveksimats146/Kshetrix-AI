import React from 'react';
import { ChevronLeft, Play, BookOpen, Calendar, Bug, Video } from 'lucide-react';

const Header = ({ title, onBack }) => (
  <div style={{ padding: '20px 20px 20px', display: 'flex', alignItems: 'center', gap: '15px', background: 'var(--white)', borderBottom: '1px solid var(--gray-light)' }}>
    <button onClick={onBack} style={{ background: 'var(--white)', border: 'none', padding: '8px', borderRadius: '10px', boxShadow: 'var(--shadow-sm)' }}>
      <ChevronLeft />
    </button>
    <h2 style={{ fontSize: '18px' }}>{title}</h2>
  </div>
);

export const VideoTutorials = ({ onBack }) => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--off-white)' }}>
    <Header title="Agri Academy (Videos)" onBack={onBack} />
    <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
      {[
        { title: "Drip Irrigation Setup for Tomatoes", time: "12:45", views: "14k", thumb: "🍅" },
        { title: "Identifying Early Blight in Potatoes", time: "08:20", views: "32k", thumb: "🥔" },
        { title: "Organic Fertilizer Mix - Step by Step", time: "15:10", views: "8k", thumb: "🌱" }
      ].map((vid, i) => (
        <div key={i} className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '15px' }}>
          <div style={{ height: '160px', background: 'var(--gray-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{ fontSize: '64px', opacity: 0.2, position: 'absolute' }}>{vid.thumb}</div>
            <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.2)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
              <Play color="white" fill="white" size={24} />
            </div>
            <span style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.8)', color: 'white', fontSize: '11px', padding: '2px 6px', borderRadius: '4px' }}>{vid.time}</span>
          </div>
          <div style={{ padding: '15px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '5px' }}>{vid.title}</h4>
            <p style={{ fontSize: '12px', color: 'var(--gray-medium)' }}>Kshetrix-AI Official • {vid.views} views</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const ArticleReader = ({ onBack }) => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--off-white)' }}>
    <Header title="Agri Guides" onBack={onBack} />
    <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
      <div className="card" style={{ padding: '25px 20px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <span style={{ fontSize: '10px', fontWeight: '800', background: 'var(--primary-pale)', color: 'var(--primary)', padding: '4px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>Featured Guide</span>
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '10px', lineHeight: '1.3' }}>Modern Techniques for High-Yield Onion Farming</h2>
        <p style={{ fontSize: '13px', color: 'var(--gray-medium)', marginBottom: '20px' }}>By Dr. Kulkarni • 5 min read</p>
        
        <div style={{ fontSize: '15px', lineHeight: '1.6', color: 'var(--gray-dark)' }}>
          <p style={{ marginBottom: '15px' }}>Onion is a shallow-rooted crop. Hence, the soil should be friable and well-drained. The optimum pH for onion cultivation is 6.0 to 7.5...</p>
          <p style={{ marginBottom: '15px' }}>For Kharif crop, nursery should be raised in the month of May-June. Raised beds of 1.2m width, 3m length and 15cm height should be prepared...</p>
        </div>
        <button style={{ width: '100%', padding: '12px', background: 'var(--gray-light)', border: 'none', borderRadius: '8px', fontWeight: '600', marginTop: '10px' }}>Read Full Article</button>
      </div>
    </div>
  </div>
);

export const CropCalendar = ({ onBack }) => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--off-white)' }}>
    <Header title="Crop Calendar" onBack={onBack} />
    <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '700' }}>May 2026</h3>
        <div style={{ background: 'var(--primary-pale)', color: 'var(--primary)', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>Onion (Kharif)</div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {[
          { date: "15 May", task: "Nursery Bed Preparation", desc: "Prepare raised beds and apply FYM.", status: "done" },
          { date: "22 May", task: "Seed Sowing", desc: "Sow seeds at 5-7 cm spacing.", status: "active" },
          { date: "05 Jun", task: "First Weeding", desc: "Remove weeds from nursery bed.", status: "upcoming" },
          { date: "25 Jun", task: "Transplanting", desc: "Transplant 40-45 days old seedlings.", status: "upcoming" }
        ].map((task, i) => (
          <div key={i} style={{ display: 'flex', gap: '20px', position: 'relative' }}>
            {/* Timeline line */}
            {i !== 3 && <div style={{ position: 'absolute', left: '46px', top: '30px', bottom: '-20px', width: '2px', background: task.status === 'done' ? 'var(--success)' : 'var(--gray-light)' }}></div>}
            
            <div style={{ width: '40px', fontSize: '13px', fontWeight: '700', color: 'var(--gray-medium)', textAlign: 'right', paddingTop: '10px' }}>
              {task.date.split(' ')[0]}<br/><span style={{ fontSize: '10px' }}>{task.date.split(' ')[1]}</span>
            </div>
            
            <div style={{ flex: 1, paddingBottom: '30px' }}>
              <div className="card" style={{ padding: '15px', border: task.status === 'active' ? '2px solid var(--primary)' : 'none', opacity: task.status === 'upcoming' ? 0.7 : 1 }}>
                <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '5px' }}>{task.task}</h4>
                <p style={{ fontSize: '13px', color: 'var(--gray-medium)' }}>{task.desc}</p>
                {task.status === 'done' && <div style={{ marginTop: '10px', fontSize: '12px', fontWeight: '600', color: 'var(--success)' }}>✓ Completed</div>}
                {task.status === 'active' && <button className="btn-primary" style={{ marginTop: '10px', padding: '6px 12px', fontSize: '12px', width: 'auto' }}>Mark Complete</button>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const PestIdentification = ({ onBack }) => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--off-white)' }}>
    <Header title="Pest Identification" onBack={onBack} />
    <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: 'var(--primary)', color: 'white', padding: '25px', borderRadius: '16px', textAlign: 'center', marginBottom: '25px' }}>
        <Bug size={48} style={{ margin: '0 auto 15px' }} />
        <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>AI Plant Doctor</h3>
        <p style={{ fontSize: '14px', opacity: 0.9, marginBottom: '20px' }}>Take a photo of a diseased leaf and our AI will identify the pest instantly.</p>
        <button style={{ background: 'var(--white)', color: 'var(--primary)', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: '700', width: '100%' }}>Open Camera</button>
      </div>

      <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '15px' }}>Common Pests (Onion)</h4>
      {[
        { name: "Thrips", impact: "High", icon: "🪲" },
        { name: "Onion Maggot", impact: "Medium", icon: "🐛" }
      ].map((pest, i) => (
        <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
          <div style={{ fontSize: '32px' }}>{pest.icon}</div>
          <div style={{ flex: 1 }}>
            <h5 style={{ fontSize: '15px', fontWeight: '700' }}>{pest.name}</h5>
            <p style={{ fontSize: '12px', color: 'var(--error)' }}>Impact: {pest.impact}</p>
          </div>
          <ChevronLeft size={20} style={{ transform: 'rotate(180deg)', color: 'var(--gray-medium)' }} />
        </div>
      ))}
    </div>
  </div>
);
