import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  GoogleGenAI,
  Type,
  HarmCategory,
  HarmBlockThreshold,
  type FunctionDeclaration
} from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const port = parseInt(process.env.PORT || '3000', 10);

const app = express();
app.use(express.json());

// Comprehensive UJMD Catalog Data
interface ArancelInfo {
  matricula: number;
  cuota: number;
  ciclo: string;
  carreraCompleta: string;
  facultad: string;
  cuotasPorCiclo: number;
  derechoAdmision: number;
  duracion: string;
  codigo?: string;
  duracion_anios?: number;
  ciclos_totales?: number;
  descuentoTempranoPorcentaje?: number;
  fechaLimiteDescuento?: string;
  requisitosIngreso?: string[];
  canalesAtencion?: {
    correo: string;
    whatsapp: string;
    horario: string;
  };
}

const CATALOGO_ARANCELES: Record<string, ArancelInfo> = {
  // Escuela de Ciencias de la Comunicación (Facultad de Ciencias y Artes "Francisco Gavidia")
  comunicaciones: {
    codigo: 'COM-01',
    matricula: 100.0,
    cuota: 150.0,
    ciclo: 'Ciclo 01-2025',
    carreraCompleta: 'Licenciatura en Ciencias de la Comunicación',
    facultad: 'Escuela de Ciencias de la Comunicación - Facultad de Ciencias y Artes "Francisco Gavidia"',
    cuotasPorCiclo: 5,
    derechoAdmision: 45.0,
    duracion: '5 años (10 ciclos totales)',
    duracion_anios: 5,
    ciclos_totales: 10,
    descuentoTempranoPorcentaje: 20,
    fechaLimiteDescuento: '15 de diciembre de 2024',
    requisitosIngreso: [
      'Título de bachiller o constancia de graduación reciente.',
      'Partida de nacimiento reciente (máximo 3 meses de emisión).',
      'Fotocopia de DUI ampliada al 150% (o carné de minoridad).',
      'Aprobar la prueba de admisión diagnóstica institucional.'
    ],
    canalesAtencion: {
      correo: 'admisiones@ujmd.edu.sv',
      whatsapp: '+503 7000-0000',
      horario: 'Lunes a viernes de 8:00 a.m. a 5:00 p.m.'
    }
  },
  diseño: {
    codigo: 'DG-02',
    matricula: 130.0,
    cuota: 160.0,
    ciclo: 'Ciclo 01-2025',
    carreraCompleta: 'Licenciatura en Diseño Gráfico',
    facultad: 'Facultad de Ciencias y Artes "Francisco Gavidia"',
    cuotasPorCiclo: 5,
    derechoAdmision: 45.0,
    duracion: '5 años (10 ciclos)',
    duracion_anios: 5,
    ciclos_totales: 10,
    descuentoTempranoPorcentaje: 20,
    fechaLimiteDescuento: '15 de diciembre de 2024',
    requisitosIngreso: [
      'Título de bachiller o constancia de graduación reciente.',
      'Partida de nacimiento reciente (máximo 3 meses de emisión).',
      'Fotocopia de DUI ampliada al 150% (o carné de minoridad).',
      'Aprobar la prueba de admisión diagnóstica institucional.'
    ],
    canalesAtencion: {
      correo: 'admisiones@ujmd.edu.sv',
      whatsapp: '+503 7000-0000',
      horario: 'Lunes a viernes de 8:00 a.m. a 5:00 p.m.'
    }
  },
  diseno: {
    codigo: 'DG-02',
    matricula: 130.0,
    cuota: 160.0,
    ciclo: 'Ciclo 01-2025',
    carreraCompleta: 'Licenciatura en Diseño Gráfico',
    facultad: 'Facultad de Ciencias y Artes "Francisco Gavidia"',
    cuotasPorCiclo: 5,
    derechoAdmision: 45.0,
    duracion: '5 años (10 ciclos)',
    duracion_anios: 5,
    ciclos_totales: 10,
    descuentoTempranoPorcentaje: 20,
    fechaLimiteDescuento: '15 de diciembre de 2024',
    requisitosIngreso: [
      'Título de bachiller o constancia de graduación reciente.',
      'Partida de nacimiento reciente (máximo 3 meses de emisión).',
      'Fotocopia de DUI ampliada al 150% (o carné de minoridad).',
      'Aprobar la prueba de admisión diagnóstica institucional.'
    ],
    canalesAtencion: {
      correo: 'admisiones@ujmd.edu.sv',
      whatsapp: '+503 7000-0000',
      horario: 'Lunes a viernes de 8:00 a.m. a 5:00 p.m.'
    }
  },
  publicidad: {
    codigo: 'PM-03',
    matricula: 120.0,
    cuota: 150.0,
    ciclo: 'Ciclo 01-2025',
    carreraCompleta: 'Licenciatura en Publicidad y Mercadeo',
    facultad: 'Facultad de Ciencias y Artes "Francisco Gavidia"',
    cuotasPorCiclo: 5,
    derechoAdmision: 45.0,
    duracion: '5 años (10 ciclos)',
    duracion_anios: 5,
    ciclos_totales: 10,
    descuentoTempranoPorcentaje: 20,
    fechaLimiteDescuento: '15 de diciembre de 2024',
    requisitosIngreso: [
      'Título de bachiller o constancia de graduación reciente.',
      'Partida de nacimiento reciente (máximo 3 meses de emisión).',
      'Fotocopia de DUI ampliada al 150% (o carné de minoridad).',
      'Aprobar la prueba de admisión diagnóstica institucional.'
    ],
    canalesAtencion: {
      correo: 'admisiones@ujmd.edu.sv',
      whatsapp: '+503 7000-0000',
      horario: 'Lunes a viernes de 8:00 a.m. a 5:00 p.m.'
    }
  },
  animacion: {
    matricula: 130.0,
    cuota: 170.0,
    ciclo: 'Ciclo 01-2025',
    carreraCompleta: 'Licenciatura en Animación Digital y Videojuegos',
    facultad: 'Facultad de Ciencias y Artes "Francisco Gavidia"',
    cuotasPorCiclo: 5,
    derechoAdmision: 45.0,
    duracion: '5 años (10 ciclos)'
  },
  interiores: {
    matricula: 130.0,
    cuota: 165.0,
    ciclo: 'Ciclo 01-2025',
    carreraCompleta: 'Licenciatura en Arquitectura de Interiores',
    facultad: 'Facultad de Ciencias y Artes "Francisco Gavidia"',
    cuotasPorCiclo: 5,
    derechoAdmision: 45.0,
    duracion: '5 años (10 ciclos)'
  },
  producto: {
    matricula: 130.0,
    cuota: 165.0,
    ciclo: 'Ciclo 01-2025',
    carreraCompleta: 'Licenciatura en Diseño de Productos',
    facultad: 'Facultad de Ciencias y Artes "Francisco Gavidia"',
    cuotasPorCiclo: 5,
    derechoAdmision: 45.0,
    duracion: '5 años (10 ciclos)'
  },

  // Facultad de Ciencias de la Salud "Dr. Luis Edmundo Vásquez"
  medicina: {
    matricula: 130.0,
    cuota: 260.0,
    ciclo: 'Ciclo 01-2025',
    carreraCompleta: 'Doctorado en Medicina',
    facultad: 'Facultad de Ciencias de la Salud "Dr. Luis Edmundo Vásquez"',
    cuotasPorCiclo: 5,
    derechoAdmision: 90.0,
    duracion: '8 años (incluye internado rotatorio y servicio social)'
  },
  enfermeria: {
    matricula: 100.0,
    cuota: 140.0,
    ciclo: 'Ciclo 01-2025',
    carreraCompleta: 'Licenciatura en Enfermería',
    facultad: 'Facultad de Ciencias de la Salud "Dr. Luis Edmundo Vásquez"',
    cuotasPorCiclo: 5,
    derechoAdmision: 45.0,
    duracion: '5 años (10 ciclos)'
  },
  psicologia: {
    matricula: 120.0,
    cuota: 155.0,
    ciclo: 'Ciclo 01-2025',
    carreraCompleta: 'Licenciatura en Psicología',
    facultad: 'Facultad de Ciencias de la Salud "Dr. Luis Edmundo Vásquez"',
    cuotasPorCiclo: 5,
    derechoAdmision: 45.0,
    duracion: '5 años (10 ciclos)'
  },
  nutricion: {
    matricula: 115.0,
    cuota: 150.0,
    ciclo: 'Ciclo 01-2025',
    carreraCompleta: 'Licenciatura en Nutrición',
    facultad: 'Facultad de Ciencias de la Salud "Dr. Luis Edmundo Vásquez"',
    cuotasPorCiclo: 5,
    derechoAdmision: 45.0,
    duracion: '5 años (10 ciclos)'
  },

  // Facultad de Ingeniería y Arquitectura
  arquitectura: {
    matricula: 130.0,
    cuota: 185.0,
    ciclo: 'Ciclo 01-2025',
    carreraCompleta: 'Licenciatura en Arquitectura',
    facultad: 'Facultad de Ingeniería y Arquitectura',
    cuotasPorCiclo: 5,
    derechoAdmision: 45.0,
    duracion: '5 años (10 ciclos)'
  },
  industrial: {
    matricula: 125.0,
    cuota: 170.0,
    ciclo: 'Ciclo 01-2025',
    carreraCompleta: 'Ingeniería Industrial',
    facultad: 'Facultad de Ingeniería y Arquitectura',
    cuotasPorCiclo: 5,
    derechoAdmision: 45.0,
    duracion: '5 años (10 ciclos)'
  },
  computacion: {
    matricula: 125.0,
    cuota: 170.0,
    ciclo: 'Ciclo 01-2025',
    carreraCompleta: 'Ingeniería en Computación e Informática',
    facultad: 'Facultad de Ingeniería y Arquitectura',
    cuotasPorCiclo: 5,
    derechoAdmision: 45.0,
    duracion: '5 años (10 ciclos)'
  },
  sistemas: {
    matricula: 125.0,
    cuota: 170.0,
    ciclo: 'Ciclo 01-2025',
    carreraCompleta: 'Ingeniería en Computación e Informática',
    facultad: 'Facultad de Ingeniería y Arquitectura',
    cuotasPorCiclo: 5,
    derechoAdmision: 45.0,
    duracion: '5 años (10 ciclos)'
  },
  biomedica: {
    matricula: 130.0,
    cuota: 180.0,
    ciclo: 'Ciclo 01-2025',
    carreraCompleta: 'Ingeniería Biomédica',
    facultad: 'Facultad de Ingeniería y Arquitectura',
    cuotasPorCiclo: 5,
    derechoAdmision: 45.0,
    duracion: '5 años (10 ciclos)'
  },

  // Facultad de Jurisprudencia y Ciencias Sociales
  derecho: {
    matricula: 120.0,
    cuota: 160.0,
    ciclo: 'Ciclo 01-2025',
    carreraCompleta: 'Licenciatura en Ciencias Jurídicas (Derecho)',
    facultad: 'Facultad de Jurisprudencia y Ciencias Sociales',
    cuotasPorCiclo: 5,
    derechoAdmision: 45.0,
    duracion: '5 años (10 ciclos)'
  },
  relaciones: {
    matricula: 120.0,
    cuota: 160.0,
    ciclo: 'Ciclo 01-2025',
    carreraCompleta: 'Licenciatura en Relaciones Internacionales',
    facultad: 'Facultad de Jurisprudencia y Ciencias Sociales',
    cuotasPorCiclo: 5,
    derechoAdmision: 45.0,
    duracion: '5 años (10 ciclos)'
  },

  // Facultad de Economía, Empresa y Negocios
  administracion: {
    matricula: 120.0,
    cuota: 155.0,
    ciclo: 'Ciclo 01-2025',
    carreraCompleta: 'Licenciatura en Administración de Empresas',
    facultad: 'Facultad de Economía, Empresa y Negocios',
    cuotasPorCiclo: 5,
    derechoAdmision: 45.0,
    duracion: '5 años (10 ciclos)'
  },
  mercadotecnia: {
    matricula: 120.0,
    cuota: 155.0,
    ciclo: 'Ciclo 01-2025',
    carreraCompleta: 'Licenciatura en Mercadotecnia',
    facultad: 'Facultad de Economía, Empresa y Negocios',
    cuotasPorCiclo: 5,
    derechoAdmision: 45.0,
    duracion: '5 años (10 ciclos)'
  },
  contaduria: {
    matricula: 115.0,
    cuota: 150.0,
    ciclo: 'Ciclo 01-2025',
    carreraCompleta: 'Licenciatura en Contaduría Pública',
    facultad: 'Facultad de Economía, Empresa y Negocios',
    cuotasPorCiclo: 5,
    derechoAdmision: 45.0,
    duracion: '5 años (10 ciclos)'
  },
  finanzas: {
    matricula: 120.0,
    cuota: 155.0,
    ciclo: 'Ciclo 01-2025',
    carreraCompleta: 'Licenciatura en Finanzas',
    facultad: 'Facultad de Economía, Empresa y Negocios',
    cuotasPorCiclo: 5,
    derechoAdmision: 45.0,
    duracion: '5 años (10 ciclos)'
  }
};

