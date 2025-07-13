import React from 'react';
import { Bell, User, Trophy, Star } from 'lucide-react';

interface HeaderProps {
  user: {
    name: string;
    avatar: string;
    points: number;
    notifications: number;
  };
}

export default function Header({ user }: HeaderProps) {
  return (
    <header className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Friend Chain
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-50 to-orange-50 px-3 py-1 rounded-full border border-yellow-200">
              <Trophy className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-semibold text-yellow-800">{user.points.toLocaleString()} điểm</span>
            </div>
            
            <div className="relative">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Bell className="w-6 h-6" />
                {user.notifications > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">{user.notifications}</span>
                  </div>
                )}
              </button>
            </div>
            
            <div className="flex items-center space-x-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full border-2 border-gray-200"
              />
              <span className="text-sm font-medium text-gray-900 hidden sm:block">{user.name}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}