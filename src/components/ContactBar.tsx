import React from 'react';
import { Phone, Mail, MapPin, Clock, Calendar, MessageSquare } from 'lucide-react';

interface ContactBarProps {
  onOpenTour: () => void;
  onOpenAranceles: () => void;
}

export const ContactBar: React.FC<ContactBarProps> = ({ onOpenTour, onOpenAranceles }) => {
  return (
    <div className="bg-[#11284f] text-white py-3 px-4 border-t border-[#ffc606]/30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-1.5 text-slate-300">
          <div className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-[#ffc606]" />
            <span>PBX: <strong className="text-white">2212-9400</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[#ffc606] font-bold">WhatsApp Oficial:</span>
            <strong className="text-white">+503 7000-0000</strong>
          </div>
          <div className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-[#ffc606]" />
            <a href="mailto:admisiones@ujmd.edu.sv" className="hover:underline text-slate-200">
              admisiones@ujmd.edu.sv
            </a>
          </div>
          <div className="hidden sm:flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#ffc606]" />
            <span>Lun a Vie de 8:00 a.m. a 5:00 p.m.</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAranceles}
            className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-medium transition-colors"
          >
            Ver Aranceles
          </button>
          <button
            onClick={onOpenTour}
            className="px-3 py-1 rounded-lg bg-[#ffc606] text-[#11284f] text-xs font-bold hover:bg-[#e5b205] transition-colors shadow-xs"
          >
            Agendar Recorrido
          </button>
        </div>
      </div>
    </div>
  );
};