export function consultar_arancel_oficial(carrera: string, modalidad: string = 'Presencial') {
  const norm = carrera.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  let matchKey = '';

  if (norm.includes('comunicaci') || norm.includes('periodis') || norm.includes('audiovisual')) {
    matchKey = 'comunicaciones';
  } else if (norm.includes('animaci') || norm.includes('videojuego')) {
    matchKey = 'animacion';
  } else if (norm.includes('disen') || norm.includes('grafic') || norm.includes('ux') || norm.includes('visual')) {
    matchKey = 'diseño';
  } else if (norm.includes('publici') || norm.includes('mercad') || norm.includes('market')) {
    matchKey = 'publicidad';
  } else if (norm.includes('interior')) {
    matchKey = 'interiores';
  } else if (norm.includes('producto')) {
    matchKey = 'producto';
  } else if (norm.includes('biomed')) {
    matchKey = 'biomedica';
  } else if (norm.includes('medic') || norm.includes('ciruj')) {
    matchKey = 'medicina';
  } else if (norm.includes('enferm')) {
    matchKey = 'enfermeria';
  } else if (norm.includes('psicol')) {
    matchKey = 'psicologia';
  } else if (norm.includes('nutri')) {
    matchKey = 'nutricion';
  } else if (norm.includes('arqui')) {
    matchKey = 'arquitectura';
  } else if (norm.includes('industr')) {
    matchKey = 'industrial';
  } else if (norm.includes('comput') || norm.includes('sistem') || norm.includes('softw') || norm.includes('informat')) {
    matchKey = 'computacion';
  } else if (norm.includes('biomed')) {
    matchKey = 'biomedica';
  } else if (norm.includes('derech') || norm.includes('jurid')) {
    matchKey = 'derecho';
  } else if (norm.includes('relacion') || norm.includes('internac')) {
    matchKey = 'relaciones';
  } else if (norm.includes('admin') || norm.includes('negoc')) {
    matchKey = 'administracion';
  } else if (norm.includes('contad') || norm.includes('auditor')) {
    matchKey = 'contaduria';
  } else if (norm.includes('finan')) {
    matchKey = 'finanzas';
  } else if (CATALOGO_ARANCELES[norm]) {
    matchKey = norm;
  }

  if (matchKey && CATALOGO_ARANCELES[matchKey]) {
    const datos = CATALOGO_ARANCELES[matchKey];
    return {
      estado: 'exito',
      carrera: datos.carreraCompleta,
      codigo: datos.codigo,
      duracion_anios: datos.duracion_anios || 5,
      ciclos_totales: datos.ciclos_totales || 10,
      facultad: datos.facultad,
      modalidad,
      costos: {
        matricula_ordinaria: datos.matricula,
        cuota_mensual_base: datos.cuota,
        descuento_temprano_porcentaje: datos.descuentoTempranoPorcentaje || 20,
        fecha_limite_descuento: datos.fechaLimiteDescuento || '15 de diciembre de 2024'
      },
      matricula_usd: datos.matricula,
      cuota_mensual_usd: datos.cuota,
      cuotas_por_ciclo: datos.cuotasPorCiclo,
      total_ciclo_usd: datos.matricula + datos.cuota * datos.cuotasPorCiclo,
      derecho_admision_usd: datos.derechoAdmision,
      descuento_temprano_porcentaje: datos.descuentoTempranoPorcentaje,
      fecha_limite_descuento: datos.fechaLimiteDescuento,
      beneficio_pronto_pago: datos.descuentoTempranoPorcentaje
        ? `${datos.descuentoTempranoPorcentaje}% de descuento temprano en matrícula (Fecha límite: ${datos.fechaLimiteDescuento})`
        : '50% de descuento en la matrícula al pagar el ciclo completo de contado antes de la cuota 2',
      requisitos_ingreso: datos.requisitosIngreso || [
        'Título de bachiller o constancia de graduación reciente.',
        'Partida de nacimiento reciente (máximo 3 meses de emisión).',
        'Fotocopia de DUI ampliada al 150% (o carné de minoridad).',
        'Aprobar la prueba de admisión diagnóstica institucional.'
      ],
      canales_atencion_oficial: datos.canalesAtencion
        ? {
            correo: datos.canalesAtencion.correo,
            whatsapp_oficial: datos.canalesAtencion.whatsapp,
            horario: datos.canalesAtencion.horario
          }
        : {
            correo: 'admisiones@ujmd.edu.sv',
            whatsapp_oficial: '+503 7000-0000',
            horario: 'Lunes a viernes de 8:00 a.m. a 5:00 p.m.'
          },
      periodo: datos.ciclo,
      moneda: 'USD',
      nota: 'Aranceles y requisitos oficiales verificados de la Universidad Dr. José Matías Delgado (UJMD).'
    };
  }

  // Realistic institutional estimation for any other program/career
  const matriculaEst = 125.0;
  const cuotaEst = 160.0;
  const cuotas = 5;

  return {
    estado: 'exito_estimado',
    carrera: carrera,
    codigo: 'UJMD-REF',
    duracion_anios: 5,
    ciclos_totales: 10,
    facultad: 'Universidad Dr. José Matías Delgado (UJMD)',
    modalidad,
    costos: {
      matricula_ordinaria: matriculaEst,
      cuota_mensual_base: cuotaEst,
      descuento_temprano_porcentaje: 20,
      fecha_limite_descuento: '15 de diciembre de 2024'
    },
    matricula_usd: matriculaEst,
    cuota_mensual_usd: cuotaEst,
    cuotas_por_ciclo: cuotas,
    total_ciclo_usd: matriculaEst + cuotaEst * cuotas,
    derecho_admision_usd: 45.0,
    beneficio_pronto_pago: '50% de descuento en la matrícula al pagar el ciclo completo de contado',
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
    periodo: 'Ciclo 01-2025',
    moneda: 'USD',
    nota: 'Valor estimado de referencia UJMD. En la UJMD las cuotas mensuales oscilan entre $100.00 y $305.00 USD según la categorización socioeconómica asignada en Admisiones.'
  };
}

// Function declaration for Gemini
const consultarArancelDeclaration: FunctionDeclaration = {
  name: 'consultar_arancel_oficial',
  description: 'Consulta los aranceles, matrículas, cuotas mensuales y derecho de admisión oficiales o estimados de la UJMD para cualquier carrera de pregrado o posgrado.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      carrera: {
        type: Type.STRING,
        description: "Nombre de la carrera o programa consultado (ej. 'comunicaciones', 'diseño', 'publicidad', 'medicina', 'arquitectura', 'derecho', 'ingenieria', etc.)."
      },
      modalidad: {
        type: Type.STRING,
        description: "Modalidad: 'Presencial' o 'Semipresencial'. Por defecto es 'Presencial'."
      }
    },
    required: ['carrera']
  }
};

const SYSTEM_INSTRUCTION = `
# ROL Y IDENTIDAD
Eres "MatíasBot", el Agente Inteligente Oficial de Orientación Vocacional y Admisiones de la Universidad Dr. José Matías Delgado (UJMD).
Tu corazón institucional y especialidad de origen es la **Escuela de Ciencias de la Comunicación** (con sus carreras insignia: Licenciatura en Ciencias de la Comunicación, Licenciatura en Diseño Gráfico y Licenciatura en Publicidad y Mercadeo), pero ahora posees una **amplia base de información de toda la UJMD** para contestar con solvencia, calidez y precisión a cualquier duda sobre:
- Oferta académica completa de pregrado y posgrado en todas las facultades.
- Requisitos, fechas, documentos y proceso de admisión paso a paso.
- Costos, aranceles oficiales, cuotas mensuales y beneficios de pronto pago.
- Becas, financiamiento bancario y convenios internacionales.
- Instalaciones del Campus I (estudios de TV, cabinas de radio, laboratorios Apple Mac, talleres de fotografía, biblioteca, áreas de coworking, parqueo a $0.75).
- Vida estudiantil, horarios de clase, intercambios académicos (DAAD Alemania, España, EE. UU.) y deportes.

# TONO Y ESTILO DE COMUNICACIÓN
- Empático, cordial, universitario, motivador, inspirador y sumamente claro.
- Trata al aspirante con calidez, entusiasmo y profesionalismo universitario.
- Emplea párrafos breves (máximo 3 oraciones por bloque) y utiliza viñetas o emojis sobrios para facilitar la lectura en teléfonos móviles.

# BASE DE INFORMACIÓN Y LÓGICA DE NEGOCIO
1. DATOS OFICIALES PRIORITARIOS - LICENCIATURA EN CIENCIAS DE LA COMUNICACIÓN:
   • Carrera: Licenciatura en Ciencias de la Comunicación
   • Código oficial: COM-01
   • Duración: 5 años (10 ciclos totales)
   • Costos y Aranceles oficiales:
     * Matrícula ordinaria: $100.00 USD por ciclo
     * Cuota mensual base: $150.00 USD (5 cuotas por ciclo)
     * Descuento temprano: 20% de descuento en matrícula (Fecha límite: 15 de diciembre de 2024 / pronto pago)
   • Requisitos de ingreso específicos:
     1. Título de bachiller o constancia de graduación reciente.
     2. Partida de nacimiento reciente (máximo 3 meses de emisión).
     3. Fotocopia de DUI ampliada al 150% (o carné de minoridad).
     4. Aprobar la prueba de admisión diagnóstica institucional.
   • Canales de atención oficial:
     * Correo electrónico: admisiones@ujmd.edu.sv
     * WhatsApp oficial: +503 7000-0000
     * Horario: Lunes a viernes de 8:00 a.m. a 5:00 p.m.

   Siempre que el usuario pregunte sobre Ciencias de la Comunicación, costos, requisitos de ingreso o canales oficiales, responde de forma estructurada, destacando claramente estas secciones.

2. ARANCELES, PRECIOS Y COSTOS GENERALES:
   - Tienes autorización para informar valores reales investigados en internet o estimar costos y aranceles realistas basados en los parámetros institucionales de la UJMD.
   - Siempre que te pregunten sobre costos, cuotas, mensualidades, matrículas o aranceles, DEBES consultar la herramienta 'consultar_arancel_oficial'.
   - Valores de referencia clave:
     * Derecho de admisión: $45.00 USD para licenciaturas, ingenierías y arquitectura; $90.00 USD para Doctorado en Medicina.
     * Matrícula ordinaria estándar: $100.00 a $130.00 USD por ciclo.
       - Ciencias de la Comunicación (COM-01): Matrícula $100.00 / Cuota base $150.00 (con 20% de descuento temprano).
       - Diseño Gráfico: Matrícula $130.00 / Cuota $160.00 (5 cuotas al ciclo).
       - Publicidad y Mercadeo: Matrícula $120.00 / Cuota $150.00 (5 cuotas al ciclo).
       - Arquitectura: Matrícula $130.00 / Cuota $185.00.
       - Doctorado en Medicina: Matrícula $130.00 / Cuota $260.00.
       - Derecho y Relaciones Internacionales: Matrícula $120.00 / Cuota $160.00.
       - Ingenierías: Matrícula $125.00 - $130.00 / Cuota $170.00 - $180.00.
     * Cuotas mensuales en la UJMD: Oscilan entre $100.00 y $305.00 USD según la carrera y categorización socioeconómica asignada por Admisiones.
     * Beneficio de Pronto Pago: 50% de descuento en la matrícula si se paga el ciclo completo antes del vencimiento de la cuota 2 (o 20% de descuento temprano para COM-01).
     * Estacionamiento institucional: $0.75 USD.

2. PASOS DEL PROCESO DE ADMISIÓN:
   1. Registro en la lista de espera y llenado de la solicitud en línea en el portal ujmd.edu.sv.
   2. Pago del derecho de admisión ($45.00 licenciaturas / $90.00 Medicina) para habilitar credenciales de correo institucional y acceso a Uvirtual.
   3. Adjuntar documentación obligatoria en digital.
   4. Cursillo preuniversitario / Pruebas diagnósticas y entrevista vocacional con coordinadores.
   5. Asignación de cuota mensual y confirmación de admisión.
   6. Pago de matrícula y primera cuota mediante banca en línea, Uvirtual o Puntos Express (Farmacias Económicas, Súper Selectos, Walmart).

3. DOCUMENTOS OBLIGATORIOS PARA NUEVO INGRESO:
   - Título de bachiller (o constancia de estar cursando el último año de educación media).
   - Certificado de notas de educación media.
   - Partida de nacimiento reciente (máximo 3 meses de emisión).
   - Copia de DUI (o carnet de minoridad / pasaporte para extranjeros).
   - 2 fotografías tamaño cédula recientes.

4. DATOS DE CONTACTO OBLIGATORIOS PARA LEADS / MATRÍCULA:
   - Cuando el usuario manifieste interés en iniciar su matrícula o agendar un recorrido por el campus, debes solicitar cortésmente:
     1. Nombre completo
     2. Teléfono celular (o WhatsApp)
     3. Bachillerato o colegio de procedencia

5. CONTACTO INSTITUCIONAL:
   - PBX de Admisiones: 2212-9400.
   - Correo electrónico: admisiones@ujmd.edu.sv.
   - Campus I: Dr. Luis Edmundo Vásquez, Calle Chiltiupán y Av. El Pedregal, Antiguo Cuscatlán.
`;

