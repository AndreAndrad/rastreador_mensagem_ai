import { Client, WhatsAppTemplate } from '../types';

const CLIENTS_KEY = 'rastreador_clients_v1';
const TEMPLATES_KEY = 'rastreador_templates_v1';

const DEFAULT_TEMPLATES: WhatsAppTemplate[] = [
  {
    id: 'agendamento',
    name: 'Convite Agendamento',
    content: '{SAUDACAO} {NOME}, aqui é da empresa de rastreamento. Precisamos agendar a retirada do equipamento do veículo {VEICULO} ({PLACA}). Qual o melhor horário para você?'
  },
  {
    id: 'confirmacao',
    name: 'Confirmação',
    content: '{SAUDACAO} {NOME}, confirmando a retirada do rastreador no veículo {VEICULO} para o dia {DATA} às {HORA}. O técnico estará a caminho.'
  },
  {
    id: 'cobranca',
    name: 'Cobrança (Follow-up)',
    content: '{SAUDACAO} {NOME}, ainda não conseguimos agendar a retirada do rastreador do {VEICULO}. Por favor, nos retorne para evitarmos cobranças adicionais.'
  },
  {
    id: 'ausente',
    name: 'Técnico no Local (Ausente)',
    content: '{SAUDACAO} {NOME}, nosso técnico está no local combinado para a retirada, mas não encontrou ninguém. Aguardamos retorno urgente.'
  },
  {
    id: 'agradecimento',
    name: 'Agradecimento',
    content: 'Obrigado {NOME}! O equipamento foi retirado com sucesso. Agradecemos a parceria.'
  }
];

export const storageService = {
  getClients: (): Client[] => {
    try {
      const data = localStorage.getItem(CLIENTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error parsing clients from LS', e);
      return [];
    }
  },

  saveClients: (clients: Client[]) => {
    localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
  },

  getTemplates: (): WhatsAppTemplate[] => {
    try {
      const data = localStorage.getItem(TEMPLATES_KEY);
      return data ? JSON.parse(data) : DEFAULT_TEMPLATES;
    } catch (e) {
      return DEFAULT_TEMPLATES;
    }
  },

  saveTemplates: (templates: WhatsAppTemplate[]) => {
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(templates));
  }
};