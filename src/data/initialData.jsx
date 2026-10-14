// Initial default sites, workers, and expense records for Site Munshi Pro
export const INITIAL_SITES = [
  {
    id: 'site-1',
    name: 'Sharma Residence - Solan',
    budget: 1500000,
    received: 500000,
    workers: [
      { id: 'w1', name: 'Ramesh Kumar', role: 'Mistri', rate: 800 },
      { id: 'w2', name: 'Suresh Kumar', role: 'Mazdoor', rate: 500 },
      { id: 'w3', name: 'Chotu Ram', role: 'Helper', rate: 400 },
      { id: 'w4', name: 'Deepak Singh', role: 'Mistri', rate: 800 }
    ],
    attendance: {
      'w1_0': { status: 'P', kharcha: 200 },
      'w1_1': { status: 'P', kharcha: 0 },
      'w1_2': { status: 'HALF', kharcha: 500 },
      'w2_0': { status: 'P', kharcha: 0 },
      'w2_1': { status: 'P', kharcha: 300 },
      'w3_0': { status: 'P', kharcha: 100 }
    },
    parchis: [
      { id: 'p1', material: 'Ultratech Cement (50 Bags)', amount: 19500, status: 'udhaar', supplier: 'Gupta Traders', date: '2026-06-10' },
      { id: 'p2', material: 'Saria / TMT Bars (500kg)', amount: 28000, status: 'paid', supplier: 'Shivalik Steels', date: '2026-06-08' },
      { id: 'p3', material: 'Reti & Crusher (1 Tipper)', amount: 6500, status: 'paid', supplier: 'Local Quarry', date: '2026-06-05' }
    ]
  },
  {
    id: 'site-2',
    name: 'Retaining Wall - Block B',
    budget: 800000,
    received: 300000,
    workers: [
      { id: 'w201', name: 'Kuldeep Singh', role: 'Mistri', rate: 850 },
      { id: 'w202', name: 'Raj Kumar', role: 'Mazdoor', rate: 500 }
    ],
    attendance: {},
    parchis: [
      { id: 'p201', material: 'Bricks (10,000 pcs)', amount: 75000, status: 'udhaar', supplier: 'Bhatha Brick Kiln', date: '2026-06-09' }
    ]
  }
];

export const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];