import React, { useState, useMemo } from 'react';
import { BloodBank } from '../../types';
import { INDIAN_STATES } from '../../data/mockData';
import { MapPin, Navigation, Phone, Mail, Clock, Shield, Search, Compass, ExternalLink, Sparkles } from 'lucide-react';

interface BloodBankDirectoryProps {
  bloodBanks: BloodBank[];
}

// Distance helper
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return (R * c).toFixed(1);
}

export const BloodBankDirectory: React.FC<BloodBankDirectoryProps> = ({ bloodBanks }) => {
  const [selectedState, setSelectedState] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; city: string } | null>({
    lat: 19.0760,
    lng: 72.8777,
    city: 'Mumbai (Default Geolocation)'
  });
  const [isLocating, setIsLocating] = useState(false);
  const [activeBankModal, setActiveBankModal] = useState<BloodBank | null>(null);

  const handleGetCurrentLocation = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            city: 'My Current GPS Coordinates'
          });
          setIsLocating(false);
        },
        () => {
          // Fallback to Delhi coordinates
          setUserLocation({
            lat: 28.6139,
            lng: 77.2090,
            city: 'New Delhi (Simulated GPS)'
          });
          setIsLocating(false);
        },
        { timeout: 8000 }
      );
    } else {
      setIsLocating(false);
    }
  };

  const sortedBanks = useMemo(() => {
    let list = bloodBanks.filter(b => {
      const matchState = !selectedState || b.state.toLowerCase() === selectedState.toLowerCase();
      const matchQuery = !searchQuery || 
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.address.toLowerCase().includes(searchQuery.toLowerCase());
      return matchState && matchQuery;
    });

    if (userLocation) {
      return list.map(b => ({
        ...b,
        distanceKm: Number(calculateDistance(userLocation.lat, userLocation.lng, b.latitude, b.longitude))
      })).sort((a, b) => a.distanceKm - b.distanceKm);
    }

    return list.map(b => ({ ...b, distanceKm: 0 }));
  }, [bloodBanks, selectedState, searchQuery, userLocation]);

  return (
    <div className="space-y-6">
      {/* Directory Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Compass className="w-4 h-4" />
            <span>National Directory & Geolocation Service</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Accredited Blood Banks & Transfusion Centers
          </h1>
          <p className="mt-2 text-slate-300 text-sm leading-relaxed">
            Locate certified government medical colleges, Red Cross stations, and licensed private transfusion services with live phone helplines, operating schedules, and directions.
          </p>
        </div>

        {/* Location controls */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <Navigation className="w-4 h-4 text-emerald-400" />
            <span>Active Reference Point:</span>
            <span className="font-semibold text-white">{userLocation?.city || 'Not set'}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleGetCurrentLocation}
              disabled={isLocating}
              className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Locating Device...' : 'Use My Exact GPS Location'}</span>
            </button>
            <button
              type="button"
              onClick={() => setUserLocation({ lat: 28.5672, lng: 77.2100, city: 'New Delhi Center' })}
              className="text-xs text-slate-300 hover:text-white px-2 py-1 underline"
            >
              Delhi
            </button>
            <button
              type="button"
              onClick={() => setUserLocation({ lat: 12.9716, lng: 77.5946, city: 'Bengaluru Center' })}
              className="text-xs text-slate-300 hover:text-white px-2 py-1 underline"
            >
              Bengaluru
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search blood bank name, road, hospital, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
          />
        </div>

        <div className="sm:w-64">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
          >
            <option value="">All States / UTs</option>
            {Object.keys(INDIAN_STATES).map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Directory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedBanks.map(bank => (
          <div
            key={bank.id}
            className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {bank.category}
                    </span>
                    {bank.is24x7 && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                        24x7 Emergency
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1.5">
                    {bank.name}
                  </h3>
                </div>

                {userLocation && (
                  <div className="shrink-0 bg-slate-100 text-slate-800 text-xs font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-600" />
                    <span>{bank.distanceKm} km</span>
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-600 mt-2 flex items-start gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{bank.address}</span>
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-semibold">{bank.phone}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{bank.operatingHours}</span>
                </div>
                <div className="flex items-center gap-1.5 col-span-2">
                  <Shield className="w-3.5 h-3.5 text-emerald-600" />
                  <span>License: {bank.licenseNumber}</span>
                  {bank.componentSeparationFacility && (
                    <span className="text-slate-400">· Component Separation Ready</span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <a
                href={`tel:${bank.emergencyHelpline || bank.phone}`}
                className="text-xs font-semibold text-rose-700 hover:text-rose-800 flex items-center gap-1"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Helpline: {bank.emergencyHelpline}</span>
              </a>

              <button
                type="button"
                onClick={() => setActiveBankModal(bank)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Navigation className="w-3.5 h-3.5 text-rose-600" />
                <span>View Route & Details</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Blood Bank Detail Modal */}
      {activeBankModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
                  Verified Facility Profile
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                  {activeBankModal.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveBankModal(null)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Simulated Map Visualizer */}
            <div className="h-44 w-full bg-slate-100 border border-slate-200 rounded-xl overflow-hidden relative flex items-center justify-center">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#e11d48_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="text-center z-10 p-4">
                <div className="w-10 h-10 bg-rose-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-slate-900 mt-2">
                  GPS Coordinates: {activeBankModal.latitude}° N, {activeBankModal.longitude}° E
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  {activeBankModal.address}
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Government License No:</span>
                <span className="font-semibold">{activeBankModal.licenseNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Facility Type:</span>
                <span className="font-semibold">{activeBankModal.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Operating Schedule:</span>
                <span className="font-semibold">{activeBankModal.operatingHours}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Direct Desk Helpline:</span>
                <span className="font-semibold text-rose-600">{activeBankModal.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Emergency Toll-Free:</span>
                <span className="font-semibold text-rose-600">{activeBankModal.emergencyHelpline}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Component Separation Lab:</span>
                <span className="font-semibold text-emerald-700">
                  {activeBankModal.componentSeparationFacility ? 'Equipped (PRBC, FFP, Platelets)' : 'Whole Blood Only'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeBankModal.name + ' ' + activeBankModal.address)}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold py-2.5 px-4 rounded-xl text-center transition-colors flex items-center justify-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Google Maps</span>
              </a>
              <button
                type="button"
                onClick={() => setActiveBankModal(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold py-2.5 px-4 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
