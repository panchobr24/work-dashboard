import React from 'react';
import { Users, DollarSign } from 'lucide-react';

interface TabNavigationProps {
  activeTab: 'clients' | 'sales';
  onTabChange: (tab: 'clients' | 'sales') => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="bg-white rounded-2xl p-2 shadow-sm mb-6">
      <div className="flex">
        <button
          onClick={() => onTabChange('clients')}
          className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-medium transition-all ${
            activeTab === 'clients'
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
          }`}
        >
          <Users size={20} />
          Clientes
        </button>
        <button
          onClick={() => onTabChange('sales')}
          className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-medium transition-all ${
            activeTab === 'sales'
              ? 'bg-green-600 text-white shadow-lg'
              : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
          }`}
        >
          <DollarSign size={20} />
          Vendas
        </button>
      </div>
    </div>
  );
};
