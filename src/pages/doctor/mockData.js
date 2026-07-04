export const doctorProfile = {
  name: 'Dr. Nusrat Khan',
  id: 'D001',
  dept: 'Cardiology',
  email: 'nusrat@medcore.com.bd',
  phone: '01711-001001',
  experience: '12 years',
  qualification: 'MBBS, MD (Cardiology)',
  address: 'Dhaka Medical College Hospital, Dhaka',
  avatar: 'NK',
  rating: 4.9,
  totalPatients: 142,
  todayAppointments: 8,
  completedThisMonth: 63,
};

export const todaySchedule = [
  { id:'A101', patient:'Rafiq Ahmed',   age:45, time:'09:00 AM', type:'Follow-up',    status:'Completed', avatar:'RA', blood:'B+' },
  { id:'A102', patient:'Nadia Rahman',  age:28, time:'10:00 AM', type:'Consultation', status:'Completed', avatar:'NR', blood:'AB+' },
  { id:'A103', patient:'Hasan Molla',   age:55, time:'11:00 AM', type:'Consultation', status:'In Progress',avatar:'HM', blood:'O+' },
  { id:'A104', patient:'Taslima Begum', age:38, time:'12:00 PM', type:'Follow-up',    status:'Waiting',   avatar:'TB', blood:'A-' },
  { id:'A105', patient:'Jahangir Alam', age:60, time:'02:00 PM', type:'New Patient',  status:'Waiting',   avatar:'JA', blood:'B-' },
  { id:'A106', patient:'Rubina Khatun', age:32, time:'03:00 PM', type:'Follow-up',    status:'Upcoming',  avatar:'RK', blood:'O-' },
  { id:'A107', patient:'Karim Uddin',   age:50, time:'04:00 PM', type:'Consultation', status:'Upcoming',  avatar:'KU', blood:'A+' },
  { id:'A108', patient:'Sumaiya Islam', age:25, time:'05:00 PM', type:'New Patient',  status:'Upcoming',  avatar:'SI', blood:'AB-' },
];

export const myPatients = [
  { id:'P001', name:'Rafiq Ahmed',   age:45, blood:'B+',  phone:'01800-111111', lastVisit:'2026-05-18', diagnosis:'Hypertension',      status:'Active',    visits:8  },
  { id:'P004', name:'Nadia Rahman',  age:28, blood:'AB+', phone:'01800-444444', lastVisit:'2026-05-20', diagnosis:'Arrhythmia',        status:'Active',    visits:3  },
  { id:'P007', name:'Hasan Molla',   age:55, blood:'O+',  phone:'01800-777777', lastVisit:'2026-05-24', diagnosis:'Heart Failure',     status:'Admitted',  visits:12 },
  { id:'P008', name:'Taslima Begum', age:38, blood:'A-',  phone:'01800-888888', lastVisit:'2026-05-22', diagnosis:'Chest Pain',        status:'Active',    visits:2  },
  { id:'P009', name:'Jahangir Alam', age:60, blood:'B-',  phone:'01800-999999', lastVisit:'2026-05-15', diagnosis:'Coronary Disease',  status:'Active',    visits:15 },
  { id:'P010', name:'Rubina Khatun', age:32, blood:'O-',  phone:'01800-101010', lastVisit:'2026-05-19', diagnosis:'Palpitations',      status:'Discharged',visits:4  },
];

export const recentPrescriptions = [
  { id:'RX101', patient:'Rafiq Ahmed',   date:'2026-05-18', diagnosis:'Hypertension Stage 1',  medicines:['Amlodipine 5mg','Losartan 50mg'] },
  { id:'RX102', patient:'Nadia Rahman',  date:'2026-05-20', diagnosis:'Atrial Fibrillation',   medicines:['Metoprolol 25mg','Aspirin 75mg'] },
  { id:'RX103', patient:'Hasan Molla',   date:'2026-05-24', diagnosis:'Heart Failure (HFrEF)', medicines:['Furosemide 40mg','Carvedilol 6.25mg','Spironolactone 25mg'] },
];

export const weeklyStats = [
  { day:'Mon', patients:10, completed:9  },
  { day:'Tue', patients:12, completed:11 },
  { day:'Wed', patients:8,  completed:8  },
  { day:'Thu', patients:14, completed:12 },
  { day:'Fri', patients:11, completed:10 },
  { day:'Sat', patients:9,  completed:9  },
  { day:'Sun', patients:6,  completed:5  },
];

export const availability = {
  Mon: ['09:00 AM','10:00 AM','11:00 AM','02:00 PM','03:00 PM','04:00 PM','05:00 PM'],
  Tue: ['09:00 AM','10:00 AM','11:00 AM','02:00 PM','03:00 PM','04:00 PM','05:00 PM'],
  Wed: ['09:00 AM','10:00 AM','11:00 AM'],
  Thu: ['09:00 AM','10:00 AM','11:00 AM','02:00 PM','03:00 PM','04:00 PM','05:00 PM'],
  Fri: ['09:00 AM','10:00 AM','02:00 PM','03:00 PM'],
  Sat: ['10:00 AM','11:00 AM','12:00 PM'],
  Sun: [],
};

export const bookedSlots = {
  Mon: ['09:00 AM','10:00 AM','11:00 AM','02:00 PM','03:00 PM'],
  Tue: ['09:00 AM','10:00 AM'],
  Wed: ['09:00 AM'],
  Thu: ['09:00 AM','10:00 AM','11:00 AM','02:00 PM'],
  Fri: ['09:00 AM','10:00 AM'],
  Sat: ['10:00 AM'],
  Sun: [],
};
