import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, ArrowRight, RotateCcw, MessageSquare } from 'lucide-react';

interface VocationalTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteTest: (careerName: string, query: string) => void;
}

export const VocationalTestModal: React.FC<VocationalTestModalProps> = ({
  isOpen,
  onClose,
  onCompleteTest
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<{
    carrera: string;
    titulo: string;
    descripcion: string;
    porcentaje: number;
  } | null>(null);

  if (!isOpen) return null;

  const questions = [
    {
      title: '1. ¿Qué tipo de proyectos disfrutas más en tu día a día?',
      options: [
        {
          key: 'comunicaciones',
          text: '🎙️ Investigar historias, grabar videos, redactar reportajes o conducir podcasts y entrevistas.'
        },
        {
          key: 'diseno',
          text: '🎨 Ilustrar, diseñar logotipos, armar composiciones visuales, editar imágenes y explorar paletas de color.'
        },
        {
          key: 'publicidad',
          text: '📈 Pensar en campañas creativas, analizar por qué un producto se vuelve viral en redes y diseñar estrategias de venta.'
        }
      ]
    },
    {
      title: '2. ¿En qué entorno profesional te imaginas destacando?',
      options: [
        {
          key: 'comunicaciones',
          text: '📹 En un set de televisión, cabina de radio, redacción digital o dirigiendo la comunicación de una corporación.'
        },
        {
          key: 'diseno',
          text: '💻 En un estudio de diseño gráfico, creando interfaces de aplicaciones (UI/UX) o animando contenidos visuales.'
        },
        {
          key: 'publicidad',
          text: '🏢 En una agencia publicitaria multinacional, dirigiendo cuentas clave y planificando lanzamientos de marca.'
        }
      ]
    },
    {
      title: '3. ¿Cuál es tu mayor superpoder creativo?',
      options: [
        {
          key: 'comunicaciones',
          text: '✍️ Conectar con las personas a través de palabras, narrativa multimedia y empatía para comunicar mensajes.'
        },
        {
          key: 'diseno',
          text: '👁️ Mi ojo estético, transformar conceptos abstractos en piezas gráficas impactantes e innovadoras.'
        },
        {
          key: 'publicidad',
          text: '💡 Mi ingenio persuasivo, entender los gustos de las audiencias y crear ideas que generen tendencia.'
        }
      ]
    }
  ];

  const handleSelectOption = (key: string) => {
    const updated = [...answers, key];
    setAnswers(updated);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate result
      const counts: Record<string, number> = { comunicaciones: 0, diseno: 0, publicidad: 0 };
      updated.forEach((k) => {
        counts[k] = (counts[k] || 0) + 1;
      });

      let winner = 'comunicaciones';
      if (counts.diseno > counts.comunicaciones && counts.diseno >= counts.publicidad) {
        winner = 'diseno';
      } else if (counts.publicidad > counts.comunicaciones && counts.publicidad > counts.diseno) {
        winner = 'publicidad';
      }

      if (winner === 'comunicaciones') {
        setResult({
          carrera: 'Licenciatura en Ciencias de la Comunicación',
          titulo: '¡Tu vocación apunta a Ciencias de la Comunicación! 🎙️📰',
          descripcion:
            'Posees una marcada inclinación hacia la investigación periodística, la producción audiovisual y la dirección de medios multiplataforma. Tu talento reside en contar historias que impacten a la sociedad.',
          porcentaje: Math.round(((counts.comunicaciones || 1) / 3) * 100)
        });
      } else if (winner === 'diseno') {
        setResult({
          carrera: 'Licenciatura en Diseño Gráfico',
          titulo: '¡Tu vocación apunta a Diseño Gráfico! 🎨✨',
          descripcion:
            'Tu sensibilidad visual, gusto por el detalle estético y pasión por transformar ideas en conceptos gráficos te convierten en un diseñador visual por excelencia. La UJMD te espera con laboratorios de última generación.',
          porcentaje: Math.round(((counts.diseno || 1) / 3) * 100)
        });
      } else {
        setResult({
          carrera: 'Licenciatura en Publicidad y Mercadeo',
          titulo: '¡Tu vocación apunta a Publicidad y Mercadeo! 📈💡',
          descripcion:
            'Combinas visión estratégica, intuición comercial y creatividad disruptiva. Tienes el perfil perfecto para liderar campañas 360°, dominar el marketing digital y gestionar el posicionamiento de grandes marcas.',
          porcentaje: Math.round(((counts.publicidad || 1) / 3) * 100)
        });
      }
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers([]);
    setResult(null);
  };

  const handleConsultBot = () => {
    if (!result) return;
    const query = `Acabo de realizar el test vocacional y mi perfil más compatible fue "${result.carrera}". ¿Podrías explicarme las oportunidades laborales y los aranceles oficiales para esta carrera?`;
    onCompleteTest(result.carrera, query);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#11284f] text-white p-5 flex items-center justify-between border-b-4 border-[#ffc606]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ffc606] text-[#11284f] flex items-center justify-center font-bold shadow">
              <Sparkles className="w-5 h-5 text-[#11284f]" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Test Vocacional Expreso</h2>
              <p className="text-xs text-slate-300">Descubre tu carrera ideal en la Escuela de Comunicaciones</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto chat-scroll">
          {result ? (
            <div className="space-y-4 animate-in zoom-in-95 duration-200 text-center">
              <div className="w-16 h-16 rounded-full bg-[#ffc606]/20 text-[#11284f] border-2 border-[#ffc606] flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9 text-[#11284f]" />
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#ffc606] bg-[#11284f] px-3 py-1 rounded-full">
                  Afinidad Detectada: {result.porcentaje}%
                </span>
                <h3 className="text-lg font-extrabold text-slate-900 mt-2">
                  {result.titulo}
                </h3>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed text-left">
                {result.descripcion}
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleReset}
                  className="py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Repetir test
                </button>
                <button
                  onClick={handleConsultBot}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-[#11284f] bg-[#ffc606] hover:bg-[#e5b205] shadow transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <MessageSquare className="w-4 h-4 text-[#11284f]" />
                  <span>Profundizar con MatíasBot</span>
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Progress bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                  <span>Pregunta {currentStep + 1} de {questions.length}</span>
                  <span>{Math.round(((currentStep + 1) / questions.length) * 100)}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#11284f] transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question */}
              <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-3">
                {questions[currentStep].title}
              </h3>

              {/* Options */}
              <div className="space-y-2.5">
                {questions[currentStep].options.map((option, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(option.key)}
                    className="w-full text-left p-3.5 rounded-xl border border-slate-200 hover:border-[#11284f] bg-slate-50/60 hover:bg-white hover:shadow-sm text-xs text-slate-800 transition-all flex items-start gap-2.5 cursor-pointer group"
                  >
                    <div className="w-5 h-5 rounded-full border border-slate-300 group-hover:border-[#11284f] flex items-center justify-center text-[11px] font-bold text-slate-500 group-hover:text-[#11284f] flex-shrink-0 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="leading-relaxed flex-1">{option.text}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