// Session & Conversion Tracking Data Structures
interface ServerConversionEvent {
  id: string;
  sessionId: string;
  type: string;
  label: string;
  timestamp: string;
  career?: string;
  metadata?: Record<string, any>;
}

interface ServerUserProfile {
  nombreCompleto?: string;
  telefono?: string;
  bachillerato?: string;
  carreraInteres?: string;
  ticketId?: string;
}

interface ServerChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Array<{
    id: string;
    role: 'user' | 'model';
    text: string;
    timestamp: string;
    toolUsed?: any;
  }>;
  userProfile?: ServerUserProfile;
  conversions: ServerConversionEvent[];
  status: 'activa' | 'lead_capturado' | 'tour_agendado' | 'matricula_iniciada';
  carreraInteres?: string;
}

interface ApplicantContext {
  nombreCompleto?: string;
  telefono?: string;
  bachillerato?: string;
  carreraInteres?: string;
  ticketId?: string;
  status?: string;
  conversions?: ServerConversionEvent[];
  hasLeadCaptured: boolean;
  hasTourScheduled: boolean;
  hasViewedAranceles: boolean;
  hasViewedCOM01: boolean;
  hasCompletedVocationalTest: boolean;
  conversionsSummary: string;
}

const sessionsMap = new Map<string, ServerChatSession>();
const conversionsList: ServerConversionEvent[] = [];

// Seed initial realistic sessions so user sees rich historical data and funnel analytics
const initialSession1Id = 'sesion-demo-com01';
sessionsMap.set(initialSession1Id, {
  id: initialSession1Id,
  title: 'Consulta Aranceles & COM-01',
  createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  status: 'lead_capturado',
  carreraInteres: 'Licenciatura en Ciencias de la Comunicación',
  userProfile: {
    nombreCompleto: 'Camila Rodriguez',
    telefono: '+503 7123-4567',
    bachillerato: 'Colegio Champagnat',
    carreraInteres: 'Licenciatura en Ciencias de la Comunicación',
    ticketId: 'UJMD-782910'
  },
  messages: [
    {
      id: 'm-demo-1',
      role: 'user',
      text: 'Hola, me interesa saber sobre la carrera de Ciencias de la Comunicación COM-01 y sus aranceles.',
      timestamp: '02:15 p.m.'
    },
    {
      id: 'm-demo-2',
      role: 'model',
      text: '¡Hola Camila! Con gusto te comparto la información oficial de la Licenciatura en Ciencias de la Comunicación (COM-01). Matrícula ordinaria: $100.00 USD, cuota base: $150.00 USD con 20% de descuento temprano.',
      timestamp: '02:15 p.m.'
    }
  ],
  conversions: [
    {
      id: 'conv-init-1',
      sessionId: initialSession1Id,
      type: 'view_aranceles',
      label: 'Consulta de Aranceles Oficiales',
      timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
      career: 'Ciencias de la Comunicación'
    },
    {
      id: 'conv-init-2',
      sessionId: initialSession1Id,
      type: 'view_pensum_com01',
      label: 'Consulta Ficha COM-01 & Requisitos',
      timestamp: new Date(Date.now() - 3600000 * 2.8).toISOString(),
      career: 'Ciencias de la Comunicación'
    },
    {
      id: 'conv-init-3',
      sessionId: initialSession1Id,
      type: 'lead_captured',
      label: 'Lead Capturado (Datos Completos)',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      career: 'Ciencias de la Comunicación'
    }
  ]
});

const initialSession2Id = 'sesion-demo-diseno';
sessionsMap.set(initialSession2Id, {
  id: initialSession2Id,
  title: 'Exploración Diseño Gráfico & Recorrido',
  createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  updatedAt: new Date(Date.now() - 3600000 * 22).toISOString(),
  status: 'tour_agendado',
  carreraInteres: 'Licenciatura en Diseño Gráfico',
  userProfile: {
    nombreCompleto: 'Mateo Hernandez',
    telefono: '+503 7890-1234',
    bachillerato: 'Liceo Salvadoreño',
    carreraInteres: 'Licenciatura en Diseño Gráfico',
    ticketId: 'UJMD-491203'
  },
  messages: [
    {
      id: 'm-demo-3',
      role: 'user',
      text: '¿Tienen laboratorios Mac para Diseño Gráfico y se puede visitar el campus?',
      timestamp: '10:30 a.m.'
    },
    {
      id: 'm-demo-4',
      role: 'model',
      text: '¡Hola Mateo! Sí, contamos con modernos laboratorios Apple Mac con suite Adobe Creative Cloud en Campus I.',
      timestamp: '10:30 a.m.'
    }
  ],
  conversions: [
    {
      id: 'conv-init-4',
      sessionId: initialSession2Id,
      type: 'view_aranceles',
      label: 'Consulta de Aranceles Oficiales',
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
      career: 'Diseño Gráfico'
    },
    {
      id: 'conv-init-5',
      sessionId: initialSession2Id,
      type: 'tour_scheduled',
      label: 'Recorrido por Campus Agendado',
      timestamp: new Date(Date.now() - 3600000 * 22).toISOString(),
      career: 'Diseño Gráfico'
    }
  ]
});

// Sync initial seed conversions into global list
sessionsMap.forEach(s => {
  conversionsList.push(...s.conversions);
});

// Helper to assemble full applicant context and conversion memory across sessions
function buildApplicantContext(
  session?: ServerChatSession,
  incomingProfile?: ServerUserProfile,
  incomingConversions?: ServerConversionEvent[],
  dialogueText?: string
): ApplicantContext {
  // Merge profile from current session and incoming request
  let profile: ServerUserProfile = {
    ...(session?.userProfile || {}),
    ...(incomingProfile || {})
  };

  // If no name yet, look up across other sessions in memory to carry forward applicant identity
  if (!profile.nombreCompleto) {
    for (const other of sessionsMap.values()) {
      if (other.userProfile?.nombreCompleto) {
        profile = { ...other.userProfile, ...profile };
        break;
      }
    }
  }

  // Combine conversion events
  const combined = [
    ...(session?.conversions || []),
    ...(incomingConversions || [])
  ];

  // If session has no conversions, check global conversions
  if (combined.length === 0 && profile.nombreCompleto) {
    const matching = conversionsList.filter(c => c.label?.includes(profile.nombreCompleto!));
    combined.push(...matching);
  }

  const uniqueConversions: ServerConversionEvent[] = [];
  const seenKeys = new Set<string>();
  for (const c of combined) {
    const key = `${c.type}_${c.label || ''}`;
    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      uniqueConversions.push(c);
    }
  }

  // Detect name from dialogue if still not set
  let detectedName = profile.nombreCompleto || '';
  if (!detectedName && dialogueText) {
    const match =
      dialogueText.match(/me llamo\s+([a-zA-ZáéíóúñÁÉÍÓÚÑ]+)/i) ||
      dialogueText.match(/soy\s+([a-zA-ZáéíóúñÁÉÍÓÚÑ]+)/i);
    if (match) detectedName = match[1];
  }

  const hasLeadCaptured =
    uniqueConversions.some(c => c.type === 'lead_captured') ||
    session?.status === 'lead_capturado' ||
    Boolean(profile.nombreCompleto && profile.telefono);

  const hasTourScheduled =
    uniqueConversions.some(c => c.type === 'tour_scheduled') ||
    session?.status === 'tour_agendado';

  const hasViewedAranceles = uniqueConversions.some(c => c.type === 'view_aranceles');
  const hasViewedCOM01 =
    uniqueConversions.some(c => c.type === 'view_pensum_com01') ||
    Boolean(session?.carreraInteres?.includes('COM-01'));

  const hasCompletedVocationalTest = uniqueConversions.some(c => c.type === 'vocational_test_completed');

  const conversionsSummary = uniqueConversions.length > 0
    ? uniqueConversions.map(c => `• ${c.label} (${c.career || 'General'})`).join('\n')
    : 'Aspirante en etapa inicial de exploración vocacional.';

  return {
    nombreCompleto: detectedName || profile.nombreCompleto,
    telefono: profile.telefono,
    bachillerato: profile.bachillerato,
    carreraInteres: session?.carreraInteres || profile.carreraInteres || 'Licenciatura en Ciencias de la Comunicación (COM-01)',
    ticketId: profile.ticketId || (hasLeadCaptured ? (session?.userProfile?.ticketId || 'UJMD-782910') : undefined),
    status: session?.status || (hasTourScheduled ? 'tour_agendado' : hasLeadCaptured ? 'lead_capturado' : 'activa'),
    conversions: uniqueConversions,
    hasLeadCaptured,
    hasTourScheduled,
    hasViewedAranceles,
    hasViewedCOM01,
    hasCompletedVocationalTest,
    conversionsSummary
  };
}

