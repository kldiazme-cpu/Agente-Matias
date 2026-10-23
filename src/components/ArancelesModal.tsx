import React, { useState } from 'react';
import { X, ShieldCheck, DollarSign, Calendar, MessageSquare, AlertCircle, Percent, Sparkles, Building2 } from 'lucide-react';

interface ArancelesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCareerPrompt: (query: string) => void;
  onOpenTour: () => void;
}

export const ArancelesModal: React.FC<ArancelesModalProps> = ({
  isOpen,
  onClose,
  onSelectCareerPrompt,
  onOpenTour
}) => {
  const [activeTab, setActiveTab] = useState<'comunicaciones' | 'otras' | 'beneficios'>('comunicaciones');

  if (!isOpen) return null;

  const comunicacionesData = [
    {
      carrera: 'Licenciatura en Ciencias de la Comunicación',
      codigo: 'COM-01',
      facultad: 'Escuela de Ciencias de la Comunicación',
      matricula: 100.0,
      cuota: 150.0,
      cuotas: 5,
      totalCiclo: 100.0 + 150.0 * 5,
      descuentoTemprano: 20,
      fechaLimite: '15 de diciembre de 2024',
      modalidad: 'Presencial',
      periodo: 'Ciclo 01-2025',
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-200'
    },
    {
      carrera: 'Licenciatura en Diseño Gráfico',
      facultad: 'Facultad de Ciencias y Artes "Francisco Gavidia"',
      matricula: 130.0,
      cuota: 160.0,
      cuotas: 5,
      totalCiclo: 130.0 + 160.0 * 5,
      modalidad: 'Presencial',
      periodo: 'Ciclo 01-2025',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-200'
    },
    {
      carrera: 'Licenciatura en Publicidad y Mercadeo',
      facultad: 'Facultad de Ciencias y Artes "Francisco Gavidia"',
      matricula: 120.0,
      cuota: 150.0,
      cuotas: 5,
      totalCiclo: 120.0 + 150.0 * 5,
      modalidad: 'Presencial',
      periodo: 'Ciclo 01-2025',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200'
    },
    {
      carrera: 'Licenciatura en Animación Digital y Videojuegos',
      facultad: 'Facultad de Ciencias y Artes "Francisco Gavidia"',
      matricula: 130.0,
      cuota: 170.0,
      cuotas: 5,
      totalCiclo: 130.0 + 170.0 * 5,
      modalidad: 'Presencial',
      periodo: 'Ciclo 01-2025',
      badgeColor: 'bg-purple-100 text-purple-900 border-purple-200'
    }
  ];

  const otrasCarrerasData = [
    {
      carrera: 'Doctorado en Medicina',
      facultad: 'Facultad de Ciencias de la Salud "Dr. Luis Edmundo Vásquez"',
      admision: 90.0,
      matricula: 130.0,
      cuota: 260.0,
      cuotas: 5,
      totalCiclo: 130.0 + 260.0 * 5,
      modalidad: 'Presencial (8 años)',
      periodo: 'Ciclo 01-2025',
      badgeColor: 'bg-rose-100 text-rose-900 border-rose-200'
    },
    {
      carrera: 'Licenciatura en Arquitectura',
      facultad: 'Facultad de Ingeniería y Arquitectura',
      admision: 45.0,
      matricula: 130.0,
      cuota: 185.0,
      cuotas: 5,
      totalCiclo: 130.0 + 185.0 * 5,
      modalidad: 'Presencial (5 años)',
      periodo: 'Ciclo 01-2025',
      badgeColor: 'bg-orange-100 text-orange-900 border-orange-200'
    },
    {
      carrera: 'Licenciatura en Ciencias Jurídicas (Derecho)',
      facultad: 'Facultad de Jurisprudencia y Ciencias Sociales',
      admision: 45.0,
      matricula: 120.0,
      cuota: 160.0,
      cuotas: 5,
      totalCiclo: 120.0 + 160.0 * 5,
      modalidad: 'Presencial (5 años)',
      periodo: 'Ciclo 01-2025',
      badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-200'
    },
    {
      carrera: 'Ingeniería en Computación e Informática',
      facultad: 'Facultad de Ingeniería y Arquitectura',
      admision: 45.0,
      matricula: 125.0,
      cuota: 170.0,
      cuotas: 5,
      totalCiclo: 125.0 + 170.0 * 5,
      modalidad: 'Presencial (5 años)',
      periodo: 'Ciclo 01-2025',
      badgeColor: 'bg-cyan-100 text-cyan-900 border-cyan-200'
    },
    {
      carrera: 'Licenciatura en Psicología',
      facultad: 'Facultad de Ciencias de la Salud "Dr. Luis Edmundo Vásquez"',
      admision: 45.0,
      matricula: 120.0,
      cuota: 155.0,
      cuotas: 5,
      totalCiclo: 120.0 + 155.0 * 5,
      modalidad: 'Presencial (5 años)',
      periodo: 'Ciclo 01-2025',
      badgeColor: 'bg-teal-100 text-teal-900 border-teal-200'
    },
    {
      carrera: 'Licenciatura en Administración de Empresas',
      facultad: 'Facultad de Economía, Empresa y Negocios',
      admision: 45.0,
      matricula: 120.0,
      cuota: 155.0,
      cuotas: 5,
      totalCiclo: 120.0 + 155.0 * 5,
      modalidad: 'Presencial (5 años)',
      periodo: 'Ciclo 01-2025',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#11284f] text-white p-5 flex items-center justify-between border-b-4 border-[#ffc606]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ffc606] text-[#11284f] flex items-center justify-center font-bold shadow">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Aranceles y Cuotas Oficiales UJMD</h2>
              <p className="text-xs text-slate-300">Universidad Dr. José Matías Delgado • Ciclo 01-2025</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('comunicaciones')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'comunicaciones'
                ? 'border-[#11284f] text-[#11284f]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#ffc606]" />
            Ciencias de la Comunicación
          </button>

          <button
            onClick={() => setActiveTab('otras')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'otras'
                ? 'border-[#11284f] text-[#11284f]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-[#11284f]" />
            Otras Facultades UJMD
          </button>

          <button
            onClick={() => setActiveTab('beneficios')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'beneficios'
                ? 'border-[#11284f] text-[#11284f]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Percent className="w-3.5 h-3.5 text-emerald-600" />
            Beneficios y Descuentos
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto chat-scroll space-y-4">
          {/* Tab 1: Comunicaciones */}
          {activeTab === 'comunicaciones' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#d9a400] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Base Financiera Oficial de Comunicaciones:</span> Valores fijados para nuevo ingreso Ciclo 01-2025. Incluyen derecho de uso de sets de TV HD, cabinas de radio y laboratorios Mac con Adobe Creative Cloud.
                </div>
              </div>

              <div className="grid gap-3">
                {comunicacionesData.map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2.5">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${item.badgeColor} inline-block`}>
                            {item.modalidad} • {item.periodo}
                          </span>
                          {item.codigo && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#11284f] text-[#ffc606]">
                              {item.codigo}
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm">
                          {item.carrera}
                        </h3>
                        {item.descuentoTemprano && (
                          <div className="text-[11px] font-semibold text-emerald-700 mt-0.5 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
                            {item.descuentoTemprano}% de descuento temprano (Límite: {item.fechaLimite})
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          onSelectCareerPrompt(`¿Me das más detalles sobre los aranceles y materias de ${item.carrera}?`);
                          onClose();
                        }}
                        className="text-xs font-semibold text-[#11284f] hover:text-[#1a3c75] flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer self-start sm:self-auto"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[#ffc606]" />
                        Preguntar al bot
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 bg-white p-2.5 rounded-lg border border-slate-200/80 text-xs">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Matrícula</span>
                        <span className="font-bold text-[#11284f] text-sm">
                          ${item.matricula.toFixed(2)} USD
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Cuota Mensual</span>
                        <span className="font-bold text-[#11284f] text-sm">
                          ${item.cuota.toFixed(2)} USD
                        </span>
                        <span className="text-[10px] text-slate-400 block">5 cuotas</span>
                      </div>
                      <div className="col-span-2 sm:col-span-1 pt-1.5 sm:pt-0 border-t sm:border-t-0 sm:border-l border-slate-200 sm:pl-2.5">
                        <span className="text-slate-500 block text-[10px]">Total Ciclo</span>
                        <span className="font-bold text-emerald-700 text-sm">
                          ${item.totalCiclo.toFixed(2)} USD
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Otras Carreras */}
          {activeTab === 'otras' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Aranceles Generales UJMD:</strong> En la UJMD las cuotas mensuales oscilan entre $100.00 y $305.00 USD según la carrera y categorización socioeconómica de Admisiones.
                </span>
              </div>

              <div className="grid gap-3">
                {otrasCarrerasData.map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
                      <div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${item.badgeColor} inline-block mb-0.5`}>
                          {item.modalidad}
                        </span>
                        <h3 className="font-bold text-slate-900 text-sm">
                          {item.carrera}
                        </h3>
                        <p className="text-[11px] text-slate-500">{item.facultad}</p>
                      </div>
                      <button
                        onClick={() => {
                          onSelectCareerPrompt(`¿Cuáles son los requisitos de admisión y aranceles para ${item.carrera}?`);
                          onClose();
                        }}
                        className="text-xs font-semibold text-[#11284f] bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer self-start sm:self-auto flex items-center gap-1"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[#ffc606]" />
                        Consultar
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2 bg-white p-2.5 rounded-lg border border-slate-200/80 text-xs">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Admisión</span>
                        <span className="font-semibold text-slate-800 text-xs sm:text-sm">
                          ${item.admision.toFixed(2)} USD
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Matrícula</span>
                        <span className="font-bold text-[#11284f] text-xs sm:text-sm">
                          ${item.matricula.toFixed(2)} USD
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Cuota Aprox.</span>
                        <span className="font-bold text-emerald-700 text-xs sm:text-sm">
                          ${item.cuota.toFixed(2)} USD
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Beneficios y Descuentos */}
          {activeTab === 'beneficios' && (
            <div className="space-y-3.5 text-xs text-slate-700">
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/70 space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
                  <Percent className="w-5 h-5 text-emerald-700" />
                  Descuento Oficial del 50% en Matrícula
                </div>
                <p className="leading-relaxed text-emerald-800">
                  Al cancelar el ciclo completo en un solo pago antes del vencimiento de la cuota 2, la Universidad aplica automáticamente un <strong>50% de descuento en el valor de la matrícula</strong>.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="font-bold text-[#11284f] text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#ffc606]" />
                  Becas y Apoyo Financiero
                </div>
                <ul className="space-y-1.5 list-disc pl-4 text-slate-600">
                  <li><strong>Becas Matías:</strong> Destinadas a bachilleres con excelencia académica comprobada, talento artístico o deportivo.</li>
                  <li><strong>Convenios Bancarios:</strong> Facilidades de crédito educativo y financiamiento con Banco Agrícola, BAC, Banco Cuscatlán y Fedecrédito.</li>
                  <li><strong>Convenios Internacionales:</strong> Acuerdos de becas y movilidad para posgrados con el DAAD (Alemania), Universidad de Sevilla (España) y McGill University (Canadá).</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="font-bold text-[#11284f] text-sm">
                  Medios Electrónicos y Puntos de Pago Autorizados
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Puedes abonar tus cuotas y aranceles a través de:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-medium text-slate-800">
                  <span className="p-2 bg-white rounded border border-slate-200 text-center">Banca en Línea</span>
                  <span className="p-2 bg-white rounded border border-slate-200 text-center">Uvirtual (Visa/Mastercard)</span>
                  <span className="p-2 bg-white rounded border border-slate-200 text-center">Puntos Express</span>
                  <span className="p-2 bg-white rounded border border-slate-200 text-center">Súper Selectos</span>
                  <span className="p-2 bg-white rounded border border-slate-200 text-center">Farmacias Económicas</span>
                  <span className="p-2 bg-white rounded border border-slate-200 text-center">Walmart El Salvador</span>
                </div>
              </div>
            </div>
          )}

          <div className="p-3 bg-slate-100 rounded-xl text-xs text-slate-600 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-slate-500 flex-shrink-0" />
            <span>Nota: Los valores presentados son de referencia oficial UJMD. En Admisiones se evalúa cada solicitud de nuevo ingreso.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            ¿Deseas iniciar tu proceso o visitar el campus universitario?
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 cursor-pointer"
            >
              Cerrar
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenTour();
              }}
              className="flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-semibold text-[#11284f] bg-[#ffc606] hover:bg-[#e5b205] shadow transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-[#11284f]" />
              Agendar Recorrido
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
