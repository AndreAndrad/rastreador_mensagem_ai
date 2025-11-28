import React, { useState, useEffect, useMemo } from 'react';
import { Client, ClientFormData, ClientStatus } from './types';
import { storageService } from './services/storageService';
import { ClientCard } from './components/ClientCard';
import { StatsCards } from './components/StatsCards';
import { SmartPasteModal } from './components/SmartPasteModal';
import { ClientFormModal } from './components/ClientFormModal';
import { WhatsAppModal } from './components/WhatsAppModal';
import { Search, Plus, Download, Wand2, Filter, Menu } from 'lucide-react';

function App() {
  const [clients, setClients] = useState<Client[]>([]);
  const [statusFilter, setStatusFilter] = useState<ClientStatus | 'Todos'>('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals state
  const [isSmartPasteOpen, setIsSmartPasteOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [whatsAppClient, setWhatsAppClient] = useState<Client | null>(null);
  
  // Quick AI paste result temporary holder before opening form
  const [aiDraftData, setAiDraftData] = useState<Partial<ClientFormData> | undefined>(undefined);

  // Load initial data
  useEffect(() => {
    const loaded = storageService.getClients();
    setClients(loaded);
  }, []);

  // Save on change
  useEffect(() => {
    if (clients.length > 0) {
      storageService.saveClients(clients);
    }
  }, [clients]);

  // Actions
  const handleAddClient = (data: ClientFormData) => {
    const newClient: Client = {
      ...data,
      id: crypto.randomUUID(),
      updatedAt: new Date().toISOString(),
      sentWhatsapp: false
    };
    setClients(prev => [newClient, ...prev]);
  };

  const handleUpdateClient = (data: ClientFormData) => {
    if (!editingClient) return;
    setClients(prev => prev.map(c => 
      c.id === editingClient.id 
        ? { ...c, ...data, updatedAt: new Date().toISOString() } 
        : c
    ));
    setEditingClient(null);
  };

  const handleDeleteClient = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      setClients(prev => prev.filter(c => c.id !== id));
      // Also update storage immediately to handle empty list edge case
      const newClients = clients.filter(c => c.id !== id);
      storageService.saveClients(newClients);
    }
  };

  const handleMarkRetrieved = (client: Client) => {
    const updated = { ...client, status: 'Retirado' as ClientStatus, updatedAt: new Date().toISOString() };
    setClients(prev => prev.map(c => c.id === client.id ? updated : c));
  };

  const handleWhatsAppSent = (id: string) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, sentWhatsapp: true } : c));
  };

  const handleExportCSV = () => {
    const headers = ['Nome', 'Telefone', 'Placa', 'Veiculo', 'Endereco', 'Status', 'Data Agendada', 'Hora Agendada', 'Obs'];
    const rows = clients.map(c => [
      c.name, c.phone, c.plate, c.vehicle, c.address, c.status, c.scheduledDate, c.scheduledTime, c.observations
    ].map(field => `"${field || ''}"`).join(',')); // simple CSV escaping
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `clientes_rastreador_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAiProcessed = (data: Partial<ClientFormData>) => {
    setAiDraftData(data);
    setIsSmartPasteOpen(false);
    setIsFormOpen(true);
  };

  // Filtering
  const filteredClients = useMemo(() => {
    return clients.filter(c => {
      const matchesStatus = statusFilter === 'Todos' || c.status === statusFilter;
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        c.name.toLowerCase().includes(searchLower) || 
        c.plate.toLowerCase().includes(searchLower) ||
        c.vehicle.toLowerCase().includes(searchLower);
      return matchesStatus && matchesSearch;
    });
  }, [clients, statusFilter, searchTerm]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      
      {/* Header */}
      <header className="bg-indigo-600 text-white shadow-lg sticky top-0 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-white/20 p-2 rounded-lg">
                 <Menu className="w-6 h-6" />
              </div>
              <h1 className="text-xl font-bold tracking-tight">Rastreador<span className="font-light opacity-80">Manager</span></h1>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setIsSmartPasteOpen(true)}
                className="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white px-3 py-2 rounded-lg shadow-md flex items-center gap-2 text-sm font-bold transition-all"
              >
                <Wand2 className="w-4 h-4" />
                <span className="hidden sm:inline">Colar IA</span>
              </button>
              <button 
                onClick={() => { setEditingClient(null); setAiDraftData(undefined); setIsFormOpen(true); }}
                className="bg-white text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-lg shadow-md flex items-center gap-2 text-sm font-bold transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Novo</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        
        {/* Stats */}
        <StatsCards clients={clients} />

        {/* Controls */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 sticky top-[72px] z-20">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text"
                placeholder="Buscar por nome, placa ou veículo..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex p-1 bg-gray-100 rounded-lg overflow-x-auto w-full md:w-auto">
              {(['Todos', 'Fazer', 'Agendado', 'Retirado'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                    statusFilter === tab 
                      ? 'bg-white text-indigo-700 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Export */}
            <button 
               onClick={handleExportCSV}
               className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 hidden md:block"
               title="Exportar CSV"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Client List */}
        {filteredClients.length === 0 ? (
          <div className="text-center py-20 opacity-50">
            <Filter className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-xl text-gray-500">Nenhum cliente encontrado.</p>
            <p className="text-sm text-gray-400">Tente ajustar os filtros ou adicionar um novo.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClients.map(client => (
              <ClientCard
                key={client.id}
                client={client}
                onEdit={(c) => { setEditingClient(c); setIsFormOpen(true); }}
                onDelete={handleDeleteClient}
                onWhatsApp={(c) => { setWhatsAppClient(c); setIsWhatsAppOpen(true); }}
                onMarkRetrieved={handleMarkRetrieved}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modals */}
      <SmartPasteModal 
        isOpen={isSmartPasteOpen} 
        onClose={() => setIsSmartPasteOpen(false)} 
        onProcessed={handleAiProcessed} 
      />

      <ClientFormModal 
        isOpen={isFormOpen} 
        onClose={() => { setIsFormOpen(false); setEditingClient(null); setAiDraftData(undefined); }} 
        onSubmit={editingClient ? handleUpdateClient : handleAddClient}
        initialData={editingClient || aiDraftData || {}}
        isEditing={!!editingClient}
      />

      <WhatsAppModal 
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        client={whatsAppClient}
        onSent={handleWhatsAppSent}
      />

    </div>
  );
}

export default App;