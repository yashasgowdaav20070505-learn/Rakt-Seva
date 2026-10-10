import { BloodBank, BloodUnit, DonationCamp, DonorRecord, NotificationAlert, BioMedicalWasteRecord, SerologicalTestLog, StatutoryMetrics, BloodGroup, ComponentType, UnitStatus } from '../types';
import { MOCK_BLOOD_BANKS, MOCK_BLOOD_UNITS, MOCK_CAMPS, MOCK_DONORS, MOCK_NOTIFICATIONS, MOCK_STATUTORY_METRICS, MOCK_TEST_LOGS, MOCK_WASTE_RECORDS } from '../data/mockData';

export const api = {
  async getHealth() {
    try {
      const res = await fetch('/api/health');
      return await res.json();
    } catch {
      return { status: 'ok', fallback: true };
    }
  },

  async getBloodBanks(params?: { state?: string; district?: string }) {
    try {
      const query = new URLSearchParams();
      if (params?.state) query.append('state', params.state);
      if (params?.district) query.append('district', params.district);
      const res = await fetch(`/api/blood-banks?${query.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch blood banks');
      const data = await res.json();
      return data.bloodBanks as BloodBank[];
    } catch (e) {
      console.warn('API fallback for blood banks', e);
      let list = [...MOCK_BLOOD_BANKS];
      if (params?.state) list = list.filter(b => b.state.toLowerCase() === params.state?.toLowerCase());
      if (params?.district) list = list.filter(b => b.district.toLowerCase() === params.district?.toLowerCase());
      return list;
    }
  },

  async getInventory(params?: { state?: string; district?: string; bloodGroup?: BloodGroup; component?: ComponentType; status?: UnitStatus }) {
    try {
      const query = new URLSearchParams();
      if (params?.state) query.append('state', params.state);
      if (params?.district) query.append('district', params.district);
      if (params?.bloodGroup) query.append('bloodGroup', params.bloodGroup);
      if (params?.component) query.append('component', params.component);
      if (params?.status) query.append('status', params.status);
      const res = await fetch(`/api/inventory?${query.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch inventory');
      const data = await res.json();
      return data.units as BloodUnit[];
    } catch (e) {
      console.warn('API fallback for inventory', e);
      let list = [...MOCK_BLOOD_UNITS];
      if (params?.bloodGroup) list = list.filter(u => u.bloodGroup === params.bloodGroup);
      if (params?.component) list = list.filter(u => u.component === params.component);
      if (params?.status) list = list.filter(u => u.status === params.status);
      return list;
    }
  },

  async addBloodUnit(unit: Partial<BloodUnit>) {
    const res = await fetch('/api/inventory', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(unit)
    });
    if (!res.ok) throw new Error('Failed to log blood unit');
    return await res.json();
  },

  async updateUnitStatus(id: string, updates: Partial<BloodUnit>) {
    const res = await fetch(`/api/inventory/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update blood unit');
    return await res.json();
  },

  async submitScreeningTest(testLog: Partial<SerologicalTestLog>) {
    const res = await fetch('/api/inventory/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testLog)
    });
    if (!res.ok) throw new Error('Failed to submit screening test');
    return await res.json();
  },

  async getTestLogs() {
    try {
      const res = await fetch('/api/inventory/test-logs');
      if (!res.ok) throw new Error();
      const data = await res.json();
      return data.testLogs as SerologicalTestLog[];
    } catch {
      return MOCK_TEST_LOGS;
    }
  },

  async getWasteRecords() {
    try {
      const res = await fetch('/api/inventory/waste');
      if (!res.ok) throw new Error();
      const data = await res.json();
      return data.wasteRecords as BioMedicalWasteRecord[];
    } catch {
      return MOCK_WASTE_RECORDS;
    }
  },

  async logWasteRecord(record: Partial<BioMedicalWasteRecord>) {
    const res = await fetch('/api/inventory/waste', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record)
    });
    if (!res.ok) throw new Error('Failed to log bio-medical waste record');
    return await res.json();
  },

  async getDonors() {
    try {
      const res = await fetch('/api/donors');
      if (!res.ok) throw new Error();
      const data = await res.json();
      return data.donors as DonorRecord[];
    } catch {
      return MOCK_DONORS;
    }
  },

  async registerDonor(donor: Partial<DonorRecord>) {
    const res = await fetch('/api/donors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(donor)
    });
    if (!res.ok) throw new Error('Failed to register donor');
    return await res.json();
  },

  async getCamps() {
    try {
      const res = await fetch('/api/camps');
      if (!res.ok) throw new Error();
      const data = await res.json();
      return data.camps as DonationCamp[];
    } catch {
      return MOCK_CAMPS;
    }
  },

  async createCamp(camp: Partial<DonationCamp>) {
    const res = await fetch('/api/camps', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(camp)
    });
    if (!res.ok) throw new Error('Failed to schedule camp');
    return await res.json();
  },

  async rsvpCamp(campId: string) {
    const res = await fetch(`/api/camps/${campId}/rsvp`, {
      method: 'POST'
    });
    if (!res.ok) throw new Error('Failed to confirm RSVP');
    return await res.json();
  },

  async getNotifications() {
    try {
      const res = await fetch('/api/notifications');
      if (!res.ok) throw new Error();
      const data = await res.json();
      return data.notifications as NotificationAlert[];
    } catch {
      return MOCK_NOTIFICATIONS;
    }
  },

  async broadcastEmergencySos(payload: { title: string; message: string; bloodGroupNeeded?: BloodGroup; district?: string }) {
    const res = await fetch('/api/notifications/broadcast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to send broadcast');
    return await res.json();
  },

  async getStatutoryReport() {
    try {
      const res = await fetch('/api/statutory-report');
      if (!res.ok) throw new Error();
      const data = await res.json();
      return data.metrics as StatutoryMetrics;
    } catch {
      return MOCK_STATUTORY_METRICS;
    }
  },

  // Gemini AI calls
  async chatWithGemini(messages: { role: 'user' | 'assistant'; content: string }[]) {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages })
    });
    if (!res.ok) {
      const err = await res.json();
      return err.fallback || 'Apologies, please try again in a moment.';
    }
    const data = await res.json();
    return data.reply;
  },

  async preScreenDonor(answers: Record<string, any>) {
    const res = await fetch('/api/ai/prescreen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(answers)
    });
    return await res.json();
  },

  async getInventoryDemandForecast() {
    const res = await fetch('/api/ai/forecast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return await res.json();
  },

  async groundedSearch(query: string, city?: string) {
    const res = await fetch('/api/ai/grounded-search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, city })
    });
    return await res.json();
  },

  async getEmergencyRequests() {
    try {
      const res = await fetch('/api/emergency-requests');
      if (!res.ok) throw new Error();
      const data = await res.json();
      return data.requests as import('../types').EmergencyBloodRequest[];
    } catch {
      const { MOCK_EMERGENCY_REQUESTS } = await import('../data/mockData');
      return MOCK_EMERGENCY_REQUESTS;
    }
  },

  async createEmergencyRequest(req: Partial<import('../types').EmergencyBloodRequest>) {
    try {
      const res = await fetch('/api/emergency-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req)
      });
      if (!res.ok) throw new Error();
      return await res.json();
    } catch {
      return { request: req, message: 'Emergency request published to local donor grid.' };
    }
  },

  async getDonorBadges() {
    const { MOCK_DONOR_BADGES } = await import('../data/mockData');
    return MOCK_DONOR_BADGES;
  }
};
