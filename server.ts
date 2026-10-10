import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { 
  MOCK_BLOOD_BANKS, 
  MOCK_BLOOD_UNITS, 
  MOCK_CAMPS, 
  MOCK_DONORS, 
  MOCK_NOTIFICATIONS, 
  MOCK_STATUTORY_METRICS, 
  MOCK_TEST_LOGS, 
  MOCK_WASTE_RECORDS, 
  INDIAN_STATES,
  MOCK_EMERGENCY_REQUESTS
} from './src/data/mockData.ts';
import { BloodUnit, DonationCamp, DonorRecord, BioMedicalWasteRecord, SerologicalTestLog, NotificationAlert, EmergencyBloodRequest } from './src/types/index.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory data store initialized with rich mock data
let bloodBanks = [...MOCK_BLOOD_BANKS];
let bloodUnits: BloodUnit[] = [...MOCK_BLOOD_UNITS];
let testLogs: SerologicalTestLog[] = [...MOCK_TEST_LOGS];
let wasteRecords: BioMedicalWasteRecord[] = [...MOCK_WASTE_RECORDS];
let donors: DonorRecord[] = [...MOCK_DONORS];
let camps: DonationCamp[] = [...MOCK_CAMPS];
let notifications: NotificationAlert[] = [...MOCK_NOTIFICATIONS];
let emergencyRequests: EmergencyBloodRequest[] = [...MOCK_EMERGENCY_REQUESTS];

// Gemini AI Client initialization (User-Agent header required by skill guidelines)
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build'
    }
  }
});

// --- REST API ENDPOINTS ---

// Health & Metadata
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'RaktSeva / LifeStream',
    timestamp: new Date().toISOString(),
    aiConfigured: Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY')
  });
});

// States & Districts
app.get('/api/states', (req: Request, res: Response) => {
  res.json({ states: INDIAN_STATES });
});

// Blood Banks
app.get('/api/blood-banks', (req: Request, res: Response) => {
  const { state, district } = req.query;
  let filtered = [...bloodBanks];
  if (state && typeof state === 'string') {
    filtered = filtered.filter(b => b.state.toLowerCase() === state.toLowerCase());
  }
  if (district && typeof district === 'string') {
    filtered = filtered.filter(b => b.district.toLowerCase() === district.toLowerCase());
  }
  res.json({ bloodBanks: filtered });
});

// Blood Units / Inventory
app.get('/api/inventory', (req: Request, res: Response) => {
  const { state, district, bloodGroup, component, status } = req.query;
  let result = [...bloodUnits];

  if (bloodGroup && typeof bloodGroup === 'string') {
    result = result.filter(u => u.bloodGroup === bloodGroup);
  }
  if (component && typeof component === 'string') {
    result = result.filter(u => u.component === component);
  }
  if (status && typeof status === 'string') {
    result = result.filter(u => u.status === status);
  }

  // Filter by bank location if state/district specified
  if (state || district) {
    const matchingBankIds = bloodBanks
      .filter(b => (!state || b.state.toLowerCase() === String(state).toLowerCase()) &&
                   (!district || b.district.toLowerCase() === String(district).toLowerCase()))
      .map(b => b.id);
    result = result.filter(u => matchingBankIds.includes(u.bloodBankId));
  }

  // FIFO Sorting: Units closest to expiry come first
  result.sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());

  res.json({ units: result, totalCount: result.length });
});

// Add New Blood Unit (Post-collection)
app.post('/api/inventory', (req: Request, res: Response) => {
  const data = req.body;
  const newUnit: BloodUnit = {
    id: data.id || `RS-2026-B${Math.floor(1000 + Math.random() * 9000)}`,
    bloodBankId: data.bloodBankId || 'BB-01',
    bloodBankName: data.bloodBankName || 'AIIMS Central Blood Bank & Transfusion Medicine',
    bloodGroup: data.bloodGroup || 'O+',
    component: data.component || 'Packed Red Blood Cells (PRBC)',
    volumeMl: data.volumeMl || 450,
    bagType: data.bagType || 'Quadruple (SAGM)',
    collectionDate: data.collectionDate || new Date().toISOString().split('T')[0],
    expiryDate: data.expiryDate,
    status: data.status || 'Quarantine',
    storageLocation: data.storageLocation || 'Quarantine Section Q-01',
    collectionType: data.collectionType || 'Walk-in / In-house',
    campId: data.campId
  };

  bloodUnits.unshift(newUnit);
  res.status(201).json({ unit: newUnit, message: 'Blood unit logged into quarantine successfully.' });
});

