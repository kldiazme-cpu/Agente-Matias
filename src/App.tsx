import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { QuickPrompts } from './components/QuickPrompts';
import { ArancelesModal } from './components/ArancelesModal';
import { TourModal } from './components/TourModal';
import { CareersDrawer } from './components/CareersDrawer';
import { VocationalTestModal } from './components/VocationalTestModal';
import { ContactBar } from './components/ContactBar';
import { SessionsDrawer } from './components/SessionsDrawer';
import { ConversionModal } from './components/ConversionModal';
import { Message, LeadFormData, ChatSession, ConversionEvent } from './types';
import { 
  fetchSessions, 
  createSession, 
  fetchSession, 
  updateSession, 
  deleteSession, 
  trackConversion, 
  sendChatMessage, 
  submitLead 
} from './services/api';
import { 
  Bot, 
  Sparkles, 
  ShieldCheck, 
  MessageSquare, 
  TrendingUp, 
  Plus, 
  CheckCircle2, 
  Calendar, 
  User, 
  ArrowRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Phone,
  School,
  Tag
} from 'lucide-react';

const INITIAL_BOT_MESSAGE: Message = {
  id: 'msg-initial',
  role: 'model',
  text: `¡Hola! Soy **MatíasBot**, Agente Oficial de Orientación Vocacional y Admisiones de la Universidad Dr. José Matías Delgado (UJMD). 🎙️✨

Estoy listo para responder todas tus preguntas sobre la universidad:
• **Escuela de Comunicaciones:** Ciencias de la Comunicación (COM-01), Diseño Gráfico y Publicidad.
• **Todas las Facultades UJMD:** Medicina, Arquitectura, Derecho, Ingenierías y Negocios.
• **Aranceles y Becas:** Matrícula ordinaria ($100.00 USD en COM-01), cuotas mensuales y beneficios por pronto pago.
• **Admisiones:** Requisitos oficiales de ingreso, fechas de matrícula y proceso paso a paso.
• **Campus:** Visita guiada a nuestros estudios de TV HD, cabinas de radio y laboratorios Mac.

¿Qué carrera te gustaría explorar hoy o qué consulta tienes en mente?`,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
};

