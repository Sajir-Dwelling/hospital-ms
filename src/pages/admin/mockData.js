export const stats = [
  { label: 'Total Patients',    value: '1,284', change: '+12%', icon: '🧑‍⚕️', color: '#1B4FD8' },
  { label: 'Total Doctors',     value: '87',    change: '+3%',  icon: '👨‍⚕️', color: '#06D6A0' },
  { label: 'Appointments Today',value: '63',    change: '+8%',  icon: '📅', color: '#F59E0B' },
  { label: 'Revenue (Month)',   value: '৳2.4L', change: '+18%', icon: '💰', color: '#8B5CF6' },
];

export const recentAppointments = [
  { id:'A001', patient:'Rafiq Ahmed',    doctor:'Dr. Nusrat Khan',   dept:'Cardiology',  time:'09:00 AM', status:'Completed' },
  { id:'A002', patient:'Sumaiya Begum',  doctor:'Dr. Tariq Hossain', dept:'Neurology',   time:'10:30 AM', status:'Pending' },
  { id:'A003', patient:'Karim Molla',    doctor:'Dr. Fariha Islam',  dept:'Orthopedics', time:'11:00 AM', status:'Cancelled' },
  { id:'A004', patient:'Nadia Rahman',   doctor:'Dr. Nusrat Khan',   dept:'Cardiology',  time:'01:00 PM', status:'Pending' },
  { id:'A005', patient:'Jahangir Alam',  doctor:'Dr. Sami Chowdhury',dept:'Dermatology', time:'02:30 PM', status:'Completed' },
  { id:'A006', patient:'Rubina Khatun',  doctor:'Dr. Tariq Hossain', dept:'Neurology',   time:'03:00 PM', status:'Pending' },
];

export const doctors = [
  { id:'D001', name:'Dr. Nusrat Khan',    dept:'Cardiology',   phone:'01711-001001', patients:142, status:'Active',   avatar:'NK' },
  { id:'D002', name:'Dr. Tariq Hossain',  dept:'Neurology',    phone:'01711-002002', patients:98,  status:'Active',   avatar:'TH' },
  { id:'D003', name:'Dr. Fariha Islam',   dept:'Orthopedics',  phone:'01711-003003', patients:76,  status:'On Leave', avatar:'FI' },
  { id:'D004', name:'Dr. Sami Chowdhury', dept:'Dermatology',  phone:'01711-004004', patients:113, status:'Active',   avatar:'SC' },
  { id:'D005', name:'Dr. Lubna Akter',    dept:'Pediatrics',   phone:'01711-005005', patients:89,  status:'Active',   avatar:'LA' },
  { id:'D006', name:'Dr. Imran Kabir',    dept:'Ophthalmology',phone:'01711-006006', patients:54,  status:'Inactive', avatar:'IK' },
];

export const patients = [
  { id:'P001', name:'Rafiq Ahmed',    age:45, blood:'B+',  phone:'01800-111111', doctor:'Dr. Nusrat Khan',    lastVisit:'2026-05-18', status:'Active' },
  { id:'P002', name:'Sumaiya Begum',  age:32, blood:'O+',  phone:'01800-222222', doctor:'Dr. Tariq Hossain',  lastVisit:'2026-05-17', status:'Active' },
  { id:'P003', name:'Karim Molla',    age:60, blood:'A-',  phone:'01800-333333', doctor:'Dr. Fariha Islam',   lastVisit:'2026-05-10', status:'Discharged' },
  { id:'P004', name:'Nadia Rahman',   age:28, blood:'AB+', phone:'01800-444444', doctor:'Dr. Nusrat Khan',    lastVisit:'2026-05-20', status:'Active' },
  { id:'P005', name:'Jahangir Alam',  age:55, blood:'B-',  phone:'01800-555555', doctor:'Dr. Sami Chowdhury', lastVisit:'2026-05-15', status:'Active' },
  { id:'P006', name:'Rubina Khatun',  age:38, blood:'O-',  phone:'01800-666666', doctor:'Dr. Tariq Hossain',  lastVisit:'2026-05-19', status:'Admitted' },
];

export const invoices = [
  { id:'INV-001', patient:'Rafiq Ahmed',   amount:'৳3,500', date:'2026-05-18', status:'Paid' },
  { id:'INV-002', patient:'Sumaiya Begum', amount:'৳1,800', date:'2026-05-17', status:'Pending' },
  { id:'INV-003', patient:'Karim Molla',   amount:'৳7,200', date:'2026-05-10', status:'Paid' },
  { id:'INV-004', patient:'Nadia Rahman',  amount:'৳2,100', date:'2026-05-20', status:'Pending' },
  { id:'INV-005', patient:'Jahangir Alam', amount:'৳4,600', date:'2026-05-15', status:'Paid' },
  { id:'INV-006', patient:'Rubina Khatun', amount:'৳9,000', date:'2026-05-19', status:'Overdue' },
];

export const weeklyData = [
  { day:'Mon', appointments:38, revenue:42000 },
  { day:'Tue', appointments:52, revenue:61000 },
  { day:'Wed', appointments:45, revenue:53000 },
  { day:'Thu', appointments:60, revenue:72000 },
  { day:'Fri', appointments:55, revenue:65000 },
  { day:'Sat', appointments:70, revenue:84000 },
  { day:'Sun', appointments:30, revenue:35000 },
];
