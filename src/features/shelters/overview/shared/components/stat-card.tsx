interface StatCardProps {
  label: string;
  value: string;
  valueColor?: string;
}

export const StatCard = ({ label, value, valueColor = '#792a2a' }: StatCardProps) => {
  return (
    <div className="bg-white border border-black/10 rounded-[10px] shadow-sm flex-1 min-w-[240px]">
      <div className="flex flex-col items-start p-8">
        <p className="text-[#717182] text-sm font-normal">{label}</p>
        <p
          className="text-[36px] font-bold mt-3 leading-tight"
          style={{ color: valueColor }}
        >
          {value}
        </p>
      </div>
    </div>
  );
};
