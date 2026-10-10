import { BloodBank, BloodUnit, DonationCamp, DonorRecord, NotificationAlert, BioMedicalWasteRecord, SerologicalTestLog, StatutoryMetrics } from '../types';

export const INDIAN_STATES: { [state: string]: string[] } = {
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad'],
  'Delhi (NCT)': ['Central Delhi', 'New Delhi', 'South Delhi', 'North Delhi', 'East Delhi'],
  'Karnataka': ['Bengaluru Urban', 'Bengaluru Rural', 'Mysuru', 'Mangaluru', 'Hubballi'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
  'West Bengal': ['Kolkata', 'Howrah', 'Siliguri', 'Durgapur'],
  'Kerala': ['Thiruvananthapuram', 'Ernakulam (Kochi)', 'Kozhikode', 'Thrissur'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Varanasi', 'Noida', 'Agra']
};

export const MOCK_BLOOD_BANKS: BloodBank[] = [
  {
    id: 'BB-01',
    name: 'AIIMS Central Blood Bank & Transfusion Medicine',
    licenseNumber: 'DL-BB-2019-0012',
    category: 'Government',
    state: 'Delhi (NCT)',
    district: 'New Delhi',
    address: 'Ansari Nagar, Sri Aurobindo Marg, New Delhi 110029',
    phone: '+91 11 2658 8500',
    emergencyHelpline: '1800-11-2446',
    email: 'bloodbank@aiims.edu',
    operatingHours: '24 Hours (7 Days a week)',
    latitude: 28.5672,
    longitude: 77.2100,
    is24x7: true,
    componentSeparationFacility: true
  },
  {
    id: 'BB-02',
    name: 'Indian Red Cross Society National Blood Bank',
    licenseNumber: 'DL-BB-2015-0045',
    category: 'Red Cross',
    state: 'Delhi (NCT)',
    district: 'Central Delhi',
    address: '1, Red Cross Road, Near Parliament Street, New Delhi 110001',
    phone: '+91 11 2371 1551',
    emergencyHelpline: '+91 98110 55442',
    email: 'bloodservices@indianredcross.org',
    operatingHours: '08:00 AM - 08:00 PM',
    latitude: 28.6219,
    longitude: 77.2090,
    is24x7: false,
    componentSeparationFacility: true
  },
  {
    id: 'BB-03',
    name: 'KEM Hospital & Seth GS Medical College Regional Blood Bank',
    licenseNumber: 'MH-BB-2018-0108',
    category: 'Government',
    state: 'Maharashtra',
    district: 'Mumbai',
    address: 'Acharya Donde Marg, Parel, Mumbai, Maharashtra 400012',
    phone: '+91 22 2410 7000',
    emergencyHelpline: '+91 22 2413 6051',
    email: 'bloodtransfusion@kem.edu',
    operatingHours: '24 Hours (7 Days a week)',
    latitude: 19.0028,
    longitude: 72.8427,
    is24x7: true,
    componentSeparationFacility: true
  },
  {
    id: 'BB-04',
    name: 'Tata Memorial Centre Blood & Platelet Center',
    licenseNumber: 'MH-BB-2017-0092',
    category: 'Charitable',
    state: 'Maharashtra',
    district: 'Mumbai',
    address: 'Dr. Ernest Borges Marg, Parel, Mumbai 400012',
    phone: '+91 22 2417 7000',
    emergencyHelpline: '1800-22-8282',
    email: 'tmc.bloodbank@tmc.gov.in',
    operatingHours: '24 Hours (7 Days a week)',
    latitude: 19.0061,
    longitude: 72.8434,
    is24x7: true,
    componentSeparationFacility: true
  },
  {
    id: 'BB-05',
    name: 'Victoria Hospital & BMCRI Blood Center',
    licenseNumber: 'KA-BB-2016-0033',
    category: 'Government',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    address: 'Fort Road, Near City Market, Bengaluru, Karnataka 560002',
    phone: '+91 80 2670 1150',
    emergencyHelpline: '+91 80 2670 4400',
    email: 'bmcri.bloodbank@karnataka.gov.in',
    operatingHours: '24 Hours (7 Days a week)',
    latitude: 12.9625,
    longitude: 77.5756,
    is24x7: true,
    componentSeparationFacility: true
  },
  {
    id: 'BB-06',
    name: 'Rotary TTK Blood Bank (Rotary Bangalore Trust)',
    licenseNumber: 'KA-BB-2014-0019',
    category: 'Charitable',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    address: 'New Thippasandra Main Road, HAL 3rd Stage, Bengaluru 560075',
    phone: '+91 80 2528 7903',
    emergencyHelpline: '+91 99000 87903',
    email: 'ttkbloodbank@rotaryblr.org',
    operatingHours: '08:00 AM - 10:00 PM',
    latitude: 12.9733,
    longitude: 77.6534,
    is24x7: false,
    componentSeparationFacility: true
  },
  {
    id: 'BB-07',
    name: 'Madras Medical College & RGGGH Blood Bank',
    licenseNumber: 'TN-BB-2015-0081',
    category: 'Government',
    state: 'Tamil Nadu',
    district: 'Chennai',
    address: 'EVR Periyar Salai, Park Town, Chennai, Tamil Nadu 600003',
    phone: '+91 44 2530 5000',
    emergencyHelpline: '104 (TN Health)',
    email: 'rgggh.bloodbank@tn.gov.in',
    operatingHours: '24 Hours (7 Days a week)',
    latitude: 13.0805,
    longitude: 80.2783,
    is24x7: true,
    componentSeparationFacility: true
  },
  {
    id: 'BB-08',
    name: 'Nizam\'s Institute of Medical Sciences (NIMS) Blood Center',
    licenseNumber: 'TG-BB-2019-0054',
    category: 'Government',
    state: 'Telangana',
    district: 'Hyderabad',
    address: 'Punjagutta, Hyderabad, Telangana 500082',
    phone: '+91 40 2348 9000',
    emergencyHelpline: '+91 40 2348 9244',
    email: 'bloodtransfusion@nims.edu.in',
    operatingHours: '24 Hours (7 Days a week)',
    latitude: 17.4239,
    longitude: 78.4482,
    is24x7: true,
    componentSeparationFacility: true
  }
];

// Helper to calculate expiry relative to current date (e.g. 2026-10-10)
const NOW_DATE = new Date('2026-10-10');
const addDays = (d: Date, days: number): string => {
  const target = new Date(d);
  target.setDate(target.getDate() + days);
  return target.toISOString().split('T')[0];
};

export const MOCK_BLOOD_UNITS: BloodUnit[] = [
  // CRITICAL FIFO: Platelets expiring in 1 day (urgently needs dispatch!)
  {
    id: 'RS-2026-PL01',
    bloodBankId: 'BB-03',
    bloodBankName: 'KEM Hospital & Seth GS Medical College Regional Blood Bank',
    bloodGroup: 'O+',
    component: 'Platelet Concentrate',
    volumeMl: 350,
    bagType: 'Triple',
    collectionDate: addDays(NOW_DATE, -4),
    expiryDate: addDays(NOW_DATE, 1), // 1 day remaining!
    status: 'Cleared',
    storageLocation: 'Agitator AG-01 / Shelf 2',
    collectionType: 'Camp',
    campId: 'CAMP-01'
  },
  {
    id: 'RS-2026-PL02',
    bloodBankId: 'BB-01',
    bloodBankName: 'AIIMS Central Blood Bank & Transfusion Medicine',
    bloodGroup: 'A+',
    component: 'Platelet Concentrate',
    volumeMl: 350,
    bagType: 'Triple',
    collectionDate: addDays(NOW_DATE, -3),
    expiryDate: addDays(NOW_DATE, 2), // 2 days remaining!
    status: 'Cleared',
    storageLocation: 'Agitator AG-02 / Shelf 1',
    collectionType: 'Walk-in / In-house'
  },
  {
    id: 'RS-2026-PL03',
    bloodBankId: 'BB-05',
    bloodBankName: 'Victoria Hospital & BMCRI Blood Center',
    bloodGroup: 'B-',
    component: 'Platelet Concentrate',
    volumeMl: 350,
    bagType: 'Double',
    collectionDate: addDays(NOW_DATE, -4),
    expiryDate: addDays(NOW_DATE, 1),
    status: 'Cleared',
    storageLocation: 'Agitator AG-03 / Shelf 4',
    collectionType: 'Camp',
    campId: 'CAMP-02'
  },
  // PRBC nearing FIFO warning (3 days remaining)
  {
    id: 'RS-2026-RB01',
    bloodBankId: 'BB-01',
    bloodBankName: 'AIIMS Central Blood Bank & Transfusion Medicine',
    bloodGroup: 'O-',
    component: 'Packed Red Blood Cells (PRBC)',
    volumeMl: 350,
    bagType: 'Quadruple (SAGM)',
    collectionDate: addDays(NOW_DATE, -39),
    expiryDate: addDays(NOW_DATE, 3), // 3 days remaining!
    status: 'Cleared',
    storageLocation: 'Cold Room A / Rack 04',
    collectionType: 'Walk-in / In-house'
  },
  {
    id: 'RS-2026-RB02',
    bloodBankId: 'BB-03',
    bloodBankName: 'KEM Hospital & Seth GS Medical College Regional Blood Bank',
    bloodGroup: 'AB-',
    component: 'Packed Red Blood Cells (PRBC)',
    volumeMl: 450,
    bagType: 'Quadruple (SAGM)',
    collectionDate: addDays(NOW_DATE, -38),
    expiryDate: addDays(NOW_DATE, 4),
    status: 'Cleared',
    storageLocation: 'Cold Room B / Rack 01',
    collectionType: 'Camp'
  },
  // Normal Fresh Units
  {
    id: 'RS-2026-RB03',
    bloodBankId: 'BB-01',
    bloodBankName: 'AIIMS Central Blood Bank & Transfusion Medicine',
    bloodGroup: 'A+',
    component: 'Packed Red Blood Cells (PRBC)',
    volumeMl: 450,
    bagType: 'Quadruple (SAGM)',
    collectionDate: addDays(NOW_DATE, -10),
    expiryDate: addDays(NOW_DATE, 32),
    status: 'Cleared',
    storageLocation: 'Cold Room A / Rack 02',
    collectionType: 'Walk-in / In-house'
  },
  {
    id: 'RS-2026-RB04',
    bloodBankId: 'BB-05',
    bloodBankName: 'Victoria Hospital & BMCRI Blood Center',
    bloodGroup: 'B+',
    component: 'Packed Red Blood Cells (PRBC)',
    volumeMl: 450,
    bagType: 'Quadruple (SAGM)',
    collectionDate: addDays(NOW_DATE, -5),
    expiryDate: addDays(NOW_DATE, 37),
    status: 'Cleared',
    storageLocation: 'Cold Room V / Rack 03',
    collectionType: 'Camp',
    campId: 'CAMP-02'
  },
  {
    id: 'RS-2026-RB05',
    bloodBankId: 'BB-06',
    bloodBankName: 'Rotary TTK Blood Bank (Rotary Bangalore Trust)',
    bloodGroup: 'O+',
    component: 'Packed Red Blood Cells (PRBC)',
    volumeMl: 450,
    bagType: 'Triple',
    collectionDate: addDays(NOW_DATE, -8),
    expiryDate: addDays(NOW_DATE, 34),
    status: 'Cleared',
    storageLocation: 'Refrig R-01 / Shelf C',
    collectionType: 'Camp'
  },
  // Plasma Units (Long shelf life, 1 year)
  {
    id: 'RS-2026-FF01',
    bloodBankId: 'BB-01',
    bloodBankName: 'AIIMS Central Blood Bank & Transfusion Medicine',
    bloodGroup: 'AB+',
    component: 'Fresh Frozen Plasma (FFP)',
    volumeMl: 250,
    bagType: 'Double',
    collectionDate: addDays(NOW_DATE, -40),
    expiryDate: addDays(NOW_DATE, 325),
    status: 'Cleared',
    storageLocation: 'Deep Freezer DF-01 / -40°C',
    collectionType: 'Camp'
  },
  {
    id: 'RS-2026-FF02',
    bloodBankId: 'BB-03',
    bloodBankName: 'KEM Hospital & Seth GS Medical College Regional Blood Bank',
    bloodGroup: 'O+',
    component: 'Fresh Frozen Plasma (FFP)',
    volumeMl: 250,
    bagType: 'Double',
    collectionDate: addDays(NOW_DATE, -25),
    expiryDate: addDays(NOW_DATE, 340),
    status: 'Cleared',
    storageLocation: 'Deep Freezer DF-02 / -40°C',
    collectionType: 'Camp'
  },
  // Units in Quarantine (awaiting mandatory serological test validation)
  {
    id: 'RS-2026-Q001',
    bloodBankId: 'BB-01',
    bloodBankName: 'AIIMS Central Blood Bank & Transfusion Medicine',
    bloodGroup: 'O+',
    component: 'Packed Red Blood Cells (PRBC)',
    volumeMl: 450,
    bagType: 'Quadruple (SAGM)',
    collectionDate: addDays(NOW_DATE, -1),
    expiryDate: addDays(NOW_DATE, 41),
    status: 'Quarantine',
    storageLocation: 'Quarantine Refrig Q-01',
    collectionType: 'Camp',
    campId: 'CAMP-01'
  },
  {
    id: 'RS-2026-Q002',
    bloodBankId: 'BB-03',
    bloodBankName: 'KEM Hospital & Seth GS Medical College Regional Blood Bank',
    bloodGroup: 'A-',
    component: 'Packed Red Blood Cells (PRBC)',
    volumeMl: 350,
    bagType: 'Triple',
    collectionDate: addDays(NOW_DATE, 0),
    expiryDate: addDays(NOW_DATE, 42),
    status: 'Quarantine',
    storageLocation: 'Quarantine Refrig Q-02',
    collectionType: 'Walk-in / In-house'
  },
  {
    id: 'RS-2026-Q003',
    bloodBankId: 'BB-05',
    bloodBankName: 'Victoria Hospital & BMCRI Blood Center',
    bloodGroup: 'B+',
    component: 'Platelet Concentrate',
    volumeMl: 350,
    bagType: 'Double',
    collectionDate: addDays(NOW_DATE, 0),
    expiryDate: addDays(NOW_DATE, 5),
    status: 'Quarantine',
    storageLocation: 'Quarantine Agitator Q-PL',
    collectionType: 'Walk-in / In-house'
  },
  // Whole Blood Units
  {
    id: 'RS-2026-WB01',
    bloodBankId: 'BB-04',
    bloodBankName: 'Tata Memorial Centre Blood & Platelet Center',
    bloodGroup: 'A-',
    component: 'Whole Blood',
    volumeMl: 350,
    bagType: 'Single',
    collectionDate: addDays(NOW_DATE, -12),
    expiryDate: addDays(NOW_DATE, 23),
    status: 'Cleared',
    storageLocation: 'Refrig WB-01',
    collectionType: 'Walk-in / In-house'
  },
  {
    id: 'RS-2026-WB02',
    bloodBankId: 'BB-07',
    bloodBankName: 'Madras Medical College & RGGGH Blood Bank',
    bloodGroup: 'O+',
    component: 'Whole Blood',
    volumeMl: 450,
    bagType: 'Single',
    collectionDate: addDays(NOW_DATE, -6),
    expiryDate: addDays(NOW_DATE, 29),
    status: 'Cleared',
    storageLocation: 'Refrig WB-02',
    collectionType: 'Camp'
  },
  // Reserved Unit
  {
    id: 'RS-2026-RS01',
    bloodBankId: 'BB-01',
    bloodBankName: 'AIIMS Central Blood Bank & Transfusion Medicine',
    bloodGroup: 'B+',
    component: 'Packed Red Blood Cells (PRBC)',
    volumeMl: 450,
    bagType: 'Quadruple (SAGM)',
    collectionDate: addDays(NOW_DATE, -14),
    expiryDate: addDays(NOW_DATE, 28),
    status: 'Reserved',
    storageLocation: 'Reserved Cold Unit R-1',
    collectionType: 'Walk-in / In-house'
  }
];

export const MOCK_TEST_LOGS: SerologicalTestLog[] = [
  {
    id: 'TEST-2026-0091',
    unitId: 'RS-2026-RB01',
    bloodGroup: 'O-',
    component: 'Packed Red Blood Cells (PRBC)',
    testDate: addDays(NOW_DATE, -38),
    technicianName: 'Sunita Meena (LT-441)',
    supervisorName: 'Dr. R. K. Shrivastava',
    hivTest: 'Non-Reactive',
    hbvTest: 'Non-Reactive',
    hcvTest: 'Non-Reactive',
    syphilisTest: 'Non-Reactive',
    malariaTest: 'Negative',
    aboRhConfirmation: 'Confirmed Matched',
    irregularAntibodies: 'Negative',
    finalResult: 'Approved',
    notes: 'Safe for emergency universal negative transfusion release.'
  },
  {
    id: 'TEST-2026-0092',
    unitId: 'RS-2026-PL01',
    bloodGroup: 'O+',
    component: 'Platelet Concentrate',
    testDate: addDays(NOW_DATE, -3),
    technicianName: 'Amit Verma (LT-512)',
    supervisorName: 'Dr. Sneha Patil',
    hivTest: 'Non-Reactive',
    hbvTest: 'Non-Reactive',
    hcvTest: 'Non-Reactive',
    syphilisTest: 'Non-Reactive',
    malariaTest: 'Negative',
    aboRhConfirmation: 'Confirmed Matched',
    irregularAntibodies: 'Negative',
    finalResult: 'Approved',
    notes: 'Platelet swirl test checked: Grade 4 positive. Cleared.'
  }
];

export const MOCK_WASTE_RECORDS: BioMedicalWasteRecord[] = [
  {
    id: 'BMW-2026-0038',
    unitId: 'RS-2026-DISC-01',
    bloodGroup: 'B+',
    component: 'Platelet Concentrate',
    volumeMl: 350,
    disposalDate: addDays(NOW_DATE, -1),
    reason: 'Expired Shelf Life',
    treatmentMethod: 'Autoclaving & Shredding (Yellow Bag)',
    authorizedOfficer: 'Dr. Anita Roy (Officer in Charge)',
    wasteContractor: 'Synergy Waste Management Pvt Ltd',
    manifestNumber: 'BMW-DL-2026-8841',
    notes: 'Platelet unit passed 5-day viability limit without dispatch requisition.'
  },
  {
    id: 'BMW-2026-0039',
    unitId: 'RS-2026-DISC-02',
    bloodGroup: 'A+',
    component: 'Packed Red Blood Cells (PRBC)',
    volumeMl: 450,
    disposalDate: addDays(NOW_DATE, -2),
    reason: 'Reactive Test Result',
    treatmentMethod: 'Chemical Disinfection 1% Hypochlorite',
    authorizedOfficer: 'Dr. Suresh Chandra',
    wasteContractor: 'SMS Envoclean Biomedical Services',
    manifestNumber: 'BMW-MH-2026-4412',
    notes: 'Screened Reactive for HBsAg ELISA in secondary confirmation. Safe disposal logged.'
  }
];

export const MOCK_DONORS: DonorRecord[] = [
  {
    id: 'DONOR-1001',
    fullName: 'Rahul Sharma',
    bloodGroup: 'O+',
    gender: 'Male',
    dateOfBirth: '1995-04-14',
    phone: '+91 98765 43210',
    email: 'rahul.sharma@example.com',
    state: 'Maharashtra',
    district: 'Mumbai',
    address: 'Flat 402, Sea View Heights, Bandra West, Mumbai 400050',
    weightKg: 72,
    hemoglobinGdl: 14.8,
    donorCardNumber: 'RS-MH-9504-01001',
    registeredDate: '2023-01-15',
    lastDonationDate: addDays(NOW_DATE, -72), // 72 days ago (cooling off is 90 days for males -> 18 days remaining!)
    totalDonations: 8,
    emergencyDonor: true,
    history: [
      {
        id: 'HIST-01',
        donationDate: addDays(NOW_DATE, -72),
        bloodBankOrCamp: 'KEM Hospital & Seth GS Medical College Regional Blood Bank',
        component: 'Whole Blood',
        volumeMl: 450,
        vitals: { bp: '120/80', pulse: 74, hb: 14.8, weight: 72 },
        certificateId: 'CERT-2026-0814',
        recipientImpactStory: 'Transfused to pediatric cardiac surgery patient. Recovery successfully noted.'
      },
      {
        id: 'HIST-02',
        donationDate: addDays(NOW_DATE, -168),
        bloodBankOrCamp: 'Rotary Club Mumbai Donation Drive',
        component: 'Packed Red Blood Cells (PRBC)',
        volumeMl: 450,
        vitals: { bp: '118/76', pulse: 72, hb: 15.1, weight: 71 },
        certificateId: 'CERT-2025-9921',
        recipientImpactStory: 'Utilized in trauma care unit for road traffic accident stabilization.'
      },
      {
        id: 'HIST-03',
        donationDate: addDays(NOW_DATE, -260),
        bloodBankOrCamp: 'Tata Memorial Centre Blood Center',
        component: 'Platelet Concentrate',
        volumeMl: 350,
        vitals: { bp: '122/82', pulse: 76, hb: 14.9, weight: 70 },
        certificateId: 'CERT-2025-4410',
        recipientImpactStory: 'Issued to oncology patient undergoing intensive chemotherapy.'
      }
    ]
  },
  {
    id: 'DONOR-1002',
    fullName: 'Priya Iyer',
    bloodGroup: 'O-',
    gender: 'Female',
    dateOfBirth: '1998-09-22',
    phone: '+91 97112 33445',
    email: 'priya.iyer@example.com',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    address: '74, 5th Cross, Indiranagar, Bengaluru 560038',
    weightKg: 58,
    hemoglobinGdl: 13.2,
    donorCardNumber: 'RS-KA-9809-01002',
    registeredDate: '2024-03-10',
    lastDonationDate: addDays(NOW_DATE, -135), // 135 days ago (cooling off 120 days for females -> ELIGIBLE NOW!)
    totalDonations: 4,
    emergencyDonor: true,
    history: [
      {
        id: 'HIST-04',
        donationDate: addDays(NOW_DATE, -135),
        bloodBankOrCamp: 'Victoria Hospital & BMCRI Blood Center',
        component: 'Whole Blood',
        volumeMl: 350,
        vitals: { bp: '116/74', pulse: 78, hb: 13.2, weight: 58 },
        certificateId: 'CERT-2026-0312',
        recipientImpactStory: 'Universal donor unit provided to neonatal emergency ward.'
      }
    ]
  },
  {
    id: 'DONOR-1003',
    fullName: 'Vikram Singh Rathore',
    bloodGroup: 'AB-',
    gender: 'Male',
    dateOfBirth: '1991-11-05',
    phone: '+91 98290 88991',
    email: 'vikram.rathore@example.com',
    state: 'Delhi (NCT)',
    district: 'New Delhi',
    address: 'B-12, Green Park Main, New Delhi 110016',
    weightKg: 78,
    hemoglobinGdl: 15.4,
    donorCardNumber: 'RS-DL-9111-01003',
    registeredDate: '2022-06-20',
    lastDonationDate: addDays(NOW_DATE, -110), // 110 days ago (male 90 days -> ELIGIBLE NOW!)
    totalDonations: 12,
    emergencyDonor: true,
    history: []
  }
];

export const MOCK_CAMPS: DonationCamp[] = [
  {
    id: 'CAMP-01',
    title: 'Rotary Metro & Youth Red Cross Mega Blood Drive',
    organizerName: 'Rotary Club of Central Mumbai & NSS Units',
    partnerBloodBankId: 'BB-03',
    partnerBloodBankName: 'KEM Hospital & Seth GS Medical College Regional Blood Bank',
    state: 'Maharashtra',
    district: 'Mumbai',
    venueAddress: 'Shivaji Park Community Center, Dadar West, Mumbai 400028',
    latitude: 19.0268,
    longitude: 72.8385,
    distanceKm: 2.3,
    date: addDays(NOW_DATE, 3), // In 3 days!
    startTime: '09:00 AM',
    endTime: '05:00 PM',
    contactPerson: 'Harish Mehta (President, Rotary)',
    contactPhone: '+91 98200 12345',
    expectedDonors: 250,
    registeredDonorsCount: 168,
    status: 'Upcoming',
    isRsvpOpen: true
  },
  {
    id: 'CAMP-02',
    title: 'Techies Give Life - Bandra Kurla Complex Blood Drive',
    organizerName: 'Corporate LifeStream & IT Wellness Alliance',
    partnerBloodBankId: 'BB-03',
    partnerBloodBankName: 'KEM Hospital Blood Bank',
    state: 'Maharashtra',
    district: 'Mumbai',
    venueAddress: 'BKC Ground, G Block, Bandra East, Mumbai 400051',
    latitude: 19.0657,
    longitude: 72.8682,
    distanceKm: 5.6,
    date: addDays(NOW_DATE, 5), // In 5 days!
    startTime: '10:00 AM',
    endTime: '06:00 PM',
    contactPerson: 'Ananya Deshmukh (CSR Head)',
    contactPhone: '+91 99801 55667',
    expectedDonors: 300,
    registeredDonorsCount: 215,
    status: 'Upcoming',
    isRsvpOpen: true
  },
  {
    id: 'CAMP-03',
    title: 'South Mumbai College Youth Blood Donation Camp',
    organizerName: 'Red Cross Society & Mumbai University NSS',
    partnerBloodBankId: 'BB-03',
    partnerBloodBankName: 'KEM Hospital & Seth GS Medical College',
    state: 'Maharashtra',
    district: 'Mumbai',
    venueAddress: 'St. Xavier\'s Quadrangle, Mahapalika Marg, Dhobi Talao, Mumbai 400001',
    latitude: 18.9431,
    longitude: 72.8315,
    distanceKm: 4.1,
    date: addDays(NOW_DATE, 8),
    startTime: '08:30 AM',
    endTime: '04:30 PM',
    contactPerson: 'Prof. Sandeep Kulkarni',
    contactPhone: '+91 98101 98765',
    expectedDonors: 400,
    registeredDonorsCount: 142,
    status: 'Upcoming',
    isRsvpOpen: true
  },
  {
    id: 'CAMP-04',
    title: 'Andheri West Community Lifeline Camp',
    organizerName: 'Lions Club Andheri & Youth Brigade',
    partnerBloodBankId: 'BB-03',
    partnerBloodBankName: 'KEM Hospital Regional Blood Bank',
    state: 'Maharashtra',
    district: 'Mumbai',
    venueAddress: 'Bhavan\'s Cultural Hall, Munshi Nagar, Andheri West, Mumbai 400058',
    latitude: 19.1246,
    longitude: 72.8364,
    distanceKm: 8.4,
    date: addDays(NOW_DATE, 12),
    startTime: '09:00 AM',
    endTime: '05:00 PM',
    contactPerson: 'Karthik Raja',
    contactPhone: '+91 94441 23456',
    expectedDonors: 200,
    registeredDonorsCount: 94,
    status: 'Upcoming',
    isRsvpOpen: true
  }
];

export const MOCK_NOTIFICATIONS: NotificationAlert[] = [
  {
    id: 'NOTIF-01',
    title: 'URGENT: Rare O- PRBC Needed at AIIMS Trauma Center',
    message: '2 units of O- Negative PRBC urgently needed for pediatric emergency. Eligible O- donors in New Delhi requested to donate.',
    type: 'urgent_sos',
    bloodGroupNeeded: 'O-',
    district: 'New Delhi',
    timestamp: '2026-10-10 09:15 AM',
    read: false,
    smsRecipientCount: 38
  },
  {
    id: 'NOTIF-02',
    title: 'FIFO Alert: 2 Units of Platelets Expiring in < 24 Hours',
    message: 'Platelet units RS-2026-PL01 and RS-2026-PL03 reaching day 5 viability limit. Prioritize immediate dispatch to nearby oncology or dengue wards.',
    type: 'fifo_warning',
    timestamp: '2026-10-10 08:00 AM',
    read: false
  },
  {
    id: 'NOTIF-03',
    title: 'Upcoming Camp: Shivaji Park Mega Drive on Oct 13',
    message: 'Rotary Metro & KEM Blood Bank camp scheduled. Pre-register your 30-min slot to skip wait lines.',
    type: 'camp_invite',
    district: 'Mumbai',
    timestamp: '2026-10-09 04:30 PM',
    read: true
  }
];

export const MOCK_STATUTORY_METRICS: StatutoryMetrics = {
  reportingPeriod: 'September 2026 - Monthly Statutory Return (Form 27C)',
  state: 'All India Aggregate / Model State Center',
  totalUnitsCollected: 4850,
  campCollection: 3240,
  walkinCollection: 1610,
  prbcProduced: 3980,
  plateletsProduced: 2410,
  plasmaProduced: 3850,
  cryoProduced: 420,
  totalUnitsTested: 4850,
  seropositiveCount: 34,
  seropositiveBreakdown: {
    hiv: 6,
    hbv: 18,
    hcv: 5,
    syphilis: 4,
    malaria: 1
  },
  totalUnitsIssued: 4420,
  totalUnitsDiscarded: 62,
  discardBreakdown: {
    expiredPrbc: 12,
    expiredPlatelets: 16,
    seropositive: 34,
    bagDamaged: 0
  },
  crossmatchToTransfusionRatio: 1.35, // Excellent clinical ratio (< 2.0 indicates optimal ordering)
  complianceFormId: 'FORM-27C-NBTC-2026-Q3'
};

export const MOCK_EMERGENCY_REQUESTS: import('../types').EmergencyBloodRequest[] = [
  {
    id: 'REQ-SOS-101',
    patientName: 'Aarav Deshmukh (Emergency Pediatric Surgery)',
    bloodGroup: 'O-',
    unitsNeeded: 2,
    hospitalName: 'NY Rajhansh Hospital',
    location: 'Worli Seaface, Mumbai',
    distanceKm: 2.4,
    urgency: 'Critical',
    verificationStatus: 'Hospital Verified',
    verifiedHospitalId: 'HOSP-MUM-881',
    requesterPhone: '+91 98200 44551',
    createdAt: '12 mins ago',
    respondersCount: 3,
    acceptedByMe: false,
    notes: 'Urgent whole blood or PRBC required for open heart pediatric procedure.'
  },
  {
    id: 'REQ-SOS-102',
    patientName: 'Meera Sengupta (Severe Dengue Thrombocytopenia)',
    bloodGroup: 'A+',
    unitsNeeded: 3,
    hospitalName: 'KEM Hospital & Seth GS Medical College',
    location: 'Parel, Mumbai',
    distanceKm: 4.8,
    urgency: 'Urgent',
    verificationStatus: 'Hospital Verified',
    verifiedHospitalId: 'MH-BB-2018-0108',
    requesterPhone: '+91 97110 99882',
    createdAt: '35 mins ago',
    respondersCount: 6,
    acceptedByMe: false,
    notes: 'Platelet count dropped below 15,000/uL. Immediate platelet concentrate needed.'
  },
  {
    id: 'REQ-SOS-103',
    patientName: 'Vikramaditya Solanki (Trauma & Fracture Surgery)',
    bloodGroup: 'AB+',
    unitsNeeded: 2,
    hospitalName: 'Apollo Specialty Trauma Centre',
    location: 'Navi Mumbai',
    distanceKm: 9.6,
    urgency: 'Urgent',
    verificationStatus: 'Hospital Verified',
    verifiedHospitalId: 'HOSP-APO-441',
    requesterPhone: '+91 98980 11223',
    createdAt: '1 hour ago',
    respondersCount: 4,
    acceptedByMe: false,
    notes: 'Multiple trauma post highway accident. Blood requisition approved by attending surgeon.'
  },
  {
    id: 'REQ-SOS-104',
    patientName: 'Deepak Nair (Leukemia Chemotherapy Support)',
    bloodGroup: 'B-',
    unitsNeeded: 1,
    hospitalName: 'Tata Memorial Cancer Center',
    location: 'Dr. E Borges Marg, Parel, Mumbai',
    distanceKm: 14.2,
    urgency: 'Moderate',
    verificationStatus: 'Pending Verification',
    requesterPhone: '+91 99201 33440',
    createdAt: '2 hours ago',
    respondersCount: 1,
    acceptedByMe: false,
    notes: 'Scheduled morning transfusion support. Attending verification desk review.'
  }
];

export const MOCK_DONOR_BADGES: import('../types').DonorAchievementBadge[] = [
  {
    id: 'BADGE-01',
    title: 'First Drop Hero',
    subtitle: 'The Journey of a Lifesaver Begins',
    description: 'Awarded for completing your very first certified voluntary blood donation.',
    tier: 'Bronze',
    earnedDate: '15 Jan 2023',
    isUnlocked: true,
    iconType: 'first_drop'
  },
  {
    id: 'BADGE-02',
    title: 'Triple Lifesaver',
    subtitle: '9 Lives Transfused & Sustained',
    description: 'Completed 3 voluntary donations, saving up to 9 recipients with component fractions.',
    tier: 'Silver',
    earnedDate: '10 Oct 2024',
    isUnlocked: true,
    iconType: 'triple_save'
  },
  {
    id: 'BADGE-03',
    title: 'Emergency Rapid Responder',
    subtitle: 'Answered SOS within 30 Minutes',
    description: 'Responded to an urgent local trauma SOS alert within 5 km of your location.',
    tier: 'Gold',
    earnedDate: '14 Apr 2025',
    isUnlocked: true,
    iconType: 'sos_responder'
  },
  {
    id: 'BADGE-04',
    title: 'Rare Phenotype Shield',
    subtitle: 'Guardian of Negative Rh Blood',
    description: 'Consistent donations supporting critical Rh-negative or universal donor reserves.',
    tier: 'Gold',
    earnedDate: '12 Nov 2025',
    isUnlocked: true,
    iconType: 'rare_shield'
  },
  {
    id: 'BADGE-05',
    title: 'Century Lifeguard (Elite Club)',
    subtitle: '10+ Milestone Donations Master',
    description: 'Achieved 10 or more verified voluntary donations across national registered camps.',
    tier: 'Platinum',
    earnedDate: 'Locked',
    isUnlocked: false,
    iconType: 'century_hero'
  }
];

export const MOCK_CAMP_HOST_ORGS: import('../types').CampHostRecord[] = [
  {
    id: 'HOST-01',
    orgName: 'Rotary Club of Central Mumbai',
    orgType: 'NGO',
    contactPerson: 'Harish Mehta (President)',
    contactEmail: 'rotary.central@rotary3141.org',
    contactPhone: '+91 98200 12345',
    campsHostedCount: 14,
    totalDonorsMobilized: 2840
  },
  {
    id: 'HOST-02',
    orgName: 'IIT Bombay National Service Scheme (NSS)',
    orgType: 'College Club / NSS',
    contactPerson: 'Prof. Anirudh Kulkarni',
    contactEmail: 'nss@iitb.ac.in',
    contactPhone: '+91 22 2576 7000',
    campsHostedCount: 8,
    totalDonorsMobilized: 1420
  },
  {
    id: 'HOST-03',
    orgName: 'Tata Communications CSR Wellness Alliance',
    orgType: 'Corporate CSR',
    contactPerson: 'Sunita Deshpande',
    contactEmail: 'csr@tatacommunications.com',
    contactPhone: '+91 99881 22334',
    campsHostedCount: 5,
    totalDonorsMobilized: 890
  }
];

