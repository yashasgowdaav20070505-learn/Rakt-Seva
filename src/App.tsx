import React, { useState, useEffect } from 'react';
import { 
  BloodUnit, 
  BloodBank, 
  DonationCamp, 
  DonorRecord, 
  NotificationAlert, 
  EmergencyBloodRequest 
} from './types';
import { api } from './services/api';
import { MOCK_EMERGENCY_REQUESTS, MOCK_DONORS } from './data/mockData';

// Authentication & Profile Editing
import { LoginPage, CitizenUser, OrgUser } from './components/Auth/LoginPage';
import { EditProfileModal } from './components/Auth/EditProfileModal';

// Category 1: Citizen Portal (Donor & Requester Dual-Mode)
import { CitizenDualPortal } from './components/CitizenPortal/CitizenDualPortal';

// Category 2: Organization / Camp Host Portal
import { CampHostPortal } from './components/OrganizationPortal/CampHostPortal';

// Standout Features
import { SmartSosRadiusSection } from './components/StandoutFeatures/SmartSosRadiusSection';
import { NearbyDonorsSection } from './components/StandoutFeatures/NearbyDonorsSection';
import { InteractiveMapWidget } from './components/StandoutFeatures/InteractiveMapWidget';
import { BadgeCertificateViewer } from './components/StandoutFeatures/BadgeCertificateViewer';
import { DigitalDonorCard } from './components/DonorManagement/DigitalDonorCard';

// Shell & Global Widgets
import { Navbar } from './components/Navbar';
import { NotificationDrawer } from './components/NotificationDrawer';
import { RaktSevaChatbot } from './components/Assistant/RaktSevaChatbot';
import { SupportedLanguage } from './services/i18n';
import { Droplet } from 'lucide-react';