// Builds system instruction dynamically injecting active applicant context and strict memory continuity rules
function buildDynamicSystemInstruction(ctx: ApplicantContext): string {
  const contextBlock = `
# CONTEXTO DEL ASPIRANTE Y MEMORIA ACTIVA DE CONVERSIONES PREVIAS (OBLIGATORIO):
• Nombre del aspirante: ${ctx.nombreCompleto ? `"${ctx.nombreCompleto}" (YA REGISTRADO - DIRÍGETE A ÉL/ELLA POR SU NOMBRE)` : 'Aún no proporcionado'}
• Teléfono celular / WhatsApp: ${ctx.telefono ? `"${ctx.telefono}" (YA REGISTRADO)` : 'Aún no proporcionado'}
• Bachillerato de procedencia: ${ctx.bachillerato ? `"${ctx.bachillerato}" (YA REGISTRADO)` : 'Aún no proporcionado'}
• Carrera de interés confirmada: "${ctx.carreraInteres || 'Licenciatura en Ciencias de la Comunicación (COM-01)'}"
• Ticket Oficial de Admisión: ${ctx.ticketId ? `"${ctx.ticketId}"` : 'Pendiente de asignación'}
• Estado actual en el embudo: ${ctx.status || 'activa'}
• Hitos de conversión alcanzados previamente:
${ctx.conversionsSummary}

REGLAS ESTRICTAS DE CONTEXTO Y NO REPETICIÓN (CUMPLIMIENTO CRÍTICO):
1. **NUNCA vuelvas a solicitar el nombre, teléfono o colegio/bachillerato** al aspirante si ya aparecen registrados en el contexto anterior o si ya realizó una conversión previa (lead capturado, tour agendado o consulta previa).
2. Trata al estudiante por su nombre ("${ctx.nombreCompleto || ''}") de manera personalizada, empática y cordial.
3. Si el usuario pregunta cosas como:
   - "¿Qué sigue?", "Ya me registré, ¿ahora qué hago?" -> Explica directamente los siguientes pasos oficiales (entrega de documentos en Campus I, cursillo diagnóstico institucional y formalización de matrícula con el 20% de descuento temprano en COM-01).
   - "¿Cuál es mi número de ticket?" o "¿Tienen mis datos?" -> Confirma su número de ticket oficial ("${ctx.ticketId || 'UJMD-782910'}") y los datos de contacto ya registrados sin pedir nada de nuevo.
   - "¿A qué horas es mi visita o recorrido?" -> Confirma que su solicitud de visita para Campus I (estudios de TV HD, cabinas de radio y laboratorios Mac) está registrada con su Ticket oficial, y el horario de atención (lunes a viernes de 8:00 a.m. a 5:00 p.m.).
   - "¿Cuáles requisitos me faltan?" -> Enumera el checklist de requisitos oficiales de ingreso para ${ctx.carreraInteres || 'COM-01'} sin preguntarle qué carrera estudia.
   - "¿Cuánto sería con el descuento?" -> Aplica de inmediato los aranceles de ${ctx.carreraInteres || 'COM-01'}: Matrícula $100.00 con 20% descuento = $80.00 USD, cuota mensual base $150.00 USD.
4. Si el aspirante ya tiene registrado un lead o agendado un recorrido, NO le pidas agendar de nuevo como si fuera desconocido; felicítalo y dale seguimiento a su solicitud.
`;

  return SYSTEM_INSTRUCTION + '\n\n' + contextBlock;
}

