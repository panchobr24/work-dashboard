import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Client, Sale, WeeklySale } from '../types';

export function useSupabaseClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    try {
      setLoading(true);
      
      // Tentar carregar do Supabase primeiro
      try {
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Converter as datas de string para Date objects
        const clientsWithDates = data?.map(client => ({
          ...client,
          createdAt: new Date(client.created_at),
          weeklySales: client.weekly_sales?.map((sale: any) => ({
            ...sale,
            weekStart: new Date(sale.week_start),
            weekEnd: new Date(sale.week_end),
            createdAt: new Date(sale.created_at)
          })) || []
        })) || [];

        setClients(clientsWithDates);
        return;
      } catch (supabaseError) {
        console.warn('Supabase não disponível, usando localStorage:', supabaseError);
        
        // Fallback para localStorage
        const localClients = localStorage.getItem('clients');
        if (localClients) {
          const parsedClients = JSON.parse(localClients).map((client: any) => ({
            ...client,
            createdAt: new Date(client.createdAt),
            weeklySales: client.weeklySales?.map((sale: any) => ({
              ...sale,
              weekStart: new Date(sale.weekStart),
              weekEnd: new Date(sale.weekEnd),
              createdAt: new Date(sale.createdAt)
            })) || []
          }));
          setClients(parsedClients);
        } else {
          setClients([]);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  const addClient = async (client: Omit<Client, 'id' | 'createdAt'>) => {
    try {
      // Tentar salvar no Supabase primeiro
      try {
        const { data, error } = await supabase
          .from('clients')
          .insert([{
            name: client.name,
            phone: client.phone,
            business_type: client.businessType,
            city: client.city,
            location: client.location,
            importance_level: client.importanceLevel,
            weekly_sales: client.weeklySales.map(sale => ({
              id: sale.id,
              week_start: sale.weekStart.toISOString(),
              week_end: sale.weekEnd.toISOString(),
              sold: sale.sold,
              notes: sale.notes,
              created_at: sale.createdAt.toISOString()
            }))
          }])
          .select()
          .single();

        if (error) throw error;

        const newClient: Client = {
          ...data,
          id: data.id,
          businessType: data.business_type,
          importanceLevel: data.importance_level,
          createdAt: new Date(data.created_at),
          weeklySales: data.weekly_sales?.map((sale: any) => ({
            ...sale,
            weekStart: new Date(sale.week_start),
            weekEnd: new Date(sale.week_end),
            createdAt: new Date(sale.created_at)
          })) || []
        };

        setClients(prev => [newClient, ...prev]);
        return newClient;
      } catch (supabaseError) {
        console.warn('Supabase não disponível, salvando no localStorage:', supabaseError);
        
        // Fallback para localStorage
        const newClient: Client = {
          ...client,
          id: Date.now().toString(),
          createdAt: new Date()
        };
        
        const updatedClients = [newClient, ...clients];
        setClients(updatedClients);
        localStorage.setItem('clients', JSON.stringify(updatedClients));
        return newClient;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar cliente');
      throw err;
    }
  };

  const updateClient = async (id: string, updates: Partial<Client>) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update({
          name: updates.name,
          phone: updates.phone,
          business_type: updates.businessType,
          city: updates.city,
          location: updates.location,
          importance_level: updates.importanceLevel,
          weekly_sales: updates.weeklySales?.map(sale => ({
            id: sale.id,
            week_start: sale.weekStart.toISOString(),
            week_end: sale.weekEnd.toISOString(),
            sold: sale.sold,
            notes: sale.notes,
            created_at: sale.createdAt.toISOString()
          }))
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedClient: Client = {
        ...data,
        id: data.id,
        businessType: data.business_type,
        importanceLevel: data.importance_level,
        createdAt: new Date(data.created_at),
        weeklySales: data.weekly_sales?.map((sale: any) => ({
          ...sale,
          weekStart: new Date(sale.week_start),
          weekEnd: new Date(sale.week_end),
          createdAt: new Date(sale.created_at)
        })) || []
      };

      setClients(prev => prev.map(client => 
        client.id === id ? updatedClient : client
      ));
      return updatedClient;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar cliente');
      throw err;
    }
  };

  const deleteClient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setClients(prev => prev.filter(client => client.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir cliente');
      throw err;
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return {
    clients,
    loading,
    error,
    addClient,
    updateClient,
    deleteClient,
    refetch: fetchClients
  };
}

export function useSupabaseSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSales = async () => {
    try {
      setLoading(true);
      
      // Tentar carregar do Supabase primeiro
      try {
        const { data, error } = await supabase
          .from('sales')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Converter as datas de string para Date objects
        const salesWithDates = data?.map(sale => ({
          ...sale,
          date: new Date(sale.date),
          createdAt: new Date(sale.created_at)
        })) || [];

        setSales(salesWithDates);
        return;
      } catch (supabaseError) {
        console.warn('Supabase não disponível, usando localStorage:', supabaseError);
        
        // Fallback para localStorage
        const localSales = localStorage.getItem('sales');
        if (localSales) {
          const parsedSales = JSON.parse(localSales).map((sale: any) => ({
            ...sale,
            date: new Date(sale.date),
            createdAt: new Date(sale.createdAt)
          }));
          setSales(parsedSales);
        } else {
          setSales([]);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar vendas');
    } finally {
      setLoading(false);
    }
  };

  const addSale = async (sale: Omit<Sale, 'id' | 'createdAt'>) => {
    try {
      const { data, error } = await supabase
        .from('sales')
        .insert([{
          value: sale.value,
          client_name: sale.clientName,
          city: sale.city,
          date: sale.date.toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      const newSale: Sale = {
        ...data,
        id: data.id,
        clientName: data.client_name,
        date: new Date(data.date),
        createdAt: new Date(data.created_at)
      };

      setSales(prev => [newSale, ...prev]);
      return newSale;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar venda');
      throw err;
    }
  };

  const updateSale = async (id: string, updates: Partial<Sale>) => {
    try {
      const { data, error } = await supabase
        .from('sales')
        .update({
          value: updates.value,
          client_name: updates.clientName,
          city: updates.city,
          date: updates.date?.toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      const updatedSale: Sale = {
        ...data,
        id: data.id,
        clientName: data.client_name,
        date: new Date(data.date),
        createdAt: new Date(data.created_at)
      };

      setSales(prev => prev.map(sale => 
        sale.id === id ? updatedSale : sale
      ));
      return updatedSale;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar venda');
      throw err;
    }
  };

  const deleteSale = async (id: string) => {
    try {
      const { error } = await supabase
        .from('sales')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSales(prev => prev.filter(sale => sale.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir venda');
      throw err;
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return {
    sales,
    loading,
    error,
    addSale,
    updateSale,
    deleteSale,
    refetch: fetchSales
  };
}
