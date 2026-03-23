import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import styles from './SustainabilityScoreChart.module.css';

const SustainabilityScoreChart = ({ data = [], caption }) => {
  // Compute color based on index to create a green ramp, darkest for newest
  const getColor = (index, total) => {
    if (total <= 1) return '#1c5f20';
    const opacity = 0.2 + (0.8 * (index / (total - 1)));
    return `rgba(28, 95, 32, ${opacity})`;
  };

  return (
    <div className={styles.chartWrapper}>
      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <XAxis dataKey="month" hide />
            <Tooltip
              cursor={{ fill: 'transparent' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="score" radius={[2, 2, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(index, data.length)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {caption && (
        <div className={styles.captionContainer}>
          <p className={styles.caption}>{caption}</p>
        </div>
      )}
    </div>
  );
};

export default SustainabilityScoreChart;
