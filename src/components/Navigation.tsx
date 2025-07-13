import React from 'react';
import { Home, Share2, MessageSquare, ShoppingCart, Trophy, Users } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: 'dashboard', label: 'Tổng quan', icon: Home },
    { id: 'share', label: 'Chia sẻ', icon: Share2 },
    { id: 'review', label: 'Review', icon: MessageSquare },
    { id: 'group-buy', label: 'Mua chung', icon: ShoppingCart },
    { id: 'rewards', label: 'Phần thưởng', icon: Trophy },
    { id: 'friends', label: 'Bạn bè', icon: Users }
  ];

  return (
    <nav className="bg-white shadow-lg border-t border-gray-200 lg:border-t-0 lg:border-r lg:shadow-none">
      <div className="lg:w-64 lg:fixed lg:h-screen lg:pt-20">
        <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible p-2 lg:p-4 space-x-2 lg:space-x-0 lg:space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all whitespace-nowrap lg:w-full ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="hidden sm:block">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}