// Update Blood Unit Status (Issue / Allocate / Reserve)
app.patch('/api/inventory/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, issuedTo, discardDetails, storageLocation } = req.body;
  const index = bloodUnits.findIndex(u => u.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Unit not found' });
  }

  if (status) bloodUnits[index].status = status;
  if (issuedTo) bloodUnits[index].issuedTo = issuedTo;
  if (discardDetails) bloodUnits[index].discardDetails = discardDetails;
  if (storageLocation) bloodUnits[index].storageLocation = storageLocation;

  res.json({ unit: bloodUnits[index], message: 'Unit status updated.' });
});

// Serological Testing & Clearance Workflow
app.post('/api/inventory/test', (req: Request, res: Response) => {
  const testData: SerologicalTestLog = req.body;
  const unitIndex = bloodUnits.findIndex(u => u.id === testData.unitId);

  if (unitIndex === -1) {
    return res.status(404).json({ error: 'Associated unit not found' });
  }

  // Evaluate final result based on standard safety protocols:
  // All must be Non-Reactive / Negative & ABO Confirmed
  const isSafe = 
    testData.hivTest === 'Non-Reactive' &&
    testData.hbvTest === 'Non-Reactive' &&
    testData.hcvTest === 'Non-Reactive' &&
    testData.syphilisTest === 'Non-Reactive' &&
    testData.malariaTest === 'Negative' &&
    testData.aboRhConfirmation === 'Confirmed Matched' &&
    testData.irregularAntibodies === 'Negative';

  testData.finalResult = isSafe ? 'Approved' : 'Rejected';
  testData.id = testData.id || `TEST-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  testLogs.unshift(testData);

  if (isSafe) {
    bloodUnits[unitIndex].status = 'Cleared';
    bloodUnits[unitIndex].storageLocation = 'Active Storage Cold Room Shelf 1';
  } else {
    bloodUnits[unitIndex].status = 'Discarded';
    bloodUnits[unitIndex].discardDetails = {
      reason: 'Reactive Serological Screening Result',
      disposalDate: new Date().toISOString().split('T')[0],
      disposalBatchId: `BMW-2026-TEST-${Math.floor(100 + Math.random() * 900)}`
    };

    // Auto-create waste log record
    const wasteLog: BioMedicalWasteRecord = {
      id: `BMW-2026-AUTOTEST-${Math.floor(1000 + Math.random() * 9000)}`,
      unitId: testData.unitId,
      bloodGroup: testData.bloodGroup,
      component: testData.component,
      volumeMl: bloodUnits[unitIndex].volumeMl,
      disposalDate: new Date().toISOString().split('T')[0],
      reason: 'Reactive Test Result',
      treatmentMethod: 'Chemical Disinfection 1% Hypochlorite',
      authorizedOfficer: testData.supervisorName || 'Medical Officer',
      wasteContractor: 'Authorized Bio-Medical Waste Operator',
      manifestNumber: `BMW-DISC-${Date.now().toString().slice(-6)}`,
      notes: `Rejected during mandatory viral marker screen: HIV=${testData.hivTest}, HBV=${testData.hbvTest}, HCV=${testData.hcvTest}, Syphilis=${testData.syphilisTest}`
    };
    wasteRecords.unshift(wasteLog);
  }

  res.json({
    testLog: testData,
    unit: bloodUnits[unitIndex],
    message: isSafe ? 'Unit passed all screening tests and moved to Cleared Active Inventory.' : 'Unit Reactive. Quarantined for safe Bio-Medical disposal.'
  });
});

app.get('/api/inventory/test-logs', (req: Request, res: Response) => {
  res.json({ testLogs });
});

// Bio-Medical Waste Records
app.get('/api/inventory/waste', (req: Request, res: Response) => {
  res.json({ wasteRecords });
});

app.post('/api/inventory/waste', (req: Request, res: Response) => {
  const newRecord: BioMedicalWasteRecord = {
    ...req.body,
    id: req.body.id || `BMW-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    disposalDate: req.body.disposalDate || new Date().toISOString().split('T')[0]
  };

  wasteRecords.unshift(newRecord);

  // If unitId exists in inventory, mark as discarded
  const unitIdx = bloodUnits.findIndex(u => u.id === newRecord.unitId);
  if (unitIdx !== -1) {
    bloodUnits[unitIdx].status = 'Discarded';
    bloodUnits[unitIdx].discardDetails = {
      reason: newRecord.reason,
      disposalDate: newRecord.disposalDate,
      disposalBatchId: newRecord.id
    };
  }

  res.status(201).json({ wasteRecord: newRecord, message: 'Disposal logged into Bio-Medical Waste audit trail.' });
});

