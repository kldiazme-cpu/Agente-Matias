import React, { useState } from 'react';
import { X, Calendar, CheckCircle2, Phone, School, User, GraduationCap, ArrowRight } from 'lucide-react';
import { LeadFormData } from '../types';

interface TourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitLead: (data: LeadFormData) => Promise<void>;
  preselectedCareer?: string;
}

export const TourModal: React.FC<TourModalProps> = ({
  isOpen,
  onClose,
  onSubmitLead,
  preselectedCareer
}) => {
  const [formData, setFormData] = useState<LeadFormData>({
    nombreCompleto: '',
    telefono: '',
    bachillerato: '',
    carreraInteres: preselectedCareer || 'Licenciatura en Ciencias de la Comunicación',
    tipoSolicitud: 'Recorrido por el Campus y Admisiones'
  });

  const [loading, setLoading] = useState(false);
  const [successTicket, setSuccessTicket] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombreCompleto.trim() || !formData.telefono.trim() || !formData.bachillerato.trim()) {
      return;
    }

    setLoading(true);
    try {
      await onSubmitLead(formData);
      setSuccessTicket(`UJMD-${Math.floor(100000 + Math.random() * 900000)}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccessTicket(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#11284f] text-white p-5 flex items-center justify-between border-b-4 border-[#ffc606]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ffc606] text-[#11284f] flex items-center justify-center font-bold shadow">
              <Calendar className="w-5 h-5 text-[#11284f]" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Agendar Recorrido / Matrícula</h2>
              <p className="text-xs text-slate-300">Escuela de Ciencias de la Comunicación • UJMD</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {successTicket ? (
            <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">¡Solicitud Registrada con Éxito!</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Tu número oficial de seguimiento en Admisiones UJMD es:
                </p>
                <div className="inline-block mt-2 px-4 py-1.5 rounded-lg bg-slate-100 font-mono font-bold text-sm text-[#11284f] border border-slate-300">
                  {successTicket}
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl text-left text-xs text-slate-600 space-y-1.5 border border-slate-200">
                <p><strong>Aspirante:</strong> {formData.nombreCompleto}</p>
                <p><strong>Teléfono de contacto:</strong> {formData.telefono}</p>
                <p><strong>Colegio / Bachillerato:</strong> {formData.bachillerato}</p>
                <p><strong>Carrera solicitada:</strong> {formData.carreraInteres}</p>
                <p className="pt-2 text-emerald-700 font-medium">
                  ✓ Un asesor te contactará vía WhatsApp (+503 7000-0000) o llamada para coordinar tu recorrido por nuestros estudios de televisión, cabinas de radio y laboratorios digitales.
                </p>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-2.5 rounded-xl font-semibold text-xs text-white bg-[#11284f] hover:bg-[#1a3c75] transition-colors shadow"
              >
                Volver al chat con MatíasBot
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-xs text-slate-600">
                Por favor, completa los <strong>3 datos de contacto obligatorios</strong> para coordinar tu cita personalizada o iniciar tu expediente de admisión:
              </div>

              {/* Nombre completo */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-[#11284f]" />
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombreCompleto}
                  onChange={(e) => setFormData({ ...formData, nombreCompleto: e.target.value })}
                  placeholder="Ej. Fernando José Rivera Martínez"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#11284f] focus:ring-2 focus:ring-[#11284f]/10 focus:outline-none"
                />
              </div>

              {/* Teléfono celular */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#11284f]" />
                  Número de Teléfono Celular (WhatsApp) *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  placeholder="Ej. 7890-1234"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#11284f] focus:ring-2 focus:ring-[#11284f]/10 focus:outline-none"
                />
              </div>

              {/* Bachillerato de procedencia */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <School className="w-3.5 h-3.5 text-[#11284f]" />
                  Bachillerato / Colegio de Procedencia *
                </label>
                <input
                  type="text"
                  required
                  value={formData.bachillerato}
                  onChange={(e) => setFormData({ ...formData, bachillerato: e.target.value })}
                  placeholder="Ej. Colegio Cristóbal Colón / Inst. Nac. San Salvador"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 focus:border-[#11284f] focus:ring-2 focus:ring-[#11284f]/10 focus:outline-none"
                />
              </div>

              {/* Carrera de interés */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-[#11284f]" />
                  Carrera de tu interés
                </label>
                <select
                  value={formData.carreraInteres}
                  onChange={(e) => setFormData({ ...formData, carreraInteres: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:border-[#11284f] focus:ring-2 focus:ring-[#11284f]/10 focus:outline-none"
                >
                  <option value="Licenciatura en Ciencias de la Comunicación">
                    Licenciatura en Ciencias de la Comunicación
                  </option>
                  <option value="Licenciatura en Diseño Gráfico">
                    Licenciatura en Diseño Gráfico
                  </option>
                  <option value="Licenciatura en Publicidad y Mercadeo">
                    Licenciatura en Publicidad y Mercadeo
                  </option>
                </select>
              </div>

              {/* Botón de envío */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-[#11284f] bg-[#ffc606] hover:bg-[#e5b205] shadow transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-[#11284f] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Confirmar Registro de Admisión</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
