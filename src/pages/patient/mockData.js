export const patientProfile = {
  name: 'Rafiq Ahmed',
  id: 'P001',
  age: 45,
  blood: 'B+',
  phone: '01800-111111',
  email: 'rafiq@example.com',
  address: 'House 12, Road 4, Dhanmondi, Dhaka',
  doctor: 'Dr. Nusrat Khan',
  dept: 'Cardiology',
  avatar: 'RA',
};

export const upcomingAppointments = [
  { id: 'A010', doctor: 'Dr. Nusrat Khan',    dept: 'Cardiology',   date: '2026-05-27', time: '10:00 AM', status: 'Confirmed', avatar: 'NK' },
  { id: 'A011', doctor: 'Dr. Fariha Islam',   dept: 'Orthopedics',  date: '2026-06-02', time: '02:30 PM', status: 'Pending',   avatar: 'FI' },
];

export const pastAppointments = [
  { id: 'A001', doctor: 'Dr. Nusrat Khan',    dept: 'Cardiology',   date: '2026-05-18', time: '09:00 AM', status: 'Completed', avatar: 'NK' },
  { id: 'A002', doctor: 'Dr. Tariq Hossain',  dept: 'Neurology',    date: '2026-04-30', time: '11:00 AM', status: 'Completed', avatar: 'TH' },
  { id: 'A003', doctor: 'Dr. Fariha Islam',   dept: 'Orthopedics',  date: '2026-04-12', time: '03:00 PM', status: 'Cancelled', avatar: 'FI' },
  { id: 'A004', doctor: 'Dr. Sami Chowdhury', dept: 'Dermatology',  date: '2026-03-20', time: '12:00 PM', status: 'Completed', avatar: 'SC' },
];

export const prescriptions = [
  {
    id: 'RX001', date: '2026-05-18', doctor: 'Dr. Nusrat Khan', dept: 'Cardiology',
    diagnosis: 'Hypertension — Stage 1',
    medicines: [
      { name: 'Amlodipine 5mg',  dose: '1 tablet', freq: 'Once daily (morning)', duration: '30 days' },
      { name: 'Losartan 50mg',   dose: '1 tablet', freq: 'Once daily (night)',   duration: '30 days' },
    ],
    notes: 'Reduce salt intake. Walk 30 min daily. Follow-up after 4 weeks.',
  },
  {
    id: 'RX002', date: '2026-04-30', doctor: 'Dr. Tariq Hossain', dept: 'Neurology',
    diagnosis: 'Tension Headache',
    medicines: [
      { name: 'Paracetamol 500mg', dose: '1–2 tablets', freq: 'As needed (max 3×/day)', duration: '7 days' },
      { name: 'Amitriptyline 10mg', dose: '1 tablet',   freq: 'Once daily (night)',     duration: '14 days' },
    ],
    notes: 'Avoid screen time before bed. Stay hydrated.',
  },
];

export const invoices = [
  { id: 'INV-201', date: '2026-05-18', doctor: 'Dr. Nusrat Khan',    dept: 'Cardiology',  amount: '৳1,500', status: 'Paid' },
  { id: 'INV-202', date: '2026-04-30', doctor: 'Dr. Tariq Hossain',  dept: 'Neurology',   amount: '৳1,200', status: 'Paid' },
  { id: 'INV-203', date: '2026-06-02', doctor: 'Dr. Fariha Islam',   dept: 'Orthopedics', amount: '৳1,800', status: 'Pending' },
];

export const availableDoctors = [
  { id: 'D001', name: 'Dr. Nusrat Khan',    dept: 'Cardiology',    slots: ['09:00 AM','10:00 AM','02:00 PM'], avatar: 'NK', rating: 4.9, patients: 142 },
  { id: 'D002', name: 'Dr. Tariq Hossain',  dept: 'Neurology',     slots: ['11:00 AM','03:00 PM','04:00 PM'], avatar: 'TH', rating: 4.7, patients: 98  },
  { id: 'D003', name: 'Dr. Fariha Islam',   dept: 'Orthopedics',   slots: ['08:00 AM','01:00 PM'],            avatar: 'FI', rating: 4.8, patients: 76  },
  { id: 'D004', name: 'Dr. Sami Chowdhury', dept: 'Dermatology',   slots: ['10:30 AM','12:00 PM','05:00 PM'], avatar: 'SC', rating: 4.6, patients: 113 },
  { id: 'D005', name: 'Dr. Lubna Akter',    dept: 'Pediatrics',    slots: ['09:30 AM','11:30 AM','02:30 PM'], avatar: 'LA', rating: 4.9, patients: 89  },
];

export const healthStats = [
  { label: 'Blood Pressure', value: '128/82', unit: 'mmHg', icon: '🫀', trend: 'stable', date: '2026-05-18' },
  { label: 'Heart Rate',     value: '74',     unit: 'bpm',  icon: '💓', trend: 'good',   date: '2026-05-18' },
  { label: 'Weight',         value: '72',     unit: 'kg',   icon: '⚖️', trend: 'stable', date: '2026-05-18' },
  { label: 'Blood Sugar',    value: '98',     unit: 'mg/dL',icon: '🩸', trend: 'good',   date: '2026-05-18' },
];