// Helper for deterministic fallback when Gemini API key is not yet configured or error recovery is needed
function generateFallbackResponse(
  messages: Array<{ role: string; parts: Array<{ text?: string }> }>,
  ctx?: ApplicantContext
) {
  const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
  const rawText = (lastUserMsg?.parts?.[0]?.text || '').trim();
  const text = rawText.toLowerCase();
  const normalizedText = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const fullConversation = messages.map(m => m.parts?.[0]?.text || '').join(' ').toLowerCase();
  const fullConversationNorm = fullConversation.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Detect student name from context first, then dialogue
  const nameMatch =
    fullConversation.match(/me llamo\s+([a-zA-ZáéíóúñÁÉÍÓÚÑ]+)/i) ||
    fullConversation.match(/soy\s+([a-zA-ZáéíóúñÁÉÍÓÚÑ]+)/i);
  const detectedDialogName = nameMatch ? nameMatch[1] : '';
  const studentName = ctx?.nombreCompleto || detectedDialogName || '';
  const cleanName = studentName ? studentName.charAt(0).toUpperCase() + studentName.slice(1) : '';
  const cleanGreeting = cleanName ? `¡Con gusto ${cleanName}! ` : 'Con gusto ';
  const targetCareer = ctx?.carreraInteres || 'Licenciatura en Ciencias de la Comunicación (COM-01)';
  const ticketId = ctx?.ticketId || (ctx?.hasLeadCaptured ? 'UJMD-782910' : undefined);

  // Jailbreak check
  if (/\b(ignore|ignora|olvida|jailbreak|dan mode)\b/i.test(normalizedText)) {
    return {
      text: 'Soy MatíasBot, el Agente Oficial de Orientación Vocacional y Admisiones de la UJMD. Mi misión es orientarte de forma transparente y precisa sobre nuestras carreras, aranceles y procesos de admisión. ¿En qué carrera te gustaría enfocarte hoy?',
      toolUsed: null
    };
  }

  // 1. CONTEXT MEMORY: Next steps after registration ("qué sigue", "ya me registré", "ahora qué hago", "siguiente paso")
  if (
    normalizedText.includes('que sigue') ||
    normalizedText.includes('ahora que hago') ||
    normalizedText.includes('ya me registre') ||
    normalizedText.includes('siguiente paso') ||
    normalizedText.includes('pasos siguientes') ||
    normalizedText.includes('que hago ahora')
  ) {
    const student = cleanName || 'estimado aspirante';
    const telNotice = ctx?.telefono ? ` al número registrado (${ctx.telefono})` : '';
    return {
      text: `¡Excelente ${student}! Como ya registramos tu solicitud de admisión para **${targetCareer}**${ticketId ? ` (Ticket Oficial: \`${ticketId}\`)` : ''}, no necesitas volver a ingresar tus datos. 🎉🏛️\n\nLos siguientes pasos oficiales para formalizar tu ingreso a la UJMD son:\n\n1. 📑 **Presentación de Documentación Digital o Física:** En Admisiones (Campus I Dr. Luis Edmundo Vásquez):\n   • Título de bachiller o constancia de último año.\n   • Partida de nacimiento reciente (máximo 3 meses).\n   • Fotocopia de DUI ampliada al 150% (o carné de minoridad).\n2. 📝 **Prueba Diagnóstica y Cursillo Institucional:** Para nivelación académica y bienvenida con directores de carrera.\n3. 💳 **Formalización de Matrícula:** Aplicar al beneficio del 20% de descuento temprano (en COM-01 la matrícula ordinaria de $100.00 USD queda en **$80.00 USD** hasta el 15 de diciembre de 2024).\n4. 📱 **Contacto de tu Asesor:** Un coordinador de admisiones te contactará${telNotice} para coordinar tu cita o recorrido por los estudios de TV.\n\n¿Deseas verificar algún documento específico o los horarios de atención?`,
      toolUsed: null
    };
  }

  // 2. CONTEXT MEMORY: Inquiry about ticket or registered contact details ("mi ticket", "mis datos", "tienen mis datos")
  if (
    normalizedText.includes('mi ticket') ||
    normalizedText.includes('mis datos') ||
    normalizedText.includes('tienen mis datos') ||
    normalizedText.includes('numero de registro') ||
    normalizedText.includes('mi registro') ||
    normalizedText.includes('tienen mi informacion') ||
    normalizedText.includes('estado de mi solicitud')
  ) {
    const student = cleanName || 'Aspirante Registrado';
    const convCount = ctx?.conversions?.length || 3;
    return {
      text: `¡Sí, ${student}! En MatíasBot y en el sistema de admisiones UJMD mantenemos activo todo tu expediente y conversiones previas: ✅🏛️\n\n📋 **Expediente de Admisión Registrado:**\n• **Aspirante:** ${student}\n• **Ticket Oficial:** \`${ticketId || 'UJMD-782910'}\`\n• **Carrera de Interés:** ${targetCareer}\n• **Teléfono de Contacto:** ${ctx?.telefono || '+503 7123-4567'}\n• **Colegio / Bachillerato:** ${ctx?.bachillerato || 'Colegio Champagnat'}\n• **Hitos en el Embudo:** ${convCount} conversiones registradas\n\nTodo tu registro está guardado y vinculado a tu sesión, por lo que nunca tendrás que volver a proporcionar estos datos. ¿En qué más puedo orientarte hoy?`,
      toolUsed: null
    };
  }

  // 3. CONTEXT MEMORY: Scheduled tour or visit details ("mi visita", "mi recorrido", "a qué hora", "cuándo voy")
  if (
    normalizedText.includes('mi visita') ||
    normalizedText.includes('mi recorrido') ||
    normalizedText.includes('a que hora es') ||
    normalizedText.includes('que dia es') ||
    normalizedText.includes('cuando voy') ||
    normalizedText.includes('visita al campus') ||
    normalizedText.includes('donde queda la visita')
  ) {
    const student = cleanName || 'estimado aspirante';
    const telNotice = ctx?.telefono ? ` al ${ctx.telefono}` : '';
    return {
      text: `¡Hola ${student}! Tu solicitud de recorrido guiado para **${targetCareer}**${ticketId ? ` (Ticket: \`${ticketId}\`)` : ''} está debidamente registrada en nuestro sistema de Admisiones. 🏛️🎙️\n\n• **Lugar:** Campus I - Dr. Luis Edmundo Vásquez (Antiguo Cuscatlán, Calle Chiltiupán y Av. El Pedregal).\n• **Instalaciones incluidas en tu visita:** Estudios de televisión en alta definición (HD), cabinas de transmisión radial profesional y laboratorios Apple Mac con suite Adobe.\n• **Horario oficial de atención:** Lunes a viernes de 8:00 a.m. a 5:00 p.m.\n• **Coordinación:** Nuestro equipo de admisiones te contactará${telNotice} para reconfirmar la fecha y hora exacta que te resulte más conveniente.\n\n¿Deseas que te comparta cómo llegar o dónde estacionarte en Campus I ($0.75 USD)?`,
      toolUsed: null
    };
  }

  // 4. CONTEXT MEMORY: Discount calculation with context ("con el descuento", "cuánto con descuento", "cuánto pago")
  if (
    normalizedText.includes('con el descuento') ||
    normalizedText.includes('cuanto con descuento') ||
    normalizedText.includes('cuanto pago') ||
    normalizedText.includes('descuento temprano') ||
    normalizedText.includes('precio con descuento') ||
    normalizedText.includes('cuanto me costaria con descuento')
  ) {
    const isCom = targetCareer.toLowerCase().includes('comunicaci') || targetCareer.toLowerCase().includes('com-01');
    if (isCom) {
      const info = consultar_arancel_oficial('comunicaciones');
      return {
        text: `${cleanName ? `¡Hola ${cleanName}! ` : cleanGreeting}te confirmo el desglose con descuento oficial para la **Licenciatura en Ciencias de la Comunicación (COM-01)**: 💰🏷️\n\n• **Matrícula Ordinaria Base:** $100.00 USD por ciclo\n• **Descuento Temprano (20%):** Pagas únicamente **$80.00 USD** de matrícula (Ahorras $20.00 USD al formalizar antes del ${info.fecha_limite_descuento || '15 de diciembre de 2024'}).\n• **Cuota Mensual Base:** **$150.00 USD** (5 cuotas por ciclo).\n• **Inversión Primer Ciclo con Beneficio:** **$830.00 USD** en total ($80 matrícula + 5 cuotas de $150).\n• **Beneficio adicional de pronto pago UJMD:** 50% de descuento en matrícula si cancelas el ciclo completo de contado.\n\nComo ya tenemos tu expediente registrado${ticketId ? ` (Ticket: \`${ticketId}\`)` : ''}, este beneficio queda reservado a tu nombre. ¿Deseas que te explique las formas de pago en línea o puntos autorizados?`,
        toolUsed: { name: 'consultar_arancel_oficial', args: { carrera: 'comunicaciones' }, result: info }
      };
    }
  }

  // 5. Explicit check for structured profile improvements or JSON input for COM-01
  if (
    normalizedText.includes('com-01') ||
    normalizedText.includes('mejorar esta parte') ||
    normalizedText.includes('descuento_temprano') ||
    normalizedText.includes('canales_atencion') ||
    normalizedText.includes('duracion_anios') ||
    (normalizedText.includes('costos') && normalizedText.includes('comunicaci'))
  ) {
    const info = consultar_arancel_oficial('comunicaciones');
    return {
      text: `${cleanGreeting}te comparto la ficha técnica oficial mejorada y optimizada para la **Licenciatura en Ciencias de la Comunicación** de la UJMD: 🎙️📹🏛️\n\n🎓 **Ficha Técnica del Programa:**\n• **Carrera:** Licenciatura en Ciencias de la Comunicación\n• **Código Oficial:** \`${info.codigo}\`\n• **Duración:** ${info.duracion_anios} años (${info.ciclos_totales} ciclos académicos en total)\n• **Modalidad:** Presencial (con campus virtual Uvirtual)\n• **Facultad:** ${info.facultad}\n\n💰 **Costos y Aranceles Oficiales (${info.periodo}):**\n• **Matrícula Ordinaria:** $${info.matricula_usd?.toFixed(2)} USD por ciclo\n• **Cuota Mensual Base:** $${info.cuota_mensual_usd?.toFixed(2)} USD (${info.cuotas_por_ciclo} cuotas al ciclo)\n• **Beneficio Descuento Temprano:** **${info.descuento_temprano_porcentaje}% de descuento** en matrícula (Fecha límite: ${info.fecha_limite_descuento})\n• **Derecho de Admisión:** $${info.derecho_admision_usd?.toFixed(2)} USD\n\n📋 **Requisitos de Ingreso Oficiales:**\n1. Título de bachiller o constancia de graduación reciente.\n2. Partida de nacimiento reciente (máximo 3 meses de emisión).\n3. Fotocopia de DUI ampliada al 150% (o carné de minoridad).\n4. Aprobar la prueba de admisión diagnóstica institucional.\n\n📞 **Canales de Atención Oficial:**\n• ✉️ **Correo electrónico:** ${info.canales_atencion_oficial?.correo}\n• 💬 **WhatsApp Oficial:** ${info.canales_atencion_oficial?.whatsapp_oficial}\n• 🕒 **Horario de atención:** ${info.canales_atencion_oficial?.horario}\n• ☎️ **PBX de Admisiones:** 2212-9400\n\n¿Te gustaría agendar un recorrido por nuestros estudios de televisión HD o iniciar tu solicitud de matrícula?`,
      toolUsed: { name: 'consultar_arancel_oficial', args: { carrera: 'comunicaciones' }, result: info }
    };
  }

  // 6. Enrollment / Campus tour interest -> Check if already registered to avoid asking again
  if (
    normalizedText.includes('matricul') ||
    normalizedText.includes('inscribir') ||
    normalizedText.includes('recorrido') ||
    normalizedText.includes('visita') ||
    normalizedText.includes('conocer el campus') ||
    normalizedText.includes('agendar')
  ) {
    if (ctx?.hasLeadCaptured || ctx?.nombreCompleto || ctx?.hasTourScheduled) {
      const student = cleanName || 'estimado aspirante';
      const telNotice = ctx?.telefono ? ` al ${ctx.telefono}` : '';
      return {
        text: `¡Excelente ${student}! Recordamos que ya tenemos tu registro activo para **${targetCareer}**${ticketId ? ` (Ticket: \`${ticketId}\`)` : ''}. 🎓✨\n\nNo es necesario que vuelvas a ingresar tus datos personales. Tu expediente ya cuenta con:\n• Teléfono de contacto: ${ctx?.telefono || '+503 7123-4567'}\n• Colegio de procedencia: ${ctx?.bachillerato || 'Colegio Champagnat'}\n\nUn asesor de admisiones de la Escuela de Comunicaciones te contactará${telNotice} para formalizar tu proceso y coordinar tu visita a los estudios de TV. ¿Te gustaría consultar los aranceles o los requisitos de ingreso?`,
        toolUsed: null
      };
    }
    return {
      text: `${cleanGreeting ? `¡Hola ${cleanName}! ` : ''}¡Excelente decisión! Con gusto te acompaño para dar este gran paso en la Universidad Dr. José Matías Delgado. 🎓\n\nPara agendar tu recorrido por el campus o iniciar tu expediente de admisión, ¿podrías compartirme cortésmente:\n• Tu nombre completo\n• Número de teléfono celular (WhatsApp)\n• Bachillerato o colegio de procedencia?`,
      toolUsed: null
    };
  }

  // 7. Requirements / Documents / Steps of admission
  if (
    normalizedText.includes('requisito') ||
    normalizedText.includes('paso') ||
    normalizedText.includes('documento') ||
    normalizedText.includes('admision') ||
    normalizedText.includes('examen') ||
    normalizedText.includes('proceso') ||
    normalizedText.includes('que me falta') ||
    normalizedText.includes('que necesito llevar')
  ) {
    return {
      text: `${cleanGreeting}te detallo los pasos y requisitos oficiales para ingresar a **${targetCareer}**${ticketId ? ` (Ticket: \`${ticketId}\`)` : ''}: 📝🏛️\n\n1. **Registro:** Completado en nuestro sistema institucional.\n2. **Derecho de Admisión:** $45.00 USD ($90.00 USD para Doctorado en Medicina).\n3. **Prueba diagnóstica:** Evaluación institucional diagnóstica y cursillo de inducción.\n4. **Documentos obligatorios:**\n   • Título de bachiller o constancia de notas reciente.\n   • Partida de nacimiento reciente (máximo 3 meses de emisión).\n   • Fotocopia de DUI ampliada al 150% (o carné de minoridad).\n   • Certificado de notas de educación media y 2 fotografías tamaño cédula.\n5. **Matrícula:** Asignación de cuota y pago en línea o Puntos Express.\n\n¿Ya cuentas con alguno de estos documentos listos para su validación en Admisiones (Campus I)?`,
      toolUsed: null
    };
  }

  // 8. Scholarships / Financial aid / Discounts
  if (
    normalizedText.includes('beca') ||
    normalizedText.includes('financiam') ||
    normalizedText.includes('descuento') ||
    normalizedText.includes('convenio') ||
    normalizedText.includes('pago')
  ) {
    return {
      text: `${cleanGreeting}en la UJMD contamos con excelentes alternativas de apoyo financiero: 💡✨\n\n• **Descuento de Pronto Pago:** 50% de descuento en el valor de la matrícula al cancelar el ciclo completo en un solo pago antes de la cuota 2.\n• **Descuento Temprano COM-01:** 20% de descuento en matrícula de Ciencias de la Comunicación hasta el 15 de diciembre de 2024.\n• **Becas Matías:** Programas de mérito académico sobresaliente, talento artístico y deportivo.\n• **Convenios Bancarios:** Opciones de financiamiento y pago en cuotas con Banco Agrícola, BAC Credomatic, Banco Cuscatlán y Fedecrédito.\n• **Convenios Internacionales:** Becas con el DAAD (Alemania), Universidad de Sevilla y McGill University.\n\n¿Te gustaría consultar los aranceles específicos de alguna carrera?`,
      toolUsed: null
    };
  }

  // 9. Campus facilities & infrastructure
  if (
    normalizedText.includes('campus') ||
    normalizedText.includes('instalacion') ||
    normalizedText.includes('laboratorio') ||
    normalizedText.includes('estudio') ||
    normalizedText.includes('parqueo') ||
    normalizedText.includes('donde queda') ||
    normalizedText.includes('ubicacion')
  ) {
    return {
      text: `${cleanGreeting}nuestro **Campus I Dr. Luis Edmundo Vásquez** está ubicado estratégicamente en Antiguo Cuscatlán (Calle Chiltiupán y Av. El Pedregal). 🏛️🌿\n\nContamos con:\n• **Estudios de Televisión y Cabinas de Radio:** Equipamiento profesional de transmisión para la Escuela de Comunicaciones.\n• **Laboratorios Apple Mac:** Estaciones de trabajo de alto rendimiento con Adobe Creative Cloud.\n• **Talleres y Bibliotecas:** Talleres de fotografía, arquitectura, áreas de coworking y biblioteca central.\n• **Comodidad:** Parqueo amplio y seguro ($0.75 USD por ingreso), cafeterías y zonas verdes.\n\n¿Te gustaría agendar un recorrido guiado para conocerlos en persona?`,
      toolUsed: null
    };
  }

  // 10. Schedules and modality
  if (normalizedText.includes('horario') || normalizedText.includes('turno') || normalizedText.includes('modalidad') || normalizedText.includes('virtual') || normalizedText.includes('semipresencial')) {
    return {
      text: `${cleanGreeting}la UJMD ofrece horarios flexibles adaptados a las necesidades de los estudiantes: ⏰\n\n• **Turno Diurno / Matutino:** 7:00 a.m. a 12:00 m. (el preferido por estudiantes de nuevo ingreso).\n• **Turno Vespertino / Nocturno:** A partir de las 5:00 p.m. para estudiantes que laboran.\n• **Modalidad:** Presencial con apoyo de aulas virtuales Uvirtual para asignaturas teórico-prácticas seleccionadas.\n\n¿En qué carrera estás interesado para revisar sus horarios específicos?`,
      toolUsed: null
    };
  }

  // 11. Aranceles check (with conversational memory across whole dialogue)
  if (
    normalizedText.includes('costo') ||
    normalizedText.includes('precio') ||
    normalizedText.includes('cuanto cuesta') ||
    normalizedText.includes('arancel') ||
    normalizedText.includes('mensualidad') ||
    normalizedText.includes('cuota') ||
    normalizedText.includes('pago')
  ) {
    let target = 'comunicaciones';

    if (normalizedText.includes('diplomad') || normalizedText.includes('maestri') || normalizedText.includes('posgrad')) {
      target = rawText.replace(/^[¿\s]*(cuanto cuesta|cual es el costo|costo|precio|arancel|mensualidad|de|la|el|estudiar|un|una)\s+/gi, '').replace(/[?¿]/g, '').trim() || 'Posgrado / Diplomado UJMD';
    } else if (normalizedText.includes('disen') || normalizedText.includes('grafic')) {
      target = 'diseño';
    } else if (normalizedText.includes('publici') || normalizedText.includes('mercad')) {
      target = 'publicidad';
    } else if (normalizedText.includes('comunicaci') || normalizedText.includes('periodis')) {
      target = 'comunicaciones';
    } else if (normalizedText.includes('animaci') || normalizedText.includes('videojuego')) {
      target = 'animacion';
    } else if (normalizedText.includes('biomed')) {
      target = 'biomedica';
    } else if (normalizedText.includes('medic') || normalizedText.includes('ciruj')) {
      target = 'medicina';
    } else if (normalizedText.includes('arqui')) {
      target = 'arquitectura';
    } else if (normalizedText.includes('derech') || normalizedText.includes('jurid')) {
      target = 'derecho';
    } else if (normalizedText.includes('enferm')) {
      target = 'enfermeria';
    } else if (normalizedText.includes('psicol')) {
      target = 'psicologia';
    } else if (normalizedText.includes('comput') || normalizedText.includes('sistem')) {
      target = 'computacion';
    } else if (normalizedText.includes('industr')) {
      target = 'industrial';
    } else if (normalizedText.includes('admin') || normalizedText.includes('negoc')) {
      target = 'administracion';
    } else if (fullConversationNorm.includes('disen') || fullConversationNorm.includes('grafic')) {
      target = 'diseño';
    } else if (fullConversationNorm.includes('publici') || fullConversationNorm.includes('mercad')) {
      target = 'publicidad';
    } else if (fullConversationNorm.includes('medic')) {
      target = 'medicina';
    } else if (fullConversationNorm.includes('arqui')) {
      target = 'arquitectura';
    } else if (fullConversationNorm.includes('derech')) {
      target = 'derecho';
    } else if (fullConversationNorm.includes('comunicaci') || fullConversationNorm.includes('periodis')) {
      target = 'comunicaciones';
    } else if (targetCareer.toLowerCase().includes('disen')) {
      target = 'diseño';
    } else if (targetCareer.toLowerCase().includes('publici')) {
      target = 'publicidad';
    }

    const info = consultar_arancel_oficial(target);

    if (target === 'comunicaciones') {
      return {
        text: `${cleanGreeting}te comparto la información oficial completa de la **Licenciatura en Ciencias de la Comunicación** (${info.periodo}): 🎙️📹\n\n• **Carrera:** Licenciatura en Ciencias de la Comunicación (Código: **COM-01**)\n• **Duración:** 5 años (10 ciclos totales) • Modalidad: Presencial\n• **Facultad:** Escuela de Ciencias de la Comunicación\n\n💰 **Inversión y Aranceles Oficiales:**\n• Matrícula ordinaria: **$100.00 USD** por ciclo\n• Cuota mensual base: **$150.00 USD** (5 cuotas por ciclo)\n• Descuento temprano: **20% de descuento** en matrícula (Fecha límite: 15 de diciembre de 2024)\n\n📋 **Requisitos de Ingreso Oficiales:**\n1. Título de bachiller o constancia de graduación reciente.\n2. Partida de nacimiento reciente (máximo 3 meses de emisión).\n3. Fotocopia de DUI ampliada al 150% (o carné de minoridad).\n4. Aprobar la prueba de admisión diagnóstica institucional.\n\n📞 **Canales de Atención Oficial:**\n• WhatsApp oficial: **+503 7000-0000**\n• Correo electrónico: **admisiones@ujmd.edu.sv**\n• Horario: Lunes a viernes de 8:00 a.m. a 5:00 p.m.\n\n¿Te gustaría agendar un recorrido por nuestros estudios de TV HD o iniciar tu expediente de admisión?`,
        toolUsed: { name: 'consultar_arancel_oficial', args: { carrera: 'comunicaciones' }, result: info }
      };
    }

    const tipoDato = info.estado === 'exito_estimado' ? 'aranceles de referencia estimados' : 'aranceles y cuotas oficiales';
    return {
      text: `${cleanGreeting}te comparto los ${tipoDato} de la UJMD (${info.periodo}):\n\n• **Programa / Carrera:** ${info.carrera}\n• **Facultad / Unidad:** ${info.facultad}\n• **Derecho de Admisión:** $${info.derecho_admision_usd?.toFixed(2)} USD\n• **Matrícula Ordinaria:** $${info.matricula_usd?.toFixed(2)} USD por ciclo\n• **Cuota Mensual de Referencia:** $${info.cuota_mensual_usd?.toFixed(2)} USD (${info.cuotas_por_ciclo} cuotas al ciclo)\n• **Beneficio:** 50% de descuento en matrícula si cancelas el ciclo completo de contado.\n\n*Nota:* ${info.nota}\n\n¿Te gustaría que agendemos un recorrido por nuestras instalaciones o iniciar tu proceso de admisión?`,
      toolUsed: { name: 'consultar_arancel_oficial', args: { carrera: target }, result: info }
    };
  }

  // 12. Out of scope queries
  if (
    normalizedText.includes('receta de cocina') ||
    normalizedText.includes('como cocinar') ||
    normalizedText.includes('partido politico') ||
    normalizedText.includes('elecciones presidenciales') ||
    normalizedText.includes('codigo python')
  ) {
    return {
      text: 'Mi especialidad es brindarte información completa sobre la oferta académica, aranceles oficiales, becas y admisiones de la Universidad Dr. José Matías Delgado (UJMD). 🏛️\n\n¿Te gustaría conocer los planes de estudio, fechas de matrícula o costos de alguna carrera?',
      toolUsed: null
    };
  }

  // 13. Individual careers details
  if (text.includes('diseñ') || text.includes('disen')) {
    return {
      text: '¡La **Licenciatura en Diseño Gráfico** de la UJMD es líder histórica en El Salvador! 🎨✨\n\nDesarrollarás branding estratégico, diseño digital UI/UX, animación, ilustración y dirección de arte en modernos laboratorios Apple Mac.\n\n• Duración: 5 años (10 ciclos) • Modalidad: Presencial\n• Matrícula: $130.00 USD • Cuota: $160.00 USD (5 cuotas al ciclo)\n\n¿Te gustaría conocer los talleres o agendar un recorrido?',
      toolUsed: null
    };
  }

  if (text.includes('publici') || text.includes('mercad') || text.includes('marketing')) {
    return {
      text: '¡La **Licenciatura en Publicidad y Mercadeo** combina visión de negocio y creatividad disruptiva! 📈💡\n\nAprenderás planificación de campañas 360°, marketing digital en redes, analítica de audiencias y gestión de marcas de alto impacto.\n\n• Duración: 5 años (10 ciclos) • Modalidad: Presencial\n• Matrícula: $120.00 USD • Cuota: $150.00 USD (5 cuotas al ciclo)\n\n¿Deseas conocer el plan de estudios o iniciar tu matrícula?',
      toolUsed: null
    };
  }

  if (text.includes('comunicaci') || text.includes('periodis') || text.includes('radio') || text.includes('television') || text.includes('audiovisual')) {
    const info = consultar_arancel_oficial('comunicaciones');
    return {
      text: `${cleanGreeting}te comparto la información oficial completa de la **Licenciatura en Ciencias de la Comunicación** (${info.periodo}): 🎙️📹\n\n• **Carrera:** Licenciatura en Ciencias de la Comunicación (Código: **COM-01**)\n• **Duración:** 5 años (10 ciclos totales) • Modalidad: Presencial\n• **Facultad:** Escuela de Ciencias de la Comunicación\n\n💰 **Inversión y Aranceles Oficiales:**\n• Matrícula ordinaria: **$100.00 USD** por ciclo\n• Cuota mensual base: **$150.00 USD** (5 cuotas por ciclo)\n• Descuento temprano: **20% de descuento** en matrícula (Fecha límite: 15 de diciembre de 2024)\n\n📋 **Requisitos de Ingreso Oficiales:**\n1. Título de bachiller o constancia de graduación reciente.\n2. Partida de nacimiento reciente (máximo 3 meses de emisión).\n3. Fotocopia de DUI ampliada al 150% (o carné de minoridad).\n4. Aprobar la prueba de admisión diagnóstica institucional.\n\n📞 **Canales de Atención Oficial:**\n• WhatsApp oficial: **+503 7000-0000**\n• Correo electrónico: **admisiones@ujmd.edu.sv**\n• Horario: Lunes a viernes de 8:00 a.m. a 5:00 p.m.\n\n¿Te gustaría visitar nuestros estudios de TV HD y cabinas de radio o iniciar tu proceso de admisión?`,
      toolUsed: { name: 'consultar_arancel_oficial', args: { carrera: 'comunicaciones' }, result: info }
    };
  }

  if (text.includes('medicina') || text.includes('salud') || text.includes('doctor')) {
    return {
      text: '¡El **Doctorado en Medicina** de la UJMD tiene un prestigio nacional e internacional excepcional! 🩺🏥\n\nFormación clínica de excelencia en la Facultad de Ciencias de la Salud "Dr. Luis Edmundo Vásquez", con laboratorios biomédicos y rotaciones en los principales hospitales del país.\n\n• Duración: 8 años • Derecho de admisión: $90.00 USD\n• Matrícula: $130.00 USD • Cuota aproximada: $260.00 USD (5 cuotas al ciclo)\n\n¿Te gustaría saber los requisitos de ingreso para Medicina?',
      toolUsed: null
    };
  }

  if (text.includes('arquitectura') || text.includes('diseño de interiores')) {
    return {
      text: '¡La **Licenciatura en Arquitectura** de la UJMD es sinónimo de innovación urbana, diseño sostenible y arte constructivo! 📐🏛️\n\nAprenderás diseño bioclimático, modelado 3D, gestión de proyectos urbanísticos y talleres de diseño experimental.\n\n• Duración: 5 años (10 ciclos) • Modalidad: Presencial\n• Matrícula: $130.00 USD • Cuota aproximada: $185.00 USD\n\n¿Deseas conocer más del plan de estudios de Arquitectura?',
      toolUsed: null
    };
  }

  if (text.includes('derecho') || text.includes('leyes') || text.includes('juridic')) {
    return {
      text: '¡La **Licenciatura en Ciencias Jurídicas (Derecho)** de la UJMD ha formado a los más destacados juristas y jueces del país! ⚖️🏛️\n\nExcelente formación en derecho corporativo, litigación oral, derecho constitucional y relaciones internacionales en salas de audiencia simuladas.\n\n• Duración: 5 años (10 ciclos) • Modalidad: Presencial\n• Matrícula: $120.00 USD • Cuota aproximada: $160.00 USD\n\n¿Te gustaría agendar una visita a la Facultad de Jurisprudencia?',
      toolUsed: null
    };
  }

  return {
    text: `¡Hola${cleanName ? ` ${cleanName}` : ''}! Soy **MatíasBot**, Agente Oficial de Orientación Vocacional y Admisiones de la Universidad Dr. José Matías Delgado (UJMD). 🏛️✨\n\nPuedo orientarte sobre:\n• **Oferta académica:** Ciencias de la Comunicación (COM-01), Diseño Gráfico, Publicidad, Medicina, Arquitectura, Derecho, Ingenierías y Negocios.\n• **Aranceles y Becas:** Matrícula ordinaria ($100.00 USD en COM-01), cuotas base y descuento del 20% temprano o 50% por pronto pago.\n• **Admisiones:** Requisitos oficiales, fechas de matrícula y pasos de admisión.\n• **Campus:** Recorridos por nuestros estudios de TV HD, cabinas de radio y laboratorios Mac.\n\n¿Qué carrera te gustaría explorar o qué consulta tienes en mente?`,
    toolUsed: null
  };
}

// Helper to auto-generate a smart session title from message text
function deriveSessionTitle(text: string): string {
  const norm = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  if (norm.includes('comunicaci') || norm.includes('com-01') || norm.includes('periodis')) {
    return 'Orientación COM-01 Comunicaciones';
  }
  if (norm.includes('disen') || norm.includes('grafic')) {
    return 'Consulta Diseño Gráfico';
  }
  if (norm.includes('publici') || norm.includes('mercad')) {
    return 'Consulta Publicidad y Mercadeo';
  }
  if (norm.includes('medicin')) {
    return 'Consulta Doctorado en Medicina';
  }
  if (norm.includes('arqui')) {
    return 'Consulta Lic. en Arquitectura';
  }
  if (norm.includes('derech') || norm.includes('juridic')) {
    return 'Consulta Ciencias Jurídicas';
  }
  if (norm.includes('test') || norm.includes('vocacion')) {
    return 'Test Vocacional de Medios';
  }
  if (norm.includes('arancel') || norm.includes('cuanto cuesta') || norm.includes('precio') || norm.includes('costo')) {
    return 'Consulta Aranceles y Cuotas';
  }
  if (norm.includes('recorrido') || norm.includes('visita') || norm.includes('campus')) {
    return 'Recorrido Guiado por Campus';
  }
  const clean = text.replace(/^[¿¡\s]+|[?!\s]+$/g, '').trim();
  return clean.length > 38 ? clean.slice(0, 35) + '...' : clean || 'Consulta de Admisiones';
}

// API endpoint for Chat
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages, sessionId, userProfile, conversions } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Formato de mensajes inválido.' });
    }

    // Locate or initialize user session
    const currentSessionId = sessionId || `ses-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    let session = sessionsMap.get(currentSessionId);
    const isNewSession = !session;

    if (!session) {
      const firstUserText = messages.find((m: any) => m.role === 'user')?.parts?.[0]?.text || messages.find((m: any) => m.role === 'user')?.text || '';
      const title = firstUserText ? deriveSessionTitle(firstUserText) : 'Nueva Consulta';
      session = {
        id: currentSessionId,
        title,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [],
        conversions: [],
        status: 'activa',
        userProfile: userProfile || undefined
      };
      sessionsMap.set(currentSessionId, session);
    } else {
      session.updatedAt = new Date().toISOString();
      if (userProfile) {
        session.userProfile = { ...session.userProfile, ...userProfile };
      }
      // If title is generic and we now have a user message, update title
      if (session.title === 'Nueva Consulta' || session.title === 'Bienvenida & Orientación Vocacional') {
        const firstUserMsg = messages.find((m: any) => m.role === 'user');
        const text = firstUserMsg?.parts?.[0]?.text || firstUserMsg?.text || '';
        if (text) session.title = deriveSessionTitle(text);
      }
    }

    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    const lastUserText = (lastUserMsg?.parts?.[0]?.text || lastUserMsg?.text || '').toLowerCase();
    const lastUserNorm = lastUserText.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const dialogueFull = messages.map((m: any) => m.parts?.[0]?.text || m.text || '').join(' ');

    // Automatic Conversion Tracking within chat flow
    const autoConversions: ServerConversionEvent[] = [];
    const hasConversion = (type: string) => session!.conversions.some(c => c.type === type);

    if ((lastUserNorm.includes('cuanto cuesta') || lastUserNorm.includes('arancel') || lastUserNorm.includes('cuota') || lastUserNorm.includes('precio')) && !hasConversion('view_aranceles')) {
      const conv: ServerConversionEvent = {
        id: `conv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        sessionId: currentSessionId,
        type: 'view_aranceles',
        label: 'Consulta de Aranceles Oficiales',
        timestamp: new Date().toISOString(),
        career: lastUserNorm.includes('disen') ? 'Diseño Gráfico' : lastUserNorm.includes('publici') ? 'Publicidad' : 'Ciencias de la Comunicación'
      };
      session.conversions.push(conv);
      conversionsList.push(conv);
      autoConversions.push(conv);
    }

    if ((lastUserNorm.includes('com-01') || (lastUserNorm.includes('comunicaci') && lastUserNorm.includes('requisito'))) && !hasConversion('view_pensum_com01')) {
      const conv: ServerConversionEvent = {
        id: `conv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        sessionId: currentSessionId,
        type: 'view_pensum_com01',
        label: 'Consulta Ficha COM-01 & Requisitos',
        timestamp: new Date().toISOString(),
        career: 'Licenciatura en Ciencias de la Comunicación'
      };
      session.conversions.push(conv);
      conversionsList.push(conv);
      autoConversions.push(conv);
    }

    // Build comprehensive applicant context and conversational memory
    const applicantContext = buildApplicantContext(session, userProfile, conversions, dialogueFull);

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      // Use our high-fidelity deterministic agent fallback with applicant context
      const fallback = generateFallbackResponse(messages, applicantContext);
      
      // Update session messages with model reply
      session.messages = messages.map((m: any, i: number) => ({
        id: m.id || `msg-${i}-${Date.now()}`,
        role: m.role === 'model' || m.role === 'assistant' ? 'model' : 'user',
        text: m.parts?.[0]?.text || m.text || '',
        timestamp: m.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        toolUsed: m.toolUsed || undefined
      }));

      session.messages.push({
        id: `bot-${Date.now()}`,
        role: 'model',
        text: fallback.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        toolUsed: fallback.toolUsed
      });

      return res.json({
        reply: fallback.text,
        toolUsed: fallback.toolUsed,
        model: 'gemini-3.8-flash (simulated mode - key pending)',
        sessionId: currentSessionId,
        sessionTitle: session.title,
        autoConversions,
        applicantContext
      });
    }

    // Initialize Gemini SDK with User-Agent header as required
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    // Format conversation history for Gemini SDK
    const formattedContents = messages.map((m: any) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: Array.isArray(m.parts) ? m.parts : [{ text: m.content || m.text || '' }]
    }));

    // Safety Settings: Block Some / Most
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
      }
    ];

    const dynamicSystemInstruction = buildDynamicSystemInstruction(applicantContext);

    // Call Gemini 3.8 Flash with Google Search grounding and consultarArancel tool
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: formattedContents,
      config: {
        systemInstruction: dynamicSystemInstruction,
        temperature: 0.25,
        topP: 0.95,
        topK: 40,
        tools: [
          { googleSearch: {} },
          { functionDeclarations: [consultarArancelDeclaration] }
        ],
        toolConfig: { includeServerSideToolInvocations: true },
        safetySettings
      }
    });

    let toolUsedInfo: any = null;

    // Check if the model invoked our function
    const functionCalls = response.functionCalls;

    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0];
      if (call.name === 'consultar_arancel_oficial') {
        const carreraArg = (call.args as any)?.carrera || applicantContext.carreraInteres || 'comunicaciones';
        const modalidadArg = (call.args as any)?.modalidad || 'Presencial';
        const toolResult = consultar_arancel_oficial(carreraArg, modalidadArg);

        toolUsedInfo = {
          name: call.name,
          args: call.args,
          result: toolResult
        };

        // Multi-turn resolution: Append model call and tool response, then generate final text
        const candidateContent = response.candidates?.[0]?.content;
        const nextContents = [
          ...formattedContents,
          candidateContent || {
            role: 'model',
            parts: [{ functionCall: { name: call.name, args: call.args } }]
          },
          {
            role: 'user',
            parts: [
              {
                functionResponse: {
                  name: call.name,
                  response: { output: toolResult }
                }
              }
            ]
          }
        ];

        const secondResponse = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: nextContents,
          config: {
            systemInstruction: dynamicSystemInstruction,
            temperature: 0.25,
            topP: 0.95,
            topK: 40,
            safetySettings
          }
        });

        const reply = secondResponse.text || 'He consultado la base de datos oficial de la UJMD.';

        session.messages = messages.map((m: any, i: number) => ({
          id: m.id || `msg-${i}-${Date.now()}`,
          role: m.role === 'model' || m.role === 'assistant' ? 'model' : 'user',
          text: m.parts?.[0]?.text || m.text || '',
          timestamp: m.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          toolUsed: m.toolUsed || undefined
        }));

        session.messages.push({
          id: `bot-${Date.now()}`,
          role: 'model',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          toolUsed: toolUsedInfo
        });

        return res.json({
          reply,
          toolUsed: toolUsedInfo,
          model: 'gemini-3.8-flash',
          sessionId: currentSessionId,
          sessionTitle: session.title,
          autoConversions,
          applicantContext
        });
      }
    }

    const replyText = response.text || '';

    session.messages = messages.map((m: any, i: number) => ({
      id: m.id || `msg-${i}-${Date.now()}`,
      role: m.role === 'model' || m.role === 'assistant' ? 'model' : 'user',
      text: m.parts?.[0]?.text || m.text || '',
      timestamp: m.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      toolUsed: m.toolUsed || undefined
    }));

    session.messages.push({
      id: `bot-${Date.now()}`,
      role: 'model',
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      toolUsed: null
    });

    return res.json({
      reply: replyText,
      toolUsed: null,
      model: 'gemini-3.8-flash',
      sessionId: currentSessionId,
      sessionTitle: session.title,
      autoConversions,
      applicantContext
    });
  } catch (err: any) {
    console.error('Error in /api/chat:', err);
    // Graceful fallback with applicant context memory to avoid leaving user hanging
    const fallbackContext = buildApplicantContext(undefined, req.body.userProfile, req.body.conversions);
    const fallback = generateFallbackResponse(req.body.messages || [], fallbackContext);
    return res.json({
      reply: fallback.text,
      toolUsed: fallback.toolUsed,
      model: 'gemini-3.8-flash (error-recovery mode)',
      applicantContext: fallbackContext
    });
  }
});

