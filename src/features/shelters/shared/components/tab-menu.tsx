interface Tab {
  id: string;
  label: string;
}

interface TabMenuProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export const TabMenu = ({ tabs, activeTab, onTabChange }: TabMenuProps) => {
  return (
    <div className="flex bg-white border border-black/10 rounded-2xl shadow-sm overflow-hidden">
      {tabs.map((tab, index) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors
              ${index > 0 ? 'border-l border-black/10' : ''}
              ${isActive ? 'text-[#0a0a0a]' : 'text-[#717182]'}`}
          >
            {tab.label}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2f7dbb]" />
            )}
          </button>
        );
      })}
    </div>
  );
};
