export interface Professional {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export interface WeeklyBlock {
  professionalId: string;
  professionalName: string;
  startTime: string;
  endTime: string;
  reason: string;
}

export const WEEKLY_BLOCKS: WeeklyBlock[] = [
  // Dhionara Sbrussi (...01)
  { professionalId: '00000000-0000-0000-0000-000000000001', professionalName: 'Dhionara Sbrussi', startTime: '07:00', endTime: '09:00', reason: 'AUSÊNCIA DO PROFISSIONAL SEMANA' },
  { professionalId: '00000000-0000-0000-0000-000000000001', professionalName: 'Dhionara Sbrussi', startTime: '10:15', endTime: '11:30', reason: 'AUSÊNCIA DO PROFISSIONAL SEMANA' },
  { professionalId: '00000000-0000-0000-0000-000000000001', professionalName: 'Dhionara Sbrussi', startTime: '11:45', endTime: '13:30', reason: 'AUSÊNCIA DO PROFISSIONAL SEMANA' },
  { professionalId: '00000000-0000-0000-0000-000000000001', professionalName: 'Dhionara Sbrussi', startTime: '18:30', endTime: '23:00', reason: 'AUSÊNCIA DO PROFISSIONAL SEMANA' },

  // Dhiani Sbrussi (...02)
  { professionalId: '00000000-0000-0000-0000-000000000002', professionalName: 'Dhiani Sbrussi', startTime: '11:15', endTime: '13:30', reason: 'AUSÊNCIA DO PROFISSIONAL SEMANA' },
  { professionalId: '00000000-0000-0000-0000-000000000002', professionalName: 'Dhiani Sbrussi', startTime: '17:00', endTime: '23:00', reason: 'AUSÊNCIA DO PROFISSIONAL SEMANA' },

  // Luciane Castanheira (...03)
  { professionalId: '00000000-0000-0000-0000-000000000003', professionalName: 'Luciane Castanheira', startTime: '10:45', endTime: '14:00', reason: 'AUSÊNCIA DO PROFISSIONAL SEMANA' },
  { professionalId: '00000000-0000-0000-0000-000000000003', professionalName: 'Luciane Castanheira', startTime: '19:00', endTime: '23:00', reason: 'AUSÊNCIA DO PROFISSIONAL SEMANA' },

  // Tais Pires (...04)
  { professionalId: '00000000-0000-0000-0000-000000000004', professionalName: 'Tais Pires', startTime: '11:45', endTime: '14:00', reason: 'AUSÊNCIA DO PROFISSIONAL SEMANA' },
  { professionalId: '00000000-0000-0000-0000-000000000004', professionalName: 'Tais Pires', startTime: '18:30', endTime: '23:00', reason: 'AUSÊNCIA DO PROFISSIONAL SEMANA' },

  // Bruna Castanheira (...05)
  { professionalId: '00000000-0000-0000-0000-000000000005', professionalName: 'Bruna Castanheira', startTime: '07:00', endTime: '14:00', reason: 'AUSÊNCIA DO PROFISSIONAL SEMANA' },
  { professionalId: '00000000-0000-0000-0000-000000000005', professionalName: 'Bruna Castanheira', startTime: '19:00', endTime: '23:00', reason: 'AUSÊNCIA DO PROFISSIONAL SEMANA' },

  // Michele Quintana (...06)
  { professionalId: '00000000-0000-0000-0000-000000000006', professionalName: 'Michele Quintana', startTime: '11:30', endTime: '13:30', reason: 'AUSÊNCIA DO PROFISSIONAL SEMANA' },
  { professionalId: '00000000-0000-0000-0000-000000000006', professionalName: 'Michele Quintana', startTime: '18:00', endTime: '23:00', reason: 'AUSÊNCIA DO PROFISSIONAL SEMANA' },

  // Patricia Armanda (...07)
  { professionalId: '00000000-0000-0000-0000-000000000007', professionalName: 'Patricia Armanda', startTime: '09:30', endTime: '14:00', reason: 'AUSÊNCIA DO PROFISSIONAL SEMANA' },
];

export interface Service {
  id: string;
  name: string;
  duration: number; // in minutes
  price: number | null; // null = "consulta avaliação" or "encaminhar dr bruna"
  priceNote?: string; // e.g. "encaminhar dr bruna", "consulta avaliação", "sem custo"
  professionalIds: string[]; // which professionals perform this service
  category: string;
}

export interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  professionalId: string;
  serviceNames: string[];
  date: string;
  time: string;
  status: 'agendado' | 'confirmado' | 'cancelado' | 'atendido' | 'espera' | 'atendendo' | 'atrasado' | 'falta';
  notes?: string;
  executedBy?: string;
}