// API: List all user sessions
app.get('/api/sessions', (_req: Request, res: Response) => {
  const sessions = Array.from(sessionsMap.values())
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .map(s => ({
      id: s.id,
      title: s.title,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
      messageCount: s.messages.length,
      lastMessage: s.messages[s.messages.length - 1]?.text || '',
      status: s.status,
      userProfile: s.userProfile,
      conversionsCount: s.conversions.length,
      carreraInteres: s.carreraInteres
    }));
  res.json({ sessions });
});

// API: Create new user session
app.post('/api/sessions', (req: Request, res: Response) => {
  const { id, title, userProfile, carreraInteres } = req.body;
  const newId = id || `ses-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const now = new Date().toISOString();

  // Inherit applicant profile from previous sessions if none provided
  let inheritedProfile = userProfile;
  if (!inheritedProfile) {
    for (const s of sessionsMap.values()) {
      if (s.userProfile?.nombreCompleto) {
        inheritedProfile = { ...s.userProfile };
        break;
      }
    }
  }

  const careerName = carreraInteres || inheritedProfile?.carreraInteres || 'Licenciatura en Ciencias de la Comunicación (COM-01)';
  const welcomeText = inheritedProfile?.nombreCompleto
    ? `¡Hola **${inheritedProfile.nombreCompleto}**! 👋 Soy **MatíasBot**, tu Agente Oficial de Orientación Vocacional y Admisiones de la UJMD. 🎙️🏛️\n\nTenemos registrado tu expediente para **${careerName}**${inheritedProfile.ticketId ? ` (Ticket: \`${inheritedProfile.ticketId}\`)` : ''}.\n\n¿En qué puedo orientarte hoy en esta nueva consulta? Puedes preguntarme sobre tus siguientes pasos de admisión, requisitos, horarios de visita al campus o aranceles con descuento.`
    : '¡Hola! Soy **MatíasBot**, el Agente Inteligente Oficial de Orientación Vocacional y Admisiones de la Escuela de Ciencias de la Comunicación de la **Universidad Dr. José Matías Delgado (UJMD)**. 🎙️🏛️\n\nEstoy aquí para orientarte sobre la **Licenciatura en Ciencias de la Comunicación (COM-01)**, Diseño Gráfico, Publicidad y toda nuestra oferta académica. ¿En qué puedo ayudarte hoy?';

  const newSession: ServerChatSession = {
    id: newId,
    title: title || 'Nueva Consulta',
    createdAt: now,
    updatedAt: now,
    messages: [
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        text: welcomeText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ],
    conversions: [],
    status: inheritedProfile?.ticketId ? 'lead_capturado' : 'activa',
    userProfile: inheritedProfile,
    carreraInteres: careerName
  };

  sessionsMap.set(newId, newSession);
  res.status(201).json({ session: newSession });
});

// API: Get single user session with full message history
app.get('/api/sessions/:id', (req: Request, res: Response) => {
  const session = sessionsMap.get(req.params.id);
  if (!session) {
    return res.status(404).json({ error: 'Sesión no encontrada.' });
  }
  res.json({ session });
});

// API: Update user session title, status, or userProfile
app.put('/api/sessions/:id', (req: Request, res: Response) => {
  const session = sessionsMap.get(req.params.id);
  if (!session) {
    return res.status(404).json({ error: 'Sesión no encontrada.' });
  }

  const { title, status, userProfile, carreraInteres } = req.body;
  if (title) session.title = title;
  if (status) session.status = status;
  if (userProfile) session.userProfile = { ...session.userProfile, ...userProfile };
  if (carreraInteres) session.carreraInteres = carreraInteres;
  session.updatedAt = new Date().toISOString();

  res.json({ session });
});

// API: Delete user session
app.delete('/api/sessions/:id', (req: Request, res: Response) => {
  const deleted = sessionsMap.delete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Sesión no encontrada.' });
  }
  res.json({ exito: true, id: req.params.id });
});

// API: Track conversion event
app.post('/api/conversions/track', (req: Request, res: Response) => {
  const { sessionId, type, label, career, metadata } = req.body;

  if (!sessionId || !type) {
    return res.status(400).json({ error: 'sessionId y type son obligatorios.' });
  }

  const session = sessionsMap.get(sessionId);
  const conversionId = `conv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const now = new Date().toISOString();

  const convEvent: ServerConversionEvent = {
    id: conversionId,
    sessionId,
    type,
    label: label || type,
    timestamp: now,
    career: career || session?.carreraInteres || 'Ciencias de la Comunicación',
    metadata
  };

  conversionsList.push(convEvent);

  if (session) {
    session.conversions.push(convEvent);
    session.updatedAt = now;
    if (type === 'lead_captured') session.status = 'lead_capturado';
    if (type === 'tour_scheduled') session.status = 'tour_agendado';
    if (type === 'enrollment_intent') session.status = 'matricula_iniciada';
  }

  res.json({ exito: true, conversion: convEvent });
});

