import React, { useState } from 'react';
import { parseClientText } from '../services/geminiService';
import { ClientFormData } from '../types';
import { Wand2, X, AlertCircle } from 'lucide-react';

interface SmartPasteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProcessed: (data: Partial<ClientFormData>) => void;
}

export const SmartPasteModal: React.FC<SmartPasteModalProps> = ({ isOpen, onClose, onProcessed }) => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleProcess = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await parseClientText(text);
      onProcessed(data);
      setText(''); // Clear on success
      onClose();
    } catch (err) {
      setError('Falha ao processar texto com IA. Verifique sua chave de API ou tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-fade-in">
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <Wand2 className="w-5 h-5" />
            <h2 className="font-bold text-lg">Cadastro Inteligente (IA)</h2>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-600 mb-3">
            Cole abaixo qualquer texto (mensagem de WhatsApp, e-mail) e a IA irá extrair os dados automaticamente.
          </p>
          
          <textarea
            className="w-full h-40 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
            placeholder="Ex: Cliente João Silva, placa ABC-1234, rua das flores 123. Agendado para amanhã as 10h..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading}
          />

          {error && (
            <div className="mt-3 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <button 
              onClick={onClose} 
              className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              onClick={handleProcess}
              disabled={loading || !text.trim()}
              className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processando...
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  Processar Texto
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};