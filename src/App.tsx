import { useState, useEffect, useMemo } from 'react';
import { supabase } from './lib/supabase';
import PasswordGate from './components/PasswordGate';
import StatsSection from './components/StatsSection';
import FiltersBar from './components/FiltersBar';
import LeadCard from './components/LeadCard';
import LeadsTable from './components/LeadsTable';

interface Lead {
  id: string | number;
  full_name?: string;
  phone_number?: string;
  instagram_handle?: string;
  created_at?: string;
  [key: string]: any;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isAuthenticated) {
      fetchLeads();
      
      // Subscribe to real-time changes
      const channel = supabase
        .channel('join_community-changes')
        .on(
          'postgres_changes',
          { event: '*', table: 'join_community', schema: 'public' },
          () => {
            console.log('Change detected, refreshing...');
            fetchLeads();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [isAuthenticated]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('join_community')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setLeads(data || []);
    } catch (err: any) {
      console.error('Error fetching leads:', err);
      setError(err.message || 'Failed to fetch community leads');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (id: string | number) => {
    // For now, "it stays" - we could update a status field if it exists
    alert(`Lead ${id} approved!`);
  };

  const handleReject = async (id: string | number) => {
    if (!confirm('Are you sure you want to reject and delete this lead?')) return;
    
    try {
      const { error } = await supabase
        .from('join_community')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      // Update local state immediately
      setLeads(prev => prev.filter(l => l.id !== id));
    } catch (err: any) {
      console.error('Error rejecting lead:', err);
      alert('Failed to delete lead. Check if you have a DELETE policy set up in Supabase.');
    }
  };

  // Dynamically determine which fields can be filtered
  const availableFilters = useMemo(() => {
    const filters: Record<string, string[]> = {};
    const filterableFields = ['gender', 'profession', 'source']; // These are candidates
    
    filterableFields.forEach(field => {
      const uniqueValues = Array.from(new Set(
        leads
          .map(l => l[field])
          .filter(v => typeof v === 'string' && v.trim() !== '')
      )) as string[];
      
      if (uniqueValues.length > 0) {
        filters[field] = uniqueValues;
      }
    });
    
    return filters;
  }, [leads]);

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      // Search matching
      const searchTerm = search.toLowerCase();
      const matchesSearch = !search || 
        (lead.full_name?.toLowerCase().includes(searchTerm)) ||
        (lead.phone_number?.toLowerCase().includes(searchTerm));

      // Filter matching
      const matchesFilters = Object.entries(activeFilters).every(([field, value]) => {
        if (!value) return true;
        return String(lead[field]).toLowerCase() === value.toLowerCase();
      });

      return matchesSearch && matchesFilters;
    });
  }, [leads, search, activeFilters]);

  const handleSetFilter = (field: string, value: string) => {
    setActiveFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isAuthenticated) {
    return <PasswordGate onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="dashboard-container">
      <header className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Community Leads</h1>
          <p>Users interested in joining the WanderMesh community</p>
        </div>
        <button 
          className="primary-button" 
          style={{ width: 'auto', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          onClick={() => fetchLeads()}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={loading ? 'animate-spin' : ''}><path d="M23 4v6h-6"></path><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
          Refresh
        </button>
      </header>

      {loading ? (
        <div className="loading-state">
          <p>Loading community leads...</p>
        </div>
      ) : error ? (
        <div className="error-message" style={{ textAlign: 'center', padding: '2rem' }}>
          <p>{error}</p>
          <button className="primary-button" style={{ width: 'auto', marginTop: '1rem' }} onClick={fetchLeads}>
            Retry
          </button>
        </div>
      ) : (
        <>
          <StatsSection leads={leads} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <FiltersBar 
              search={search}
              setSearch={setSearch}
              availableFilters={availableFilters}
              activeFilters={activeFilters}
              setActiveFilter={handleSetFilter}
            />
            <div className="view-toggle" style={{ display: 'flex', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.25rem' }}>
              <button 
                onClick={() => setViewMode('cards')}
                style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', cursor: 'pointer', background: viewMode === 'cards' ? '#f1f5f9' : 'transparent', fontWeight: 600, color: '#475569', fontSize: '0.8rem' }}
              >
                Cards
              </button>
              <button 
                onClick={() => setViewMode('table')}
                style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', cursor: 'pointer', background: viewMode === 'table' ? '#f1f5f9' : 'transparent', fontWeight: 600, color: '#475569', fontSize: '0.8rem' }}
              >
                Table
              </button>
            </div>
          </div>

          {filteredLeads.length === 0 ? (
            <div className="empty-state">
              <p style={{ fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>
                {leads.length === 0 ? "No community leads found in 'join_community' table" : "No leads match your search/filters"}
              </p>
              <p style={{ fontSize: '0.875rem' }}>
                {leads.length === 0 
                  ? "If you have data in a CSV or another table, make sure the table name matches and RLS policies allow selection." 
                  : `Showing 0 of ${leads.length} total leads`}
              </p>
            </div>
          ) : viewMode === 'cards' ? (
            <div className="leads-grid">
              {filteredLeads.map(lead => (
                <LeadCard 
                  key={lead.id} 
                  lead={lead} 
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))}
            </div>
          ) : (
            <LeadsTable 
              leads={filteredLeads} 
              onApprove={handleApprove}
              onReject={handleReject}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
