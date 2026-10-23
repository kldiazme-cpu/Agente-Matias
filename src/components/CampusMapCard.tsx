import React, { useState } from 'react';
import { LocationMapData } from '../types';
import { trackConversion } from '../services/api';
import {
  MapPin,
  Navigation,
  Compass,
  Bus,
  Car,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Building2,
  Calendar,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface CampusMapCardProps {
  initialData?: LocationMapData;
  onAskFollowUp?: (query: string) => void;
}

export const CampusMapCard: React.FC<CampusMapCardProps> = ({ initialData, onAskFollowUp }) => {
  const [activeCampus, setActiveCampus] = useState<'campus_2' | 'campus_1'>('campus_2');
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const campus2Data = {
    nombre: 'Campus 2 • Escuela de Ciencias de la Comunicación & Diseño',
    subtitulo: 'Facultad de Ciencias y Artes "Francisco Gavidia"',
    direccion: 'Calle El Pedregal, Antiguo Cuscatlán, La Libertad, El Salvador',
    referencia: 'Frente a Centro Comercial Las Cascadas y a 300 m de Multiplaza.',
    embedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3876.6277235809916!2d-89.25731382514549!3d13.680386486704101!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f632e2d37310897%3A0xbc673edf2d183e74!2sUniversidad%20Dr.%20Jos%C3%A9%20Mat%C3%ADas%20Delgado%20%7C%20Campus%202!5e0!3m2!1ses!2ssv!4v1792714774346!5m2!1ses!2ssv',
    googleMapsUrl: 'https://maps.google.com/?q=Universidad+Dr.+Jos%C3%A9+Mat%C3%ADas+Delgado+Campus+2',
    wazeUrl: 'https://www.waze.com/ul?ll=13.680386,-89.257314&navigate=yes',
    facultades: [
      'Escuela de Ciencias de la Comunicación (Estudios de TV y Radio)',
      'Licenciatura en Diseño Gráfico & Talleres Mac',
      'Licenciatura en Publicidad y Mercadeo',
      'Arquitectura de Interiores y Diseño de Productos'
    ],
    buses: ['Ruta 101-D', 'Ruta 42-B', 'Ruta 44', 'Ruta 101-B'],
    parqueo: 'Parqueo amplio vigilado ($0.75 USD por ingreso)',
    horario: 'Lunes a viernes: 7:00 a.m. a 7:30 p.m. • Sábados: 7:30 a.m. a 1:00 p.m.'
  };

  const campus1Data = {
    nombre: 'Campus 1 • Rectoría & Campus Principal "Dr. Luis Edmundo Vásquez"',
    subtitulo: 'Salud, Jurisprudencia, Ingeniería, Arquitectura y Economía',
    direccion: 'Km 8 ½ Carretera Panamericana a Santa Tecla, Antiguo Cuscatlán, La Libertad',
    referencia: 'Sobre Carretera Panamericana, contiguo a Cancillería de la República.',
    embedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3876.671392683935!2d-89.26259972514555!3d13.67873108670566!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f632e2fafe8b8e3%3A0xd68019e075c32bca!2sUniversidad%20Dr.%20Jos%C3%A9%20Mat%C3%ADas%20Delgado!5e0!3m2!1ses!2ssv!4v1792714850000!5m2!1ses!2ssv',
    googleMapsUrl: 'https://maps.google.com/?q=Universidad+Dr.+Jos%C3%A9+Mat%C3%ADas+Delgado+Campus+1',
    wazeUrl: 'https://www.waze.com/ul?ll=13.678731,-89.262600&navigate=yes',
    facultades: [
      'Facultad de Ciencias de la Salud (Doctorado en Medicina y Enfermería)',
      'Facultad de Jurisprudencia y Ciencias Sociales (Derecho)',
      'Facultad de Ingeniería y Arquitectura',
      'Facultad de Economía, Empresa y Negocios',
      'Edificio de Rectoría y Oficinas Centrales de Admisiones'
    ],
    buses: ['Ruta 101-A', 'Ruta 101-B', 'Ruta 79', 'Ruta 42-A'],
    parqueo: 'Edificio de estacionamiento institucional ($0.75 USD)',
    horario: 'Lunes a viernes: 7:00 a.m. a 6:00 p.m. • Sábados: 8:00 a.m. a 12:00 m.'
  };

  const currentCampus = activeCampus === 'campus_2' ? campus2Data : campus1Data;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(`${currentCampus.nombre}: ${currentCampus.direccion} (${currentCampus.referencia})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleExternalNav = (service: 'google' | 'waze') => {
    const sessId = localStorage.getItem('matiasbot_active_session_id') || '';
    if (sessId) {
      trackConversion(
        sessId,
        'view_location_map',
        `Clic navegación ${service === 'google' ? 'Google Maps' : 'Waze'} (${activeCampus})`,
        'Campus UJMD'
      );
    }
  };

  return (
    <div className="mb-4 rounded-xl bg-white border border-slate-200 overflow-hidden shadow-sm transition-all text-xs">
      {/* Institutional Top Banner */}
      <div className="bg-[#11284f] text-white p-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#ffc606] text-[#11284f] flex items-center justify-center font-bold shadow-xs flex-shrink-0">
            <MapPin className="w-4 h-4 text-[#11284f]" />
          </div>
          <div>
            <div className="font-bold text-xs text-white flex items-center gap-1.5">
              <span>Ubicación y Mapa Oficial • UJMD</span>
              <span className="text-[10px] bg-[#ffc606]/20 border border-[#ffc606]/40 text-[#ffc606] px-1.5 py-0.5 rounded font-medium">
                Antiguo Cuscatlán
              </span>
            </div>
            <p className="text-[10.5px] text-slate-300">
              Universidad Dr. José Matías Delgado • El Salvador
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-slate-300 hover:text-white flex items-center gap-1 text-[11px] font-medium cursor-pointer p-1 rounded hover:bg-white/10"
          title={isExpanded ? 'Contraer mapa' : 'Expandir mapa'}
        >
          <span>{isExpanded ? 'Ocultar' : 'Ver mapa'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Campus Selector Tabs */}
      <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveCampus('campus_2')}
          className={`flex-1 py-2 px-3 text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer border-b-2 ${
            activeCampus === 'campus_2'
              ? 'border-[#ffc606] bg-white text-[#11284f] font-bold shadow-xs'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-[#ffc606]" />
          <span>Campus 2 (Comunicaciones & Diseño)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveCampus('campus_1')}
          className={`flex-1 py-2 px-3 text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer border-b-2 ${
            activeCampus === 'campus_1'
              ? 'border-[#ffc606] bg-white text-[#11284f] font-bold shadow-xs'
              : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-blue-600" />
          <span>Campus 1 (Principal / Medicina / Rectoría)</span>
        </button>
      </div>

      {isExpanded && (
        <div className="p-3 space-y-3">
          {/* Active Campus Info Bar */}
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-bold text-slate-900 text-[12.5px] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  {currentCampus.nombre}
                </h4>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  <strong>Dirección:</strong> {currentCampus.direccion}
                </p>
                <p className="text-[10.5px] text-slate-500 mt-0.5">
                  <strong>Referencia:</strong> {currentCampus.referencia}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopyAddress}
                className="self-start sm:self-center flex items-center gap-1 px-2.5 py-1.5 bg-white border border-slate-200 hover:border-slate-300 rounded text-slate-700 font-medium text-[11px] transition-colors cursor-pointer shadow-xs"
                title="Copiar dirección completa al portapapeles"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-semibold">¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copiar dirección</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Interactive Google Maps Iframe Container */}
          <div className="relative w-full rounded-lg overflow-hidden border border-slate-300 bg-slate-100 shadow-inner group">
            <div className="aspect-[16/10] sm:aspect-[16/9] w-full">
              <iframe
                title={`Mapa interactivo de ${currentCampus.nombre}`}
                src={currentCampus.embedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                className="w-full h-full"
              />
            </div>

            {/* Floating Quick Action Overlay */}
            <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
              <a
                href={currentCampus.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => handleExternalNav('google')}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-[#11284f]/90 hover:bg-[#11284f] text-white text-[10.5px] font-semibold backdrop-blur shadow-md transition-all hover:scale-103 cursor-pointer"
              >
                <span>Ver en pantalla completa</span>
                <ExternalLink className="w-3 h-3 text-[#ffc606]" />
              </a>
            </div>
          </div>

          {/* Action Navigation Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <a
              href={currentCampus.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleExternalNav('google')}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 font-semibold text-[11.5px] hover:bg-blue-100 transition-colors shadow-xs"
            >
              <Navigation className="w-3.5 h-3.5 text-blue-700" />
              <span>Abrir ruta en Google Maps</span>
              <ExternalLink className="w-3 h-3 text-blue-600" />
            </a>

            <a
              href={currentCampus.wazeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleExternalNav('waze')}
              className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-sky-50 border border-sky-200 text-sky-950 font-semibold text-[11.5px] hover:bg-sky-100 transition-colors shadow-xs"
            >
              <Car className="w-3.5 h-3.5 text-sky-700" />
              <span>Navegar con Waze</span>
              <ExternalLink className="w-3 h-3 text-sky-600" />
            </a>
          </div>

          {/* Campus Details: Transport, Parking & Faculties */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
            {/* Left: Transport & Parking */}
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/90 space-y-2">
              <div>
                <div className="font-bold text-[#11284f] flex items-center gap-1.5 mb-1">
                  <Bus className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Rutas de transporte público:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {currentCampus.buses.map((bus, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-white border border-slate-200 rounded font-semibold text-slate-700 text-[10px]"
                    >
                      {bus}
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-1.5">
                <div className="font-bold text-[#11284f] flex items-center gap-1.5 mb-0.5">
                  <Car className="w-3.5 h-3.5 text-amber-600" />
                  <span>Estacionamiento:</span>
                </div>
                <p className="text-slate-600 text-[10.5px]">{currentCampus.parqueo}</p>
              </div>

              <div className="border-t border-slate-200 pt-1.5 flex items-center gap-1 text-slate-600 text-[10.5px]">
                <Clock className="w-3 h-3 text-slate-400 flex-shrink-0" />
                <span>{currentCampus.horario}</span>
              </div>
            </div>

            {/* Right: What's at this campus */}
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/90">
              <div className="font-bold text-[#11284f] flex items-center gap-1.5 mb-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Instalaciones en esta sede:</span>
              </div>
              <ul className="space-y-1 text-slate-700 text-[10.5px]">
                {currentCampus.facultades.map((fac, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-[#ffc606] font-bold text-xs select-none">•</span>
                    <span>{fac}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick interactive follow-ups */}
          {onAskFollowUp && (
            <div className="pt-1 flex flex-wrap gap-1.5 border-t border-slate-100">
              <button
                type="button"
                onClick={() =>
                  onAskFollowUp(
                    '¿Cómo puedo agendar un recorrido presencial guiado por el Campus 2 y los estudios de televisión?'
                  )
                }
                className="px-2.5 py-1 rounded bg-[#11284f] text-[#ffc606] font-semibold text-[10.5px] hover:bg-[#1c3c72] transition-colors cursor-pointer flex items-center gap-1 shadow-xs"
              >
                <Calendar className="w-3 h-3" />
                <span>Agendar visita guiada</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  onAskFollowUp(
                    activeCampus === 'campus_2'
                      ? '¿Cómo llego al Campus 1 desde el Campus 2 y qué facultades están ahí?'
                      : '¿Dónde está ubicado el Campus 2 de Comunicaciones y Diseño?'
                  )
                }
                className="px-2.5 py-1 rounded bg-white text-slate-700 font-semibold text-[10.5px] border border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1"
              >
                <Compass className="w-3 h-3 text-slate-500" />
                <span>
                  {activeCampus === 'campus_2' ? 'Consultar Campus 1' : 'Consultar Campus 2'}
                </span>
              </button>

              <button
                type="button"
                onClick={() =>
                  onAskFollowUp(
                    '¿Cuáles son las rutas de buses más rápidas para llegar a la UJMD desde San Salvador o Santa Tecla?'
                  )
                }
                className="px-2.5 py-1 rounded bg-white text-slate-700 font-semibold text-[10.5px] border border-slate-300 hover:bg-slate-50 transition-colors cursor-pointer flex items-center gap-1"
              >
                <Bus className="w-3 h-3 text-slate-500" />
                <span>Rutas de buses detalladas</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