export const professionals: Professional[] = [
  { id: '00000000-0000-0000-0000-000000000001', name: 'Dhionara Sbrussi', role: 'Micropigmentação / Estética', avatar: 'DS' },
  { id: '00000000-0000-0000-0000-000000000002', name: 'Dhiani Sbrussi', role: 'Corporal / Estética', avatar: 'DS' },
  { id: '00000000-0000-0000-0000-000000000003', name: 'Luciane Castanheira', role: 'Manicure / Pedicure', avatar: 'LC' },
  { id: '00000000-0000-0000-0000-000000000004', name: 'Tais Pires', role: 'Estética / Depilação', avatar: 'TP' },
  { id: '00000000-0000-0000-0000-000000000005', name: 'Bruna Castanheira', role: 'Biomédica / Injetáveis', avatar: 'BC' },
  { id: '00000000-0000-0000-0000-000000000006', name: 'Michele Quintana', role: 'Enfermeira / Injetáveis', avatar: 'MQ' },
  { id: '00000000-0000-0000-0000-000000000007', name: 'Patricia Armanda', role: 'Nail Designer', avatar: 'PA' },
];

// Helper to find professional IDs by name fragments
const findProfIds = (...names: string[]): string[] => {
  const map: Record<string, string> = {
    dhionara: '00000000-0000-0000-0000-000000000001',
    dhiani: '00000000-0000-0000-0000-000000000002',
    luciane: '00000000-0000-0000-0000-000000000003',
    tais: '00000000-0000-0000-0000-000000000004',
    bruna: '00000000-0000-0000-0000-000000000005',
    michele: '00000000-0000-0000-0000-000000000006',
    michel: '00000000-0000-0000-0000-000000000006',
    patricia: '00000000-0000-0000-0000-000000000007',
    todos: 'all',
  };
  const ids: string[] = [];
  for (const n of names) {
    const key = n.toLowerCase().split(' ')[0];
    if (key === 'todos') return professionals.map(p => p.id);
    const id = map[key];
    if (id && !ids.includes(id)) ids.push(id);
  }
  return ids;
};

// Parse duration string "HH:MM:SS" to minutes
const parseDuration = (d: string): number => {
  const parts = d.split(':').map(Number);
  return (parts[0] || 0) * 60 + (parts[1] || 0);
};

// Parse price string to number or null
const parsePrice = (p: string): { price: number | null; priceNote?: string } => {
  if (!p) return { price: null, priceNote: 'consulta avaliação' };
  const lower = p.toLowerCase().trim();
  if (lower.includes('encaminhar')) return { price: null, priceNote: 'encaminhar dr bruna' };
  if (lower.includes('consulta') || lower.includes('avaliação')) return { price: null, priceNote: 'consulta avaliação' };
  if (lower === 'sem custo' || lower === '0,00') return { price: 0, priceNote: 'sem custo' };
  if (lower.startsWith('r$')) {
    const num = parseFloat(lower.replace('r$', '').replace('.', '').replace(',', '.').replace('-', '0').trim());
    return { price: isNaN(num) ? 0 : num };
  }
  return { price: null, priceNote: lower };
};