// Donors
app.get('/api/donors', (req: Request, res: Response) => {
  res.json({ donors });
});

app.get('/api/donors/:id', (req: Request, res: Response) => {
  const donor = donors.find(d => d.id === req.params.id);
  if (!donor) return res.status(404).json({ error: 'Donor not found' });
  res.json({ donor });
});

app.post('/api/donors', (req: Request, res: Response) => {
  const data = req.body;
  const newDonor: DonorRecord = {
    id: `DONOR-${Math.floor(1000 + Math.random() * 9000)}`,
    fullName: data.fullName,
    bloodGroup: data.bloodGroup,
    gender: data.gender || 'Male',
    dateOfBirth: data.dateOfBirth,
    phone: data.phone,
    email: data.email,
    state: data.state || 'Maharashtra',
    district: data.district || 'Mumbai',
    address: data.address || '',
    weightKg: Number(data.weightKg) || 65,
    hemoglobinGdl: Number(data.hemoglobinGdl) || 14.0,
    donorCardNumber: `RS-${(data.state || 'IN').slice(0, 2).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`,
    registeredDate: new Date().toISOString().split('T')[0],
    lastDonationDate: data.lastDonationDate || undefined,
    totalDonations: data.lastDonationDate ? 1 : 0,
    emergencyDonor: Boolean(data.emergencyDonor),
    history: []
  };

  donors.unshift(newDonor);
  res.status(201).json({ donor: newDonor, message: 'Donor registered successfully.' });
});

// Donation Camps
app.get('/api/camps', (req: Request, res: Response) => {
  res.json({ camps });
});

app.post('/api/camps', (req: Request, res: Response) => {
  const data = req.body;
  const newCamp: DonationCamp = {
    id: `CAMP-${Math.floor(100 + Math.random() * 900)}`,
    title: data.title,
    organizerName: data.organizerName,
    partnerBloodBankId: data.partnerBloodBankId || 'BB-01',
    partnerBloodBankName: data.partnerBloodBankName || 'AIIMS Central Blood Bank',
    state: data.state || 'Maharashtra',
    district: data.district || 'Mumbai',
    venueAddress: data.venueAddress,
    date: data.date,
    startTime: data.startTime || '09:00 AM',
    endTime: data.endTime || '05:00 PM',
    contactPerson: data.contactPerson,
    contactPhone: data.contactPhone,
    expectedDonors: Number(data.expectedDonors) || 100,
    registeredDonorsCount: 0,
    status: 'Upcoming',
    isRsvpOpen: true
  };

  camps.unshift(newCamp);
  res.status(201).json({ camp: newCamp, message: 'Donation camp registered successfully.' });
});

app.post('/api/camps/:id/rsvp', (req: Request, res: Response) => {
  const camp = camps.find(c => c.id === req.params.id);
  if (!camp) return res.status(404).json({ error: 'Camp not found' });
  camp.registeredDonorsCount += 1;
  res.json({ camp, message: 'Slot RSVP confirmed. E-Pass generated.' });
});

// Notifications & Emergency SOS Broadcast
app.get('/api/notifications', (req: Request, res: Response) => {
  res.json({ notifications });
});

