import React, { useState } from 'react';
import { X, BookOpen, Clock, MapPin, DollarSign, MessageSquare, ArrowRight, Check, Sparkles, Building2 } from 'lucide-react';
import { Career } from '../types';

interface CareersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCareerPrompt: (query: string) => void;
  onOpenTourWithCareer: (careerName: string) => void;
}

export const CareersDrawer: React.FC<CareersDrawerProps> = ({
  isOpen,
  onClose,
  onSelectCareerPrompt,
  onOpenTourWithCareer
}) => {
  const [selectedFaculty, setSelectedFaculty] = useState<'comunicaciones' | 'salud' | 'ingenieria' | 'ciencias_sociales'>('comunicaciones');

  if (!isOpen) return null;

  const carrerasComunicaciones: Career[] = [
    {
      id: 'comunicaciones',
      codigo: 'COM-01',
      nombre: 'Licenciatura en Ciencias de la Comunicación',
      duracion: '5 años (10 ciclos totales)',
      modalidad: 'Presencial',
      matricula_usd: 100.0,
      cuota_mensual_usd: 150.0,
      cuotas_por_ciclo: 5,
      descuento_temprano_porcentaje: 20,
      fecha_limite_descuento: '15 de diciembre de 2024',
      requisitos_ingreso: [
        'Título de bachiller o constancia de graduación reciente.',
        'Partida de nacimiento reciente (máximo 3 meses de emisión).',
        'Fotocopia de DUI ampliada al 150% (o carné de minoridad).',
        'Aprobar la prueba de admisión diagnóstica institucional.'
      ],
      canales_atencion_oficial: {
        correo: 'admisiones@ujmd.edu.sv',
        whatsapp_oficial: '+503 7000-0000',
        horario: 'Lunes a viernes de 8:00 a.m. a 5:00 p.m.'
      },
      descripcion:
        'Lidera la era de la información multimedia. Desarrolla competencias en periodismo digital de investigación, producción televisiva en estudios HD, radio digital, comunicación corporativa estratégica y gestión de contenidos para redes sociales.',
      areas: [
        'Periodismo Digital y Nuevos Medios',
        'Producción y Realización Audiovisual HD',
        'Comunicación Corporativa y Crisis',
        'Relaciones Públicas y Vocería Institucional'
      ]
    },
    {
      id: 'diseno',
      nombre: 'Licenciatura en Diseño Gráfico',
      duracion: '5 años (10 ciclos)',
      modalidad: 'Presencial',
      matricula_usd: 130.0,
      cuota_mensual_usd: 160.0,
      cuotas_por_ciclo: 5,
      descripcion:
        'El referente de diseño visual en El Salvador. Aprende a crear identidades de marca memorables, prototipado y diseño de experiencia de usuario (UX/UI), modelado y animación digital, así como ilustración en laboratorios Mac.',
      areas: [
        'Branding y Creación de Identidad Visual',
        'Diseño de Interfaces y Experiencia (UX/UI)',
        'Animación Digital 2D/3D y Motion Graphics',
        'Diseño Editorial e Ilustración Profesional'
      ]
    },
    {
      id: 'publicidad',
      nombre: 'Licenciatura en Publicidad y Mercadeo',
      duracion: '5 años (10 ciclos)',
      modalidad: 'Presencial',
      matricula_usd: 120.0,
      cuota_mensual_usd: 150.0,
      cuotas_por_ciclo: 5,
      descripcion:
        'Conecta marcas con audiencias a través de creatividad y datos. Domina la planificación de campañas 360°, la compra programática y marketing en plataformas digitales, el análisis del comportamiento del consumidor y la dirección de cuentas.',
      areas: [
        'Estrategia de Campañas Publicitarias 360°',
        'Marketing Digital, SEO y Social Ads',
        'Creatividad Publicitaria y Redacción (Copywriting)',
        'Inteligencia y Analítica de Mercados'
      ]
    },
    {
      id: 'animacion',
      nombre: 'Licenciatura en Animación Digital y Videojuegos',
      duracion: '5 años (10 ciclos)',
      modalidad: 'Presencial',
      matricula_usd: 130.0,
      cuota_mensual_usd: 170.0,
      cuotas_por_ciclo: 5,
      descripcion:
        'Pionera en la industria creativa del entretenimiento. Formación en modelado 3D, desarrollo de motores de videojuegos, narrativa interactiva y animación para cine y publicidad.',
      areas: [
        'Modelado y Rigging 3D',
        'Diseño de Niveles y Motores de Videojuegos',
        'Efectos Visuales (VFX) y Renderizado',
        'Arte Conceptual y Guion Gráfico'
      ]
    }
  ];

  const carrerasOtras: Record<string, Array<{ nombre: string; duracion: string; matricula: number; cuota: number; desc: string }>> = {
    salud: [
      {
        nombre: 'Doctorado en Medicina',
        duracion: '8 años (incluye internado)',
        matricula: 130.0,
        cuota: 260.0,
        desc: 'Formación médica de excelencia con rotaciones hospitalarias y laboratorios biomédicos modernos.'
      },
      {
        nombre: 'Licenciatura en Enfermería',
        duracion: '5 años (10 ciclos)',
        matricula: 100.0,
        cuota: 140.0,
        desc: 'Cuidado integral de la salud, ética profesional y entrenamiento en centros de práctica clínica.'
      },
      {
        nombre: 'Licenciatura en Psicología',
        duracion: '5 años (10 ciclos)',
        matricula: 120.0,
        cuota: 155.0,
        desc: 'Especializaciones en psicología clínica, educativa, forense y organizacional.'
      }
    ],
    ingenieria: [
      {
        nombre: 'Licenciatura en Arquitectura',
        duracion: '5 años (10 ciclos)',
        matricula: 130.0,
        cuota: 185.0,
        desc: 'Diseño arquitectónico innovador, urbanismo sostenible y talleres de maquetación digital.'
      },
      {
        nombre: 'Ingeniería en Computación e Informática',
        duracion: '5 años (10 ciclos)',
        matricula: 125.0,
        cuota: 170.0,
        desc: 'Desarrollo de software avanzado, inteligencia artificial, ciberseguridad y arquitectura en la nube.'
      },
      {
        nombre: 'Ingeniería Industrial',
        duracion: '5 años (10 ciclos)',
        matricula: 125.0,
        cuota: 170.0,
        desc: 'Optimización de procesos productivos, gestión de calidad, logística y cadena de suministro.'
      }
    ],
    ciencias_sociales: [
      {
        nombre: 'Licenciatura en Ciencias Jurídicas (Derecho)',
        duracion: '5 años (10 ciclos)',
        matricula: 120.0,
        cuota: 160.0,
        desc: 'Prestigiosa facultad con salas de audiencias simuladas, litigación oral y derecho corporativo.'
      },
      {
        nombre: 'Licenciatura en Administración de Empresas',
        duracion: '5 años (10 ciclos)',
        matricula: 120.0,
        cuota: 155.0,
        desc: 'Liderazgo empresarial, finanzas corporativas, emprendimiento e innovación en negocios globales.'
      },
      {
        nombre: 'Licenciatura en Relaciones Internacionales',
        duracion: '5 años (10 ciclos)',
        matricula: 120.0,
        cuota: 160.0,
        desc: 'Diplomacia, comercio exterior, cooperación internacional y análisis geopolítico.'
      }
    ]
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-xl h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300 border-l border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#11284f] text-white p-5 flex items-center justify-between border-b-4 border-[#ffc606]">
          <div>
            <h2 className="text-lg font-bold">Oferta Académica UJMD</h2>
            <p className="text-xs text-slate-300">Universidad Dr. José Matías Delgado • Pregrado</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Faculties Filter Buttons */}
        <div className="bg-slate-100 p-2.5 flex items-center gap-1.5 overflow-x-auto chat-scroll border-b border-slate-200">
          <button
            onClick={() => setSelectedFaculty('comunicaciones')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedFaculty === 'comunicaciones'
                ? 'bg-[#11284f] text-[#ffc606] shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            Escuela de Comunicaciones
          </button>
          <button
            onClick={() => setSelectedFaculty('salud')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedFaculty === 'salud'
                ? 'bg-[#11284f] text-[#ffc606] shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            Ciencias de la Salud
          </button>
          <button
            onClick={() => setSelectedFaculty('ingenieria')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedFaculty === 'ingenieria'
                ? 'bg-[#11284f] text-[#ffc606] shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            Ingeniería y Arquitectura
          </button>
          <button
            onClick={() => setSelectedFaculty('ciencias_sociales')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              selectedFaculty === 'ciencias_sociales'
                ? 'bg-[#11284f] text-[#ffc606] shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200'
            }`}
          >
            Derecho y Negocios
          </button>
        </div>

        {/* List of Careers */}
        <div className="flex-1 overflow-y-auto chat-scroll p-5 space-y-4">
          {selectedFaculty === 'comunicaciones' ? (
            carrerasComunicaciones.map((career) => (
              <div 
                key={career.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all space-y-2.5"
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    {career.codigo && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#11284f] text-[#ffc606]">
                        {career.codigo}
                      </span>
                    )}
                    {career.descuento_temprano_porcentaje && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {career.descuento_temprano_porcentaje}% Descuento Temprano
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug">
                    {career.nombre}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#11284f]" />
                      {career.duracion}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#11284f]" />
                      {career.modalidad}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {career.descripcion}
                </p>

                {/* Areas */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1">
                  {career.areas.map((area, idx) => (
                    <div key={idx} className="flex items-center gap-1 text-[11px] text-slate-600">
                      <Check className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                      <span>{area}</span>
                    </div>
                  ))}
                </div>

                {/* Aranceles snippet */}
                <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Aranceles oficiales</span>
                    <span className="font-bold text-[#11284f]">
                      Matrícula: ${career.matricula_usd.toFixed(2)} | Cuota: ${career.cuota_mensual_usd.toFixed(2)}
                    </span>
                  </div>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full">
                    Ciclo 01-2025
                  </span>
                </div>

                {/* Actions */}
                <div className="pt-1 flex items-center gap-2">
                  <button
                    onClick={() => {
                      onSelectCareerPrompt(`Cuéntame sobre el plan de estudios, materias y aranceles de ${career.nombre}.`);
                      onClose();
                    }}
                    className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold text-[#11284f] bg-slate-100 hover:bg-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#ffc606]" />
                    Consultar al Bot
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onOpenTourWithCareer(career.nombre);
                    }}
                    className="py-1.5 px-3 rounded-lg text-xs font-semibold text-[#11284f] bg-[#ffc606] hover:bg-[#e5b205] flex items-center justify-center gap-1 transition-colors shadow-xs cursor-pointer"
                  >
                    <span>Inscribir</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            carrerasOtras[selectedFaculty]?.map((item, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all space-y-2.5"
              >
                <div>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug">
                    {item.nombre}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-[#11284f]" />
                    <span>{item.duracion}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.desc}
                </p>

                <div className="bg-white p-2.5 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Aranceles oficiales de referencia</span>
                    <span className="font-bold text-[#11284f]">
                      Matrícula: ${item.matricula.toFixed(2)} | Cuota Aprox.: ${item.cuota.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="pt-1 flex items-center gap-2">
                  <button
                    onClick={() => {
                      onSelectCareerPrompt(`¿Cuáles son los requisitos de admisión y plan de estudios de ${item.nombre}?`);
                      onClose();
                    }}
                    className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold text-[#11284f] bg-slate-100 hover:bg-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#ffc606]" />
                    Preguntar a MatíasBot
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      onOpenTourWithCareer(item.nombre);
                    }}
                    className="py-1.5 px-3 rounded-lg text-xs font-semibold text-[#11284f] bg-[#ffc606] hover:bg-[#e5b205] flex items-center justify-center gap-1 transition-colors shadow-xs cursor-pointer"
                  >
                    <span>Inscribir</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Cerrar catálogo
          </button>
        </div>
      </div>
    </div>
  );
};
