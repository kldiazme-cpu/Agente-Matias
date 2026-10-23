export interface LocationMapData {
  campus: 'campus_2' | 'campus_1' | 'ambos';
  nombre: string;
  direccion: string;
  referencia: string;
  embedUrl: string;
  googleMapsUrl: string;
  wazeUrl: string;
  facultades: string[];
  transportePublico?: string[];
  parqueo?: string;
  horarioAtencion?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  locationMap?: LocationMapData | null;
  toolUsed?: {
    name: string;
    args?: any;
    result?: any;
  } | null;
}

export interface Career {
  id: string;
  nombre: string;
  codigo?: string;
  facultad?: string;
  duracion: string;
  modalidad: string;
  matricula_usd: number;
  cuota_mensual_usd: number;
  cuotas_por_ciclo: number;
  descuento_temprano_porcentaje?: number;
  fecha_limite_descuento?: string;
  requisitos_ingreso?: string[];
  canales_atencion_oficial?: {
    correo: string;
    whatsapp_oficial: string;
    horario: string;
  };
  descripcion: string;
  areas: string[];
}

export interface LeadFormData {
  nombreCompleto: string;
  telefono: string;
  bachillerato: string;
  carreraInteres: string;
  tipoSolicitud: string;
}

export type ConversionType =
  | 'view_aranceles'
  | 'view_pensum_com01'
  | 'view_location_map'
  | 'vocational_test_completed'
  | 'official_contact_click'
  | 'lead_captured'
  | 'tour_scheduled'
  | 'enrollment_intent';

export interface ConversionEvent {
  id: string;
  sessionId: string;
  type: ConversionType;
  label: string;
  timestamp: string;
  career?: string;
  metadata?: Record<string, any>;
}

export interface UserProfile {
  nombreCompleto?: string;
  telefono?: string;
  bachillerato?: string;
  carreraInteres?: string;
  ticketId?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  userProfile?: UserProfile;
  conversions: ConversionEvent[];
  status: 'activa' | 'lead_capturado' | 'tour_agendado' | 'matricula_iniciada';
  carreraInteres?: string;
}

export interface FunnelStats {
  totalSessions: number;
  totalMessages: number;
  conversionsByType: Record<ConversionType, number>;
  funnelSteps: {
    stage: string;
    type: ConversionType;
    count: number;
    percentage: number;
    color: string;
  }[];
  recentConversions: ConversionEvent[];
  topCarreras: { carrera: string; count: number }[];
  conversionRateLead: number;
  conversionRateTour: number;
}
