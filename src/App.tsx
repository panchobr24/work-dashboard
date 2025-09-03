import React, { useState } from 'react';
import { Client, Sale, ImportanceLevel, WeeklySale } from './types';
import { useSupabaseClients, useSupabaseSales } from './hooks/useSupabase';
import { TabNavigation } from './components/TabNavigation';
import { ClientList } from './components/ClientList';
import { ClientForm } from './components/ClientForm';
import { SaleList } from './components/SaleList';
import { SaleForm } from './components/SaleForm';

import { Plus, Users, DollarSign } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState<'clients' | 'sales'>('clients');
  const [showClientForm, setShowClientForm] = useState(false);
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | undefined>();
  const [editingSale, setEditingSale] = useState<Sale | undefined>();

  // Supabase hooks
  const { 
    clients, 
    loading: clientsLoading, 
    error: clientsError, 
    addClient, 
    updateClient, 
    deleteClient 
  } = useSupabaseClients();

  const { 
    sales, 
    loading: salesLoading, 
    error: salesError, 
    addSale, 
    updateSale, 
    deleteSale 
  } = useSupabaseSales();


  const handleSaveClient = async (clientData: Omit<Client, 'id' | 'createdAt'>) => {
    try {
      if (editingClient) {
        await updateClient(editingClient.id, clientData);
      } else {
        await addClient(clientData);
      }
      setShowClientForm(false);
      setEditingClient(undefined);
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
    }
  };

  const handleSaveSale = async (saleData: Omit<Sale, 'id' | 'createdAt'>) => {
    try {
      if (editingSale) {
        await updateSale(editingSale.id, saleData);
      } else {
        await addSale(saleData);
      }
      setShowSaleForm(false);
      setEditingSale(undefined);
    } catch (error) {
      console.error('Erro ao salvar venda:', error);
    }
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setShowClientForm(true);
  };

  const handleEditSale = (sale: Sale) => {
    setEditingSale(sale);
    setShowSaleForm(true);
  };

  const handleDeleteClient = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await deleteClient(id);
      } catch (error) {
        console.error('Erro ao excluir cliente:', error);
      }
    }
  };

  const handleUpdateImportance = async (clientId: string, importance: ImportanceLevel) => {
    try {
      const client = clients.find(c => c.id === clientId);
      if (client) {
        await updateClient(clientId, { ...client, importanceLevel: importance });
      }
    } catch (error) {
      console.error('Erro ao atualizar importância:', error);
    }
  };

  const handleToggleWeeklySale = async (clientId: string) => {
    try {
      const client = clients.find(c => c.id === clientId);
      if (!client) return;

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

      await updateClient(clientId, { ...client, weeklySales: updatedSales });
    } catch (error) {
      console.error('Erro ao atualizar venda semanal:', error);
    }
  };

  const handleDeleteSale = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta venda?')) {
      try {
        await deleteSale(id);
      } catch (error) {
        console.error('Erro ao excluir venda:', error);
      }
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

  // Mostrar loading se qualquer operação estiver carregando
  if (clientsLoading || salesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dados...</p>
        </div>
      </div>
    );
  }

  // Mostrar erro se houver problemas
  if (clientsError || salesError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <p className="text-lg font-semibold">Erro ao carregar dados</p>
            <p className="text-sm">{clientsError || salesError}</p>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

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