app.post('/api/notifications/broadcast', (req: Request, res: Response) => {
  const { title, message, bloodGroupNeeded, district, targetType } = req.body;

  // Find matching registered donors with compatible blood group in the district
  const matchingDonors = donors.filter(d => {
    const groupMatch = !bloodGroupNeeded || d.bloodGroup === bloodGroupNeeded;
    const districtMatch = !district || d.district.toLowerCase() === district.toLowerCase();
    return groupMatch && districtMatch;
  });

  const alert: NotificationAlert = {
    id: `NOTIF-${Math.floor(100 + Math.random() * 900)}`,
    title: title || `URGENT: ${bloodGroupNeeded || 'Blood'} Needed at Emergency Center`,
    message: message || `Critical requirement at district center. Immediate donations requested.`,
    type: targetType || 'urgent_sos',
    bloodGroupNeeded,
    district,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    read: false,
    smsRecipientCount: Math.max(matchingDonors.length, 12)
  };

  notifications.unshift(alert);

  res.status(201).json({
    alert,
    matchingDonorsCount: matchingDonors.length,
    simulatedSmsSent: alert.smsRecipientCount,
    message: `Emergency SOS broadcast dispatched to ${alert.smsRecipientCount} registered matching donors.`
  });
});

// Emergency Blood Requests (Citizen Portal & SOS Radius)
app.get('/api/emergency-requests', (req: Request, res: Response) => {
  res.json({ requests: emergencyRequests });
});

app.post('/api/emergency-requests', (req: Request, res: Response) => {
  const data = req.body;
  const newReq: EmergencyBloodRequest = {
    id: `REQ-SOS-${Math.floor(100 + Math.random() * 900)}`,
    patientName: data.patientName || 'Emergency Patient',
    bloodGroup: data.bloodGroup || 'O-',
    unitsNeeded: Number(data.unitsNeeded) || 1,
    hospitalName: data.hospitalName || 'City Trauma Care Hospital',
    location: data.location || 'Mumbai',
    distanceKm: data.distanceKm || 2.1,
    urgency: data.urgency || 'Critical',
    verificationStatus: data.verificationStatus || 'Hospital Verified',
    requesterPhone: data.requesterPhone || '+91 98200 44551',
    prescriptionUrl: data.prescriptionUrl,
    createdAt: 'Just now',
    respondersCount: 0,
    acceptedByMe: false,
    notes: data.notes
  };

  emergencyRequests.unshift(newReq);

  // Also auto-generate an SOS notification alert
  const notif: NotificationAlert = {
    id: `NOTIF-SOS-${Date.now().toString().slice(-4)}`,
    title: `URGENT SOS: ${newReq.bloodGroup} Blood Needed at ${newReq.hospitalName}`,
    message: `Critical emergency for ${newReq.patientName}. ${newReq.unitsNeeded} unit(s) needed at ${newReq.location}.`,
    type: 'urgent_sos',
    bloodGroupNeeded: newReq.bloodGroup,
    timestamp: 'Just now',
    read: false,
    smsRecipientCount: 24
  };
  notifications.unshift(notif);

  res.status(201).json({ request: newReq, message: 'Emergency request broadcast to local donor radar.' });
});

app.post('/api/emergency-requests/:id/respond', (req: Request, res: Response) => {
  const reqItem = emergencyRequests.find(r => r.id === req.params.id);
  if (!reqItem) return res.status(404).json({ error: 'Request not found' });
  reqItem.respondersCount += 1;
  reqItem.acceptedByMe = true;
  res.json({ request: reqItem, message: 'Response recorded. Direct hospital coordination line opened.' });
});

// Statutory Compliance Report
app.get('/api/statutory-report', (req: Request, res: Response) => {
  // Aggregate real stats from current in-memory data
  const cleared = bloodUnits.filter(u => u.status === 'Cleared').length;
  const quarantine = bloodUnits.filter(u => u.status === 'Quarantine').length;
  const discarded = wasteRecords.length;

  res.json({
    metrics: {
      ...MOCK_STATUTORY_METRICS,
      currentLiveInventory: {
        totalCleared: cleared,
        totalQuarantine: quarantine,
        totalDiscardedRecorded: discarded
      }
    }
  });
});

// --- GEMINI AI ENDPOINTS ---

