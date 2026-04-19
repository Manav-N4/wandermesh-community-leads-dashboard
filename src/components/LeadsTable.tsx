import React from 'react';

interface Lead {
  id: string | number;
  full_name?: string;
  phone_number?: string;
  instagram_handle?: string;
  created_at?: string;
  [key: string]: any;
}

interface LeadsTableProps {
  leads: Lead[];
  onApprove: (id: string | number) => void;
  onReject: (id: string | number) => void;
}

const LeadsTable: React.FC<LeadsTableProps> = ({ leads, onApprove, onReject }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Find all keys that exist across all leads to build table headers
  const allKeys = Array.from(new Set(leads.flatMap(l => Object.keys(l))));
  const coreKeys = ['full_name', 'phone_number', 'instagram_handle', 'created_at'];
  const extraKeys = allKeys.filter(k => !coreKeys.includes(k) && !['id', 'user_id', 'referral_code'].includes(k));

  return (
    <div className="table-wrapper" style={{ overflowX: 'auto', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
        <thead>
          <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
            <th style={{ padding: '1rem', fontWeight: '600', color: '#64748b' }}>Name</th>
            <th style={{ padding: '1rem', fontWeight: '600', color: '#64748b' }}>Phone</th>
            <th style={{ padding: '1rem', fontWeight: '600', color: '#64748b' }}>Instagram</th>
            <th style={{ padding: '1rem', fontWeight: '600', color: '#64748b' }}>Joined</th>
            {extraKeys.map(k => (
              <th key={k} style={{ padding: '1rem', fontWeight: '600', color: '#64748b' }}>{k.replace('_', ' ')}</th>
            ))}
            <th style={{ padding: '1rem', fontWeight: '600', color: '#64748b', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead, i) => (
            <tr key={lead.id || i} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}>
              <td style={{ padding: '1rem', fontWeight: '500', color: '#0f172a' }}>{lead.full_name || 'Anonymous'}</td>
              <td style={{ padding: '1rem', color: '#334155' }}>{lead.phone_number || '—'}</td>
              <td style={{ padding: '1rem' }}>
                {lead.instagram_handle ? (
                  <a href={`https://instagram.com/${lead.instagram_handle.replace('@', '')}`} target="_blank" rel="noopener noreferrer" style={{ color: '#d62976', textDecoration: 'none', fontWeight: '500' }}>
                    @{lead.instagram_handle.replace('@', '')}
                  </a>
                ) : '—'}
              </td>
              <td style={{ padding: '1rem', color: '#64748b' }}>{formatDate(lead.created_at)}</td>
              {extraKeys.map(k => (
                <td key={k} style={{ padding: '1rem', color: '#334155' }}>{String(lead[k] || '—')}</td>
              ))}
              <td style={{ padding: '1rem', textAlign: 'right' }}>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button 
                    onClick={() => onApprove(lead.id)}
                    style={{ background: '#ecfdf5', color: '#10b981', border: '1px solid #d1fae5', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer' }}
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => onReject(lead.id)}
                    style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fee2e2', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600', cursor: 'pointer' }}
                  >
                    Reject
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeadsTable;
