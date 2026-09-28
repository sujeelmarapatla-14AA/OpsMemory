import React from 'react';
import { Inbox } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'No incidents yet.',
  description = 'Your first production incident will appear here.',
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-[#272A2F] rounded-2xl bg-[#17191C]/50">
      <div className="w-12 h-12 rounded-2xl bg-[#1B1D21] flex items-center justify-center text-[#8E95A0] mb-3 border border-[#272A2F]">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-semibold text-[#EDEDED]">{title}</h3>
      <p className="text-xs text-[#8E95A0] max-w-sm mt-1 mb-4">{description}</p>
      {actionLabel && onAction && (
        <Button size="sm" variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