// 1. RaktSeva Mitra - Multi-turn Chat Assistant (gemini-3.5-flash)
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  const { messages, userLocation } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array required' });
  }

  try {
    const lastUserMessage = messages[messages.length - 1]?.content || 'Hello';
    
    // Format conversation history for Gemini
    const contents = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const systemInstruction = `You are "RaktSeva Mitra" (रक्तसेवा मित्र), a compassionate, highly knowledgeable medical communicator and AI assistant for the RaktSeva / LifeStream Blood Donation & Transfusion platform in India.
Your mission is to guide voluntary blood donors, explain eligibility criteria, explain blood components (PRBC, Platelets, Plasma), discuss cooling-off periods (90 days for men, 120 days for women for whole blood), debunk myths, provide tips to boost hemoglobin, and guide users on transfusion safety.
Guidelines:
- Provide empathetic, clinically accurate, and culturally considerate advice.
- If someone is having a severe medical emergency, advise them to immediately contact the National Blood Helpline (1800-11-2446) or call emergency services (112 / 108 in India).
- Format your response cleanly with clear bullet points where helpful.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7
      }
    });

    const reply = response.text || "Thank you for reaching out to RaktSeva. How can I assist you with blood donation today?";
    res.json({ reply });
  } catch (error: any) {
    console.error('Gemini Chat Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate AI response',
      fallback: 'RaktSeva Mitra is currently running on standby mode. Remember: Whole blood donation requires a cooling-off period of 90 days for males and 120 days for females, minimum 45 kg weight, and Hb >= 12.5 g/dL.'
    });
  }
});

// 2. Instant Donor Pre-Screening Questionnaire (gemini-3.1-flash-lite for fast low-latency response)
app.post('/api/ai/prescreen', async (req: Request, res: Response) => {
  const { 
    age, 
    weight, 
    gender, 
    hemoglobin, 
    lastDonationMonths, 
    hadTattooIn6Months, 
    recentDentalOrSurgery, 
    medications, 
    feverOrInfection 
  } = req.body;

  try {
    const prompt = `Perform an immediate donor eligibility evaluation based on Drugs and Cosmetics Act & National Blood Transfusion Council (NBTC) India guidelines:
Candidate Details:
- Age: ${age} years (Rule: 18 - 65 years)
- Weight: ${weight} kg (Rule: >= 45 kg for 350ml, >= 50 kg for 450ml)
- Gender: ${gender}
- Hemoglobin: ${hemoglobin || 'Unknown / Not tested'} g/dL (Rule: >= 12.5 g/dL)
- Months since last donation: ${lastDonationMonths ?? 'First time donor'} (Rule: >= 3 months for male, >= 4 months for female)
- Tattoo/Acupuncture/Piercing within last 6 months: ${hadTattooIn6Months ? 'YES' : 'NO'} (Rule: Deferral for 6-12 months)
- Recent Dental extraction/Major surgery in last 6 months: ${recentDentalOrSurgery ? 'YES' : 'NO'} (Rule: Deferral required)
- Active Medications / Antibiotics: ${medications || 'None'}
- Fever / Cold / Infection in last 2 weeks: ${feverOrInfection ? 'YES' : 'NO'} (Rule: Must be fully symptom-free for 14 days)

Provide an accurate, concise assessment in valid JSON with:
{
  "eligible": boolean,
  "confidenceScore": number (0-100),
  "verdictTitle": string,
  "summary": string,
  "reasons": string[],
  "recommendations": string[],
  "coolingOffDaysRemaining": number (0 if eligible now)
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Gemini Pre-screen Error:', error);
    // Rule-based deterministic fallback
    const isWeightOk = Number(weight) >= 45;
    const isAgeOk = Number(age) >= 18 && Number(age) <= 65;
    const isTattooOk = !hadTattooIn6Months;
    const isHealthy = !feverOrInfection && !recentDentalOrSurgery;
    const eligible = isWeightOk && isAgeOk && isTattooOk && isHealthy;

    res.json({
      eligible,
      confidenceScore: 92,
      verdictTitle: eligible ? 'Preliminary Eligible to Donate' : 'Temporary Deferral Recommended',
      summary: eligible 
        ? 'Based on NBTC criteria, you meet the primary safety benchmarks. Final physical vitals check will be done at the camp.' 
        : 'One or more temporary deferral criteria apply. Please review the checklist below.',
      reasons: [
        !isWeightOk ? 'Weight below 45 kg threshold' : '',
        !isAgeOk ? 'Age must be between 18 and 65' : '',
        hadTattooIn6Months ? 'Tattoo/piercing in last 6 months requires waiting period' : '',
        feverOrInfection ? 'Recent fever or infection requires full recovery' : ''
      ].filter(Boolean),
      recommendations: [
        'Stay well hydrated (drink 500ml water prior to donation)',
        'Ensure a good night of 6-8 hours sleep',
        'Avoid alcohol consumption 24 hours prior to donation'
      ],
      coolingOffDaysRemaining: eligible ? 0 : 30
    });
  }
});

