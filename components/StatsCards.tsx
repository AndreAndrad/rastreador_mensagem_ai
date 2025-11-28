import React from 'react';
import { Client } from '../types';
import { Users, Clock, CalendarCheck, CheckCircle2 } from 'lucide-react';

interface StatsCardsProps {
  clients: Client[];
}

export const StatsCards: React.FC<StatsCardsProps> = ({ clients }) => {
  const total = clients.length;
  const pending = clients.filter(c => c.status === 'Fazer').length;
  const scheduled = clients.filter(c => c.status === 'Agendado').length;
  const done = clients.filter(c => c.status === 'Retirado').length;

  const cards = [
    { label: 'Total Clientes', value: total, icon: Users, color: 'bg-indigo-50 text-indigo-700' },
    { label: 'Pendentes (Fazer)', value: pending, icon: Clock, color: 'bg-red-50 text-red-700' },
    { label: 'Agendados', value: scheduled, icon: CalendarCheck, color: 'bg-yellow-50 text-yellow-700' },
    { label: 'Retirados', value: done, icon: CheckCircle2, color: 'bg-green-50 text-green-700' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <div key={card.label} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{card.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
          </div>
          <div className={`p-3 rounded-full ${card.color}`}>
            <card.icon className="w-5 h-5" />
          </div>
        </div>
      ))}
    </div>
  );
};