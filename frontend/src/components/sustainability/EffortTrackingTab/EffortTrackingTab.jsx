import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Download } from 'lucide-react';
import StatCard from '../../common/StatCard/StatCard';
import Badge from '../../common/Badge/Badge';
import styles from './EffortTrackingTab.module.css';

const EffortTrackingTab = ({ stories = [], projectId }) => {
  // Calculate project metrics
  const stats = useMemo(() => {
    let totalBase = 0;
    let totalSustainable = 0;

    stories.forEach(s => {
      const base = s.storyPoints || 0;
      const sust = s.sustainableStoryPoints || s.storyPoints || 0;
      totalBase += base;
      totalSustainable += sust;
    });

    const overhead = totalSustainable - totalBase;
    const share = totalSustainable > 0 ? Math.round((overhead / totalSustainable) * 100) : 0;

    return {
      totalBase,
      totalSustainable,
      overhead,
      share,
      storyCount: stories.length
    };
  }, [stories]);

  // Stacked Bar Chart Data
  const barChartData = useMemo(() => {
    return stories.map((s, index) => {
      const base = s.storyPoints || 0;
      const sust = s.sustainableStoryPoints || s.storyPoints || 0;
      const overhead = Math.max(0, sust - base);
      return {
        name: s.title.length > 25 ? `${s.title.substring(0, 22)}...` : s.title,
        shortName: `Story ${index + 1}`,
        'Base Points': base,
        'Sustainability Overhead': overhead,
      };
    });
  }, [stories]);

  // Donut Pie Chart Data
  const pieChartData = useMemo(() => {
    const baseShare = 100 - stats.share;
    return [
      { name: 'Base Effort', value: baseShare || 100 },
      { name: 'Sustainability', value: stats.share }
    ];
  }, [stats]);

  const COLORS = ['#c2d6c2', '#2d6a2d']; // Light Green for Base, Dark Green for Sustainability

  const exportToCSV = () => {
    if (stories.length === 0) return;
    
    const headers = ['Story', 'Base Points', 'Sustainable Points', 'Overhead (pts)'];
    const rows = stories.map((s) => {
      const base = s.storyPoints || 0;
      const sust = s.sustainableStoryPoints || s.storyPoints || 0;
      const overhead = Math.max(0, sust - base);
      
      return [
        s.title,
        base,
        sust,
        `+${overhead}`
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `project_effort_tracking_${projectId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.tabContainer}>
      {/* 1. Stat Cards Row */}
      <div className={styles.statsGrid}>
        <StatCard 
          title="TOTAL BASE STORY POINTS" 
          value={stats.totalBase} 
          subtitle="+0 this sprint" 
        />
        <StatCard 
          title="TOTAL SUSTAINABLE STORY POINTS" 
          value={stats.totalSustainable} 
          subtitle={`+${stats.overhead} overhead`} 
        />
        <StatCard 
          title="SUSTAINABILITY OVERHEAD" 
          value={`${stats.overhead} pts`} 
          subtitle={`across ${stats.storyCount} stories`} 
        />
        <div className={styles.progressStatCard}>
          <h3 className={styles.progressStatTitle}>SUSTAINABILITY EFFORT SHARE</h3>
          <div className={styles.progressStatContent}>
            <span className={styles.progressStatValue}>{stats.share}%</span>
            <span className={styles.progressStatSubtitle}>of total sprint effort</span>
          </div>
          <div className={styles.progressBarWrapper}>
            <div 
              className={styles.progressBar} 
              style={{ width: `${stats.share}%` }} 
            />
          </div>
        </div>
      </div>

      {/* 2. Charts Row */}
      <div className={styles.chartsRow}>
        {/* Stacked Bar Chart */}
        <div className={styles.chartPanel}>
          <div className={styles.chartHeader}>
            <h3 className={styles.sectionTitle}>Story Points Breakdown</h3>
            <div className={styles.legendContainer}>
              <span className={styles.legendItem}>
                <span className={styles.legendColor} style={{ backgroundColor: '#c2d6c2' }} />
                Base Points
              </span>
              <span className={styles.legendItem}>
                <span className={styles.legendColor} style={{ backgroundColor: '#2d6a2d' }} />
                Sustainability Overhead
              </span>
            </div>
          </div>
          <div className={styles.barChartContainer}>
            {stories.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <XAxis dataKey="shortName" tick={{ fill: '#64748b', fontSize: 12 }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: 'none', 
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                      backgroundColor: '#ffffff'
                    }}
                  />
                  <Bar dataKey="Base Points" stackId="a" fill="#c2d6c2" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Sustainability Overhead" stackId="a" fill="#2d6a2d" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className={styles.emptyState}>No user stories found.</div>
            )}
          </div>
        </div>

        {/* Donut Chart */}
        <div className={styles.donutPanel}>
          <h3 className={styles.sectionTitle}>Overhead Distribution</h3>
          <div className={styles.donutChartContainer}>
            {stories.length > 0 ? (
              <div className={styles.donutWrapper}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={0}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className={styles.donutCenterLabel}>
                  <span className={styles.donutPercentage}>{stats.share}%</span>
                  <span className={styles.donutText}>OVERHEAD</span>
                </div>
              </div>
            ) : (
              <div className={styles.emptyState}>No data.</div>
            )}
            {stories.length > 0 && (
              <div className={styles.donutLegends}>
                <div className={styles.donutLegendItem}>
                  <span className={styles.donutLegendColor} style={{ backgroundColor: '#c2d6c2' }} />
                  <span className={styles.donutLegendLabel}>{100 - stats.share}%</span>
                  <span className={styles.donutLegendName}>Base Effort</span>
                </div>
                <div className={styles.donutLegendItem}>
                  <span className={styles.donutLegendColor} style={{ backgroundColor: '#2d6a2d' }} />
                  <span className={styles.donutLegendLabel}>{stats.share}%</span>
                  <span className={styles.donutLegendName}>Sustainability</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Story Level Effort Detail */}
      <div className={styles.tablePanel}>
        <div className={styles.tableHeaderRow}>
          <h3 className={styles.sectionTitle}>Story-Level Effort Detail</h3>
          <button 
            className={styles.exportButton} 
            onClick={exportToCSV}
            disabled={stories.length === 0}
          >
            <Download size={14} /> Export CSV
          </button>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.detailTable}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>STORY</th>
                <th style={{ textAlign: 'right' }}>BASE POINTS</th>
                <th style={{ textAlign: 'right' }}>SUSTAINABLE POINTS</th>
                <th style={{ textAlign: 'right' }}>OVERHEAD</th>
              </tr>
            </thead>
            <tbody>
              {stories.length > 0 ? (
                stories.map((story) => {
                  const base = story.storyPoints || 0;
                  const sust = story.sustainableStoryPoints || story.storyPoints || 0;
                  const overhead = Math.max(0, sust - base);
                  
                  return (
                    <tr key={story._id || story.id}>
                      <td className={styles.storyTitle}>{story.title}</td>
                      <td style={{ textAlign: 'right', fontWeight: '500' }}>{base}</td>
                      <td style={{ textAlign: 'right', fontWeight: '700' }}>{sust}</td>
                      <td style={{ textAlign: 'right' }}>
                        <span className={styles.overheadBadge}>
                          +{overhead} pts
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '30px' }}>
                    No stories found for this project.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EffortTrackingTab;
