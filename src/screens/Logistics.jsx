import React from 'react';
import { ChevronLeft, Truck, Snowflake, Package, Navigation, PhoneCall, Star } from 'lucide-react';

const Header = ({ title, onBack }) => (
  <div style={{ padding: '20px 20px 20px', display: 'flex', alignItems: 'center', gap: '15px', background: 'var(--white)', borderBottom: '1px solid var(--gray-light)' }}>
    <button onClick={onBack} style={{ background: 'var(--white)', border: 'none', padding: '8px', borderRadius: '10px', boxShadow: 'var(--shadow-sm)' }}>
      <ChevronLeft />
    </button>
    <h2 style={{ fontSize: '18px' }}>{title}</h2>
  </div>
);

export const TransportFinder = ({ onBack }) => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--off-white)' }}>
    <Header title="Find Transport" onBack={onBack} />
    <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
      <div className="card" style={{ padding: '15px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center', background: 'var(--primary)', color: 'white' }}>
        <Navigation size={20} />
        <span style={{ fontSize: '14px', fontWeight: '600' }}>Searching near: Nashik, MH (Within 20km)</span>
      </div>
      
      {[
        { name: "Om Logistics", type: "Mini Truck (1 Ton)", price: "₹800 + ₹15/km", rating: 4.8 },
        { name: "Kisan Movers", type: "Pickup (2.5 Ton)", price: "₹1200 + ₹18/km", rating: 4.5 },
        { name: "Fast Transport", type: "Heavy Truck (9 Ton)", price: "₹3500 + ₹30/km", rating: 4.9 }
      ].map((truck, i) => (
        <div key={i} className="card" style={{ marginBottom: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>{truck.name}</h4>
              <p style={{ fontSize: '13px', color: 'var(--gray-medium)', marginBottom: '8px' }}>{truck.type}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: '600', color: 'var(--warning)' }}>
                <Star size={14} fill="currentColor" /> {truck.rating} Rating
              </div>
            </div>
            <div style={{ width: '48px', height: '48px', background: 'var(--primary-pale)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              <Truck size={24} />
            </div>
          </div>
          <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid var(--gray-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: '700' }}>{truck.price}</span>
            <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>Book Now</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const ColdStorageFinder = ({ onBack }) => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--off-white)' }}>
    <Header title="Cold Storage Centers" onBack={onBack} />
    <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
      {[
        { name: "Nashik Fresh Storage", dist: "4.2 km", capacity: "Available: 40%", price: "₹50 / Quintal / Month" },
        { name: "AgroCold Hub", dist: "12 km", capacity: "Available: 15%", price: "₹45 / Quintal / Month" }
      ].map((storage, i) => (
        <div key={i} className="card" style={{ marginBottom: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '4px' }}>{storage.name}</h4>
              <p style={{ fontSize: '13px', color: 'var(--gray-medium)', marginBottom: '10px' }}>📍 {storage.dist} away</p>
            </div>
            <Snowflake color="var(--info)" size={24} />
          </div>
          <p style={{ fontSize: '13px', fontWeight: '600', color: 'var(--success)', marginBottom: '10px' }}>{storage.capacity}</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
            <span style={{ fontSize: '13px', fontWeight: '700' }}>{storage.price}</span>
            <button style={{ background: 'var(--info-pale)', color: 'var(--info)', border: 'none', padding: '8px', borderRadius: '8px' }}><PhoneCall size={18} /></button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const InventoryManager = ({ onBack }) => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--off-white)' }}>
    <Header title="My Inventory" onBack={onBack} />
    <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Current Stock</h3>
        <button style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: '600' }}>+ Add Item</button>
      </div>
      {[
        { item: "Onion (Kharif)", qty: "45 Quintals", status: "In Cold Storage", quality: "Grade A" },
        { item: "Tomato", qty: "12 Quintals", status: "At Farm", quality: "Grade B" }
      ].map((inv, i) => (
        <div key={i} className="card" style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ width: '50px', height: '50px', background: 'var(--warning-pale)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Package color="var(--warning)" /></div>
          <div style={{ flex: 1 }}>
            <h4 style={{ fontSize: '15px', fontWeight: '700' }}>{inv.item}</h4>
            <p style={{ fontSize: '12px', color: 'var(--gray-medium)' }}>{inv.qty} • {inv.quality}</p>
          </div>
          <div style={{ fontSize: '11px', padding: '4px 8px', background: 'var(--info-pale)', color: 'var(--info)', borderRadius: '8px', fontWeight: '600', textAlign: 'center' }}>{inv.status}</div>
        </div>
      ))}
    </div>
  </div>
);

export const OrderTracking = ({ onBack }) => (
  <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--off-white)' }}>
    <Header title="Track Shipments" onBack={onBack} />
    <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
      <div className="card" style={{ padding: '20px' }}>
        <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>Order #49281 (45 Q. Onion)</h4>
        
        <div style={{ position: 'relative', paddingLeft: '30px' }}>
          <div style={{ position: 'absolute', left: '7px', top: '10px', bottom: '10px', width: '2px', background: 'var(--gray-light)' }}></div>
          
          <div style={{ position: 'relative', marginBottom: '30px' }}>
            <div style={{ position: 'absolute', left: '-30px', top: '0', width: '16px', height: '16px', borderRadius: '50%', background: 'var(--success)', border: '4px solid white', boxShadow: '0 0 0 1px var(--success)' }}></div>
            <h5 style={{ fontSize: '14px', fontWeight: '700' }}>Picked Up from Farm</h5>
            <p style={{ fontSize: '12px', color: 'var(--gray-medium)' }}>Today, 09:30 AM</p>
          </div>
          
          <div style={{ position: 'relative', marginBottom: '30px' }}>
            <div style={{ position: 'absolute', left: '-30px', top: '0', width: '16px', height: '16px', borderRadius: '50%', background: 'var(--primary)', border: '4px solid white', boxShadow: '0 0 0 1px var(--primary)', animation: 'pulse 2s infinite' }}></div>
            <h5 style={{ fontSize: '14px', fontWeight: '700' }}>In Transit to Azadpur Mandi</h5>
            <p style={{ fontSize: '12px', color: 'var(--gray-medium)' }}>Expected arrival: 04:00 PM</p>
          </div>
          
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '-30px', top: '0', width: '16px', height: '16px', borderRadius: '50%', background: 'white', border: '4px solid var(--gray-light)', boxShadow: '0 0 0 1px var(--gray-light)' }}></div>
            <h5 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--gray-medium)' }}>Delivered</h5>
            <p style={{ fontSize: '12px', color: 'var(--gray-medium)' }}>Pending</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
