import { BloodGroup } from '../types';

export interface NearbyDonor {
  id: string;
  fullName: string;
  bloodGroup: BloodGroup;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  location: string;
  distanceKm: number;
  latitude: number;
  longitude: number;
  photoUrl: string;
  isAvailable: boolean;
  totalDonations: number;
  lastDonationDate: string;
  responseTime: string;
  verification: {
    mobileVerified: boolean;
    emailVerified: boolean;
    aadhaarVerified: boolean;
  };
}

export const MOCK_NEARBY_DONORS: NearbyDonor[] = [
  {
    id: 'DONOR-MB-01',
    fullName: 'Amitabh Sen',
    bloodGroup: 'O+',
    gender: 'Male',
    phone: '+91 98201 44512',
    email: 'amitabh.sen@example.com',
    location: 'Worli Sea Face, Mumbai',
    distanceKm: 0.8,
    latitude: 19.0178,
    longitude: 72.8172,
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
    isAvailable: true,
    totalDonations: 9,
    lastDonationDate: '2026-05-14',
    responseTime: '< 5 mins',
    verification: {
      mobileVerified: true,
      emailVerified: true,
      aadhaarVerified: true,
    }
  },
  {
    id: 'DONOR-MB-02',
    fullName: 'Dr. Sneha Kulkarni',
    bloodGroup: 'O-',
    gender: 'Female',
    phone: '+91 98199 87654',
    email: 'sneha.kulkarni@example.com',
    location: 'Dadar West, Mumbai',
    distanceKm: 1.6,
    latitude: 19.0195,
    longitude: 72.8368,
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80',
    isAvailable: true,
    totalDonations: 14,
    lastDonationDate: '2026-04-10',
    responseTime: '< 10 mins (Universal Donor)',
    verification: {
      mobileVerified: true,
      emailVerified: true,
      aadhaarVerified: true,
    }
  },
  {
    id: 'DONOR-MB-03',
    fullName: 'Rohan Deshmukh',
    bloodGroup: 'A+',
    gender: 'Male',
    phone: '+91 98700 11223',
    email: 'rohan.deshmukh@example.com',
    location: 'Lower Parel, Mumbai',
    distanceKm: 2.3,
    latitude: 18.9986,
    longitude: 72.8305,
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80',
    isAvailable: true,
    totalDonations: 5,
    lastDonationDate: '2026-06-01',
    responseTime: '< 15 mins',
    verification: {
      mobileVerified: true,
      emailVerified: true,
      aadhaarVerified: true,
    }
  },
  {
    id: 'DONOR-MB-04',
    fullName: 'Ananya Roy',
    bloodGroup: 'B+',
    gender: 'Female',
    phone: '+91 99300 44882',
    email: 'ananya.roy@example.com',
    location: 'Prabhadevi, Mumbai',
    distanceKm: 2.9,
    latitude: 19.0144,
    longitude: 72.8277,
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
    isAvailable: true,
    totalDonations: 7,
    lastDonationDate: '2026-05-20',
    responseTime: '< 8 mins',
    verification: {
      mobileVerified: true,
      emailVerified: true,
      aadhaarVerified: false,
    }
  },
  {
    id: 'DONOR-MB-05',
    fullName: 'Karthik Raman',
    bloodGroup: 'AB+',
    gender: 'Male',
    phone: '+91 98205 33441',
    email: 'karthik.raman@example.com',
    location: 'Bandra West, Mumbai',
    distanceKm: 4.8,
    latitude: 19.0596,
    longitude: 72.8295,
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&h=200&q=80',
    isAvailable: true,
    totalDonations: 11,
    lastDonationDate: '2026-03-12',
    responseTime: '< 20 mins',
    verification: {
      mobileVerified: true,
      emailVerified: true,
      aadhaarVerified: true,
    }
  },
  {
    id: 'DONOR-MB-06',
    fullName: 'Fatima Shaikh',
    bloodGroup: 'A-',
    gender: 'Female',
    phone: '+91 98920 99881',
    email: 'fatima.shaikh@example.com',
    location: 'Byculla, Mumbai',
    distanceKm: 5.4,
    latitude: 18.9750,
    longitude: 72.8340,
    photoUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=200&h=200&q=80',
    isAvailable: true,
    totalDonations: 6,
    lastDonationDate: '2026-05-02',
    responseTime: '< 15 mins',
    verification: {
      mobileVerified: true,
      emailVerified: true,
      aadhaarVerified: true,
    }
  },
  {
    id: 'DONOR-MB-07',
    fullName: 'Vikramaditya Solanki',
    bloodGroup: 'B-',
    gender: 'Male',
    phone: '+91 98111 22334',
    email: 'vikram.solanki@example.com',
    location: 'Mahim West, Mumbai',
    distanceKm: 3.7,
    latitude: 19.0350,
    longitude: 72.8420,
    photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&h=200&q=80',
    isAvailable: true,
    totalDonations: 8,
    lastDonationDate: '2026-04-28',
    responseTime: '< 12 mins',
    verification: {
      mobileVerified: true,
      emailVerified: true,
      aadhaarVerified: true,
    }
  },
  {
    id: 'DONOR-MB-08',
    fullName: 'Meera Nair',
    bloodGroup: 'AB-',
    gender: 'Female',
    phone: '+91 97690 55441',
    email: 'meera.nair@example.com',
    location: 'Colaba, Mumbai',
    distanceKm: 7.2,
    latitude: 18.9067,
    longitude: 72.8147,
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200&q=80',
    isAvailable: true,
    totalDonations: 10,
    lastDonationDate: '2026-03-30',
    responseTime: '< 25 mins (Rare Rh-)',
    verification: {
      mobileVerified: true,
      emailVerified: true,
      aadhaarVerified: true,
    }
  }
];