// Real services from Produto_ou_Servico.xls
export const services: Service[] = [
  // Bruna Castanheira
  { id: 'srv1', name: 'Aplicação de Botox', duration: 90, ...parsePrice('encaminhar dr bruna'), professionalIds: ['5'], category: 'Injetáveis' },
  { id: 'srv2', name: 'ATA CROSS', duration: 30, ...parsePrice('encaminhar dr bruna'), professionalIds: ['5'], category: 'Facial' },
  { id: 'srv3', name: 'Banco de Colágeno', duration: 90, ...parsePrice('encaminhar dr bruna'), professionalIds: ['5'], category: 'Facial' },
  { id: 'srv4', name: 'Bioestimulador com Elleva', duration: 60, ...parsePrice('encaminhar dr bruna'), professionalIds: ['5'], category: 'Injetáveis' },
  { id: 'srv5', name: 'Bioestimulador com Harmonyca', duration: 60, ...parsePrice('encaminhar dr bruna'), professionalIds: ['5'], category: 'Injetáveis' },
  { id: 'srv6', name: 'Bioestimulador com Radiesse', duration: 60, ...parsePrice('encaminhar dr bruna'), professionalIds: ['5'], category: 'Injetáveis' },
  { id: 'srv7', name: 'Bioestimulador com Sculptra', duration: 60, ...parsePrice('encaminhar dr bruna'), professionalIds: ['5'], category: 'Injetáveis' },
  { id: 'srv8', name: 'Bioestimulador de Gluteo', duration: 60, ...parsePrice('encaminhar dr bruna'), professionalIds: ['5'], category: 'Injetáveis' },
  { id: 'srv9', name: 'Harmonização Facial', duration: 120, ...parsePrice('encaminhar dr bruna'), professionalIds: ['5'], category: 'Injetáveis' },
  { id: 'srv10', name: 'Lavieen', duration: 60, ...parsePrice('encaminhar dr bruna'), professionalIds: ['5'], category: 'Facial' },
  { id: 'srv11', name: 'Lipo de Papada', duration: 30, ...parsePrice('encaminhar dr bruna'), professionalIds: ['5'], category: 'Injetáveis' },
  { id: 'srv12', name: 'Peeling para Acne Cisteamine', duration: 30, ...parsePrice('encaminhar dr bruna'), professionalIds: ['5'], category: 'Facial' },
  { id: 'srv13', name: 'Peeling para Melasma', duration: 30, ...parsePrice('encaminhar dr bruna'), professionalIds: ['5'], category: 'Facial' },
  { id: 'srv14', name: 'Peeling para Rejuvenescimento', duration: 30, ...parsePrice('encaminhar dr bruna'), professionalIds: ['5'], category: 'Facial' },
  { id: 'srv15', name: 'Preenchedor de Glúteo', duration: 60, ...parsePrice('encaminhar dr bruna'), professionalIds: ['5'], category: 'Injetáveis' },
  { id: 'srv16', name: 'Preenchimento Bigodinho Chinês', duration: 60, ...parsePrice('encaminhar dr bruna'), professionalIds: ['5'], category: 'Injetáveis' },
  { id: 'srv17', name: 'Preenchimento de Mandíbula', duration: 60, ...parsePrice('encaminhar dr bruna'), professionalIds: ['5'], category: 'Injetáveis' },
  { id: 'srv18', name: 'Preenchimento de Mento', duration: 60, ...parsePrice('encaminhar dr bruna'), professionalIds: ['5'], category: 'Injetáveis' },
  { id: 'srv19', name: 'Preenchimento de Olheiras', duration: 60, ...parsePrice('encaminhar dr bruna'), professionalIds: ['5'], category: 'Injetáveis' },
  { id: 'srv20', name: 'Preenchimento de Têmporas', duration: 60, ...parsePrice('encaminhar dr bruna'), professionalIds: ['5'], category: 'Injetáveis' },
  { id: 'srv21', name: 'Preenchimento de Zigomático', duration: 60, ...parsePrice('encaminhar dr bruna'), professionalIds: ['5'], category: 'Injetáveis' },
  { id: 'srv22', name: 'Preenchimento Labial', duration: 60, ...parsePrice('encaminhar dr bruna'), professionalIds: ['5'], category: 'Injetáveis' },
  { id: 'srv23', name: 'Preenchimento Linha Marionete', duration: 60, ...parsePrice('encaminhar dr bruna'), professionalIds: ['5'], category: 'Injetáveis' },
  { id: 'srv24', name: 'Preenchimento Malar', duration: 60, ...parsePrice('encaminhar dr bruna'), professionalIds: ['5'], category: 'Injetáveis' },
  { id: 'srv25', name: 'Rinomodelação', duration: 90, ...parsePrice('encaminhar dr bruna'), professionalIds: ['5'], category: 'Injetáveis' },
  { id: 'srv26', name: 'Skinbooster', duration: 45, ...parsePrice('encaminhar dr bruna'), professionalIds: ['5'], category: 'Injetáveis' },
  { id: 'srv27', name: 'Terapia Capilar', duration: 30, ...parsePrice('encaminhar dr bruna'), professionalIds: ['5'], category: 'Capilar' },
  { id: 'srv28', name: 'Ultraformer', duration: 120, ...parsePrice('consulta avaliação'), professionalIds: ['5'], category: 'Facial' },

  // Dhiani Sbrussi
  { id: 'srv29', name: 'Massagem', duration: 60, ...parsePrice('consulta avaliação'), professionalIds: ['2'], category: 'Corporal' },
  { id: 'srv30', name: 'Tratamento Celulite', duration: 60, ...parsePrice('consulta avaliação'), professionalIds: ['2'], category: 'Corporal' },
  { id: 'srv31', name: 'Tratamento Corporal', duration: 60, ...parsePrice('consulta avaliação'), professionalIds: ['2'], category: 'Corporal' },
  { id: 'srv32', name: 'Tratamento Laser', duration: 30, ...parsePrice('consulta avaliação'), professionalIds: ['2'], category: 'Corporal' },
  { id: 'srv33', name: 'Tratamento Luz Pulsada', duration: 30, ...parsePrice('consulta avaliação'), professionalIds: ['2'], category: 'Corporal' },
  { id: 'srv34', name: 'Tratamento Estrias', duration: 60, ...parsePrice('consulta avaliação'), professionalIds: ['2'], category: 'Corporal' },
  { id: 'srv35', name: 'Ventosaterapia', duration: 60, price: 130, professionalIds: ['2'], category: 'Corporal' },
  { id: 'srv36', name: 'Drenagem Linfática', duration: 45, price: 120, professionalIds: ['2'], category: 'Corporal' },
  { id: 'srv37', name: 'Prime Bumbum', duration: 60, ...parsePrice('consulta avaliação'), professionalIds: ['2'], category: 'Corporal' },
  { id: 'srv38', name: 'Carboxiterapia', duration: 60, ...parsePrice('consulta avaliação'), professionalIds: ['2'], category: 'Corporal' },
  { id: 'srv39', name: 'Jato de Plasma', duration: 60, ...parsePrice('consulta avaliação'), professionalIds: ['2'], category: 'Corporal' },
  { id: 'srv40', name: 'Pós Operatório', duration: 60, price: 150, professionalIds: ['2'], category: 'Corporal' },

  // Dhiani + Tais (shared)
  { id: 'srv41', name: 'Limpeza de Pele', duration: 60, price: 160, professionalIds: ['2', '4'], category: 'Facial' },
  { id: 'srv42', name: 'Retorno Limpeza de Pele', duration: 30, price: 0, priceNote: 'sem custo', professionalIds: ['2', '4'], category: 'Facial' },
  { id: 'srv43', name: 'Revitalização Facial', duration: 30, price: 60, professionalIds: ['2', '4'], category: 'Facial' },

  // Dhiani + Tais + Bruna (shared)
  { id: 'srv44', name: 'Microagulhamento', duration: 60, ...parsePrice('consulta avaliação'), professionalIds: ['2', '4', '5'], category: 'Facial' },

  // Dhiani + Tais (depilação)
  { id: 'srv45', name: 'Depilação Axila', duration: 15, price: 35, professionalIds: ['2', '4'], category: 'Depilação' },
  { id: 'srv46', name: 'Depilação Completa', duration: 45, price: 60, professionalIds: ['2', '4'], category: 'Depilação' },
  { id: 'srv47', name: 'Depilação de Costas', duration: 20, price: 80, professionalIds: ['2', '4'], category: 'Depilação' },
  { id: 'srv48', name: 'Depilação de Nariz', duration: 15, price: 30, professionalIds: ['2', '4'], category: 'Depilação' },
  { id: 'srv49', name: 'Depilação de Orelha', duration: 15, price: 30, professionalIds: ['2', '4'], category: 'Depilação' },
  { id: 'srv50', name: 'Depilação Definitiva', duration: 30, ...parsePrice('consulta avaliação'), professionalIds: ['2', '4'], category: 'Depilação' },
  { id: 'srv51', name: 'Depilação Facial', duration: 15, price: 50, professionalIds: ['2', '4'], category: 'Depilação' },
  { id: 'srv52', name: 'Depilação Luz Pulsada', duration: 30, ...parsePrice('consulta avaliação'), professionalIds: ['2', '4'], category: 'Depilação' },
  { id: 'srv53', name: 'Depilação Meia Perna', duration: 30, price: 50, professionalIds: ['2', '4'], category: 'Depilação' },
  { id: 'srv54', name: 'Depilação Perna', duration: 30, price: 60, professionalIds: ['2', '4'], category: 'Depilação' },
  { id: 'srv55', name: 'Depilação Virilha', duration: 30, price: 55, professionalIds: ['2', '4'], category: 'Depilação' },
  { id: 'srv56', name: 'Dermaplaning', duration: 30, price: 80, professionalIds: ['2', '4'], category: 'Facial' },

  // Dhiani + Tais + Dhionara (buço)
  { id: 'srv57', name: 'Depilação Buço', duration: 15, price: 30, professionalIds: ['2', '4', '1'], category: 'Depilação' },

  // Dhionara Sbrussi
  { id: 'srv58', name: 'Despigmentação', duration: 30, ...parsePrice('consulta avaliação'), professionalIds: ['1'], category: 'Micropigmentação' },
  { id: 'srv59', name: 'Manutenção Anual de Sobrancelhas', duration: 75, ...parsePrice('consulta avaliação'), professionalIds: ['1'], category: 'Micropigmentação' },
  { id: 'srv60', name: 'Manutenção de Sobrancelhas (menos de 1 ano)', duration: 60, ...parsePrice('consulta avaliação'), professionalIds: ['1'], category: 'Micropigmentação' },
  { id: 'srv61', name: 'Manutenção Labial', duration: 90, ...parsePrice('consulta avaliação'), professionalIds: ['1'], category: 'Micropigmentação' },
  { id: 'srv62', name: 'Manutenção Labial (menos de 1 ano)', duration: 90, ...parsePrice('consulta avaliação'), professionalIds: ['1'], category: 'Micropigmentação' },
  { id: 'srv63', name: 'Manutenção Olho', duration: 60, ...parsePrice('consulta avaliação'), professionalIds: ['1'], category: 'Micropigmentação' },
  { id: 'srv64', name: 'Manutenção Olho (menos de 1 ano)', duration: 75, ...parsePrice('consulta avaliação'), professionalIds: ['1'], category: 'Micropigmentação' },
  { id: 'srv65', name: 'Micropigmentação Contorno de Olhos', duration: 45, price: 700, professionalIds: ['1'], category: 'Micropigmentação' },
  { id: 'srv66', name: 'Micropigmentação de Sobrancelhas', duration: 90, price: 700, professionalIds: ['1'], category: 'Micropigmentação' },
  { id: 'srv67', name: 'Micropigmentação Labial', duration: 75, price: 700, professionalIds: ['1'], category: 'Micropigmentação' },
  { id: 'srv68', name: 'Prime Brow (crescimento do pelo)', duration: 30, price: 700, professionalIds: ['1'], category: 'Micropigmentação' },
  { id: 'srv69', name: 'Prime Up (Brow Lamination)', duration: 60, price: 200, professionalIds: ['1'], category: 'Sobrancelha' },
  { id: 'srv70', name: 'Retorno de Olhos', duration: 30, price: 0, priceNote: 'sem custo', professionalIds: ['1'], category: 'Micropigmentação' },
  { id: 'srv71', name: 'Retorno Labial', duration: 60, price: 0, priceNote: 'sem custo', professionalIds: ['1'], category: 'Micropigmentação' },
  { id: 'srv72', name: 'Retorno Sobrancelhas', duration: 45, price: 0, priceNote: 'sem custo', professionalIds: ['1'], category: 'Micropigmentação' },
  { id: 'srv73', name: 'Lash Lifting', duration: 60, price: 150, professionalIds: ['1'], category: 'Sobrancelha' },

  // Dhionara + Tais (sobrancelha)
  { id: 'srv74', name: 'Tintura de Sobrancelhas', duration: 15, price: 80, professionalIds: ['1', '4'], category: 'Sobrancelha' },

  // Dhionara + Tais + Dhiani (sobrancelha)
  { id: 'srv75', name: 'Designer com Henna', duration: 15, price: 70, professionalIds: ['1', '4', '2'], category: 'Sobrancelha' },
  { id: 'srv76', name: 'Designer de Sobrancelhas', duration: 15, price: 55, professionalIds: ['1', '4', '2'], category: 'Sobrancelha' },

  // Luciane Castanheira
  { id: 'srv77', name: 'Spa dos Pés', duration: 60, price: 100, professionalIds: ['3'], category: 'Pés' },
  { id: 'srv78', name: 'Unha Mão', duration: 45, price: 45, professionalIds: ['3'], category: 'Unhas' },
  { id: 'srv79', name: 'Unha Pé', duration: 60, price: 45, professionalIds: ['3'], category: 'Unhas' },
  { id: 'srv80', name: 'Unha Pé e Mão', duration: 120, price: 80, professionalIds: ['3'], category: 'Unhas' },

  // Michele Quiana
  { id: 'srv81', name: 'Bioimpedância', duration: 30, price: 100, professionalIds: ['6', '2'], category: 'Avaliação' },
  { id: 'srv82', name: 'Consulta de Enfermagem', duration: 60, price: 0, priceNote: 'sem custo', professionalIds: ['6'], category: 'Avaliação' },
  { id: 'srv83', name: 'Injetáveis', duration: 30, ...parsePrice('consulta avaliação'), professionalIds: ['6'], category: 'Injetáveis' },
  { id: 'srv84', name: 'Soroterapia', duration: 45, ...parsePrice('consulta avaliação'), professionalIds: ['6'], category: 'Injetáveis' },

  // Patricia Amanda
  { id: 'srv85', name: 'Alongamento de Unha Fibra', duration: 140, price: 170, professionalIds: ['7'], category: 'Unhas' },
  { id: 'srv86', name: 'Banho de Gel', duration: 105, price: 140, professionalIds: ['7'], category: 'Unhas' },
  { id: 'srv87', name: 'Esmaltação em Gel', duration: 90, price: 70, professionalIds: ['7'], category: 'Unhas' },
  { id: 'srv88', name: 'Esmaltação em Gel Pé', duration: 90, price: 70, professionalIds: ['7'], category: 'Unhas' },
  { id: 'srv89', name: 'Manutenção Banho de Gel', duration: 120, price: null, priceNote: 'consulta avaliação', professionalIds: ['7'], category: 'Unhas' },
  { id: 'srv90', name: 'Manutenção de Fibra', duration: 120, price: 140, professionalIds: ['7'], category: 'Unhas' },
  { id: 'srv91', name: 'Remoção de Unha', duration: 30, price: 50, professionalIds: ['7'], category: 'Unhas' },

  // Tais Pires
  { id: 'srv92', name: 'PEIM', duration: 95, ...parsePrice('consulta avaliação'), professionalIds: ['4'], category: 'Facial' },

  // Tais + Dhiani
  { id: 'srv93', name: 'BB Glow', duration: 60, ...parsePrice('consulta avaliação'), professionalIds: ['4', '2'], category: 'Facial' },

  // Tais + Bruna
  { id: 'srv94', name: 'Peeling Químico', duration: 60, ...parsePrice('consulta avaliação'), professionalIds: ['4', '5'], category: 'Facial' },

  // Todos os profissionais
  { id: 'srv95', name: 'Avaliação', duration: 30, price: 0, priceNote: 'sem custo', professionalIds: ['1', '2', '3', '4', '5', '6', '7'], category: 'Geral' },
  { id: 'srv96', name: 'Consulta Avaliação', duration: 60, price: 0, priceNote: 'sem custo', professionalIds: ['1', '2', '3', '4', '5', '6', '7'], category: 'Geral' },
  { id: 'srv97', name: 'Curso', duration: 120, ...parsePrice('consulta avaliação'), professionalIds: ['1', '2', '3', '4', '5', '6', '7'], category: 'Geral' },
  { id: 'srv98', name: 'Retorno de Procedimento', duration: 15, ...parsePrice('consulta avaliação'), professionalIds: ['1', '2', '3', '4', '5', '6', '7'], category: 'Geral' },

  // HIPERIN QUIMICO (duration 0 in export, default to 30)
  { id: 'srv99', name: 'Hiperin Químico', duration: 30, ...parsePrice('encaminhar dr bruna'), professionalIds: ['5'], category: 'Facial' },
];

