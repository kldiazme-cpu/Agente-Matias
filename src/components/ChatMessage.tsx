import React, { useState } from 'react';
import { Message } from '../types';
import { trackConversion } from '../services/api';
import { 
  Bot, 
  User, 
  CheckCircle2, 
  Database, 
  Copy, 
  Check, 
  Volume2, 
  VolumeX,
  ExternalLink,
  GraduationCap,
  Calendar,
  Clock,
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  FileCheck,
  DollarSign,
  ArrowRight
} from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  onAskFollowUp?: (query: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onAskFollowUp }) => {
  const isBot = message.role === 'model';
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showDetails, setShowDetails] = useState(true);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message.text.replace(/[*•#_]/g, ''));
    utterance.lang = 'es-ES';
    utterance.rate = 1.05;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Helper to format basic markdown-style blocks, bullets, and bold text
  const renderFormattedText = (rawText: string) => {
    const lines = rawText.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();

      if (!trimmed) {
        return <div key={idx} className="h-2" />;
      }

      // Bullet points
      if (trimmed.startsWith('•') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const content = trimmed.replace(/^([•*-]\s*)/, '');
        return (
          <div key={idx} className="flex items-start gap-2 my-1 pl-1">
            <span className="text-[#ffc606] font-bold text-sm select-none">•</span>
            <span className="flex-1 text-[13.5px] leading-relaxed">
              {parseBoldAndItalics(content)}
            </span>
          </div>
        );
      }

      // Numbered items
      const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
      if (numMatch) {
        return (
          <div key={idx} className="flex items-start gap-2 my-1 pl-1">
            <span className="text-[#11284f] font-semibold text-xs bg-[#ffc606]/30 px-1.5 py-0.5 rounded select-none">
              {numMatch[1]}
            </span>
            <span className="flex-1 text-[13.5px] leading-relaxed">
              {parseBoldAndItalics(numMatch[2])}
            </span>
          </div>
        );
      }

      // Regular paragraph
      return (
        <p key={idx} className="text-[13.5px] leading-relaxed mb-1.5 last:mb-0">
          {parseBoldAndItalics(trimmed)}
        </p>
      );
    });
  };

  // Helper to highlight **bold** and *italic*
  const parseBoldAndItalics = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-slate-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return (
          <em key={i} className="italic text-slate-700">
            {part.slice(1, -1)}
          </em>
        );
      }
      return part;
    });
  };

  return (
    <div className={`flex w-full mb-4.5 ${isBot ? 'justify-start' : 'justify-end'} animate-in fade-in-50 duration-200`}>
      <div className={`flex gap-3 max-w-[92%] sm:max-w-[82%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        {/* Avatar */}
        <div className="flex-shrink-0 mt-1">
          {isBot ? (
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#11284f] text-[#ffc606] flex items-center justify-center font-bold text-xs shadow-md border-2 border-[#ffc606]">
              <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-[#ffc606]" />
            </div>
          ) : (
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-200 text-[#11284f] flex items-center justify-center font-bold text-xs shadow border border-slate-300">
              <User className="w-4 h-4 text-slate-700" />
            </div>
          )}
        </div>

        {/* Content Bubble */}
        <div className="flex flex-col">
          {/* Header Info */}
          <div className={`flex items-center gap-2 mb-1 px-1 text-[11px] ${isBot ? 'justify-start' : 'justify-end'}`}>
            <span className="font-semibold text-slate-700">
              {isBot ? 'MatíasBot • UJMD' : 'Tú (Aspirante)'}
            </span>
            <span className="text-slate-400">{message.timestamp}</span>
          </div>

          {/* Message Body */}
          <div
            className={`rounded-2xl px-4 py-3 shadow-sm ${
              isBot
                ? 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-sm'
                : 'bg-gradient-to-r from-[#11284f] to-[#1c3c72] text-white rounded-tr-sm'
            }`}
          >
            {/* Institutional Official Profile Card when tool is used */}
            {isBot && message.toolUsed && message.toolUsed.result && (() => {
              const res = message.toolUsed.result;
              const carreraName = res.carrera || 'Ciencias de la Comunicación';
              return (
              <div className="mb-4 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden text-xs shadow-sm">
                {/* Header */}
                <div className="bg-[#11284f] text-white p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-[#ffc606] text-[#11284f] flex items-center justify-center font-bold text-xs">
                      <GraduationCap className="w-3.5 h-3.5 text-[#11284f]" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white flex items-center gap-1.5">
                        Ficha Oficial de Carrera • UJMD
                        {res.codigo && (
                          <span className="text-[10px] px-1.5 py-0.2 bg-[#ffc606] text-[#11284f] font-mono font-bold rounded">
                            {res.codigo}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-300">
                        {res.facultad || 'Escuela de Ciencias de la Comunicación'}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-slate-300 hover:text-white flex items-center gap-1 text-[11px] font-medium cursor-pointer"
                  >
                    <span>{showDetails ? 'Ocultar' : 'Ver ficha'}</span>
                    {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {showDetails && (
                  <div className="p-3 space-y-3">
                    {/* Program & Duration */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] bg-white p-2.5 rounded-lg border border-slate-200/80">
                      <div>
                        <span className="text-slate-500 font-medium">Programa:</span>
                        <div className="font-bold text-slate-800">{res.carrera}</div>
                      </div>
                      <div>
                        <span className="text-slate-500 font-medium">Duración & Modalidad:</span>
                        <div className="font-semibold text-slate-700">
                          {res.duracion_anios || 5} años ({res.ciclos_totales || 10} ciclos) • {res.modalidad || 'Presencial'}
                        </div>
                      </div>
                    </div>

                    {/* Costos y Aranceles */}
                    <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg p-2.5">
                      <div className="text-[11px] font-bold text-[#11284f] flex items-center gap-1 mb-1.5">
                        <DollarSign className="w-3.5 h-3.5 text-[#d9a400]" />
                        Costos y Aranceles Oficiales ({res.periodo})
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11.5px]">
                        <div className="bg-white p-2 rounded border border-amber-200/60">
                          <span className="text-[10px] text-slate-500 block">Matrícula Ordinaria</span>
                          <span className="font-bold text-[#11284f] text-sm">
                            ${res.matricula_usd?.toFixed(2)} USD
                          </span>
                          <span className="text-[9.5px] text-slate-500 block">por ciclo</span>
                        </div>
                        <div className="bg-white p-2 rounded border border-amber-200/60">
                          <span className="text-[10px] text-slate-500 block">Cuota Mensual Base</span>
                          <span className="font-bold text-[#11284f] text-sm">
                            ${res.cuota_mensual_usd?.toFixed(2)} USD
                          </span>
                          <span className="text-[9.5px] text-slate-500 block">5 cuotas por ciclo</span>
                        </div>
                        <div className="bg-white p-2 rounded border border-amber-200/60 col-span-2 sm:col-span-1">
                          <span className="text-[10px] text-slate-500 block">Descuento Temprano</span>
                          <span className="font-bold text-emerald-700 text-sm">
                            {res.descuento_temprano_porcentaje || 20}% OFF
                          </span>
                          <span className="text-[9.5px] text-emerald-600 block">
                            Límite: {res.fecha_limite_descuento || '15 de dic 2024'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Requisitos de Ingreso */}
                    {res.requisitos_ingreso && res.requisitos_ingreso.length > 0 && (
                      <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                        <div className="text-[11px] font-bold text-[#11284f] flex items-center gap-1.5 mb-1.5">
                          <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                          Requisitos de Ingreso Oficiales:
                        </div>
                        <ul className="space-y-1">
                          {res.requisitos_ingreso.map((req, rIdx) => (
                            <li key={rIdx} className="flex items-start gap-1.5 text-[11px] text-slate-700">
                              <Check className="w-3 h-3 text-emerald-600 mt-0.5 flex-shrink-0 font-bold" />
                              <span>{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Canales de Atención Oficial */}
                    <div className="bg-slate-100/80 p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-700 space-y-1.5">
                      <div className="font-bold text-[#11284f] text-[11px] flex items-center justify-between">
                        <span>Canales de Atención Oficial</span>
                        <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          En línea
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[10.5px]">
                        <a
                          href={`https://wa.me/50370000000?text=${encodeURIComponent('Hola, me interesa información oficial sobre ' + res.carrera)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => {
                            const sessId = localStorage.getItem('matiasbot_active_session_id') || '';
                            if (sessId) {
                              trackConversion(sessId, 'official_contact_click', 'Clic a WhatsApp Oficial (+503 7000-0000)', res.carrera);
                            }
                          }}
                          className="flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-medium bg-white p-1.5 rounded border border-slate-200"
                        >
                          <Phone className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                          <span>WhatsApp: <strong>+503 7000-0000</strong></span>
                        </a>
                        <a
                          href="mailto:admisiones@ujmd.edu.sv"
                          onClick={() => {
                            const sessId = localStorage.getItem('matiasbot_active_session_id') || '';
                            if (sessId) {
                              trackConversion(sessId, 'official_contact_click', 'Clic a Correo Oficial admisiones@ujmd.edu.sv', res.carrera);
                            }
                          }}
                          className="flex items-center gap-1.5 text-blue-700 hover:text-blue-800 font-medium bg-white p-1.5 rounded border border-slate-200"
                        >
                          <Mail className="w-3 h-3 text-blue-600 flex-shrink-0" />
                          <span>admisiones@ujmd.edu.sv</span>
                        </a>
                        <div className="flex items-center gap-1.5 text-slate-600 col-span-1 sm:col-span-2 px-1">
                          <Clock className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span>{res.canales_atencion_oficial?.horario || 'Lunes a viernes de 8:00 a.m. a 5:00 p.m.'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick action follow-ups */}
                    {onAskFollowUp && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <button
                          onClick={() => onAskFollowUp(`¿Cómo inicio el proceso de matrícula para ${carreraName}?`)}
                          className="px-2.5 py-1 rounded bg-[#11284f] text-[#ffc606] font-semibold text-[10.5px] hover:bg-[#1c3c72] transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <span>Iniciar Matrícula</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => onAskFollowUp(`¿Cuáles son los pasos para agendar un recorrido por el campus para ${carreraName}?`)}
                          className="px-2.5 py-1 rounded bg-white text-slate-700 font-semibold text-[10.5px] border border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Calendar className="w-3 h-3 text-slate-500" />
                          <span>Agendar Recorrido</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              );
            })()}

            {/* Formatted Text */}
            <div className={isBot ? 'text-slate-800' : 'text-slate-100'}>
              {renderFormattedText(message.text)}
            </div>

            {/* Bot Action Footer */}
            {isBot && (
              <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  Verificado • Admisiones UJMD
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSpeak}
                    className="p-1 hover:text-[#11284f] hover:bg-slate-100 rounded transition-colors"
                    title={isSpeaking ? 'Detener lectura' : 'Escuchar respuesta'}
                  >
                    {isSpeaking ? (
                      <VolumeX className="w-3.5 h-3.5 text-rose-500" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600" />
                    )}
                  </button>
                  <button
                    onClick={handleCopy}
                    className="p-1 hover:text-[#11284f] hover:bg-slate-100 rounded transition-colors"
                    title="Copiar texto"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600" />
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
