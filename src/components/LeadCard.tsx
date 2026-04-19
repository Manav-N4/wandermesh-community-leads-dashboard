import React from 'react';

interface Lead {
  id: string | number;
  full_name?: string;
  phone_number?: string;
  instagram_handle?: string;
  created_at?: string;
  [key: string]: any;
}

interface LeadCardProps {
  lead: Lead;
  isApproved: boolean;
  onApprove: (id: string | number) => void;
  onReject: (id: string | number) => void;
}

const LeadCard: React.FC<LeadCardProps> = ({ lead, isApproved, onApprove, onReject }) => {
  const { full_name, phone_number, instagram_handle, created_at, ...extraFields } = lead;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Skip internal Supabase fields and the core ones we already handled
  const filteredExtraFields = Object.entries(extraFields).filter(([key, value]) => {
    const internalFields = ['id', 'user_id', 'referral_code', 'status'];
    return !internalFields.includes(key) && value !== null && value !== undefined && value !== '';
  });

  return (
    <div className="lead-card">
      <div className="lead-header">
        <h3 className="lead-name">{full_name || 'Anonymous Lead'}</h3>
        <p className="lead-metaJoined">Joined {formatDate(created_at)}</p>
      </div>

      <div className="lead-details">
        <div className="detail-item">
          <span className="detail-label">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign: 'middle', marginRight: '4px'}}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            Phone
          </span>
          <span className="detail-value">{phone_number || 'Not provided'}</span>
        </div>

        {instagram_handle && (
          <div className="detail-item">
            <span className="detail-label">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign: 'middle', marginRight: '4px'}}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              Instagram
            </span>
            <a 
              href={`https://instagram.com/${instagram_handle.replace('@', '')}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="instagram-link"
            >
              @{instagram_handle.replace('@', '')}
            </a>
          </div>
        )}

        {filteredExtraFields.map(([key, value]) => (
          <div key={key} className="detail-item">
            <span className="detail-label">{key.replace('_', ' ')}</span>
            <span className="detail-value">{String(value)}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
        {isApproved ? (
          <div style={{ 
            width: '100%', 
            padding: '0.6rem', 
            background: '#ecfdf5', 
            color: '#059669', 
            borderRadius: 'var(--radius-md)', 
            textAlign: 'center',
            fontWeight: '700',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            border: '1px solid #d1fae5'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Approved
          </div>
        ) : (
          <>
            <button 
              onClick={() => onApprove(lead.id)}
              className="primary-button" 
              style={{ flex: 1, background: '#10b981', fontSize: '0.8rem', padding: '0.5rem' }}
            >
              Approve
            </button>
            <button 
              onClick={() => onReject(lead.id)}
              className="primary-button" 
              style={{ flex: 1, background: '#ef4444', fontSize: '0.8rem', padding: '0.5rem' }}
            >
              Reject
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default LeadCard;
