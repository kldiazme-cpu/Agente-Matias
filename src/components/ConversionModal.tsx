import React, { useState, useEffect } from 'react';
import { 
  X, 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  BarChart3, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  RefreshCw,
  Phone,
  School,
  GraduationCap,
  Percent
} from 'lucide-react';
import { FunnelStats } from '../types';
import { fetchFunnelStats } from '../services/api';

interface ConversionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPrompt?: (prompt: string) => void;
}

export const ConversionModal: React.FC<ConversionModalProps> = ({
  isOpen,
  onClose,
  onSelectPrompt
}) => {
  const [stats, setStats] = useState<FunnelStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'embudo' | 'actividad' | 'carreras'>('embudo');

  const loadStats = async () => {
    setIsLoading(true);
    const data = await fetchFunnelStats();
    if (data) setStats(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadStats();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#11284f] text-white p-5 flex items-center justify-between border-b-4 border-[#ffc606]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ffc606] text-[#11284f] flex items-center justify-center font-bold shadow">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Seguimiento de Conversiones & Embudo
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  En tiempo real
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Escuela de Ciencias de la Comunicación • Admisiones UJMD
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={loadStats}
              title="Actualizar métricas"
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* KPI Top Cards */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
              <span>Aspirantes</span>
              <Users className="w-3.5 h-3.5 text-[#11284f]" />
            </div>
            <div className="text-xl font-bold text-[#11284f]">
              {stats?.totalSessions || 0}
            </div>
            <div className="text-[10.5px] text-slate-500">Sesiones activas</div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
              <span>Leads</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-xl font-bold text-emerald-700">
              {stats?.conversionsByType['lead_captured'] || 0}
            </div>
            <div className="text-[10.5px] text-emerald-600 font-semibold">
              {stats?.conversionRateLead || 0}% tasa de captación
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
              <span>Tours Campus</span>
              <Calendar className="w-3.5 h-3.5 text-[#d9a400]" />
            </div>
            <div className="text-xl font-bold text-amber-700">
              {stats?.conversionsByType['tour_scheduled'] || 0}
            </div>
            <div className="text-[10.5px] text-slate-500">
              {stats?.conversionRateTour || 0}% de aspirantes
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 text-xs font-medium mb-1">
              <span>Aranceles</span>
              <DollarSign className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="text-xl font-bold text-blue-700">
              {stats?.conversionsByType['view_aranceles'] || 0}
            </div>
            <div className="text-[10.5px] text-slate-500">Consultas de costos</div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-200 bg-white px-5 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('embudo')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'embudo'
                ? 'border-[#11284f] text-[#11284f]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-[#ffc606]" />
            Embudo de Admisiones
          </button>

          <button
            onClick={() => setActiveTab('actividad')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'actividad'
                ? 'border-[#11284f] text-[#11284f]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-slate-600" />
            Actividad en Tiempo Real ({stats?.recentConversions?.length || 0})
          </button>

          <button
            onClick={() => setActiveTab('carreras')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'carreras'
                ? 'border-[#11284f] text-[#11284f]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-slate-600" />
            Interés por Carrera
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-5 overflow-y-auto chat-scroll flex-1 space-y-4">
          {activeTab === 'embudo' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#d9a400] flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Seguimiento de Conversión por Fases:</strong> Cada interacción del aspirante con MatíasBot (consulta de aranceles, examen vocacional, clic a WhatsApp o registro de lead) es clasificada automáticamente dentro del embudo institucional.
                </div>
              </div>

              {/* Funnel Progress Bars */}
              <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200">
                {stats?.funnelSteps?.map((step, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="text-slate-800 font-semibold">{step.stage}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#11284f]">{step.count} eventos</span>
                        <span className="text-[11px] text-slate-500 font-mono">({step.percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.max(5, step.percentage)}%`,
                          backgroundColor: step.color
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'actividad' && (
            <div className="space-y-2">
              <div className="text-xs text-slate-500 font-medium mb-1">
                Últimos eventos de conversión registrados en las sesiones:
              </div>

              {(!stats?.recentConversions || stats.recentConversions.length === 0) ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No se han registrado conversiones todavía.
                </div>
              ) : (
                stats.recentConversions.map((conv) => (
                  <div
                    key={conv.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3 text-xs hover:bg-white transition-colors"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-[#11284f] text-[#ffc606] flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                        <TrendingUp className="w-3.5 h-3.5 text-[#ffc606]" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{conv.label}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          {conv.career && (
                            <span className="font-medium text-[#11284f]">• {conv.career}</span>
                          )}
                          {conv.metadata?.telefono && (
                            <span className="text-slate-500 flex items-center gap-0.5">
                              <Phone className="w-2.5 h-2.5" />
                              {conv.metadata.telefono}
                            </span>
                          )}
                          {conv.metadata?.bachillerato && (
                            <span className="text-slate-500 flex items-center gap-0.5">
                              <School className="w-2.5 h-2.5" />
                              {conv.metadata.bachillerato}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-400 font-medium flex-shrink-0">
                      {new Date(conv.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'carreras' && (
            <div className="space-y-3">
              <div className="text-xs text-slate-500 font-medium mb-1">
                Distribución de consultas por carrera de interés del aspirante:
              </div>

              {stats?.topCarreras?.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-[#11284f] text-[#ffc606] font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-slate-800">{item.carrera}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#11284f]">{item.count} sesiones</span>
                    {onSelectPrompt && (
                      <button
                        onClick={() => {
                          onSelectPrompt(`Cuéntame los aranceles y requisitos oficiales de ${item.carrera}.`);
                          onClose();
                        }}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-[#11284f] font-semibold text-[10.5px] rounded cursor-pointer"
                      >
                        Preguntar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Embudo institucional conectado a MatíasBot UJMD</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#11284f] text-[#ffc606] font-semibold hover:bg-[#1c3c72] transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