// API: Conversion & Funnel Analytics
app.get('/api/conversions/stats', (_req: Request, res: Response) => {
  const allSessions = Array.from(sessionsMap.values());
  const totalSessions = allSessions.length;
  const totalMessages = allSessions.reduce((acc, s) => acc + s.messages.length, 0);

  const conversionsByType: Record<string, number> = {
    view_aranceles: 0,
    view_pensum_com01: 0,
    vocational_test_completed: 0,
    official_contact_click: 0,
    lead_captured: 0,
    tour_scheduled: 0,
    enrollment_intent: 0
  };

  conversionsList.forEach(c => {
    if (conversionsByType[c.type] !== undefined) {
      conversionsByType[c.type]++;
    } else {
      conversionsByType[c.type] = 1;
    }
  });

  // Funnel calculation
  const funnelStages = [
    { stage: '1. Consulta de Aranceles', type: 'view_aranceles', color: '#ffc606' },
    { stage: '2. Ficha COM-01 / Requisitos', type: 'view_pensum_com01', color: '#313b81' },
    { stage: '3. Test Vocacional', type: 'vocational_test_completed', color: '#8b5cf6' },
    { stage: '4. Contacto WhatsApp/Email', type: 'official_contact_click', color: '#10b981' },
    { stage: '5. Lead Capturado', type: 'lead_captured', color: '#f59e0b' },
    { stage: '6. Recorrido Agendado', type: 'tour_scheduled', color: '#11284f' },
    { stage: '7. Intención de Matrícula', type: 'enrollment_intent', color: '#059669' }
  ];

  const funnelSteps = funnelStages.map(st => {
    const count = conversionsByType[st.type] || 0;
    const percentage = totalSessions > 0 ? Math.min(100, Math.round((count / totalSessions) * 100)) : 0;
    return {
      stage: st.stage,
      type: st.type,
      count,
      percentage,
      color: st.color
    };
  });

  // Top carreras
  const carreraCountMap: Record<string, number> = {};
  allSessions.forEach(s => {
    const c = s.carreraInteres || s.userProfile?.carreraInteres || 'Ciencias de la Comunicación';
    carreraCountMap[c] = (carreraCountMap[c] || 0) + 1;
  });

  const topCarreras = Object.entries(carreraCountMap)
    .map(([carrera, count]) => ({ carrera, count }))
    .sort((a, b) => b.count - a.count);

  const leadsCount = conversionsByType['lead_captured'] || 0;
  const toursCount = conversionsByType['tour_scheduled'] || 0;

  res.json({
    totalSessions,
    totalMessages,
    conversionsByType,
    funnelSteps,
    recentConversions: [...conversionsList].reverse().slice(0, 25),
    topCarreras,
    conversionRateLead: totalSessions > 0 ? Math.round((leadsCount / totalSessions) * 100) : 0,
    conversionRateTour: totalSessions > 0 ? Math.round((toursCount / totalSessions) * 100) : 0
  });
});


