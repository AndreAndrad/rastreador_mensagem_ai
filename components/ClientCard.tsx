import React from 'react';
import { Client, ClientStatus } from '../types';
import { Phone, MapPin, Car, Calendar, Clock, Edit2, Trash2, CheckCircle, MessageCircle } from 'lucide-react';

interface ClientCardProps {
  client: Client;
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
  onWhatsApp: (client: Client) => void;
  onMarkRetrieved: (client: Client) => void;
}

const statusColors: Record<ClientStatus, string> = {
  'Fazer': 'border-l-red-500 bg-white',
  'Agendado': 'border-l-yellow-500 bg-white',
  'Retirado': 'border-l-green-500 bg-gray-50 opacity-75',
};

const badgeColors: Record<ClientStatus, string> = {
  'Fazer': 'bg-red-100 text-red-800',
  'Agendado': 'bg-yellow-100 text-yellow-800',
  'Retirado': 'bg-green-100 text-green-800',
};

export const ClientCard: React.FC<ClientCardProps> = ({ 
  client, onEdit, onDelete, onWhatsApp, onMarkRetrieved 
}) => {
  return (
    <div className={`shadow-sm rounded-lg p-4 border border-gray-200 border-l-4 transition-all hover:shadow-md ${statusColors[client.status]}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
            {client.name}
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeColors[client.status]}`}>
              {client.status}
            </span>
          </h3>
          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
            <Car className="w-3 h-3" /> {client.vehicle} <span className="font-mono bg-gray-100 px-1 rounded text-xs">{client.plate}</span>
          </p>
        </div>
        <div className="flex gap-1">
          <button onClick={() => onEdit(client)} className="p-2 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-indigo-50" title="Editar">
            <Edit2 className="w-4 h-4" />
          </button>
          <button onClick={() => onDelete(client.id)} className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50" title="Excluir">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-700">
        {client.address && (
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <span className="truncate">{client.address}</span>
          </div>
        )}
        
        {client.phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-400 shrink-0" />
            <span>{client.phone}</span>
          </div>
        )}

        {(client.scheduledDate || client.scheduledTime) && (
          <div className="flex items-center gap-3 mt-2 bg-slate-50 p-2 rounded border border-slate-100">
            {client.scheduledDate && (
              <div className="flex items-center gap-1 text-indigo-700 font-medium">
                <Calendar className="w-4 h-4" />
                {client.scheduledDate.split('-').reverse().join('/')}
              </div>
            )}
            {client.scheduledTime && (
              <div className="flex items-center gap-1 text-indigo-700 font-medium">
                <Clock className="w-4 h-4" />
                {client.scheduledTime}
              </div>
            )}
          </div>
        )}
        
        {client.observations && (
            <p className="text-xs text-gray-500 italic mt-2 border-t pt-2">
                "{client.observations}"
            </p>
        )}
      </div>

      <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
        <button 
          onClick={() => onWhatsApp(client)}
          className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${client.sentWhatsapp ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-green-600 text-white hover:bg-green-700'}`}
        >
          <MessageCircle className="w-4 h-4" />
          {client.sentWhatsapp ? 'WhatsApp Enviado' : 'WhatsApp'}
        </button>
        
        {client.status !== 'Retirado' && (
          <button 
            onClick={() => onMarkRetrieved(client)}
            className="flex items-center justify-center gap-2 py-2 px-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium transition-colors"
            title="Marcar como Retirado"
          >
            <CheckCircle className="w-4 h-4" />
            Concluir
          </button>
        )}
      </div>
    </div>
  );
};