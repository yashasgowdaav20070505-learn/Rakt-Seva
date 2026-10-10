export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type ComponentType = 
  | 'Whole Blood'
  | 'Packed Red Blood Cells (PRBC)'
  | 'Fresh Frozen Plasma (FFP)'
  | 'Platelet Concentrate'
  | 'Cryoprecipitate';

export type UnitStatus = 
  | 'Quarantine'    // Collected, awaiting mandatory serological testing
  | 'Cleared'       // Tested & safe for public inventory
  | 'Reserved'      // Held for confirmed emergency/hospital requisition
  | 'Issued'        // Dispatched to patient/hospital
  | 'Discarded';     // Rejected or expired, logged into bio-waste

export type UserRole = 'public' | 'donor' | 'organizer' | 'officer' | 'admin';

export interface BloodBank {
  id: string;
  name: string;
  licenseNumber: string;
  category: 'Government' | 'Red Cross' | 'Charitable' | 'Private Hospital';
  state: string;
  district: string;
  address: string;
  phone: string;
  emergencyHelpline: string;
  email: string;
  operatingHours: string;
  latitude: number;
  longitude: number;
  is24x7: boolean;
  componentSeparationFacility: boolean;
}

export interface BloodUnit {
  id: string; // Barcode ID e.g. RS-2026-B0102
  bloodBankId: string;
  bloodBankName: string;
  bloodGroup: BloodGroup;
  component: ComponentType;
  volumeMl: number; // e.g. 350 or 450
  bagType: 'Single' | 'Double' | 'Triple' | 'Quadruple (SAGM)';
  collectionDate: string; // YYYY-MM-DD
  expiryDate: string;     // YYYY-MM-DD
  status: UnitStatus;
  storageLocation: string; // e.g. "Refrig-02 / Shelf-B"
  donorId?: string;
  collectionType: 'Camp' | 'Walk-in / In-house' | 'Replacement';
  campId?: string;
  testLogId?: string;
  issuedTo?: {
    patientName: string;
    hospitalName: string;
    issueDate: string;
    requisitionId: string;
  };
  discardDetails?: {
    reason: string;
    disposalDate: string;
    disposalBatchId: string;
  };
}

export interface SerologicalTestLog {
  id: string;
  unitId: string;
  bloodGroup: BloodGroup;
  component: ComponentType;
  testDate: string;
  technicianName: string;
  supervisorName: string;
  hivTest: 'Non-Reactive' | 'Reactive';
  hbvTest: 'Non-Reactive' | 'Reactive';
  hcvTest: 'Non-Reactive' | 'Reactive';
  syphilisTest: 'Non-Reactive' | 'Reactive';
  malariaTest: 'Negative' | 'Positive';
  aboRhConfirmation: 'Confirmed Matched' | 'Discrepancy Detected';
  irregularAntibodies: 'Negative' | 'Positive';
  finalResult: 'Approved' | 'Rejected';
  notes?: string;
}

export interface BioMedicalWasteRecord {
  id: string; // Waste Batch ID e.g. BMW-2026-0042
  unitId: string;
  bloodGroup: BloodGroup;
  component: ComponentType;
  volumeMl: number;
  disposalDate: string;
  reason: 'Expired Shelf Life' | 'Reactive Test Result' | 'Bag Leakage / Clot' | 'Hemolysis' | 'Low Volume Collection';
  treatmentMethod: 'Autoclaving & Shredding (Yellow Bag)' | 'Chemical Disinfection 1% Hypochlorite' | 'Incineration Handover';
  authorizedOfficer: string;
  wasteContractor: string;
  manifestNumber: string;
  notes?: string;
}

export interface DonorRecord {
  id: string;
  fullName: string;
  bloodGroup: BloodGroup;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: string;
  phone: string;
  email: string;
  state: string;
  district: string;
  address: string;
  weightKg: number;
  hemoglobinGdl: number;
  donorCardNumber: string;
  registeredDate: string;
  lastDonationDate?: string;
  totalDonations: number;
  emergencyDonor: boolean;
  history: DonationHistoryItem[];
}

export interface DonationHistoryItem {
  id: string;
  donationDate: string;
  bloodBankOrCamp: string;
  component: ComponentType;
  volumeMl: number;
  vitals: {
    bp: string;
    pulse: number;
    hb: number;
    weight: number;
  };
  certificateId: string;
  recipientImpactStory?: string;
}

export interface DonationCamp {
  id: string;
  title: string;
  organizerName: string; // NGO, Rotary Club, College NSS, Hospital
  partnerBloodBankId: string;
  partnerBloodBankName: string;
  state: string;
  district: string;
  venueAddress: string;
  latitude?: number;
  longitude?: number;
  distanceKm?: number;
  date: string; // YYYY-MM-DD
  startTime: string; // e.g. 09:00 AM
  endTime: string;   // e.g. 04:00 PM
  contactPerson: string;
  contactPhone: string;
  expectedDonors: number;
  registeredDonorsCount: number;
  collectedUnits?: number;
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
  bannerUrl?: string;
  isRsvpOpen: boolean;
}

export interface NotificationAlert {
  id: string;
  title: string;
  message: string;
  type: 'urgent_sos' | 'camp_invite' | 'cooling_off_ready' | 'fifo_warning' | 'certificate_issued';
  bloodGroupNeeded?: BloodGroup;
  district?: string;
  timestamp: string;
  read: boolean;
  smsRecipientCount?: number;
}

export interface StatutoryMetrics {
  reportingPeriod: string;
  state: string;
  totalUnitsCollected: number;
  campCollection: number;
  walkinCollection: number;
  prbcProduced: number;
  plateletsProduced: number;
  plasmaProduced: number;
  cryoProduced: number;
  totalUnitsTested: number;
  seropositiveCount: number;
  seropositiveBreakdown: {
    hiv: number;
    hbv: number;
    hcv: number;
    syphilis: number;
    malaria: number;
  };
  totalUnitsIssued: number;
  totalUnitsDiscarded: number;
  discardBreakdown: {
    expiredPrbc: number;
    expiredPlatelets: number;
    seropositive: number;
    bagDamaged: number;
  };
  crossmatchToTransfusionRatio: number;
  complianceFormId: string;
}

export interface EmergencyBloodRequest {
  id: string;
  patientName: string;
  bloodGroup: BloodGroup;
  unitsNeeded: number;
  hospitalName: string;
  location: string;
  latitude?: number;
  longitude?: number;
  distanceKm: number;
  urgency: 'Urgent' | 'Critical' | 'Moderate';
  verificationStatus: 'Hospital Verified' | 'Pending Verification';
  verifiedHospitalId?: string;
  requesterPhone: string;
  prescriptionUrl?: string;
  createdAt: string;
  respondersCount: number;
  acceptedByMe?: boolean;
  notes?: string;
}

export interface DonorAchievementBadge {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  earnedDate: string;
  isUnlocked: boolean;
  iconType: 'first_drop' | 'triple_save' | 'rare_shield' | 'sos_responder' | 'century_hero';
}

export interface CampHostRecord {
  id: string;
  orgName: string;
  orgType: 'NGO' | 'College Club / NSS' | 'Corporate CSR' | 'Hospital Trust';
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  campsHostedCount: number;
  totalDonorsMobilized: number;
}


