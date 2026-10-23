import React, { useState } from 'react';
import { 
  X, 
  MessageSquare, 
  Plus, 
  Search, 
  Trash2, 
  Edit2, 
  Check, 
  Calendar, 
  Sparkles, 
  User, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  Tag
} from 'lucide-react';
import { ChatSession } from '../types';

interface SessionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string) => void;
  onRenameSession: (id: string, newTitle: string) => void;
  onOpenConversionsModal: () => void;
}

export const SessionsDrawer: React.FC<SessionsDrawerProps> = ({
  isOpen,
  onClose,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  onRenameSession,
  onOpenConversionsModal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  if (!isOpen) return null;

  const filteredSessions = sessions.filter(s =>
    s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.carreraInteres && s.carreraInteres.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (s.userProfile?.nombreCompleto && s.userProfile.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const startEdit = (s: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(s.id);
    setEditTitle(s.title);
  };

  const saveEdit = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      onRenameSession(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'lead_capturado':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
            <User className="w-2.5 h-2.5 text-amber-700" />
            Lead Registrado
          </span>
        );
      case 'tour_agendado':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200">
            <Calendar className="w-2.5 h-2.5 text-emerald-700" />
            Tour Agendado
          </span>
        );
      case 'matricula_iniciada':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200">
            <CheckCircle2 className="w-2.5 h-2.5 text-blue-700" />
            Matrícula
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Activa
          </span>
        );
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const now = new Date();
      const isToday = d.toDateString() === now.toDateString();
      if (isToday) {
        return `Hoy, ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }
      return d.toLocaleDateString([], { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-start bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-r border-slate-200 animate-in slide-in-from-left duration-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#11284f] text-white p-4.5 flex items-center justify-between border-b-4 border-[#ffc606]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#ffc606] text-[#11284f] flex items-center justify-center font-bold shadow">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Historial de Sesiones
                <span className="text-[11px] px-1.5 py-0.2 bg-[#ffc606] text-[#11284f] font-mono font-bold rounded">
                  {sessions.length}
                </span>
              </h2>
              <p className="text-[11px] text-slate-300">Aspirantes & Consultas Vocacionales UJMD</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar */}
        <div className="p-3.5 border-b border-slate-200 bg-slate-50 space-y-2.5">
          <button
            onClick={() => {
              onNewSession();
              onClose();
            }}
            className="w-full py-2 px-3 rounded-xl bg-[#11284f] hover:bg-[#1c3c72] text-[#ffc606] text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#ffc606]" />
            <span>Nueva Consulta de Orientación</span>
          </button>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por carrera, tema o nombre..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#11284f]"
            />
          </div>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto chat-scroll p-3 space-y-2">
          {filteredSessions.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
              <p className="font-semibold text-slate-600">No se encontraron sesiones</p>
              <p className="text-[11px] mt-0.5">Inicia una nueva consulta con MatíasBot.</p>
            </div>
          ) : (
            filteredSessions.map((session) => {
              const isActive = session.id === activeSessionId;
              const isEditing = editingId === session.id;

              return (
                <div
                  key={session.id}
                  onClick={() => {
                    onSelectSession(session.id);
                    onClose();
                  }}
                  className={`p-3 rounded-xl border transition-all cursor-pointer relative group ${
                    isActive
                      ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-300 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <div className="flex items-center gap-1 my-0.5" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="text-xs font-semibold px-2 py-0.5 border border-slate-300 rounded bg-white w-full focus:outline-none"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEdit(session.id, e as any);
                              if (e.key === 'Escape') setEditingId(null);
                            }}
                          />
                          <button
                            onClick={(e) => saveEdit(session.id, e)}
                            className="p-1 rounded bg-[#11284f] text-[#ffc606]"
                          >
                            <Check className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <h3 className={`text-xs font-bold truncate ${isActive ? 'text-[#11284f]' : 'text-slate-800'}`}>
                            {session.title}
                          </h3>
                          {isActive && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" title="Sesión activa" />
                          )}
                        </div>
                      )}

                      {/* User Profile details if captured */}
                      {session.userProfile?.nombreCompleto && (
                        <div className="text-[11px] text-slate-600 font-medium mt-0.5 flex items-center gap-1">
                          <User className="w-3 h-3 text-slate-400" />
                          <span>{session.userProfile.nombreCompleto}</span>
                          {session.userProfile.ticketId && (
                            <span className="text-[10px] font-mono px-1 rounded bg-slate-100 text-slate-600 border border-slate-200">
                              {session.userProfile.ticketId}
                            </span>
                          )}
                          {session.userProfile.bachillerato && (
                            <span className="text-slate-400">• {session.userProfile.bachillerato}</span>
                          )}
                        </div>
                      )}

                      {/* Conversion milestone tags */}
                      {session.conversions && session.conversions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {session.conversions.slice(0, 3).map((conv, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-0.5 text-[9px] px-1.5 py-0.2 rounded-full bg-amber-50 text-amber-900 border border-amber-200 font-medium"
                            >
                              <Tag className="w-2.5 h-2.5 text-amber-700" />
                              <span className="truncate max-w-[130px]">{conv.label.replace('Consulta de ', '').replace('Consulta ', '')}</span>
                            </span>
                          ))}
                          {session.conversions.length > 3 && (
                            <span className="text-[9px] text-slate-400 font-medium self-center">
                              +{session.conversions.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Last message preview */}
                      <p className="text-[11px] text-slate-500 truncate mt-1">
                        {session.messages && session.messages.length > 0
                          ? session.messages[session.messages.length - 1].text.replace(/[*#_]/g, '')
                          : 'Sin mensajes'}
                      </p>

                      {/* Metadata footer */}
                      <div className="flex flex-wrap items-center gap-2 mt-2 pt-1.5 border-t border-slate-100 text-[10px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(session.updatedAt || session.createdAt)}
                        </span>
                        <span>•</span>
                        <span>{session.messages?.length || 0} mensajes</span>

                        {session.conversions && session.conversions.length > 0 && (
                          <>
                            <span>•</span>
                            <span className="text-amber-800 font-semibold flex items-center gap-0.5">
                              <Sparkles className="w-2.5 h-2.5 text-[#d9a400]" />
                              {session.conversions.length} conversiones
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Right action tools */}
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      {getStatusBadge(session.status)}

                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => startEdit(session, e)}
                          title="Renombrar título"
                          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        {sessions.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`¿Deseas eliminar la sesión "${session.title}"?`)) {
                                onDeleteSession(session.id);
                              }
                            }}
                            title="Eliminar sesión"
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Funnel Quick Link */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <button
            onClick={() => {
              onClose();
              onOpenConversionsModal();
            }}
            className="w-full py-2 px-3 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-[#11284f] font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <TrendingUp className="w-3.5 h-3.5 text-[#ffc606]" />
            <span>Ver Embudo de Conversiones UJMD</span>
          </button>
        </div>
      </div>

      {/* Backdrop closer */}
      <div className="flex-1" onClick={onClose} />
    </div>
  );
};