// Helper: get services for a specific professional
export const getServicesForProfessional = (professionalId: string): Service[] => {
  return services.filter(s => s.professionalIds.includes(professionalId));
};

// Sample appointments based on real export data (today = 2026-02-23)
export const sampleAppointments: Appointment[] = [
  // 23/02/2026
  { id: 'a1', clientName: 'Neycyane Ribeiro', clientPhone: '(66) 98410-2162', professionalId: '6', serviceNames: ['Bioimpedância'], date: '2026-02-23', time: '08:00', status: 'atendido', executedBy: 'Rafaela' },
  { id: 'a2', clientName: 'Andreia Cristiane Schosser', clientPhone: '(66) 99607-4672', professionalId: '4', serviceNames: ['Designer Com Henna'], date: '2026-02-23', time: '09:00', status: 'atendido', executedBy: 'Rafaela' },
  { id: 'a3', clientName: 'Mineia Gomes Trindade Suzuki', clientPhone: '(66) 98458-2273', professionalId: '2', serviceNames: ['Tratamento Luz Pulsada'], date: '2026-02-23', time: '09:00', status: 'atendido', executedBy: 'Rafaela' },
  { id: 'a4', clientName: 'CRISTINA', clientPhone: '(66) 98112-6534', professionalId: '6', serviceNames: ['Injetáveis'], date: '2026-02-23', time: '09:00', status: 'atendido', executedBy: 'Rafaela' },
  { id: 'a5', clientName: 'Ana Paula Silveira Parente', clientPhone: '(65) 99801-6189', professionalId: '2', serviceNames: ['Tratamento Corporal'], date: '2026-02-23', time: '10:00', status: 'cancelado', notes: '2/12' },
  { id: 'a6', clientName: 'Kathileenn Keilla de Souza', clientPhone: '(66) 99956-7922', professionalId: '6', serviceNames: ['Bioimpedância'], date: '2026-02-23', time: '10:45', status: 'agendado', executedBy: 'Michele Quintana' },
  { id: 'a7', clientName: 'Lisley Paz De Barros', clientPhone: '(66) 99939-2957', professionalId: '2', serviceNames: ['Drenagem Linfática'], date: '2026-02-23', time: '13:30', status: 'agendado', notes: '2/5' },
  { id: 'a8', clientName: 'Daizi Perozzo', clientPhone: '(66) 98102-4551', professionalId: '3', serviceNames: ['Unha Mão'], date: '2026-02-23', time: '14:00', status: 'confirmado' },
  { id: 'a9', clientName: 'Patricia armanda', clientPhone: '(66) 98102-1849', professionalId: '7', serviceNames: ['Retorno Limpeza de Pele'], date: '2026-02-23', time: '14:00', status: 'agendado' },

  // 24/02/2026
  { id: 'a10', clientName: 'Marli Salete de Avila Sbrussi', clientPhone: '(66) 98412-6906', professionalId: '2', serviceNames: ['Tratamento Corporal'], date: '2026-02-24', time: '08:00', status: 'agendado' },
  { id: 'a11', clientName: 'ELIANE JASCOVSK', clientPhone: '(66) 98437-8685', professionalId: '6', serviceNames: ['Bioimpedância'], date: '2026-02-24', time: '08:00', status: 'agendado' },
  { id: 'a12', clientName: 'Juliana Karoline Bankow', clientPhone: '(66) 99619-6449', professionalId: '7', serviceNames: ['Alongamento de Unha Fibra'], date: '2026-02-24', time: '08:00', status: 'agendado' },
  { id: 'a13', clientName: 'Camila Feitosa Gomes', clientPhone: '(66) 98136-4209', professionalId: '1', serviceNames: ['Prime Brow (crescimento do pelo)'], date: '2026-02-24', time: '08:00', status: 'agendado' },
  { id: 'a14', clientName: 'ELIANE JASCOVSK', clientPhone: '(66) 98437-8685', professionalId: '6', serviceNames: ['Injetáveis'], date: '2026-02-24', time: '08:30', status: 'agendado' },
  { id: 'a15', clientName: 'Larissa Ferrari', clientPhone: '(66) 98468-2020', professionalId: '1', serviceNames: ['Despigmentação'], date: '2026-02-24', time: '09:00', status: 'agendado' },
  { id: 'a16', clientName: 'Iliane W. Gabe', clientPhone: '(66) 99958-9120', professionalId: '6', serviceNames: ['Injetáveis'], date: '2026-02-24', time: '09:00', status: 'agendado' },
  { id: 'a17', clientName: 'DIOVANA MENDEL', clientPhone: '(66) 99209-9934', professionalId: '2', serviceNames: ['Tratamento Corporal'], date: '2026-02-24', time: '09:30', status: 'agendado' },
  { id: 'a18', clientName: 'Saulo Roberto Beissolotti', clientPhone: '(66) 98434-9112', professionalId: '1', serviceNames: ['Despigmentação'], date: '2026-02-24', time: '09:30', status: 'agendado' },
  { id: 'a19', clientName: 'Juliana Ferreira Fonseca', clientPhone: '(66) 99654-6066', professionalId: '1', serviceNames: ['Retorno Sobrancelhas'], date: '2026-02-24', time: '13:30', status: 'confirmado' },
  { id: 'a20', clientName: 'Dhiani Sbrussi', clientPhone: '(66) 99668-0462', professionalId: '2', serviceNames: ['Avaliação'], date: '2026-02-24', time: '13:30', status: 'agendado', notes: '5/8' },
  { id: 'a21', clientName: 'Gabriela Janaina trees', clientPhone: '(66) 99959-0908', professionalId: '7', serviceNames: ['Manutenção de Fibra'], date: '2026-02-24', time: '14:00', status: 'agendado' },
  { id: 'a22', clientName: 'Tatiane Nicoletti', clientPhone: '(66) 99685-8581', professionalId: '5', serviceNames: ['Retorno de Procedimento'], date: '2026-02-24', time: '14:00', status: 'espera' },
  { id: 'a23', clientName: 'Delvanda Maia', clientPhone: '(66) 99217-1372', professionalId: '1', serviceNames: ['Micropigmentação Labial'], date: '2026-02-24', time: '14:15', status: 'agendado' },
  { id: 'a24', clientName: 'Gabriella Grando', clientPhone: '(66) 99988-2036', professionalId: '5', serviceNames: ['Consulta Avaliação'], date: '2026-02-24', time: '15:00', status: 'agendado' },
  { id: 'a25', clientName: 'Geny Almeida Sobrinho', clientPhone: '(66) 99988-3973', professionalId: '2', serviceNames: ['Tratamento Corporal'], date: '2026-02-24', time: '15:00', status: 'agendado' },
  { id: 'a26', clientName: 'Suzamar Ferreira Sbrussi', clientPhone: '(66) 98438-2646', professionalId: '3', serviceNames: ['Unha Pé'], date: '2026-02-24', time: '16:00', status: 'agendado', notes: '13/30' },
  { id: 'a27', clientName: 'Paula Fernanda Ferreira Godoy', clientPhone: '(66) 99686-6244', professionalId: '2', serviceNames: ['Drenagem Linfática'], date: '2026-02-24', time: '16:00', status: 'agendado' },
  { id: 'a28', clientName: 'Emilia Rocha Lafeta', clientPhone: '(63) 99946-2029', professionalId: '5', serviceNames: ['Retorno de Procedimento'], date: '2026-02-24', time: '16:00', status: 'espera', notes: 'ultraformer' },
  { id: 'a29', clientName: 'Meiryelen Fachinello', clientPhone: '(66) 98401-6591', professionalId: '5', serviceNames: ['Retorno de Procedimento'], date: '2026-02-24', time: '16:00', status: 'confirmado' },
  { id: 'a30', clientName: 'Dhionara Sbrussi Lorenzon.', clientPhone: '(66) 99988-2911', professionalId: '1', serviceNames: ['Avaliação'], date: '2026-02-24', time: '16:15', status: 'agendado', notes: 'REUNIÃO MARKETING - NEYCY' },
  { id: 'a31', clientName: 'Daiane Casanova', clientPhone: '(66) 99207-5980', professionalId: '1', serviceNames: ['Prime Brow (crescimento do pelo)'], date: '2026-02-24', time: '17:00', status: 'agendado' },
  { id: 'a32', clientName: 'Ana Paula Amorin', clientPhone: '(66) 98417-6059', professionalId: '5', serviceNames: ['Consulta Avaliação'], date: '2026-02-24', time: '17:00', status: 'cancelado' },
  { id: 'a33', clientName: 'Tatielly Cardoso Araujo', clientPhone: '(66) 98468-2665', professionalId: '1', serviceNames: ['Avaliação'], date: '2026-02-24', time: '17:30', status: 'agendado', notes: 'ver se vai fazer mais remoção' },
  { id: 'a34', clientName: 'WANEIDIANA RODRIGUES DA SILVA', clientPhone: '(66) 99230-7975', professionalId: '6', serviceNames: ['Injetáveis'], date: '2026-02-24', time: '17:30', status: 'agendado' },
  { id: 'a35', clientName: 'Thais dutra', clientPhone: '(66) 99661-9387', professionalId: '7', serviceNames: ['Esmaltação em Gel Pé'], date: '2026-02-24', time: '18:30', status: 'agendado' },
];

