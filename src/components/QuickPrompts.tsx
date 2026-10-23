import React from 'react';
import { DollarSign, GraduationCap, Calendar, BookOpen, Sparkles, Building2, Percent, MapPin } from 'lucide-react';

interface QuickPromptsProps {
  onSelectPrompt: (prompt: string) => void;
  disabled?: boolean;
}

export const QuickPrompts: React.FC<QuickPromptsProps> = ({ onSelectPrompt, disabled }) => {
  const prompts = [
    {
      icon: MapPin,
      label: '📍 ¿Dónde está la Universidad? (Ver Mapa)',
      query: '¿Dónde está ubicada la Universidad Dr. José Matías Delgado y cómo puedo llegar al Campus?',
      color: 'border-indigo-300 bg-indigo-50 text-indigo-950 font-bold hover:bg-indigo-100 shadow-xs'
    },
    {
      icon: Sparkles,
      label: '📌 ¿Qué sigue después de registrarme?',
      query: 'Ya me registré con mis datos, ¿cuál es el siguiente paso para mi proceso de admisión?',
      color: 'border-emerald-300 bg-emerald-50 text-emerald-950 font-bold hover:bg-emerald-100 shadow-xs'
    },
    {
      icon: GraduationCap,
      label: '🎟️ ¿Tienen guardado mi ticket y datos?',
      query: '¿Tienen registrado mi número de ticket oficial y mis datos de contacto en el sistema?',
      color: 'border-blue-300 bg-blue-50 text-blue-950 font-bold hover:bg-blue-100 shadow-xs'
    },
    {
      icon: Percent,
      label: '💰 ¿Cuánto pago con el 20% de descuento en COM-01?',
      query: '¿Cuánto pagaría de matrícula y cuota con el descuento temprano del 20% en COM-01?',
      color: 'border-amber-300 bg-amber-50 text-amber-950 font-bold hover:bg-amber-100 shadow-xs'
    },
    {
      icon: Calendar,
      label: '🏛️ ¿A qué hora es mi visita al campus?',
      query: '¿Cuáles son los horarios y lugar para mi recorrido guiado por los estudios de TV y el campus?',
      color: 'border-indigo-300 bg-indigo-50 text-indigo-950 font-bold hover:bg-indigo-100 shadow-xs'
    },
    {
      icon: GraduationCap,
      label: 'COM-01: Costos, 20% descuento y requisitos',
      query: 'Cuéntame todo sobre la Licenciatura en Ciencias de la Comunicación (COM-01): costos oficiales, descuento temprano, requisitos de ingreso y canales de atención.',
      color: 'border-blue-200 bg-blue-50/70 text-blue-900 hover:bg-blue-100/70'
    },
    {
      icon: DollarSign,
      label: 'Mensualidad y aranceles de Comunicaciones',
      query: '¿Cuánto cuesta la mensualidad y matrícula de la carrera de Ciencias de la Comunicación?',
      color: 'border-amber-200 bg-amber-50/70 text-amber-900 hover:bg-amber-100/70'
    },
    {
      icon: DollarSign,
      label: 'Costos de Diseño Gráfico',
      query: '¿Cuáles son los aranceles de matrícula y cuota de Diseño Gráfico?',
      color: 'border-blue-200 bg-blue-50/70 text-blue-900 hover:bg-blue-100/70'
    },
    {
      icon: Building2,
      label: 'Aranceles de Medicina y Arquitectura',
      query: '¿Cuáles son los costos de matrícula, cuota y derecho de admisión de Medicina y Arquitectura?',
      color: 'border-rose-200 bg-rose-50/70 text-rose-900 hover:bg-rose-100/70'
    },
    {
      icon: Sparkles,
      label: 'Requisitos y pasos de admisión',
      query: '¿Cuáles son los pasos y documentos necesarios para iniciar mi proceso de admisión en la UJMD?',
      color: 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
    },
    {
      icon: Percent,
      label: 'Descuento del 50% por pronto pago y becas',
      query: '¿Cómo funciona el descuento del 50% en matrícula por pronto pago y qué opciones de becas tienen?',
      color: 'border-emerald-200 bg-emerald-50/70 text-emerald-900 hover:bg-emerald-100/70'
    },
    {
      icon: GraduationCap,
      label: 'Diferencias entre las 3 carreras de medios',
      query: '¿Cuáles son las principales diferencias entre Ciencias de la Comunicación, Diseño Gráfico y Publicidad?',
      color: 'border-indigo-200 bg-indigo-50/70 text-indigo-900 hover:bg-indigo-100/70'
    },
    {
      icon: Calendar,
      label: 'Agendar recorrido por el campus y estudios de TV',
      query: 'Me gustaría agendar un recorrido por el campus para conocer los estudios de TV, cabinas de radio y laboratorios Mac.',
      color: 'border-amber-200 bg-amber-50/80 text-amber-950 hover:bg-amber-100'
    }
  ];

  return (
    <div className="py-2.5 px-3 sm:px-4 border-b border-slate-200/80 bg-slate-50/70">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#11284f] mb-2 px-1">
          <Sparkles className="w-3.5 h-3.5 text-[#ffc606]" />
          <span>Preguntas frecuentes recomendadas:</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 chat-scroll scroll-smooth">
          {prompts.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                type="button"
                disabled={disabled}
                onClick={() => onSelectPrompt(item.query)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer shadow-xs active:scale-97 ${item.color} ${
                  disabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <Icon className="w-3.5 h-3.5 opacity-80" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
