export interface Client {
  id: string;
  name: string;
  phone: string;
  businessType: 'agropecuaria' | 'petshop' | 'mercado' | 'fazenda';
  city: string;
  location: string;
  importanceLevel: 'high' | 'medium' | 'low';
  createdAt: Date;
  weeklySales: WeeklySale[];
}

export interface WeeklySale {
  id: string;
  weekStart: Date; // Segunda-feira da semana
  weekEnd: Date;   // Domingo da semana
  sold: boolean;
  notes?: string;
  createdAt: Date;
}

export interface Sale {
  id: string;
  value: number;
  clientName: string;
  city: string;
  date: Date;
  createdAt: Date;
}

export type BusinessType = 'agropecuaria' | 'petshop' | 'mercado' | 'fazenda';
export type ImportanceLevel = 'high' | 'medium' | 'low';
export type SortOption = 'value' | 'date';
export type SortOrder = 'asc' | 'desc';