export default function App() {
  // Multilingual state (English, Kannada, Hindi, Tamil, Telugu, Malayalam, Marathi)
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('en');

  // Authentication session state (Starts on Login page for user to choose category)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<CitizenUser | null>(null);
  const [currentOrg, setCurrentOrg] = useState<OrgUser | null>(null);

  // Citizen Mode ('donor' or 'requester')
  const [citizenMode, setCitizenMode] = useState<'donor' | 'requester'>('donor');

  // Active view tab: 'citizen', 'sos', 'map', 'host'
  const [activeTab, setActiveTab] = useState<string>('citizen');

  // Focused camp when clicking "View on Google Map" from camp card
  const [focusCampOnMap, setFocusCampOnMap] = useState<DonationCamp | null>(null);

  // App data states
  const [camps, setCamps] = useState<DonationCamp[]>([]);
  const [bloodBanks, setBloodBanks] = useState<BloodBank[]>([]);
  const [notifications, setNotifications] = useState<NotificationAlert[]>([]);
  const [emergencyRequests, setEmergencyRequests] = useState<EmergencyBloodRequest[]>(MOCK_EMERGENCY_REQUESTS);

  // Modals
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [profileModalTab, setProfileModalTab] = useState<'details' | 'verification'>('details');
  const [isBadgeViewerOpen, setIsBadgeViewerOpen] = useState(false);
  const [isDonorCardOpen, setIsDonorCardOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Load initial backend data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [banks, campList, notifs, emReqs] = await Promise.all([
          api.getBloodBanks(),
          api.getCamps(),
          api.getNotifications(),
          api.getEmergencyRequests()
        ]);
        setBloodBanks(banks);
        setCamps(campList);
        setNotifications(notifs);
        if (emReqs && emReqs.length > 0) {
          setEmergencyRequests(emReqs);
        }
      } catch (err) {
        console.error('Failed to load data', err);
      }
    };
    loadData();
  }, []);

  // Handle Citizen Login
  const handleCitizenLogin = (user: CitizenUser) => {
    setCurrentUser(user);
    setCurrentOrg(null);
    setIsLoggedIn(true);
    setActiveTab('citizen');
  };

  // Handle Organization Login
  const handleOrgLogin = (org: OrgUser) => {
    setCurrentOrg(org);
    setCurrentUser(null);
    setIsLoggedIn(true);
    setActiveTab('host');
  };

  // Handle Logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentOrg(null);
  };

  // Helper active donor record
  const activeDonorRecord: DonorRecord = {
    id: currentUser?.id || 'CITIZEN-101',
    fullName: currentUser?.name || 'Rahul Sharma',
    bloodGroup: currentUser?.bloodGroup || 'O+',
    gender: currentUser?.gender || 'Male',
    dateOfBirth: '1995-04-14',
    phone: currentUser?.phone || '+91 98765 43210',
    email: currentUser?.email || 'rahul.sharma@example.com',
    state: 'Maharashtra',
    district: 'Mumbai',
    address: currentUser?.location || 'Worli, Mumbai',
    weightKg: 72,
    hemoglobinGdl: 14.8,
    donorCardNumber: 'RS-MH-9504-01001',
    registeredDate: '2023-01-15',
    lastDonationDate: '2026-07-30',
    totalDonations: currentUser?.totalDonations || 8,
    emergencyDonor: true,
    history: MOCK_DONORS[0]?.history || []
  };

  const handleCreateEmergencyRequest = async (newReq: Partial<EmergencyBloodRequest>) => {
    const created: EmergencyBloodRequest = {
      id: `REQ-SOS-${Math.floor(100 + Math.random() * 900)}`,
      patientName: newReq.patientName || 'Emergency Patient',
      bloodGroup: newReq.bloodGroup || 'O-',
      unitsNeeded: Number(newReq.unitsNeeded) || 1,
      hospitalName: newReq.hospitalName || 'City Hospital',
      location: newReq.location || 'Mumbai',
      distanceKm: newReq.distanceKm || 2.4,
      urgency: newReq.urgency || 'Critical',
      verificationStatus: newReq.verificationStatus || 'Hospital Verified',
      requesterPhone: newReq.requesterPhone || '+91 98200 44551',
      prescriptionUrl: newReq.prescriptionUrl,
      createdAt: 'Just now',
      respondersCount: 0,
      acceptedByMe: false,
      notes: newReq.notes
    };

    setEmergencyRequests([created, ...emergencyRequests]);
    await api.createEmergencyRequest(created);
  };

  const handleAcceptEmergencyRequest = (reqId: string) => {
    setEmergencyRequests(prev => prev.map(r => {
      if (r.id === reqId) {
        return { ...r, respondersCount: r.respondersCount + 1, acceptedByMe: true };
      }
      return r;
    }));
  };

  const handleNavigateToCampOnMap = (camp: DonationCamp) => {
    setFocusCampOnMap(camp);
    setActiveTab('map');
  };

  // IF NOT LOGGED IN: SHOW DEDICATED TWO-CATEGORY LOGIN PAGE
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#FDF8F7] flex flex-col justify-between antialiased selection:bg-rose-500 selection:text-white">
        <header className="py-4 px-6 border-b border-rose-100 bg-white/80 backdrop-blur-md">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#8B0000] to-[#C92A2A] text-white flex items-center justify-center shadow-sm">
                <Droplet className="w-5 h-5 fill-white" />
              </div>
              <span className="font-black text-slate-900 text-lg tracking-tight">
                Rakt Seva
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-xs text-slate-500 font-semibold">
                National Voluntary Blood Donation Grid
              </span>
              <div className="bg-rose-50 px-3 py-1 rounded-full text-xs font-bold text-rose-800 border border-rose-200">
                Official Portal
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center py-6 sm:py-8">
          <LoginPage
            onCitizenLogin={handleCitizenLogin}
            onOrgLogin={handleOrgLogin}
          />
        </main>

        <footer className="py-4 text-center text-xs text-slate-400 border-t border-rose-100 bg-white/50">
          Rakt Seva · Drugs & Cosmetics Act Compliant · Certified National Blood Grid
        </footer>
      </div>
    );
  }

  // IF LOGGED IN: SHOW MINIMAL DASHBOARD FOR THE SPECIFIC CATEGORY
  return (
    <div className="min-h-screen bg-[#FDF8F7] text-slate-900 flex flex-col antialiased selection:bg-rose-500 selection:text-white">
      {/* Category-tailored Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        currentOrg={currentOrg}
        citizenMode={citizenMode}
        notifications={notifications}
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenEditProfile={() => {
          setProfileModalTab('details');
          setIsEditProfileOpen(true);
        }}
        onOpenVerificationCenter={() => {
          setProfileModalTab('verification');
          setIsEditProfileOpen(true);
        }}
        onOpenDonorCard={() => setIsDonorCardOpen(true)}
        onOpenBadges={() => setIsBadgeViewerOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* ========================================================= */}
        {/* CATEGORY 1: CITIZEN PORTAL (Donor & Requester Combined) */}
        {/* ========================================================= */}
        {currentUser && activeTab === 'citizen' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <CitizenDualPortal
              donor={activeDonorRecord}
              emergencyRequests={emergencyRequests}
              camps={camps}
              citizenMode={citizenMode}
              onChangeCitizenMode={setCitizenMode}
              currentLanguage={currentLanguage}
              onCreateEmergencyRequest={handleCreateEmergencyRequest}
              onNavigateToStockSearch={() => setActiveTab('sos')}
              onNavigateToCamps={() => setActiveTab('map')}
              onNavigateToMap={() => {
                setFocusCampOnMap(null);
                setActiveTab('map');
              }}
              onNavigateToMapWithCamp={handleNavigateToCampOnMap}
            />
          </div>
        )}

        {/* STANDOUT FEATURE 1: EMERGENCY SOS (in Donor Mode) vs DONOR LIST (in Requester Mode) */}
        {currentUser && activeTab === 'sos' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {citizenMode === 'donor' ? (
              /* Emergency SOS Radar for Donors */
              <SmartSosRadiusSection
                requests={emergencyRequests}
                onAcceptRequest={handleAcceptEmergencyRequest}
              />
            ) : (
              /* Nearby Available Donors List for Requesters */
              <NearbyDonorsSection
                currentLanguage={currentLanguage}
                patientBloodGroup={currentUser.bloodGroup}
                onNavigateToMap={() => setActiveTab('map')}
              />
            )}
          </div>
        )}

        {/* STANDOUT FEATURE 2: REALISTIC GOOGLE MAPS SECTION */}
        {activeTab === 'map' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <InteractiveMapWidget
              requests={emergencyRequests}
              camps={camps}
              bloodBanks={bloodBanks}
              currentLanguage={currentLanguage}
              userMode={currentUser ? citizenMode : 'donor'}
              initialFocusCamp={focusCampOnMap}
            />
          </div>
        )}

        {/* ========================================================= */}
        {/* CATEGORY 2: THE ORGANIZATION / CAMP HOST PORTAL */}
        {/* ========================================================= */}
        {currentOrg && activeTab === 'host' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <CampHostPortal
              camps={camps}
              bloodBanks={bloodBanks}
              onCreateCamp={async (camp) => {
                await api.createCamp(camp);
                const updated = await api.getCamps();
                setCamps(updated);
              }}
            />
          </div>
        )}
      </main>

      {/* Floating 24/7 Clinical Assistant */}
      <RaktSevaChatbot />

      {/* Notification Drawer */}
      <NotificationDrawer
        notifications={notifications}
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onSelectNotification={(notif) => {
          setIsNotificationsOpen(false);
          if (currentUser) setActiveTab('sos');
          else if (currentOrg) setActiveTab('host');
        }}
      />

      {/* EDIT PROFILE & VERIFICATION MODAL */}
      {isEditProfileOpen && (
        <EditProfileModal
          citizenUser={currentUser}
          orgUser={currentOrg}
          initialTab={profileModalTab}
          onSaveCitizen={(updated) => setCurrentUser(updated)}
          onSaveOrg={(updated) => setCurrentOrg(updated)}
          onClose={() => setIsEditProfileOpen(false)}
        />
      )}

      {/* DIGITAL BADGES VIEWER MODAL */}
      {isBadgeViewerOpen && (
        <BadgeCertificateViewer
          donor={activeDonorRecord}
          onClose={() => setIsBadgeViewerOpen(false)}
        />
      )}

      {/* DIGITAL DONOR ID CARD MODAL */}
      {isDonorCardOpen && (
        <DigitalDonorCard
          donor={activeDonorRecord}
          onClose={() => setIsDonorCardOpen(false)}
        />
      )}

      {/* Minimal Footer */}
      <footer className="border-t border-rose-100 bg-white/80 backdrop-blur-md py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-rose-600 text-white flex items-center justify-center">
              <Droplet className="w-3.5 h-3.5 fill-white" />
            </div>
            <span className="font-black text-slate-900">Rakt Seva</span>
            <span className="text-slate-400">· Everyone Could Be A Hero</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-slate-600">
            <span>Logged in as: <strong>{currentUser ? currentUser.name : currentOrg ? currentOrg.orgName : 'Guest'}</strong></span>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={handleLogout}
              className="text-rose-700 hover:underline font-extrabold"
            >
              Log Out
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