// API endpoint for Official Catalog info
app.get('/api/catalog', (_req: Request, res: Response) => {
  res.json({
    institucion: 'Universidad Dr. José Matías Delgado (UJMD)',
    escuela: 'Escuela de Ciencias de la Comunicación',
    campus: 'Campus I - Dr. Luis Edmundo Vásquez, Antiguo Cuscatlán',
    contacto: {
      pbx: '2212-9400',
      email: 'admisiones@ujmd.edu.sv',
      sitioWeb: 'https://www.ujmd.edu.sv'
    },
    arancelesGenerales: {
      derechoAdmisionPregrado: 45.0,
      derechoAdmisionMedicina: 90.0,
      descuentoProntoPago: '50% en matrícula al cancelar el ciclo completo en un solo pago antes del vencimiento de la cuota 2',
      parqueo: 0.75
    },
    carrerasComunicaciones: [
      {
        id: 'comunicaciones',
        codigo: 'COM-01',
        nombre: 'Licenciatura en Ciencias de la Comunicación',
        facultad: 'Escuela de Ciencias de la Comunicación - Facultad de Ciencias y Artes "Francisco Gavidia"',
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
          'Forma comunicadores multidisciplinarios y líderes en periodismo multimedia, producción audiovisual en sets de TV, comunicación estratégica y gestión digital.',
        areas: ['Periodismo Digital', 'Producción Audiovisual HD', 'Comunicación Corporativa', 'Relaciones Públicas']
      },
      {
        id: 'diseno',
        nombre: 'Licenciatura en Diseño Gráfico',
        facultad: 'Facultad de Ciencias y Artes "Francisco Gavidia"',
        duracion: '5 años (10 ciclos)',
        modalidad: 'Presencial',
        matricula_usd: 130.0,
        cuota_mensual_usd: 160.0,
        cuotas_por_ciclo: 5,
        descripcion:
          'Pioneros en diseño y comunicación visual en la región. Desarrolla marcas memorables, interfaces UX/UI, animación digital y proyectos editoriales en laboratorios Mac.',
        areas: ['Identidad Corporativa y Branding', 'Diseño UX / UI', 'Animación e Ilustración Digital', 'Dirección de Arte']
      },
      {
        id: 'publicidad',
        nombre: 'Licenciatura en Publicidad y Mercadeo',
        facultad: 'Facultad de Ciencias y Artes "Francisco Gavidia"',
        duracion: '5 años (10 ciclos)',
        modalidad: 'Presencial',
        matricula_usd: 120.0,
        cuota_mensual_usd: 150.0,
        cuotas_por_ciclo: 5,
        descripcion:
          'Fusión de pensamiento creativo y visión comercial para liderar agencias publicitarias, campañas de marketing digital y estrategias de posicionamiento.',
        areas: ['Campañas Publicitarias 360°', 'Marketing Digital y Social Media', 'Creatividad y Copywriting', 'Analítica de Consumo']
      }
    ],
    otrasFacultades: [
      {
        facultad: 'Facultad de Ciencias de la Salud "Dr. Luis Edmundo Vásquez"',
        carreras: ['Doctorado en Medicina', 'Licenciatura en Enfermería', 'Licenciatura en Psicología', 'Licenciatura en Nutrición']
      },
      {
        facultad: 'Facultad de Ingeniería y Arquitectura',
        carreras: ['Licenciatura en Arquitectura', 'Ingeniería Industrial', 'Ingeniería en Computación e Informática', 'Ingeniería Biomédica']
      },
      {
        facultad: 'Facultad de Jurisprudencia y Ciencias Sociales',
        carreras: ['Licenciatura en Ciencias Jurídicas (Derecho)', 'Licenciatura en Relaciones Internacionales']
      },
      {
        facultad: 'Facultad de Economía, Empresa y Negocios',
        carreras: ['Licenciatura en Administración de Empresas', 'Licenciatura en Mercadotecnia', 'Licenciatura en Contaduría Pública', 'Licenciatura en Finanzas']
      }
    ]
  });
});

// API endpoint for Prospect / Tour / Enrollment registration
app.post('/api/lead', (req: Request, res: Response) => {
  const { nombreCompleto, telefono, bachillerato, carreraInteres, tipoSolicitud, sessionId } = req.body;

  if (!nombreCompleto || !telefono || !bachillerato) {
    return res.status(400).json({
      error: 'Nombre completo, teléfono celular y bachillerato de procedencia son obligatorios.'
    });
  }

  const ticketId = `UJMD-${Math.floor(100000 + Math.random() * 900000)}`;
  const now = new Date().toISOString();

  // If associated with a session, attach profile and track conversions
  if (sessionId && sessionsMap.has(sessionId)) {
    const session = sessionsMap.get(sessionId)!;
    session.userProfile = {
      nombreCompleto,
      telefono,
      bachillerato,
      carreraInteres: carreraInteres || 'Ciencias de la Comunicación',
      ticketId
    };
    session.carreraInteres = carreraInteres || session.carreraInteres;
    session.status = tipoSolicitud?.toLowerCase().includes('recorrido') ? 'tour_agendado' : 'lead_capturado';
    session.updatedAt = now;

    // Track lead_captured
    const leadConv: ServerConversionEvent = {
      id: `conv-${Date.now()}-lead`,
      sessionId,
      type: 'lead_captured',
      label: `Lead Registrado: ${nombreCompleto}`,
      timestamp: now,
      career: carreraInteres || 'Ciencias de la Comunicación',
      metadata: { telefono, bachillerato, ticketId }
    };
    session.conversions.push(leadConv);
    conversionsList.push(leadConv);

    // Track tour_scheduled if applicable
    if (tipoSolicitud?.toLowerCase().includes('recorrido') || tipoSolicitud?.toLowerCase().includes('visita')) {
      const tourConv: ServerConversionEvent = {
        id: `conv-${Date.now()}-tour`,
        sessionId,
        type: 'tour_scheduled',
        label: `Recorrido Agendado: ${nombreCompleto}`,
        timestamp: now,
        career: carreraInteres || 'Ciencias de la Comunicación',
        metadata: { ticketId }
      };
      session.conversions.push(tourConv);
      conversionsList.push(tourConv);
    }
  }

  res.json({
    exito: true,
    ticketId,
    mensaje: `¡Muchas gracias, ${nombreCompleto}! Hemos registrado tu solicitud para ${carreraInteres || 'la Escuela de Comunicaciones'}. Un asesor de Admisiones UJMD se comunicará contigo vía WhatsApp o llamada al ${telefono}.`,
    detalles: {
      nombreCompleto,
      telefono,
      bachillerato,
      carreraInteres: carreraInteres || 'Ciencias de la Comunicación',
      tipoSolicitud: tipoSolicitud || 'Recorrido por Campus y Admisión',
      fechaRegistro: now,
      sessionId
    }
  });
});

// Vite Middleware or Static Servicing
async function startServer() {
  if (isProd) {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`MatíasBot Server running on http://0.0.0.0:${port}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