export default function App() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    return localStorage.getItem('matiasbot_active_session_id') || `ses-${Date.now()}`;
  });

  const [applicantProfile, setApplicantProfile] = useState<any>(() => {
    try {
      const stored = localStorage.getItem('matiasbot_applicant_profile');
      return stored ? JSON.parse(stored) : {
        nombreCompleto: 'Camila Rodriguez',
        telefono: '+503 7123-4567',
        bachillerato: 'Colegio Champagnat',
        carreraInteres: 'Licenciatura en Ciencias de la Comunicación',
        ticketId: 'UJMD-782910'
      };
    } catch {
      return {
        nombreCompleto: 'Camila Rodriguez',
        telefono: '+503 7123-4567',
        bachillerato: 'Colegio Champagnat',
        carreraInteres: 'Licenciatura en Ciencias de la Comunicación',
        ticketId: 'UJMD-782910'
      };
    }
  });

  const [isContextDrawerOpen, setIsContextDrawerOpen] = useState(false);

  const [messages, setMessages] = useState<Message[]>([INITIAL_BOT_MESSAGE]);
  const [sessionTitle, setSessionTitle] = useState<string>('Orientación Vocacional UJMD');
  const [isLoading, setIsLoading] = useState(false);

  // Modals and Drawers
  const [isSessionsOpen, setIsSessionsOpen] = useState(false);
  const [isConversionsOpen, setIsConversionsOpen] = useState(false);
  const [isArancelesOpen, setIsArancelesOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isCareersOpen, setIsCareersOpen] = useState(false);
  const [isVocationalOpen, setIsVocationalOpen] = useState(false);
  const [selectedTourCareer, setSelectedTourCareer] = useState<string | undefined>(undefined);

  // Conversion Toast feedback
  const [conversionToast, setConversionToast] = useState<{ label: string; visible: boolean }>({
    label: '',
    visible: false
  });

  const chatBottomRef = useRef<HTMLDivElement>(null);

  const showConversionToast = (label: string) => {
    setConversionToast({ label, visible: true });
    setTimeout(() => {
      setConversionToast((prev) => ({ ...prev, visible: false }));
    }, 3500);
  };

  // Load sessions from server on mount
  useEffect(() => {
    const initSessions = async () => {
      const serverSessions = await fetchSessions();
      if (serverSessions && serverSessions.length > 0) {
        setSessions(serverSessions);
        // Find if active session exists on server
        const found = serverSessions.find((s) => s.id === activeSessionId);
        if (found) {
          const fullSession = await fetchSession(found.id);
          if (fullSession && fullSession.messages && fullSession.messages.length > 0) {
            setMessages(fullSession.messages);
            setSessionTitle(fullSession.title);
            if (fullSession.userProfile?.nombreCompleto) {
              setApplicantProfile(fullSession.userProfile);
              localStorage.setItem('matiasbot_applicant_profile', JSON.stringify(fullSession.userProfile));
            }
          }
        } else {
          // Select first session from server
          const first = serverSessions[0];
          setActiveSessionId(first.id);
          localStorage.setItem('matiasbot_active_session_id', first.id);
          const fullSession = await fetchSession(first.id);
          if (fullSession && fullSession.messages && fullSession.messages.length > 0) {
            setMessages(fullSession.messages);
            setSessionTitle(fullSession.title);
            if (fullSession.userProfile?.nombreCompleto) {
              setApplicantProfile(fullSession.userProfile);
              localStorage.setItem('matiasbot_applicant_profile', JSON.stringify(fullSession.userProfile));
            }
          }
        }
      } else {
        // Create initial session on server inheriting default applicant profile
        const created = await createSession('Bienvenida & Orientación Vocacional', 'Licenciatura en Ciencias de la Comunicación', applicantProfile);
        if (created) {
          setSessions([created]);
          setActiveSessionId(created.id);
          localStorage.setItem('matiasbot_active_session_id', created.id);
          setMessages(created.messages || [INITIAL_BOT_MESSAGE]);
          setSessionTitle(created.title);
        }
      }
    };
    initSessions();
  }, []);

  // Save active session ID to localStorage
  useEffect(() => {
    if (activeSessionId) {
      localStorage.setItem('matiasbot_active_session_id', activeSessionId);
    }
  }, [activeSessionId]);

  // Scroll to bottom on new message
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Switch to an existing session
  const handleSelectSession = async (id: string) => {
    setActiveSessionId(id);
    setIsLoading(true);
    const full = await fetchSession(id);
    if (full) {
      setMessages(full.messages && full.messages.length > 0 ? full.messages : [INITIAL_BOT_MESSAGE]);
      setSessionTitle(full.title);
      if (full.userProfile?.nombreCompleto) {
        setApplicantProfile(full.userProfile);
        localStorage.setItem('matiasbot_applicant_profile', JSON.stringify(full.userProfile));
      }
    }
    setIsLoading(false);
  };

  // Start a fresh user session with inherited context
  const handleNewSession = async () => {
    const newTitle = `Consulta #${sessions.length + 1}`;
    const careerInterest = applicantProfile?.carreraInteres || 'Licenciatura en Ciencias de la Comunicación';
    const created = await createSession(newTitle, careerInterest, applicantProfile);
    if (created) {
      setSessions((prev) => [created, ...prev]);
      setActiveSessionId(created.id);
      setMessages(created.messages && created.messages.length > 0 ? created.messages : [INITIAL_BOT_MESSAGE]);
      setSessionTitle(created.title);
      showConversionToast('Nueva sesión creada (manteniendo contexto del aspirante)');
    }
  };

  // Rename a session
  const handleRenameSession = async (id: string, newTitle: string) => {
    setSessions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title: newTitle } : s))
    );
    if (id === activeSessionId) {
      setSessionTitle(newTitle);
    }
    await updateSession(id, { title: newTitle });
  };

  // Delete a session
  const handleDeleteSession = async (id: string) => {
    const ok = await deleteSession(id);
    if (ok) {
      const remaining = sessions.filter((s) => s.id !== id);
      setSessions(remaining);
      if (id === activeSessionId && remaining.length > 0) {
        handleSelectSession(remaining[0].id);
      } else if (remaining.length === 0) {
        handleNewSession();
      }
    }
  };

  // Send message with session attribution, conversational context memory and auto-conversion detection
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const payloadMessages = newMessages.map((m) => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));

      const activeSession = sessions.find((s) => s.id === activeSessionId);
      const effectiveProfile = {
        ...applicantProfile,
        ...(activeSession?.userProfile || {})
      };

      const data = await sendChatMessage(
        payloadMessages, 
        activeSessionId, 
        effectiveProfile,
        activeSession?.conversions
      );

      const botReply: Message = {
        id: `bot-${Date.now()}`,
        role: 'model',
        text: data.reply || 'Disculpa, no dispongo de ese dato en este momento. Te invito a comunicarte con Admisiones al PBX 2212-9400 o escribir a admisiones@ujmd.edu.sv.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        toolUsed: data.toolUsed || null,
        locationMap: data.locationMap || (data.toolUsed?.name === 'mostrar_mapa_ubicacion' ? data.toolUsed.result : null)
      };

      setMessages((prev) => [...prev, botReply]);

      if (data.sessionTitle) {
        setSessionTitle(data.sessionTitle);
        setSessions((prev) =>
          prev.map((s) => (s.id === activeSessionId ? { ...s, title: data.sessionTitle } : s))
        );
      }

      // Sync updated applicant context from server if returned
      if (data.applicantContext?.nombreCompleto) {
        setApplicantProfile((prev: any) => {
          const merged = {
            ...prev,
            nombreCompleto: data.applicantContext.nombreCompleto || prev.nombreCompleto,
            telefono: data.applicantContext.telefono || prev.telefono,
            bachillerato: data.applicantContext.bachillerato || prev.bachillerato,
            carreraInteres: data.applicantContext.carreraInteres || prev.carreraInteres,
            ticketId: data.applicantContext.ticketId || prev.ticketId
          };
          localStorage.setItem('matiasbot_applicant_profile', JSON.stringify(merged));
          return merged;
        });
      }

      // Check if auto-conversions were triggered
      if (data.autoConversions && data.autoConversions.length > 0) {
        data.autoConversions.forEach((conv: ConversionEvent) => {
          showConversionToast(`🎯 Embudo: ${conv.label}`);
        });
        // refresh sessions to reflect badges
        const updatedSessions = await fetchSessions();
        if (updatedSessions) setSessions(updatedSessions);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        role: 'model',
        text: 'Disculpa, no dispongo de ese dato en este momento. Te invito a comunicarte con Admisiones al PBX 2212-9400 o escribir a admisiones@ujmd.edu.sv.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    handleNewSession();
  };

  // Submit Lead & Tour request
  const handleLeadSubmit = async (data: LeadFormData) => {
    const resData = await submitLead(data, activeSessionId);

    // Track conversions
    await trackConversion(
      activeSessionId,
      'lead_captured',
      `Lead Registrado: ${data.nombreCompleto}`,
      data.carreraInteres,
      { telefono: data.telefono, bachillerato: data.bachillerato, ticketId: resData.ticketId }
    );

    if (data.tipoSolicitud?.toLowerCase().includes('recorrido')) {
      await trackConversion(
        activeSessionId,
        'tour_scheduled',
        `Recorrido Agendado: ${data.nombreCompleto}`,
        data.carreraInteres
      );
    }

    const updatedProfile = {
      nombreCompleto: data.nombreCompleto,
      telefono: data.telefono,
      bachillerato: data.bachillerato,
      carreraInteres: data.carreraInteres,
      ticketId: resData.ticketId
    };
    setApplicantProfile(updatedProfile);
    localStorage.setItem('matiasbot_applicant_profile', JSON.stringify(updatedProfile));

    showConversionToast(`⭐ ¡Lead Cualificado Registrado! Ticket: ${resData.ticketId}`);

    // Insert lead acknowledgement message into chat
    const leadNoticeMessage: Message = {
      id: `lead-user-${Date.now()}`,
      role: 'user',
      text: `Hola MatíasBot, acabo de registrar mi solicitud de ${data.tipoSolicitud}. Mi nombre es ${data.nombreCompleto}, mi teléfono es ${data.telefono}, provengo de ${data.bachillerato} y me interesa ${data.carreraInteres}.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const leadBotReply: Message = {
      id: `lead-bot-${Date.now()}`,
      role: 'model',
      text: `¡Excelente noticia, **${data.nombreCompleto}**! 🎉 He recibido tus datos de contacto oficiales y tu registro en el sistema de admisiones UJMD.
      
• **Ticket Oficial:** \`${resData.ticketId || 'UJMD-VERIFICADO'}\`
• **Carrera elegida:** ${data.carreraInteres}
• **Colegio:** ${data.bachillerato}
• **Teléfono de contacto:** ${data.telefono}

Como ya tenemos todo tu expediente guardado, no tendrás que volver a proporcionar estos datos. Un asesor de la Escuela de Ciencias de la Comunicación de la UJMD se comunicará contigo vía WhatsApp o llamada para coordinar tu recorrido y formalizar tu matrícula con el descuento temprano del 20%. ¡Será un gusto darte la bienvenida al Campus Dr. Luis Edmundo Vásquez! 🎓`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, leadNoticeMessage, leadBotReply]);

    // Refresh sessions to show lead captured status badge
    const updated = await fetchSessions();
    if (updated) setSessions(updated);
  };

  const handleOpenTourWithCareer = (careerName: string) => {
    setSelectedTourCareer(careerName);
    setIsTourOpen(true);
  };

  const currentSession = sessions.find((s) => s.id === activeSessionId);
  const effectiveProfile = {
    ...applicantProfile,
    ...(currentSession?.userProfile || {})
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#ffc606] selection:text-[#11284f]">
      {/* Official Header */}
      <Header
        onOpenAranceles={() => {
          setIsArancelesOpen(true);
          trackConversion(activeSessionId, 'view_aranceles', 'Consulta de Aranceles Oficiales');
        }}
        onOpenTour={() => {
          setSelectedTourCareer(undefined);
          setIsTourOpen(true);
        }}
        onOpenVocational={() => setIsVocationalOpen(true)}
        onOpenCareers={() => setIsCareersOpen(true)}
        onOpenSessions={() => setIsSessionsOpen(true)}
        sessionsCount={sessions.length || 1}
        onOpenConversions={() => setIsConversionsOpen(true)}
        onOpenLocation={() => handleSendMessage('¿Dónde está ubicada la Universidad Dr. José Matías Delgado? Muéstrame el mapa de ubicación del Campus y cómo llegar.')}
      />

      {/* Floating Conversion Toast */}
      {conversionToast.visible && (
        <div className="fixed top-16 right-4 z-50 animate-in slide-in-from-top-3 fade-in duration-300">
          <div className="bg-[#11284f] text-white px-4 py-2.5 rounded-xl shadow-xl border border-[#ffc606] flex items-center gap-2.5 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <TrendingUp className="w-4 h-4 text-[#ffc606]" />
            <span>{conversionToast.label}</span>
          </div>
        </div>
      )}

      {/* Session Context Bar & Conversion Funnel Status */}
      <div className="bg-white border-b border-slate-200 py-2 px-4 shadow-2xs">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          {/* Left: Active session info */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSessionsOpen(true)}
              className="font-bold text-[#11284f] hover:text-[#1c3c72] flex items-center gap-1.5 transition-colors cursor-pointer group"
              title="Abrir historial de sesiones"
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#d9a400] group-hover:scale-110 transition-transform" />
              <span className="truncate max-w-[200px] sm:max-w-[260px]">{sessionTitle}</span>
            </button>

            {currentSession?.status === 'lead_capturado' && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                <User className="w-2.5 h-2.5 text-amber-700" />
                Lead Registrado
              </span>
            )}

            {currentSession?.status === 'tour_agendado' && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                <Calendar className="w-2.5 h-2.5 text-emerald-700" />
                Tour Agendado
              </span>
            )}
          </div>

          {/* Right: Funnel status & New Session shortcut */}
          <div className="flex items-center gap-2.5 text-[11px]">
            <button
              onClick={() => setIsConversionsOpen(true)}
              className="text-emerald-700 hover:text-emerald-800 font-medium flex items-center gap-1 cursor-pointer bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors"
            >
              <TrendingUp className="w-3 h-3 text-emerald-600" />
              <span>Embudo: {currentSession?.conversions?.length || 0} hitos</span>
            </button>

            <button
              onClick={handleNewSession}
              className="text-[#11284f] hover:text-[#1c3c72] font-semibold flex items-center gap-1 cursor-pointer bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg transition-colors"
              title="Iniciar nueva sesión"
            >
              <Plus className="w-3 h-3" />
              <span>Nueva</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Applicant & Conversion Context Memory Bar */}
      {effectiveProfile?.nombreCompleto && (
        <div className="bg-gradient-to-r from-[#0d1e3a] via-[#11284f] to-[#1a386b] text-white border-b-2 border-[#ffc606] shadow-xs">
          <div className="max-w-4xl mx-auto px-4 py-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ffc606] text-[#11284f] font-bold text-[10px] shadow-xs">
                  <Sparkles className="w-3 h-3 text-[#11284f]" />
                  Memoria de Conversiones Activa
                </span>
                <span className="text-slate-200">
                  Aspirante: <strong className="text-white">{effectiveProfile.nombreCompleto}</strong>
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-200">
                  {effectiveProfile.carreraInteres || 'Ciencias de la Comunicación'}
                </span>
                {effectiveProfile.ticketId && (
                  <span className="px-1.5 py-0.2 rounded bg-white/10 font-mono text-[11px] text-emerald-300 font-semibold border border-white/10">
                    Ticket: {effectiveProfile.ticketId}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsContextDrawerOpen(!isContextDrawerOpen)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[#ffc606] font-semibold text-[11px] transition-colors cursor-pointer"
                >
                  <span>{isContextDrawerOpen ? 'Ocultar Contexto' : 'Ver Memoria Guardada'}</span>
                  {isContextDrawerOpen ? (
                    <ChevronUp className="w-3 h-3" />
                  ) : (
                    <ChevronDown className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>

            {/* Expandable Context Details & Quick Recall Actions */}
            {isContextDrawerOpen && (
              <div className="mt-2.5 pt-2.5 border-t border-white/15 animate-in slide-in-from-top-1 duration-150">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] bg-black/25 p-2.5 rounded-xl border border-white/10">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Contacto Registrado</span>
                    <span className="text-white font-medium flex items-center gap-1 mt-0.5">
                      <Phone className="w-3 h-3 text-[#ffc606]" />
                      {effectiveProfile.telefono || '+503 7123-4567'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Procedencia</span>
                    <span className="text-white font-medium flex items-center gap-1 mt-0.5">
                      <School className="w-3 h-3 text-[#ffc606]" />
                      {effectiveProfile.bachillerato || 'Colegio Champagnat'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Hitos de Conversión</span>
                    <span className="text-emerald-300 font-semibold flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      {currentSession?.conversions?.length || 3} eventos recordados
                    </span>
                  </div>
                </div>

                <div className="mt-2.5">
                  <span className="text-[10px] text-amber-200 font-bold block mb-1.5">
                    💡 Preguntas para verificar continuidad (MatíasBot ya conoce tus datos y no te los volverá a pedir):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      {
                        label: '¿Qué sigue después de registrarme?',
                        query: 'Ya me registré con mis datos, ¿cuál es el siguiente paso para mi admisión?'
                      },
                      {
                        label: '¿Tienen guardado mi ticket y expediente?',
                        query: '¿Tienen registrado mi número de ticket y mis datos de contacto?'
                      },
                      {
                        label: '¿Cuánto pago con el 20% de descuento en COM-01?',
                        query: '¿Cuánto pagaría de matrícula y cuota con el descuento temprano del 20% en COM-01?'
                      },
                      {
                        label: '¿A qué hora es mi visita al campus?',
                        query: '¿Cuáles son los horarios y lugar para mi recorrido por el campus y estudios de TV?'
                      }
                    ].map((chip, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendMessage(chip.query)}
                        className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-[#ffc606] hover:text-[#11284f] text-slate-200 text-[10px] font-medium border border-white/20 transition-all cursor-pointer"
                      >
                        {chip.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Chat Container */}
      <main className="flex-1 flex flex-col max-w-4xl w-full mx-auto p-3 sm:p-5 chat-scroll">
        <div className="flex-1 flex flex-col justify-between">
          {/* Chat Messages */}
          <div className="space-y-1 pb-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                onAskFollowUp={handleSendMessage}
              />
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-start gap-3 mb-4 animate-in fade-in duration-200">
                <div className="w-8 h-8 rounded-full bg-[#11284f] text-[#ffc606] flex items-center justify-center font-bold text-xs shadow-md border-2 border-[#ffc606] flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-[#ffc606]" />
                </div>
                <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 border border-slate-200 shadow-sm flex items-center gap-3 text-xs text-slate-600">
                  <div className="flex gap-1.5 items-center">
                    <span className="w-2 h-2 rounded-full bg-[#ffc606] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[#11284f] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-[#ffc606] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="font-medium text-slate-500">
                    MatíasBot está formulando tu respuesta institucional...
                  </span>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>
        </div>
      </main>

      {/* Quick Prompts Bar */}
      <QuickPrompts
        onSelectPrompt={handleSendMessage}
        disabled={isLoading}
      />

      {/* Chat Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        onResetChat={handleResetChat}
      />

      {/* Contact & Admissions Bar */}
      <ContactBar
        onOpenTour={() => {
          setSelectedTourCareer(undefined);
          setIsTourOpen(true);
        }}
        onOpenAranceles={() => {
          setIsArancelesOpen(true);
          trackConversion(activeSessionId, 'view_aranceles', 'Consulta de Aranceles Oficiales');
        }}
      />

      {/* Sessions Drawer */}
      <SessionsDrawer
        isOpen={isSessionsOpen}
        onClose={() => setIsSessionsOpen(false)}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={handleSelectSession}
        onNewSession={handleNewSession}
        onDeleteSession={handleDeleteSession}
        onRenameSession={handleRenameSession}
        onOpenConversionsModal={() => setIsConversionsOpen(true)}
      />

      {/* Conversion & Funnel Analytics Modal */}
      <ConversionModal
        isOpen={isConversionsOpen}
        onClose={() => setIsConversionsOpen(false)}
        onSelectPrompt={handleSendMessage}
      />

      {/* Aranceles Modal */}
      <ArancelesModal
        isOpen={isArancelesOpen}
        onClose={() => setIsArancelesOpen(false)}
        onSelectCareerPrompt={handleSendMessage}
        onOpenTour={() => {
          setSelectedTourCareer(undefined);
          setIsTourOpen(true);
        }}
      />

      {/* Tour / Enrollment Lead Modal */}
      <TourModal
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onSubmitLead={handleLeadSubmit}
        preselectedCareer={selectedTourCareer}
      />

      {/* Careers Drawer */}
      <CareersDrawer
        isOpen={isCareersOpen}
        onClose={() => setIsCareersOpen(false)}
        onSelectCareerPrompt={handleSendMessage}
        onOpenTourWithCareer={handleOpenTourWithCareer}
      />

      {/* Vocational Diagnostic Modal */}
      <VocationalTestModal
        isOpen={isVocationalOpen}
        onClose={() => setIsVocationalOpen(false)}
        onCompleteTest={(career, query) => {
          trackConversion(activeSessionId, 'vocational_test_completed', `Test Vocacional: ${career}`, career);
          showConversionToast(`🎯 Test Vocacional Completado: ${career}`);
          handleSendMessage(query);
        }}
      />
    </div>
  );
}
