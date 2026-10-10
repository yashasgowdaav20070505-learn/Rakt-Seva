import React, { useState, useEffect, useRef } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { EmergencyBloodRequest, DonationCamp, BloodBank } from '../../types';
import { MOCK_NEARBY_DONORS, NearbyDonor } from '../../data/mockNearbyDonors';
import { 
  MapPin, 
  Search, 
  Navigation, 
  Phone, 
  Send, 
  ShieldCheck, 
  Crosshair, 
  Users, 
  Building2, 
  Calendar,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface InteractiveMapWidgetProps {
  requests: EmergencyBloodRequest[];
  camps: DonationCamp[];
  bloodBanks: BloodBank[];
  currentLanguage?: string;
  userMode?: 'donor' | 'requester';
  initialFocusCamp?: DonationCamp | null;
}

export const InteractiveMapWidget: React.FC<InteractiveMapWidgetProps> = ({
  requests,
  camps,
  bloodBanks,
  userMode = 'donor',
  initialFocusCamp = null
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [googleMap, setGoogleMap] = useState<any>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'terrain'>('roadmap');
  const [searchQuery, setSearchQuery] = useState('');
  
  // In Donor Mode: show CAMPS (donation sites) and REQUESTS (places where patients request blood)
  // In Requester Mode: show DONORS (nearby people) and BLOOD BANKS
  const defaultFilter = userMode === 'donor' ? 'ALL_DONOR' : 'ALL_REQUESTER';
  const [selectedFilter, setSelectedFilter] = useState<string>(defaultFilter);

  const [selectedDonor, setSelectedDonor] = useState<NearbyDonor | null>(null);
  const [selectedBank, setSelectedBank] = useState<BloodBank | null>(null);
  const [selectedCamp, setSelectedCamp] = useState<DonationCamp | null>(initialFocusCamp || camps[0] || null);
  const [selectedRequest, setSelectedRequest] = useState<EmergencyBloodRequest | null>(null);
  const [requestSentTo, setRequestSentTo] = useState<string | null>(null);
  const [rsvpCampId, setRsvpCampId] = useState<string | null>(null);
  const [mapLoadError, setMapLoadError] = useState(false);

  // Update default filter when mode changes
  useEffect(() => {
    setSelectedFilter(userMode === 'donor' ? 'ALL_DONOR' : 'ALL_REQUESTER');
    if (userMode === 'donor') {
      setSelectedDonor(null);
      setSelectedCamp(initialFocusCamp || camps[0] || null);
    } else {
      setSelectedCamp(null);
      setSelectedDonor(MOCK_NEARBY_DONORS[0]);
    }
  }, [userMode, initialFocusCamp]);

  const defaultCenter = initialFocusCamp?.latitude && initialFocusCamp?.longitude
    ? { lat: initialFocusCamp.latitude, lng: initialFocusCamp.longitude }
    : { lat: 19.0178, lng: 72.8258 }; // Mumbai central

  // Initialize Google Maps JavaScript API
  useEffect(() => {
    let isMounted = true;
    let markersList: any[] = [];

    const initMap = async () => {
      try {
        setOptions({
          key: 'AIzaSyAvzC01eJ7LQPcrabHINeIz1967eEPjvHo',
          v: 'weekly',
        } as any);

        const { Map } = (await importLibrary('maps')) as any;
        const { Marker } = (await importLibrary('marker')) as any;

        if (!isMounted || !mapRef.current) return;

        const map = new Map(mapRef.current, {
          center: defaultCenter,
          zoom: 13,
          mapTypeId: mapType,
          disableDefaultUI: false,
          zoomControl: true,
          zoomControlOptions: {
            position: 9, // RIGHT_BOTTOM
          },
          mapTypeControl: false,
          streetViewControl: true,
          fullscreenControl: true,
        });

        setGoogleMap(map);

        // MODE-DEPENDENT MARKERS RENDERING:
        if (userMode === 'donor') {
          // 1. DONOR MODE: Donation Camps (Sites where blood donation is taking place)
          camps.forEach((camp) => {
            if (!camp.latitude || !camp.longitude) return;
            const marker = new Marker({
              position: { lat: camp.latitude, lng: camp.longitude },
              map,
              title: `Donation Camp: ${camp.title}`,
              icon: {
                url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                  <svg width="44" height="54" viewBox="0 0 44 54" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 0C9.8 0 0 9.8 0 22C0 35.5 22 54 22 54C22 54 44 35.5 44 22C44 9.8 34.2 0 22 0Z" fill="#DC2626" stroke="#FFFFFF" stroke-width="2"/>
                    <circle cx="22" cy="22" r="15" fill="#FFFFFF"/>
                    <text x="22" y="27" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#DC2626" text-anchor="middle">⛺</text>
                  </svg>
                `)}`,
                scaledSize: { width: 44, height: 54 },
                anchor: { x: 22, y: 54 },
              },
            });

            marker.addListener('click', () => {
              setSelectedCamp(camp);
              setSelectedRequest(null);
              setSelectedDonor(null);
              setSelectedBank(null);
              map.panTo({ lat: camp.latitude!, lng: camp.longitude! });
            });
            markersList.push(marker);
          });

          // 2. DONOR MODE: Emergency Blood Requests (where patients are urgently requesting blood)
          requests.forEach((req) => {
            const reqLat = req.latitude || 18.9950;
            const reqLng = req.longitude || 72.8240;
            const marker = new Marker({
              position: { lat: reqLat, lng: reqLng },
              map,
              title: `Urgent Request: ${req.patientName} (${req.bloodGroup})`,
              icon: {
                url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                  <svg width="40" height="50" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 0C8.9 0 0 8.9 0 20C0 32 20 50 20 50C20 50 40 32 40 20C40 8.9 31.1 0 20 0Z" fill="#991B1B" stroke="#FFFFFF" stroke-width="2"/>
                    <circle cx="20" cy="20" r="13" fill="#FFFFFF"/>
                    <text x="20" y="24" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="#991B1B" text-anchor="middle">${req.bloodGroup}</text>
                  </svg>
                `)}`,
                scaledSize: { width: 40, height: 50 },
                anchor: { x: 20, y: 50 },
              },
            });

            marker.addListener('click', () => {
              setSelectedRequest(req);
              setSelectedCamp(null);
              setSelectedDonor(null);
              setSelectedBank(null);
              map.panTo({ lat: reqLat, lng: reqLng });
            });
            markersList.push(marker);
          });
        } else {
          // REQUESTER MODE: Nearby Available Donors + Blood Banks
          MOCK_NEARBY_DONORS.forEach((donor) => {
            const marker = new Marker({
              position: { lat: donor.latitude, lng: donor.longitude },
              map,
              title: `${donor.fullName} (${donor.bloodGroup})`,
              icon: {
                url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                  <svg width="42" height="52" viewBox="0 0 42 52" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 0C9.4 0 0 9.4 0 21C0 34 21 52 21 52C21 52 42 34 42 21C42 9.4 32.6 0 21 0Z" fill="#DC2626" stroke="#FFFFFF" stroke-width="2"/>
                    <circle cx="21" cy="21" r="14" fill="#FFFFFF"/>
                    <text x="21" y="25" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#B91C1C" text-anchor="middle">${donor.bloodGroup}</text>
                  </svg>
                `)}`,
                scaledSize: { width: 42, height: 52 },
                anchor: { x: 21, y: 52 },
              },
            });

            marker.addListener('click', () => {
              setSelectedDonor(donor);
              setSelectedBank(null);
              setSelectedCamp(null);
              setSelectedRequest(null);
              map.panTo({ lat: donor.latitude, lng: donor.longitude });
            });
            markersList.push(marker);
          });

          // Blood Banks
          bloodBanks.forEach((bank) => {
            if (!bank.latitude || !bank.longitude) return;
            const marker = new Marker({
              position: { lat: bank.latitude, lng: bank.longitude },
              map,
              title: bank.name,
              icon: {
                url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                  <svg width="38" height="48" viewBox="0 0 38 48" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 0C8.5 0 0 8.5 0 19C0 30.5 19 48 19 48C19 48 38 30.5 38 19C38 8.5 29.5 0 19 0Z" fill="#0F172A" stroke="#FFFFFF" stroke-width="2"/>
                    <circle cx="19" cy="19" r="12" fill="#FFFFFF"/>
                    <text x="19" y="23" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#0F172A" text-anchor="middle">🏥</text>
                  </svg>
                `)}`,
                scaledSize: { width: 38, height: 48 },
                anchor: { x: 19, y: 48 },
              },
            });

            marker.addListener('click', () => {
              setSelectedBank(bank);
              setSelectedDonor(null);
              setSelectedCamp(null);
              setSelectedRequest(null);
              map.panTo({ lat: bank.latitude, lng: bank.longitude });
            });
            markersList.push(marker);
          });
        }
      } catch (err: any) {
        console.warn('Google Maps API initialization fallback', err);
        if (isMounted) setMapLoadError(true);
      }
    };

    initMap();

    return () => {
      isMounted = false;
      markersList.forEach(m => m.setMap(null));
    };
  }, [userMode, camps, bloodBanks, requests]);

  const changeMapType = (type: 'roadmap' | 'satellite' | 'terrain') => {
    setMapType(type);
    if (googleMap) {
      googleMap.setMapTypeId(type);
    }
  };

  const handleCenterToUser = () => {
    if (googleMap) {
      googleMap.panTo(defaultCenter);
      googleMap.setZoom(14);
    }
  };

  const handleSendRequest = (name: string) => {
    setRequestSentTo(name);
    setTimeout(() => setRequestSentTo(null), 3500);
  };

  return (
    <div className="bg-white border border-rose-100 rounded-3xl p-4 sm:p-6 shadow-sm space-y-4">
      {/* Top Banner indicating realistic Google Maps mode */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-rose-600 text-xs font-black uppercase tracking-wider">
            <Navigation className="w-4 h-4 text-rose-600" />
            <span>
              {userMode === 'donor' 
                ? 'Donor Map Mode · Donation Sites & Urgent Requests' 
                : 'Requester Map Mode · Available Donors & Blood Banks'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5 tracking-tight">
            Realistic Google Maps View
          </h2>
          <p className="text-xs text-slate-500">
            {userMode === 'donor'
              ? 'Showing blood donation camp sites and urgent emergency requirements waiting for donors.'
              : 'Showing verified active blood donors and certified blood bank centers in your area.'}
          </p>
        </div>

        {/* Filter Switcher Tailored to Active Mode */}
        {userMode === 'donor' ? (
          <div className="flex items-center gap-1.5 p-1 bg-rose-50/80 rounded-2xl border border-rose-100 text-xs">
            <button
              type="button"
              onClick={() => setSelectedFilter('ALL_DONOR')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                selectedFilter === 'ALL_DONOR' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Sites
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter('CAMPS')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                selectedFilter === 'CAMPS' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Donation Camps ({camps.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter('REQUESTS')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                selectedFilter === 'REQUESTS' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Emergency Needs ({requests.length})
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 p-1 bg-rose-50/80 rounded-2xl border border-rose-100 text-xs">
            <button
              type="button"
              onClick={() => setSelectedFilter('ALL_REQUESTER')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                selectedFilter === 'ALL_REQUESTER' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Available
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter('DONORS')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                selectedFilter === 'DONORS' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Donors ({MOCK_NEARBY_DONORS.length})
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter('BANKS')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                selectedFilter === 'BANKS' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Blood Banks ({bloodBanks.length})
            </button>
          </div>
        )}
      </div>

      {/* Main Map Container with Authentic Google Maps UI Overlays */}
      <div className="relative w-full h-[550px] sm:h-[620px] rounded-3xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
        {/* Real Google Maps DIV */}
        <div ref={mapRef} className="w-full h-full" />

        {/* Fallback Simulation if API is offline */}
        {mapLoadError && (
          <div className="absolute inset-0 bg-[#e5e3df] flex flex-col justify-between p-4 overflow-hidden">
            <div 
              className="absolute inset-0 opacity-40 pointer-events-none" 
              style={{
                backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px), radial-gradient(#cbd5e1 1px, #e5e3df 1px)',
                backgroundSize: '40px 40px',
                backgroundPosition: '0 0, 20px 20px'
              }}
            />
            
            {/* Simulated Road network lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60">
              <path d="M-50 200 Q 250 180 500 320 T 1000 400" stroke="#fef08a" strokeWidth="12" fill="none" />
              <path d="M150 -50 Q 200 300 350 700" stroke="#ffffff" strokeWidth="16" fill="none" />
              <path d="M-50 450 Q 400 420 900 150" stroke="#ffffff" strokeWidth="10" fill="none" />
              <path d="M450 -50 Q 500 250 700 700" stroke="#fed7aa" strokeWidth="8" fill="none" />
            </svg>

            <div className="relative w-full h-full pointer-events-auto">
              {userMode === 'donor' ? (
                // Donor mode markers in fallback: Donation Camps & Emergency Requests
                camps.map((camp, idx) => {
                  const positions = [
                    { top: '35%', left: '42%' },
                    { top: '25%', left: '58%' },
                    { top: '65%', left: '36%' },
                    { top: '75%', left: '62%' }
                  ];
                  const pos = positions[idx % positions.length];
                  const isSelected = selectedCamp?.id === camp.id;

                  return (
                    <div
                      key={camp.id}
                      onClick={() => { setSelectedCamp(camp); setSelectedRequest(null); }}
                      style={{ top: pos.top, left: pos.left }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-125 z-20 ${
                        isSelected ? 'scale-125 z-30' : ''
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white shadow-lg flex items-center justify-center text-lg border-2 border-white">
                          ⛺
                        </div>
                        <div className="bg-slate-900 text-white text-[10px] font-black px-2 py-0.5 rounded-full -mt-2 border border-white shadow-xs">
                          {camp.organizerName.split(' ')[0]}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                // Requester mode markers in fallback: Donors with Profile Photos
                MOCK_NEARBY_DONORS.map((donor, idx) => {
                  const positions = [
                    { top: '35%', left: '42%' },
                    { top: '25%', left: '55%' },
                    { top: '50%', left: '32%' },
                    { top: '65%', left: '48%' },
                    { top: '20%', left: '28%' },
                    { top: '75%', left: '60%' },
                  ];
                  const pos = positions[idx % positions.length];
                  const isSelected = selectedDonor?.id === donor.id;

                  return (
                    <div
                      key={donor.id}
                      onClick={() => { setSelectedDonor(donor); setSelectedBank(null); }}
                      style={{ top: pos.top, left: pos.left }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-125 z-20 ${
                        isSelected ? 'scale-125 z-30' : ''
                      }`}
                    >
                      <div className="relative flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full p-0.5 bg-rose-600 shadow-lg shadow-rose-950/30 flex items-center justify-center">
                          <img
                            src={donor.photoUrl}
                            alt={donor.fullName}
                            className="w-full h-full rounded-full object-cover border-2 border-white"
                          />
                        </div>
                        <div className="bg-rose-700 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full -mt-2 border border-white shadow-xs">
                          {donor.bloodGroup}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Floating Google Maps Search Card (Top Left) */}
        <div className="absolute top-4 left-4 z-20 max-w-sm w-[calc(100%-2rem)] sm:w-80 bg-white rounded-2xl shadow-xl shadow-slate-900/15 border border-slate-200 overflow-hidden">
          <div className="flex items-center px-3.5 py-2.5 gap-2.5">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                userMode === 'donor' 
                  ? "Search donation camps, hospitals..." 
                  : "Search nearby donors, blood groups..."
              }
              className="w-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none font-medium"
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              type="button"
              onClick={handleCenterToUser}
              title="Center on my location"
              className="p-1.5 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors shrink-0"
            >
              <Crosshair className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Google Maps Layer Switcher (Top Right) */}
        <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-md rounded-2xl shadow-md border border-slate-200 p-1 flex items-center gap-1 text-[11px] font-bold">
          <button
            type="button"
            onClick={() => changeMapType('roadmap')}
            className={`px-2.5 py-1.5 rounded-xl transition-all ${
              mapType === 'roadmap' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Map
          </button>
          <button
            type="button"
            onClick={() => changeMapType('satellite')}
            className={`px-2.5 py-1.5 rounded-xl transition-all ${
              mapType === 'satellite' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Satellite
          </button>
          <button
            type="button"
            onClick={() => changeMapType('terrain')}
            className={`px-2.5 py-1.5 rounded-xl transition-all ${
              mapType === 'terrain' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Terrain
          </button>
        </div>

        {/* POPUP 1: DONATION CAMP DETAILS (Shown in Donor Mode or on Camp Click) */}
        {selectedCamp && (
          <div className="absolute bottom-6 left-4 right-4 sm:right-auto sm:w-96 z-20 bg-white rounded-3xl shadow-2xl shadow-slate-900/20 border border-rose-100 p-4 sm:p-5 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm text-xl">
                  ⛺
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-rose-600">
                    Donation Camp Site
                  </span>
                  <h3 className="font-black text-slate-900 text-sm leading-snug">{selectedCamp.title}</h3>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                    <span>{selectedCamp.venueAddress}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCamp(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 my-3 p-2.5 rounded-xl bg-[#FFF9F8] border border-rose-100 text-[11px]">
              <div>
                <span className="text-slate-400">Date:</span>{' '}
                <strong className="text-slate-800">{selectedCamp.date}</strong>
              </div>
              <div>
                <span className="text-slate-400">Timings:</span>{' '}
                <strong className="text-slate-800">{selectedCamp.startTime} - {selectedCamp.endTime}</strong>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400">Partner Blood Bank:</span>{' '}
                <strong className="text-slate-800">{selectedCamp.partnerBloodBankName}</strong>
              </div>
            </div>

            {rsvpCampId === selectedCamp.id ? (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Pre-registration confirmed! We look forward to seeing you.</span>
              </div>
            ) : null}

            <div className="flex items-center gap-2 pt-1">
              <a
                href={`tel:${selectedCamp.contactPhone}`}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Coordinator</span>
              </a>

              <button
                type="button"
                onClick={() => setRsvpCampId(selectedCamp.id)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Pre-Register Slot</span>
              </button>
            </div>
          </div>
        )}

        {/* POPUP 2: URGENT EMERGENCY BLOOD REQUEST (In Donor Mode) */}
        {selectedRequest && (
          <div className="absolute bottom-6 left-4 right-4 sm:right-auto sm:w-96 z-20 bg-white rounded-3xl shadow-2xl shadow-slate-900/20 border border-rose-200 p-4 sm:p-5 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                  Critical Blood Need · {selectedRequest.urgency}
                </span>
                <h3 className="font-black text-slate-900 text-base mt-1">
                  Patient: {selectedRequest.patientName}
                </h3>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Hospital: <strong>{selectedRequest.hospitalName}</strong> ({selectedRequest.location})
                </div>
              </div>

              <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex flex-col items-center justify-center shrink-0">
                <span className="text-[8px] font-bold uppercase">Blood</span>
                <span className="text-sm font-black">{selectedRequest.bloodGroup}</span>
              </div>
            </div>

            <div className="my-3 p-2.5 rounded-xl bg-rose-50 border border-rose-100 text-xs text-rose-900 flex items-center justify-between">
              <span>Units Needed: <strong>{selectedRequest.unitsNeeded} Units</strong></span>
              <span className="text-[11px] font-bold text-emerald-700">Hospital Verified</span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${selectedRequest.requesterPhone}`}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Contact Hospital</span>
              </a>
              <button
                type="button"
                onClick={() => setSelectedRequest(null)}
                className="px-3 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* POPUP 3: DONOR DETAILS (In Requester Mode) */}
        {selectedDonor && (
          <div className="absolute bottom-6 left-4 right-4 sm:right-auto sm:w-96 z-20 bg-white rounded-3xl shadow-2xl shadow-slate-900/20 border border-rose-100 p-4 sm:p-5 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <img
                    src={selectedDonor.photoUrl}
                    alt={selectedDonor.fullName}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-rose-300 shadow-xs"
                  />
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-black text-slate-900 text-sm">{selectedDonor.fullName}</h3>
                    {selectedDonor.verification.aadhaarVerified && (
                      <span title="Aadhaar Verified">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                    <span>{selectedDonor.location}</span>
                    <span className="font-bold text-rose-700">({selectedDonor.distanceKm} km away)</span>
                  </div>
                  <div className="text-[10px] text-emerald-700 font-bold mt-0.5">
                    Response time: {selectedDonor.responseTime}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <button
                  type="button"
                  onClick={() => setSelectedDonor(null)}
                  className="text-slate-400 hover:text-slate-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B0000] to-[#C92A2A] text-white flex flex-col items-center justify-center shadow-xs mt-1">
                  <span className="text-[8px] uppercase font-bold text-rose-200 leading-none">Group</span>
                  <span className="text-sm font-black leading-none">{selectedDonor.bloodGroup}</span>
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-2 my-3 p-2 rounded-xl bg-[#FFF9F8] border border-rose-100 text-[11px]">
              <div>
                <span className="text-slate-400">Total Donations:</span>{' '}
                <strong className="text-slate-800">{selectedDonor.totalDonations} times</strong>
              </div>
              <div>
                <span className="text-slate-400">Status:</span>{' '}
                <strong className="text-emerald-700 font-bold">Ready to Donate</strong>
              </div>
            </div>

            {requestSentTo === selectedDonor.fullName && (
              <div className="p-2 mb-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Emergency blood request dispatched to {selectedDonor.fullName}!</span>
              </div>
            )}

            <div className="flex items-center gap-2 pt-1">
              <a
                href={`tel:${selectedDonor.phone}`}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-slate-600" />
                <span>Call ({selectedDonor.phone})</span>
              </a>

              <button
                type="button"
                onClick={() => handleSendRequest(selectedDonor.fullName)}
                className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Blood Request</span>
              </button>
            </div>
          </div>
        )}

        {/* POPUP 4: BLOOD BANK CARD (In Requester Mode) */}
        {selectedBank && (
          <div className="absolute bottom-6 left-4 right-4 sm:right-auto sm:w-96 z-20 bg-white rounded-3xl shadow-2xl shadow-slate-900/20 border border-slate-200 p-4 sm:p-5 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">
                  Certified Blood Center
                </span>
                <h3 className="font-black text-slate-900 text-sm leading-tight mt-0.5">{selectedBank.name}</h3>
                <p className="text-[11px] text-slate-500 mt-1">{selectedBank.address}</p>
                <div className="text-[11px] text-slate-700 font-bold mt-1">Helpline: {selectedBank.phone}</div>
              </div>
              <button type="button" onClick={() => setSelectedBank(null)} className="text-slate-400 hover:text-slate-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
              <a
                href={`tel:${selectedBank.phone}`}
                className="flex-1 py-2 px-3 rounded-xl bg-rose-600 text-white font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Blood Bank</span>
              </a>
            </div>
          </div>
        )}

        {/* Google Map Watermark Style Footer Overlay */}
        <div className="absolute bottom-2 left-2 z-10 pointer-events-none flex items-center gap-1 bg-white/80 backdrop-blur-xs px-2 py-0.5 rounded text-[10px] text-slate-600 font-medium">
          <span className="font-bold text-slate-800">Google</span>
          <span>Map Data © 2026 · Terms of Use</span>
        </div>
      </div>

      {/* Mode-Dependent Quick Selection Strip Below the Map */}
      <div className="pt-2 space-y-2">
        {userMode === 'donor' ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Scheduled Donation Camps on Map ({camps.length})
              </span>
              <span className="text-[11px] text-rose-600 font-bold">
                Click any camp to view details & pre-register
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {camps.map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelectedCamp(c);
                    setSelectedRequest(null);
                    if (googleMap && c.latitude && c.longitude) {
                      googleMap.panTo({ lat: c.latitude, lng: c.longitude });
                      googleMap.setZoom(15);
                    }
                  }}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-2.5 ${
                    selectedCamp?.id === c.id
                      ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-300/40 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-rose-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center text-lg shrink-0">
                    ⛺
                  </div>
                  <div className="overflow-hidden">
                    <div className="font-extrabold text-xs text-slate-900 truncate">{c.title}</div>
                    <div className="text-[11px] font-bold text-rose-700">
                      {c.date} · {c.distanceKm ? `${c.distanceKm} km` : 'Near you'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Nearby Available Donors on Map ({MOCK_NEARBY_DONORS.length})
              </span>
              <span className="text-[11px] text-rose-600 font-bold">
                Click any donor to view details & request blood
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {MOCK_NEARBY_DONORS.slice(0, 4).map((d) => (
                <div
                  key={d.id}
                  onClick={() => {
                    setSelectedDonor(d);
                    setSelectedBank(null);
                    if (googleMap) {
                      googleMap.panTo({ lat: d.latitude, lng: d.longitude });
                      googleMap.setZoom(15);
                    }
                  }}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center gap-2.5 ${
                    selectedDonor?.id === d.id
                      ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-300/40 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-rose-200 hover:bg-slate-50'
                  }`}
                >
                  <img
                    src={d.photoUrl}
                    alt={d.fullName}
                    className="w-10 h-10 rounded-xl object-cover border border-rose-200 shrink-0"
                  />
                  <div className="overflow-hidden">
                    <div className="font-extrabold text-xs text-slate-900 truncate">{d.fullName}</div>
                    <div className="text-[11px] font-bold text-rose-700">
                      {d.bloodGroup} · {d.distanceKm} km
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
