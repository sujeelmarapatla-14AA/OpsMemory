import React from 'react';
import Badge from '../ui/Badge';

export default function SeverityBadge({ severity, size = 'sm', className = '' }) {
  const norm = (severity || 'low').toLowerCase();

  const variantMap = {
    critical: 'critical',
    high: 'high',
    medium: 'medium',
    low: 'low',
  };

  return (
    <Badge
      variant={variantMap[norm] || 'default'}
      size={size}
      dot={norm === 'critical' || norm === 'high'}
      className={`font-mono uppercase tracking-wider ${className}`}
    >
      {severity}
    </Badge>
  );
}
