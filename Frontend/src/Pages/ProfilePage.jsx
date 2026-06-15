import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { updateProfile, getOrderCount } from '../services/api';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, refreshUser, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [orderCount, setOrderCount] = useState(0);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getOrderCount().then((d) => setOrderCount(d.count)).catch(() => {});
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setErr('');
    setMsg('');
    setSaving(true);
    try {
      const body = {};
      if (name !== user?.name) body.name = name;
      if (password) body.password = password;
      if (Object.keys(body).length === 0) { setMsg('Nothing to update'); setSaving(false); return; }
      await updateProfile(body);
      await refreshUser();
      setPassword('');
      setMsg('Profile updated!');
    } catch (e) {
      setErr(e.response?.data?.error || e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h1 className="profile-title">My Profile</h1>

        <div className="profile-stats">
          <div className="stat-box">
            <span className="stat-number">{orderCount}</span>
            <span className="stat-label">Total Orders</span>
          </div>
          <div className="stat-box">
            <span className="stat-number">{user?.name?.split(' ')[0] || '—'}</span>
            <span className="stat-label">Member</span>
          </div>
        </div>

        <form className="profile-form" onSubmit={handleSave}>
          <label className="profile-label">Email</label>
          <input className="form-input" value={user?.email || ''} disabled />

          <label className="profile-label">Name</label>
          <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />

          <label className="profile-label">New Password (leave blank to keep current)</label>
          <input className="form-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" minLength={6} />

          {msg && <p className="profile-msg">{msg}</p>}
          {err && <p className="profile-err">{err}</p>}

          <button type="submit" className="btn-black btn-submit" disabled={saving}>
            {saving ? 'SAVING...' : 'SAVE CHANGES'}
          </button>
        </form>

        <button className="profile-logout" onClick={() => { logout(); navigate('/'); }}>LOG OUT</button>
      </div>
    </div>
  );
};

export default ProfilePage;
