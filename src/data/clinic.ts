export interface Professional {
  id: string;
  name: string;
  role: string;
  avatar: string;
  services: Service[];
}

export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  category: string;
  requiresEvaluation?: boolean;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  professionalId: string;
  services: Service[];
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'inprogress' | 'completed';
  notes?: string;
}

export const professionals: Professional[] = [
  {
    id: '1',
    name: 'Dhionara Sbrussi',
    role: 'Esteticista',
    avatar: 'DS',
    services: [
      { id: 's1', name: 'Limpeza de Pele', duration: 60, price: 150, category: 'Facial' },
      { id: 's2', name: 'Peeling Químico', duration: 45, price: 200, category: 'Facial' },
      { id: 's3', name: 'Massagem Modeladora', duration: 60, price: 180, category: 'Corporal', requiresEvaluation: true },
    ],
  },
  {
    id: '2',
    name: 'Dhiani Sbrussi',
    role: 'Esteticista',
    avatar: 'DS',
    services: [
      { id: 's4', name: 'Hidratação Facial', duration: 50, price: 130, category: 'Facial' },
      { id: 's5', name: 'Drenagem Linfática', duration: 60, price: 170, category: 'Corporal', requiresEvaluation: true },
    ],
  },
  {
    id: '3',
    name: 'Luciane Castanheira',
    role: 'Esteticista',
    avatar: 'LC',
    services: [
      { id: 's6', name: 'Design de Sobrancelha', duration: 30, price: 60, category: 'Sobrancelha' },
      { id: 's7', name: 'Micropigmentação', duration: 120, price: 800, category: 'Micropigmentação' },
    ],
  },
  {
    id: '4',
    name: 'Tais Pires',
    role: 'Esteticista',
    avatar: 'TP',
    services: [
      { id: 's8', name: 'Depilação a Laser', duration: 40, price: 250, category: 'Depilação' },
      { id: 's9', name: 'Depilação com Cera', duration: 30, price: 80, category: 'Depilação' },
    ],
  },
  {
    id: '5',
    name: 'Bruna Castanheira',
    role: 'Esteticista',
    avatar: 'BC',
    services: [
      { id: 's10', name: 'Limpeza de Pele Profunda', duration: 75, price: 180, category: 'Facial' },
      { id: 's11', name: 'Radiofrequência Facial', duration: 45, price: 220, category: 'Facial' },
    ],
  },
  {
    id: '6',
    name: 'Michele Quiana',
    role: 'Esteticista',
    avatar: 'MQ',
    services: [
      { id: 's12', name: 'Criolipólise', duration: 60, price: 350, category: 'Corporal', requiresEvaluation: true },
      { id: 's13', name: 'Ultrassom Estético', duration: 45, price: 200, category: 'Corporal', requiresEvaluation: true },
    ],
  },
  {
    id: '7',
    name: 'Patricia Amanda',
    role: 'Esteticista',
    avatar: 'PA',
    services: [
      { id: 's14', name: 'Massagem Relaxante', duration: 60, price: 150, category: 'Corporal', requiresEvaluation: true },
      { id: 's15', name: 'Tratamento Anti-idade', duration: 60, price: 280, category: 'Facial' },
    ],
  },
];

export const sampleAppointments: Appointment[] = [
  {
    id: 'a1',
    clientName: 'Maria Silva',
    clientPhone: '(66) 99999-0001',
    professionalId: '1',
    services: [
      { id: 's1', name: 'Limpeza de Pele', duration: 60, price: 150, category: 'Facial' },
    ],
    date: '2026-02-23',
    time: '09:00',
    status: 'confirmed',
  },
  {
    id: 'a2',
    clientName: 'Ana Oliveira',
    clientPhone: '(66) 99999-0002',
    professionalId: '1',
    services: [
      { id: 's2', name: 'Peeling Químico', duration: 45, price: 200, category: 'Facial' },
    ],
    date: '2026-02-23',
    time: '10:30',
    status: 'pending',
  },
  {
    id: 'a3',
    clientName: 'Carla Santos',
    clientPhone: '(66) 99999-0003',
    professionalId: '3',
    services: [
      { id: 's6', name: 'Design de Sobrancelha', duration: 30, price: 60, category: 'Sobrancelha' },
    ],
    date: '2026-02-23',
    time: '14:00',
    status: 'confirmed',
  },
  {
    id: 'a4',
    clientName: 'Julia Costa',
    clientPhone: '(66) 99999-0004',
    professionalId: '2',
    services: [
      { id: 's5', name: 'Drenagem Linfática', duration: 60, price: 170, category: 'Corporal' },
    ],
    date: '2026-02-23',
    time: '11:00',
    status: 'cancelled',
  },
  {
    id: 'a5',
    clientName: 'Fernanda Lima',
    clientPhone: '(66) 99999-0005',
    professionalId: '4',
    services: [
      { id: 's8', name: 'Depilação a Laser', duration: 40, price: 250, category: 'Depilação' },
    ],
    date: '2026-02-23',
    time: '15:00',
    status: 'confirmed',
  },
  {
    id: 'a6',
    clientName: 'Beatriz Almeida',
    clientPhone: '(66) 99999-0006',
    professionalId: '5',
    services: [
      { id: 's10', name: 'Limpeza de Pele Profunda', duration: 75, price: 180, category: 'Facial' },
    ],
    date: '2026-02-24',
    time: '09:00',
    status: 'confirmed',
  },
  {
    id: 'a7',
    clientName: 'Renata Souza',
    clientPhone: '(66) 99999-0007',
    professionalId: '6',
    services: [
      { id: 's12', name: 'Criolipólise', duration: 60, price: 350, category: 'Corporal' },
    ],
    date: '2026-02-24',
    time: '14:00',
    status: 'pending',
  },
];

export const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  for (let h = 8; h < 19; h++) {
    for (let m = 0; m < 60; m += 30) {
      slots.push({
        time: `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`,
        available: Math.random() > 0.3,
      });
    }
  }
  return slots;
};