export const statusConfig: Record<Appointment['status'], { color: string; label: string; bgClass: string }> = {
  agendado: { color: 'bg-[#4285F4]', label: 'Agendado', bgClass: 'bg-[#4285F4]/10 border-[#4285F4]/30 text-[#4285F4]' },
  confirmado: { color: 'bg-[#9b87f5]', label: 'Confirmado', bgClass: 'bg-[#9b87f5]/10 border-[#9b87f5]/30 text-[#000080]' },
  espera: { color: 'bg-[#FF9800]', label: 'Espera', bgClass: 'bg-[#FF9800]/10 border-[#FF9800]/30 text-[#FF9800]' },
  atendendo: { color: 'bg-[#E040FB]', label: 'Atendendo', bgClass: 'bg-[#E040FB]/10 border-[#E040FB]/30 text-[#E040FB]' },
  atendido: { color: 'bg-[#4CAF50]', label: 'Atendido', bgClass: 'bg-[#4CAF50]/10 border-[#4CAF50]/30 text-[#4CAF50]' },
  cancelado: { color: 'bg-[#020617]', label: 'Cancelado', bgClass: 'bg-[#020617]/10 border-[#020617]/30 text-[#020617]' },
  atrasado: { color: 'bg-[#CDDC39]', label: 'Atrasado', bgClass: 'bg-[#CDDC39]/10 border-[#CDDC39]/30 text-[#9E9D00]' },
  falta: { color: 'bg-[#8B0000]', label: 'Faltou', bgClass: 'bg-[#8B0000]/10 border-[#8B0000]/30 text-[#8B0000]' },
};
