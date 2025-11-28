import React, { useState, useEffect } from 'react';
import { Client, ClientFormData, ClientStatus } from '../types';
import { X, Save } from 'lucide-react';

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ClientFormData) => void;
  initialData?: Partial<ClientFormData>;
  isEditing: boolean;
}

const emptyForm: ClientFormData = {
  name: '',
  phone: '',
  address: '',
  vehicle: '',
  plate: '',
  trackerNumber: '',
  observations: '',
  scheduledDate: '',
  scheduledTime: '',
  status: 'Fazer'
};

export const ClientFormModal: React.FC<ClientFormModalProps> = ({ 
  isOpen, onClose, onSubmit, initialData, isEditing 
}) => {
  const [formData, setFormData] = useState<ClientFormData>(emptyForm);

  useEffect(() => {
    if (isOpen) {
      setFormData({ ...emptyForm, ...initialData });
    }
  }, [isOpen, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="bg-indigo-600 p-4 flex justify-between items-center text-white shrink-0">
          <h2 className="font-bold text-lg">{isEditing ? 'Editar Cliente' : 'Novo Cliente'}</h2>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Telefone (WhatsApp)</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
              >
                <option value="Fazer">🔴 Fazer</option>
                <option value="Agendado">🟡 Agendado</option>
                <option value="Retirado">🟢 Retirado</option>
              </select>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Endereço</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Veículo</label>
              <input
                type="text"
                name="vehicle"
                value={formData.vehicle}
                onChange={handleChange}
                placeholder="Ex: Fiat Uno"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Placa</label>
              <input
                type="text"
                name="plate"
                value={formData.plate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2 uppercase"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Data Agendada</label>
              <input
                type="date"
                name="scheduledDate"
                value={formData.scheduledDate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Hora</label>
              <input
                type="time"
                name="scheduledTime"
                value={formData.scheduledTime}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
              />
            </div>
            
             <div>
              <label className="block text-sm font-medium text-gray-700">ID Rastreador</label>
              <input
                type="text"
                name="trackerNumber"
                value={formData.trackerNumber}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Observações</label>
              <textarea
                name="observations"
                value={formData.observations}
                onChange={handleChange}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2"
              />
            </div>

          </div>

          <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-colors"
            >
              <Save className="w-4 h-4" />
              Salvar Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};