import React, { useState } from 'react';
import { Client, BusinessType, ImportanceLevel } from '../types';
import { Phone, MapPin, Edit, Trash2, Search, User, ChevronDown, MessageCircle, CheckCircle } from 'lucide-react';
import { format, parseISO, isValid, startOfWeek, isSameWeek } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ClientListProps {
  clients: Client[];
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
  onUpdateImportance: (clientId: string, importance: ImportanceLevel) => void;
  onToggleWeeklySale: (clientId: string) => void;
}

const businessTypeLabels: Record<BusinessType, string> = {
  agropecuaria: 'Agropecuária',
  petshop: 'Pet Shop',
  mercado: 'Mercado',
  fazenda: 'Fazenda'
};

const importanceLabels: Record<ImportanceLevel, string> = {
  high: 'Alta',
  medium: 'Média',
  low: 'Baixa'
};

const importanceColors: Record<ImportanceLevel, string> = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-green-100 text-green-800'
};

export const ClientList: React.FC<ClientListProps> = ({ clients, onEdit, onDelete, onUpdateImportance, onToggleWeeklySale }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBusiness, setFilterBusiness] = useState<BusinessType | 'all'>('all');
  const [filterImportance, setFilterImportance] = useState<ImportanceLevel | 'all'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'importance' | 'createdAt'>('importance');

  const filteredClients = clients
    .filter(client => {
      const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           client.city.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBusiness = filterBusiness === 'all' || client.businessType === filterBusiness;
      const matchesImportance = filterImportance === 'all' || client.importanceLevel === filterImportance;
      
      return matchesSearch && matchesBusiness && matchesImportance;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'importance':
          const importanceOrder = { high: 3, medium: 2, low: 1 };
          return importanceOrder[b.importanceLevel] - importanceOrder[a.importanceLevel];
        case 'createdAt':
          return b.createdAt.getTime() - a.createdAt.getTime();
        default:
          return 0;
      }
    });

  const handleWhatsAppClick = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/55${cleanPhone}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleMapsClick = (location: string, city: string) => {
    const query = location || city;
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    window.open(mapsUrl, '_blank');
  };

  const handleImportanceChange = (clientId: string, newImportance: ImportanceLevel) => {
    onUpdateImportance(clientId, newImportance);
  };

  const formatDate = (date: Date | string) => {
    try {
      let dateObj: Date;
      if (typeof date === 'string') {
        dateObj = parseISO(date);
      } else {
        dateObj = date;
      }
      
      if (!isValid(dateObj)) {
        return 'Data inválida';
      }
      
      return format(dateObj, 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      return 'Data inválida';
    }
  };

  const getCurrentWeekSale = (client: Client) => {
    const currentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });
    // Garantir que weeklySales existe
    const weeklySales = client.weeklySales || [];
    return weeklySales.find(sale => 
      isSameWeek(sale.weekStart, currentWeek, { weekStartsOn: 1 })
    );
  };

  return (
    <div className="space-y-6">
      {/* Filtros e Busca */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome ou cidade..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <select
              value={filterBusiness}
              onChange={(e) => setFilterBusiness(e.target.value as BusinessType | 'all')}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos os Ramos</option>
              {Object.entries(businessTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>

            <select
              value={filterImportance}
              onChange={(e) => setFilterImportance(e.target.value as ImportanceLevel | 'all')}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas as Importâncias</option>
              {Object.entries(importanceLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'importance' | 'createdAt')}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="importance">Ordenar por Importância</option>
              <option value="name">Ordenar por Nome</option>
              <option value="createdAt">Ordenar por Data</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Clientes */}
      <div className="grid gap-4">
        {filteredClients.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <div className="text-gray-400 mb-4">
              <User size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">Nenhum cliente encontrado</h3>
            <p className="text-gray-500">Tente ajustar os filtros ou adicione um novo cliente.</p>
          </div>
        ) : (
          filteredClients.map((client) => (
            <div key={client.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-14 h-14 bg-blue-500 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      {client.name.charAt(0).toUpperCase()}
                    </div>
                    {/* Checkbox de venda semanal */}
                    <button
                      onClick={() => onToggleWeeklySale(client.id)}
                      className={`weekly-sale-checkbox ${getCurrentWeekSale(client)?.sold ? 'sold' : ''}`}
                      title={getCurrentWeekSale(client)?.sold ? 'Vendeu esta semana' : 'Marcar venda semanal'}
                    >
                      {getCurrentWeekSale(client)?.sold ? (
                        <CheckCircle size={16} className="text-white" />
                      ) : (
                        <div className="w-3 h-3 rounded-full bg-white"></div>
                      )}
                    </button>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">{client.name}</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="relative group">
                        <select
                          value={client.importanceLevel}
                          onChange={(e) => handleImportanceChange(client.id, e.target.value as ImportanceLevel)}
                          className={`px-3 py-1 rounded-full text-xs font-medium cursor-pointer border-0 outline-none appearance-none ${importanceColors[client.importanceLevel]} hover:opacity-80 transition-all duration-200 min-w-[80px]`}
                          title="Clique para alterar a importância do cliente"
                          style={{ 
                            display: 'block',
                            visibility: 'visible',
                            opacity: 1,
                            backgroundColor: client.importanceLevel === 'high' ? '#fef2f2' : 
                                           client.importanceLevel === 'medium' ? '#fef3c7' : '#f0fdf4',
                            color: client.importanceLevel === 'high' ? '#991b1b' : 
                                   client.importanceLevel === 'medium' ? '#92400e' : '#166534'
                          }}
                        >
                          {Object.entries(importanceLabels).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                        <ChevronDown size={10} className="absolute right-1 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-600" />
                      </div>
                      <span 
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium whitespace-nowrap"
                        style={{
                          display: 'inline-block',
                          visibility: 'visible',
                          opacity: 1,
                          backgroundColor: '#dbeafe',
                          color: '#1e40af'
                        }}
                      >
                        {businessTypeLabels[client.businessType]}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => onEdit(client)}
                    className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all duration-200"
                    title="Editar cliente"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(client.id)}
                    className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-800 transition-all duration-200"
                    title="Excluir cliente"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {/* Botões de contato - sempre presentes */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleWhatsAppClick(client.phone)}
                    className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium text-base transition-all duration-200 shadow-sm"
                    title="Conversar no WhatsApp"
                  >
                    <MessageCircle size={18} />
                    {client.phone}
                  </button>
                  
                  <button
                    onClick={() => handleMapsClick(client.location || '', client.city)}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium text-base transition-all duration-200 shadow-sm"
                    title="Abrir no Google Maps"
                  >
                    <MapPin size={18} />
                    Ver no Maps
                  </button>
                </div>

                {/* Informações adicionais */}
                <div className="flex items-center justify-between text-sm text-gray-600 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <MapPin size={14} />
                    <span className="font-medium">{client.city}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <span>📅</span>
                    <span>{formatDate(client.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
