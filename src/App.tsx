import React, { useState } from 'react';
import { Client, Sale, ImportanceLevel, WeeklySale } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { TabNavigation } from './components/TabNavigation';
import { ClientList } from './components/ClientList';
import { ClientForm } from './components/ClientForm';
import { SaleList } from './components/SaleList';
import { SaleForm } from './components/SaleForm';

import { Plus, Users, DollarSign } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<'clients' | 'sales'>('clients');
  const [clients, setClients] = useLocalStorage<Client[]>('clients', []);
  const [sales, setSales] = useLocalStorage<Sale[]>('sales', []);
  const [showClientForm, setShowClientForm] = useState(false);
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | undefined>();
  const [editingSale, setEditingSale] = useState<Sale | undefined>();


  const handleSaveClient = (clientData: Omit<Client, 'id' | 'createdAt'>) => {
    if (editingClient) {
      setClients(clients.map(client => 
        client.id === editingClient.id 
          ? { ...client, ...clientData }
          : client
      ));
    } else {
      const newClient: Client = {
        ...clientData,
        id: Date.now().toString(),
        createdAt: new Date(),
        weeklySales: []
      };
      setClients([...clients, newClient]);
    }
    setShowClientForm(false);
    setEditingClient(undefined);
  };

  const handleSaveSale = (saleData: Omit<Sale, 'id' | 'createdAt'>) => {
    if (editingSale) {
      setSales(sales.map(sale => 
        sale.id === editingSale.id 
          ? { ...sale, ...saleData }
          : sale
      ));
    } else {
      const newSale: Sale = {
        ...saleData,
        id: Date.now().toString(),
        createdAt: new Date()
      };
      setSales([...sales, newSale]);
    }
    setShowSaleForm(false);
    setEditingSale(undefined);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setShowClientForm(true);
  };

  const handleEditSale = (sale: Sale) => {
    setEditingSale(sale);
    setShowSaleForm(true);
  };

  const handleDeleteClient = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      setClients(clients.filter(client => client.id !== id));
    }
  };

  const handleUpdateImportance = (clientId: string, importance: ImportanceLevel) => {
    setClients(clients.map(client => 
      client.id === clientId 
        ? { ...client, importanceLevel: importance }
        : client
    ));
  };

  const handleToggleWeeklySale = (clientId: string) => {
    setClients(clients.map(client => {
      if (client.id === clientId) {
        const currentWeek = new Date();
        const weekStart = new Date(currentWeek);
        weekStart.setDate(currentWeek.getDate() - currentWeek.getDay() + 1); // Segunda-feira
        
        const existingSale = client.weeklySales?.find(sale => 
          sale.weekStart.getTime() === weekStart.getTime()
        );

        let updatedSales = client.weeklySales || [];
        
        if (existingSale) {
          // Atualizar venda existente
          updatedSales = updatedSales.map(sale =>
            sale.id === existingSale.id
              ? { ...sale, sold: !sale.sold }
              : sale
          );
        } else {
          // Criar nova venda
          const newSale: WeeklySale = {
            id: Date.now().toString(),
            weekStart: weekStart,
            weekEnd: new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000), // Domingo
            sold: true,
            createdAt: new Date()
          };
          updatedSales = [...updatedSales, newSale];
        }

        return { ...client, weeklySales: updatedSales };
      }
      return client;
    }));
  };

  const handleDeleteSale = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta venda?')) {
      setSales(sales.filter(sale => sale.id !== id));
    }
  };

  const handleCancelForm = () => {
    setShowClientForm(false);
    setShowSaleForm(false);
    setEditingClient(undefined);
    setEditingSale(undefined);
  };

  const totalClients = clients.length;
  const totalSales = sales.length;
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.value, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Dashboard de Vendas
          </h1>
          <p className="text-gray-600">
            Gerencie seus clientes e vendas de forma eficiente
          </p>
        </div>

        {/* Estatísticas Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Clientes</p>
                <p className="text-3xl font-bold text-blue-600">{totalClients}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Users size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Vendas</p>
                <p className="text-3xl font-bold text-green-600">{totalSales}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <DollarSign size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Comissão Estimada</p>
                <p className="text-3xl font-bold text-green-600">
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(totalRevenue * 0.06)}
                </p>
                <p className="text-xs text-gray-500 mt-1">6% sobre o faturamento</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <DollarSign size={24} className="text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Navegação por Abas */}
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Conteúdo das Abas */}
        <div className="mb-6">
          {activeTab === 'clients' ? (
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Clientes</h2>
              <button
                onClick={() => setShowClientForm(true)}
                className="btn-primary btn-ripple flex items-center gap-2 px-6 py-3 rounded-xl font-medium"
              >
                <Plus size={20} />
                Novo Cliente
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Vendas</h2>
              <button
                onClick={() => setShowSaleForm(true)}
                className="btn-success btn-ripple flex items-center gap-2 px-6 py-3 rounded-xl font-medium"
              >
                <Plus size={20} />
                Nova Venda
              </button>
            </div>
          )}
        </div>

        {/* Listas */}
        {activeTab === 'clients' ? (
          <ClientList
            clients={clients}
            onEdit={handleEditClient}
            onDelete={handleDeleteClient}
            onUpdateImportance={handleUpdateImportance}
            onToggleWeeklySale={handleToggleWeeklySale}
          />
        ) : (
          <SaleList
            sales={sales}
            onEdit={handleEditSale}
            onDelete={handleDeleteSale}
          />
        )}

        {/* Formulários Modais */}
        {showClientForm && (
          <ClientForm
            client={editingClient}
            onSave={handleSaveClient}
            onCancel={handleCancelForm}
          />
        )}

        {showSaleForm && (
          <SaleForm
            sale={editingSale}
            clients={clients}
            onSave={handleSaveSale}
            onCancel={handleCancelForm}
          />
        )}


      </div>
    </div>
  );
}

export default App;
