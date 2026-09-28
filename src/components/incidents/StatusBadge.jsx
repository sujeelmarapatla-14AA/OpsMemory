import React from 'react';
import Badge from '../ui/Badge';

export default function StatusBadge({ status, size = 'sm', className = '' }) {
  const norm = (status || 'open').toLowerCase();

  const variantMap = {
    investigating: 'investigating',
    resolved: 'resolved',
    open: 'open',
  };

  return (
    <Badge
      variant={variantMap[norm] || 'default'}
      size={size}
      dot={norm === 'investigating'}
      className={`font-mono text-xs uppercase tracking-wider ${className}`}
    >
      {status}
    </Badge>
  );
}
