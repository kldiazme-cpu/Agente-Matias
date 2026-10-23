import React, { useState } from 'react';
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Sparkles, 
  HelpCircle,
  Menu,
  X,
  MessageSquare,
  TrendingUp
} from 'lucide-react';

interface HeaderProps {
  onOpenAranceles: () => void;
  onOpenTour: () => void;
  onOpenVocational: () => void;
  onOpenCareers: () => void;
  onOpenSessions: () => void;
  sessionsCount?: number;
  onOpenConversions: () => void;
  onOpenLocation?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAranceles,
  onOpenTour,
  onOpenVocational,
  onOpenCareers,
  onOpenSessions,
  sessionsCount = 1,
  onOpenConversions,
  onOpenLocation
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#11284f] text-white shadow-lg border-b-4 border-[#ffc606]">
      {/* Top micro-bar with contact and campus */}
      <div className="bg-[#0a1831] text-xs text-slate-300 py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={onOpenLocation}
              className="flex items-center gap-1.5 hover:text-[#ffc606] transition-colors cursor-pointer text-left"
              title="Ver mapa de ubicación de Campus 2 y Campus 1"
            >
              <MapPin className="w-3.5 h-3.5 text-[#ffc606]" />
              <span>Campus 2: Calle El Pedregal • Campus 1: Carr. a Santa Tecla</span>
            </button>
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#ffc606]" />
              PBX: <strong>2212-9400</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#ffc606] font-semibold">WhatsApp:</span>
              <strong className="text-white">+503 7000-0000</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#ffc606]" />
              admisiones@ujmd.edu.sv
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-[#ffc606]/20 text-[#ffc606] border border-[#ffc606]/30">
              Escuela de Ciencias de la Comunicación
            </span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Logo and Titles */}
        <div className="flex items-center gap-4">
          <a 
            href="https://www.ujmd.edu.sv" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center group transition-transform duration-200 hover:scale-102"
            title="Ir al sitio oficial de la UJMD"
          >
            {!logoError ? (
              <img
                src="https://www.ujmd.edu.sv/wp-content/uploads/2022/07/Logo350x100.png"
                alt="Universidad Dr. José Matías Delgado"
                className="h-10 sm:h-12 w-auto object-contain brightness-0 invert"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-[#ffc606] text-[#11284f] font-extrabold flex items-center justify-center text-lg shadow">
                  UJMD
                </div>
                <div>
                  <div className="font-bold text-sm leading-tight text-white tracking-wide">
                    UNIVERSIDAD DR. JOSÉ MATÍAS DELGADO
                  </div>
                  <div className="text-[11px] text-[#ffc606] font-medium">
                    Omnia Cum Honore
                  </div>
                </div>
              </div>
            )}
          </a>

          {/* Vertical divider */}
          <div className="hidden sm:block h-9 w-px bg-slate-500/50" />

          {/* Bot Brand Info */}
          <div className="hidden sm:block">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                MatíasBot
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#ffc606] text-[#11284f]">
                  OFICIAL
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-300 font-normal">
              Orientación Vocacional y Admisiones • Ciencias de la Comunicación
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-2">
          {/* Sessions button */}
          <button
            onClick={onOpenSessions}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-1.5 cursor-pointer border border-white/15"
            title="Ver historial de sesiones de usuario"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#ffc606]" />
            <span>Sesiones</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#ffc606] text-[#11284f] font-mono font-bold">
              {sessionsCount}
            </span>
          </button>

          {/* Conversions Funnel button */}
          <button
            onClick={onOpenConversions}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/50 transition-colors flex items-center gap-1.5 cursor-pointer border border-emerald-500/30"
            title="Panel de conversiones y embudo de admisiones"
          >
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Conversiones</span>
          </button>

          <button
            onClick={onOpenCareers}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-1 cursor-pointer border border-white/10"
          >
            <Building2 className="w-3.5 h-3.5 text-[#ffc606]" />
            Carreras
          </button>

          <button
            onClick={onOpenAranceles}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-1 cursor-pointer border border-white/10"
          >
            <DollarSign className="w-3.5 h-3.5 text-[#ffc606]" />
            Aranceles
          </button>

          <button
            onClick={onOpenVocational}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-1 cursor-pointer border border-white/10"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#ffc606]" />
            Test
          </button>

          <button
            onClick={onOpenLocation}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-white/5 hover:bg-white/10 transition-colors flex items-center gap-1 cursor-pointer border border-white/10"
            title="Ver mapa interactivo de ubicación"
          >
            <MapPin className="w-3.5 h-3.5 text-[#ffc606]" />
            Mapa
          </button>

          <button
            onClick={onOpenTour}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#11284f] bg-[#ffc606] hover:bg-[#e5b205] transition-all duration-150 flex items-center gap-1.5 shadow-md cursor-pointer hover:shadow-lg active:scale-98"
          >
            <Calendar className="w-3.5 h-3.5 text-[#11284f]" />
            Recorrido
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenSessions}
            className="p-1.5 px-2 rounded-lg text-xs font-semibold text-white bg-white/10 flex items-center gap-1 border border-white/20"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#ffc606]" />
            <span>{sessionsCount}</span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-200 hover:text-white hover:bg-white/10"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0d203f] px-4 pt-2 pb-4 border-t border-slate-700/60 space-y-2 animate-in slide-in-from-top duration-200">
          <div className="py-2 text-xs text-slate-300 border-b border-slate-700/50 flex flex-col gap-1">
            <span className="text-[#ffc606] font-semibold">Escuela de Ciencias de la Comunicación</span>
            <span>PBX: 2212-9400 | admisiones@ujmd.edu.sv</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => {
                onOpenSessions();
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 rounded-lg text-xs font-medium text-left text-white bg-white/15 flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-[#ffc606]" />
              Sesiones ({sessionsCount})
            </button>
            <button
              onClick={() => {
                onOpenConversions();
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 rounded-lg text-xs font-medium text-left text-emerald-300 bg-emerald-950/50 border border-emerald-500/30 flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Conversiones
            </button>
            <button
              onClick={() => {
                onOpenLocation?.();
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 rounded-lg text-xs font-medium text-left text-slate-200 bg-white/10 hover:bg-white/15 flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 text-[#ffc606]" />
              Ver Mapa
            </button>
            <button
              onClick={() => {
                onOpenCareers();
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 rounded-lg text-xs font-medium text-left text-slate-200 bg-white/10 hover:bg-white/15 flex items-center gap-2"
            >
              <Building2 className="w-4 h-4 text-[#ffc606]" />
              Carreras
            </button>
            <button
              onClick={() => {
                onOpenAranceles();
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 rounded-lg text-xs font-medium text-left text-slate-200 bg-white/10 hover:bg-white/15 flex items-center gap-2"
            >
              <DollarSign className="w-4 h-4 text-[#ffc606]" />
              Aranceles
            </button>
            <button
              onClick={() => {
                onOpenVocational();
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 rounded-lg text-xs font-medium text-left text-slate-200 bg-white/10 hover:bg-white/15 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#ffc606]" />
              Test Vocacional
            </button>
            <button
              onClick={() => {
                onOpenTour();
                setMobileMenuOpen(false);
              }}
              className="col-span-2 px-3 py-2 rounded-lg text-xs font-semibold text-[#11284f] bg-[#ffc606] hover:bg-[#e5b205] flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-[#11284f]" />
              Agendar Recorrido
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
