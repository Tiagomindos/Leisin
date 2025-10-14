import { Home, TrendingUp, LineChart, Newspaper, Users } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'markets', label: 'Mercados', icon: TrendingUp },
    { id: 'trade', label: 'Trade', icon: LineChart },
    { id: 'news', label: 'Descubra', icon: Newspaper },
    { id: 'social', label: 'Social', icon: Users },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#181A20] border-t border-gray-800 z-50">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  isActive ? 'text-[#FCD535]' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
