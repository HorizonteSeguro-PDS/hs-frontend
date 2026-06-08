interface StatCardProps {
  label: string;
  value: string;
  valueColor?: string;
}

export const StatCard = ({ label, value, valueColor = '#792a2a' }: StatCardProps) => {
  return (
    <div className="bg-white border border-black/10 rounded-[10px] shadow-sm flex-1 min-w-[180px]">
      <div className="flex flex-col items-start p-4">
        <p className="text-[#717182] text-xs font-normal">{label}</p>
        <p
          className="text-2xl font-bold mt-2 leading-tight"
          style={{ color: valueColor }}
        >
          {value}
        </p>
      </div>
    </div>
  );
};
