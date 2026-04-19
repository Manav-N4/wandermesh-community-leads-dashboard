import React from 'react';

interface Lead {
  [key: string]: any;
}

interface StatsSectionProps {
  leads: Lead[];
}

const StatsSection: React.FC<StatsSectionProps> = ({ leads }) => {
  const totalLeads = leads.length;

  // Dynamically find breakdown fields (like gender or profession) if they exist in at least some records
  const possibleBreakdownFields = ['gender', 'profession', 'source'];
  const breakdowns: Record<string, Record<string, number>> = {};

  possibleBreakdownFields.forEach(field => {
    const counts: Record<string, number> = {};
    let hasField = false;

    leads.forEach(lead => {
      const val = lead[field];
      if (val) {
        hasField = true;
        const normalizedVal = String(val).toLowerCase();
        counts[normalizedVal] = (counts[normalizedVal] || 0) + 1;
      }
    });

    if (hasField) {
      breakdowns[field] = counts;
    }
  });

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <p className="stat-label">Total Leads</p>
        <p className="stat-value">{totalLeads}</p>
      </div>

      {Object.entries(breakdowns).map(([field, counts]) => {
        // If it's a breakdown field, show the top category or some summary
        const topCategory = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
        if (!topCategory) return null;

        return (
          <div className="stat-card" key={field}>
            <p className="stat-label">Top {field.replace('_', ' ')}</p>
            <p className="stat-value" style={{ fontSize: '1.25rem' }}>
              {topCategory[0].charAt(0).toUpperCase() + topCategory[0].slice(1)} ({topCategory[1]})
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default StatsSection;
