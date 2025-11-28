export type ClientStatus = 'Fazer' | 'Agendado' | 'Retirado';

export interface Client {
  id: string;
  name: string;
  phone: string;
  address: string;
  vehicle: string;
  plate: string;
  trackerNumber: string;
  observations: string;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm
  status: ClientStatus;
  updatedAt: string;
  sentWhatsapp: boolean;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  content: string;
}

export interface ClientFormData extends Omit<Client, 'id' | 'updatedAt' | 'sentWhatsapp'> {}
