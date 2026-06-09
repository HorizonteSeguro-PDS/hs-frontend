import { connectionLabel, isOnline } from '@/shared/services/syncQueue';

export function ConnectionBadge() {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
      isOnline.value
        ? 'bg-[#ecfdf5] text-[#009966]'
        : 'bg-[#fef2f2] text-[#e7000b]'
    }`}>
      <span className={`h-1.5 w-1.5 rounded-full ${isOnline.value ? 'bg-[#009966]' : 'bg-[#e7000b]'}`} />
      {connectionLabel.value}
    </span>
  );
}