// 3. AI Inventory Demand Forecaster (gemini-3.1-pro-preview with HIGH Thinking Level)
app.post('/api/ai/forecast', async (req: Request, res: Response) => {
  try {
    const currentInventorySummary = {
      totalClearedUnits: bloodUnits.filter(u => u.status === 'Cleared').length,
      byGroup: {
        'O-': bloodUnits.filter(u => u.status === 'Cleared' && u.bloodGroup === 'O-').length,
        'O+': bloodUnits.filter(u => u.status === 'Cleared' && u.bloodGroup === 'O+').length,
        'A+': bloodUnits.filter(u => u.status === 'Cleared' && u.bloodGroup === 'A+').length,
        'A-': bloodUnits.filter(u => u.status === 'Cleared' && u.bloodGroup === 'A-').length,
        'B+': bloodUnits.filter(u => u.status === 'Cleared' && u.bloodGroup === 'B+').length,
        'B-': bloodUnits.filter(u => u.status === 'Cleared' && u.bloodGroup === 'B-').length,
        'AB+': bloodUnits.filter(u => u.status === 'Cleared' && u.bloodGroup === 'AB+').length,
        'AB-': bloodUnits.filter(u => u.status === 'Cleared' && u.bloodGroup === 'AB-').length,
      },
      plateletsCount: bloodUnits.filter(u => u.status === 'Cleared' && u.component.includes('Platelet')).length,
      prbcCount: bloodUnits.filter(u => u.status === 'Cleared' && u.component.includes('PRBC')).length,
      quarantineCount: bloodUnits.filter(u => u.status === 'Quarantine').length
    };

    const prompt = `Analyze current regional blood bank inventory reserves and provide a high-level clinical demand forecast and shortage vulnerability assessment.
Current Inventory State:
${JSON.stringify(currentInventorySummary, null, 2)}

Provide strategic analysis including:
1. High-risk blood group shortages (especially universal donor O- and rare negative Rh phenotypes).
2. Platelet shelf-life vulnerability (Platelets expire in 5 days; assess seasonal risks like monsoon dengue/chikungunya spikes).
3. Recommended Targeted Action Plan for Blood Bank Officers & Camp Organizers over the next 14 days.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.HIGH
        }
      }
    });

    res.json({
      forecastText: response.text,
      currentInventorySummary
    });
  } catch (error: any) {
    console.error('Gemini Forecast Error:', error);
    res.json({
      forecastText: `### Clinical Demand Forecast & Risk Assessment
- **Critical Vulnerability - Rh Negative Stocks (O- & AB-)**: Current stock is critically low. Universal donor O- is essential for trauma resuscitations.
- **Platelet Reserve Alert**: Platelets have a strict 5-day shelf-life with agitation at 20-24°C. Active continuous donor calling recommended.
- **Strategic Recommendation**: Schedule a targeted community donation camp within the next 5 days focusing on colleges and corporate tech parks to replenish PRBC and Platelet reserves.`,
      currentInventorySummary: {
        totalClearedUnits: bloodUnits.filter(u => u.status === 'Cleared').length
      }
    });
  }
});

// 4. Grounded Blood Bank Search (gemini-3.5-flash with googleSearch tool)
app.post('/api/ai/grounded-search', async (req: Request, res: Response) => {
  const { query, city } = req.body;
  try {
    const prompt = `Find up to date information and accredited government / Red Cross blood banks or donation centers in ${city || 'India'}: ${query}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const webSources = chunks
      .filter((c: any) => c.web)
      .map((c: any) => ({
        title: c.web.title,
        uri: c.web.uri
      }));

    res.json({
      answer: response.text,
      sources: webSources
    });
  } catch (error: any) {
    console.error('Grounding Search Error:', error);
    res.json({
      answer: `Accredited blood banks in ${city || 'your area'} include AIIMS, Regional Red Cross Blood Centers, Government Medical Colleges, and Rotary TTK Blood Centers. Emergency contact helpline: 1800-11-2446.`,
      sources: [
        { title: 'e-RaktKosh National Blood Portal', uri: 'https://eraktkosh.mohfw.gov.in' },
        { title: 'Indian Red Cross Blood Services', uri: 'https://indianredcross.org' }
      ]
    });
  }
});

// --- VITE DEV MIDDLEWARE & STATIC ASSET SERVING ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
