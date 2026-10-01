'use client';

import React, { useState, useEffect } from 'react';
import { Plus, UserCheck, Shield, CheckCircle2, X } from 'lucide-react';
import { DbUser } from '@/lib/db/types';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<DbUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<DbUser['role']>('editor');
  const [password, setPassword] = useState('StaffPassword123!');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Failed to add user');
      } else {
        showToast(`Team member "${name}" added with ${role} permissions!`);
        setModalOpen(false);
        setName('');
        setEmail('');
        fetchUsers();
      }
    } catch {
      showToast('Error adding user');
    }
  };

  return (
    <div className="admin-users-page">
      {toastMessage && (
        <div className="admin-toast">
          <CheckCircle2 size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="page-header-row">
        <div>
          <h1 className="page-heading">Users & RBAC Roles</h1>
          <p className="page-sub">Manage administrator access, role permissions (Super Admin, Manager, Editor, Support), and team audit accounts.</p>
        </div>

        <button onClick={() => setModalOpen(true)} className="btn-primary">
          <Plus size={16} />
          <span>Add Team Member</span>
        </button>
      </div>

      <div className="table-card">
        <table className="users-table">
          <thead>
            <tr>
              <th>Member Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th>Last Active</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="empty-cell">Loading team members...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={6} className="empty-cell">No team members found.</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <strong className="user-name">{u.name}</strong>
                  </td>
                  <td>
                    <span className="user-email">{u.email}</span>
                  </td>
                  <td>
                    <span className={`role-pill ${u.role}`}>
                      {u.role.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span className="status-dot-active">Active</span>
                  </td>
                  <td>
                    <span className="date-text">{new Date(u.createdAt).toLocaleDateString()}</span>
                  </td>
                  <td>
                    <span className="date-text">{u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : 'Never'}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Add Team Member</h3>
              <button onClick={() => setModalOpen(false)} className="close-btn"><X size={18} /></button>
            </div>
            <form onSubmit={handleAddUser} className="modal-form">
              <div className="form-group">
                <label className="field-label">Full Name *</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Vikramaditya Rathore" className="form-input" />
              </div>
              <div className="form-group">
                <label className="field-label">Email Address *</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vikram@mksilverhub.com" className="form-input" />
              </div>
              <div className="form-group">
                <label className="field-label">Role & Permissions *</label>
                <select value={role} onChange={(e) => setRole(e.target.value as any)} className="form-select">
                  <option value="admin">Admin (Catalog, Orders, Inventory, Media)</option>
                  <option value="manager">Manager (Orders, Customers, Inventory)</option>
                  <option value="editor">Editor (Products, Content, Media, Banners)</option>
                  <option value="support">Support (Orders, Customers, Reviews)</option>
                  <option value="viewer">Viewer (Read-only)</option>
                </select>
              </div>
              <div className="form-group">
                <label className="field-label">Temporary Password</label>
                <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} className="form-input" />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-cancel">Cancel</button>
                <button type="submit" className="btn-save">Create Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-users-page { display: flex; flex-direction: column; gap: 20px; }
        .admin-toast { position: fixed; top: 84px; right: 28px; background-color: #2F855A; color: #FFF; padding: 10px 18px; border-radius: 10px; display: flex; align-items: center; gap: 8px; z-index: 300; font-size: 0.86rem; }
        .page-header-row { display: flex; align-items: center; justify-content: space-between; }
        .page-heading { font-family: var(--font-display), 'Cormorant Garamond', serif; font-size: 2.2rem; font-weight: 600; color: #342727; margin: 0; }
        .page-sub { font-size: 0.88rem; color: #806D68; margin: 4px 0 0 0; }
        .btn-primary { display: inline-flex; align-items: center; gap: 6px; background-color: #B76E79; color: #FFFFFF; padding: 9px 18px; border-radius: 10px; border: none; font-size: 0.86rem; font-weight: 600; cursor: pointer; }
        .btn-primary:hover { background-color: #9C5762; }
        .table-card { background: #FFFFFF; border: 1px solid #EAE2DB; border-radius: 18px; overflow: hidden; box-shadow: 0 4px 16px rgba(59, 43, 43, 0.03); }
        .users-table { width: 100%; border-collapse: collapse; font-size: 0.86rem; }
        .users-table th { text-align: left; padding: 12px 16px; background-color: #FAF7F4; font-size: 0.76rem; text-transform: uppercase; color: #806D68; font-weight: 600; border-bottom: 1px solid #EAE2DB; }
        .users-table td { padding: 14px 16px; border-bottom: 1px solid #F4EFEB; vertical-align: middle; color: #342727; }
        .user-name { font-weight: 600; }
        .user-email { color: #6F5A58; }
        .role-pill { padding: 3px 8px; border-radius: 6px; font-size: 0.7rem; font-weight: 700; }
        .role-pill.super_admin { background: #FCE8DE; color: #B76E79; }
        .role-pill.admin { background: #EBF8FF; color: #2B6CB0; }
        .role-pill.manager { background: #FEFCBF; color: #744210; }
        .role-pill.editor { background: #E6FFFA; color: #234E52; }
        .role-pill.support { background: #EDF2F7; color: #4A5568; }
        .status-dot-active { color: #2F855A; font-weight: 600; font-size: 0.8rem; }
        .date-text { font-size: 0.78rem; color: #806D68; }
        .empty-cell { text-align: center; padding: 40px !important; color: #806D68; }
        .modal-backdrop { position: fixed; inset: 0; background: rgba(52, 39, 39, 0.45); backdrop-filter: blur(4px); z-index: 250; display: flex; align-items: center; justify-content: center; padding: 20px; }
        .modal-card { width: min(92%, 460px); background: #FFFFFF; border-radius: 18px; padding: 24px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2); }
        .modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .modal-title { font-family: var(--font-display), 'Cormorant Garamond', serif; font-size: 1.3rem; margin: 0; }
        .close-btn { background: none; border: none; cursor: pointer; color: #806D68; }
        .modal-form { display: flex; flex-direction: column; gap: 12px; }
        .form-group { display: flex; flex-direction: column; gap: 4px; }
        .field-label { font-size: 0.76rem; font-weight: 600; color: #342727; }
        .form-input, .form-select { background: #FFF9F3; border: 1px solid #E8D8D0; border-radius: 8px; padding: 8px 12px; font-size: 0.86rem; outline: none; }
        .modal-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 8px; }
        .btn-cancel { padding: 7px 14px; border-radius: 6px; border: 1px solid #E8D8D0; background: #FFF; cursor: pointer; }
        .btn-save { padding: 7px 16px; border-radius: 6px; border: none; background: #B76E79; color: #FFF; font-weight: 600; cursor: pointer; }
      `}</style>
    </div>
  );
}
