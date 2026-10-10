import React, { useState, useMemo } from 'react';
import { BloodUnit, BloodGroup, ComponentType, BloodBank } from '../../types';
import { INDIAN_STATES } from '../../data/mockData';
import { Search, Filter, Droplet, Clock, Phone, MapPin, Building2, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface StockSearchProps {
  inventory: BloodUnit[];
  bloodBanks: BloodBank[];
  onOpenRequisitionModal?: (unit: BloodUnit) => void;
}

export const StockSearch: React.FC<StockSearchProps> = ({ inventory, bloodBanks, onOpenRequisitionModal }) => {
  const [selectedState, setSelectedState] = useState<string>('Maharashtra');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Mumbai');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<BloodGroup | 'ALL'>('ALL');
  const [selectedComponent, setSelectedComponent] = useState<ComponentType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyCleared, setOnlyCleared] = useState(true);

  const availableDistricts = useMemo(() => {
    return selectedState && INDIAN_STATES[selectedState] ? INDIAN_STATES[selectedState] : [];
  }, [selectedState]);

  const bloodGroups: (BloodGroup | 'ALL')[] = ['ALL', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const components: (ComponentType | 'ALL')[] = [
    'ALL',
    'Packed Red Blood Cells (PRBC)',
    'Platelet Concentrate',
    'Fresh Frozen Plasma (FFP)',
    'Whole Blood'
  ];

  // Group inventory units by Blood Bank + Blood Group + Component
  const aggregatedStock = useMemo(() => {
    let units = inventory.filter(u => (!onlyCleared || u.status === 'Cleared'));

    if (selectedBloodGroup !== 'ALL') {
      units = units.filter(u => u.bloodGroup === selectedBloodGroup);
    }
    if (selectedComponent !== 'ALL') {
      units = units.filter(u => u.component === selectedComponent);
    }

    // Match with blood banks
    return bloodBanks
      .filter(bank => {
        const matchesState = !selectedState || bank.state.toLowerCase() === selectedState.toLowerCase();
        const matchesDistrict = !selectedDistrict || bank.district.toLowerCase() === selectedDistrict.toLowerCase();
        const matchesSearch = !searchQuery || 
          bank.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          bank.address.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesState && matchesDistrict && matchesSearch;
      })
      .map(bank => {
        const bankUnits = units.filter(u => u.bloodBankId === bank.id);
        
        // Group by Blood Group
        const groupsBreakdown: Record<string, number> = {};
        bloodGroups.filter(g => g !== 'ALL').forEach(bg => {
          groupsBreakdown[bg] = bankUnits.filter(u => u.bloodGroup === bg).length;
        });

        return {
          bank,
          totalUnits: bankUnits.length,
          units: bankUnits,
          groupsBreakdown
        };
      })
      .filter(item => item.totalUnits > 0 || !searchQuery);
  }, [inventory, bloodBanks, selectedState, selectedDistrict, selectedBloodGroup, selectedComponent, searchQuery, onlyCleared]);

  return (
    <div className="space-y-6">
      {/* Search Header Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-rose-800 to-rose-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="flex items-center gap-2 text-rose-200 text-xs font-semibold tracking-wider uppercase mb-2">
            <Droplet className="w-4 h-4 text-rose-400" />
            <span>National e-Rakt Public Grid · Real-time Availability</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Live Blood & Component Stock Search
          </h1>
          <p className="mt-2 text-rose-100/90 text-sm sm:text-base leading-relaxed">
            Verify real-time screened units across government, Red Cross, and charitable blood banks. Filter by component type and Rh blood group.
          </p>
        </div>
        <div className="absolute right-0 top-0 w-80 h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent pointer-events-none" />
      </div>

      {/* Primary Filtering Console */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* State */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              State / Union Territory
            </label>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                const firstDistrict = INDIAN_STATES[e.target.value]?.[0] || '';
                setSelectedDistrict(firstDistrict);
              }}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
            >
              {Object.keys(INDIAN_STATES).map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* District */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              District / City
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
            >
              <option value="">All Districts</option>
              {availableDistricts.map(dt => (
                <option key={dt} value={dt}>{dt}</option>
              ))}
            </select>
          </div>

          {/* Component */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Blood Component
            </label>
            <select
              value={selectedComponent}
              onChange={(e) => setSelectedComponent(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
            >
              {components.map(comp => (
                <option key={comp} value={comp}>{comp}</option>
              ))}
            </select>
          </div>

          {/* Keyword Search */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Search Hospital / Facility
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. AIIMS, KEM, Rotary..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>
        </div>

        {/* Blood Group Segmented Quick Buttons */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Select Blood Group (Rh Typing)
            </span>
            <span className="text-xs text-slate-500">
              {selectedBloodGroup === 'O-' && 'Universal RBC Donor'}
              {selectedBloodGroup === 'AB+' && 'Universal Recipient'}
              {selectedBloodGroup === 'ALL' && 'Viewing all groups'}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {bloodGroups.map(bg => (
              <button
                key={bg}
                type="button"
                onClick={() => setSelectedBloodGroup(bg)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  selectedBloodGroup === bg
                    ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                {bg}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Available Verified Stock Centers
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
            <span>Showing centers in {selectedDistrict || selectedState}</span>
            <span aria-hidden="true">·</span>
            <span>{aggregatedStock.length} registered centers matched</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-700 font-medium flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Tested Non-Reactive Units
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyCleared}
              onChange={(e) => setOnlyCleared(e.target.checked)}
              className="rounded text-rose-600 focus:ring-rose-500"
            />
            <span>Show Only Cleared Units (Excl. Quarantine)</span>
          </label>
        </div>
      </div>

      {/* Stock List Grid */}
      <div className="grid grid-cols-1 gap-4">
        {aggregatedStock.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
            <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No matching stock found</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
              Try adjusting your district, component selection, or toggle off specific filters to view adjacent facility stock.
            </p>
          </div>
        ) : (
          aggregatedStock.map(({ bank, totalUnits, units, groupsBreakdown }) => (
            <div
              key={bank.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-slate-300 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{bank.name}</h3>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {bank.category}
                    </span>
                    {bank.is24x7 && (
                      <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        24x7 Open
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {bank.address}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Lic: {bank.licenseNumber}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="text-xl font-extrabold text-rose-700">
                      {totalUnits}
                    </div>
                    <div className="text-xs text-slate-500 font-medium">
                      Units Available
                    </div>
                  </div>
                  <a
                    href={`tel:${bank.emergencyHelpline || bank.phone}`}
                    className="flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Helpline</span>
                  </a>
                </div>
              </div>

              {/* Group Availability Matrix */}
              <div className="border-t border-slate-100 pt-3">
                <div className="text-xs font-semibold text-slate-600 mb-2">
                  Inventory Breakdown by Blood Group:
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                  {(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as BloodGroup[]).map(bg => {
                    const count = groupsBreakdown[bg] || 0;
                    const isSelected = selectedBloodGroup === bg;
                    return (
                      <div
                        key={bg}
                        className={`p-2 rounded-lg text-center border transition-all ${
                          isSelected
                            ? 'border-rose-400 bg-rose-50/70 ring-1 ring-rose-400'
                            : count > 0
                            ? 'border-slate-200 bg-slate-50'
                            : 'border-slate-100 bg-slate-50/40 opacity-60'
                        }`}
                      >
                        <div className="text-xs font-bold text-slate-800">{bg}</div>
                        <div className={`text-sm font-extrabold mt-0.5 ${count > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                          {count}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {count === 1 ? 'unit' : 'units'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Individual Units Preview Table */}
              {units.length > 0 && (
                <div className="border-t border-slate-100 pt-3">
                  <div className="text-xs font-semibold text-slate-600 mb-2">
                    Verified Units in Facility Stock:
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="py-2 px-3">Unit ID / Barcode</th>
                          <th className="py-2 px-3">Blood Group</th>
                          <th className="py-2 px-3">Component</th>
                          <th className="py-2 px-3">Volume</th>
                          <th className="py-2 px-3">Storage Location</th>
                          <th className="py-2 px-3">Expiry Date</th>
                          <th className="py-2 px-3 text-right">Requisition</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {units.slice(0, 4).map(unit => {
                          const expiry = new Date(unit.expiryDate);
                          const today = new Date('2026-10-10');
                          const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));

                          return (
                            <tr key={unit.id} className="hover:bg-slate-50/80">
                              <td className="py-2 px-3 font-mono font-medium text-slate-800">{unit.id}</td>
                              <td className="py-2 px-3 font-bold text-rose-700">{unit.bloodGroup}</td>
                              <td className="py-2 px-3 text-slate-700">{unit.component}</td>
                              <td className="py-2 px-3 text-slate-600">{unit.volumeMl} mL</td>
                              <td className="py-2 px-3 text-slate-500">{unit.storageLocation}</td>
                              <td className="py-2 px-3">
                                <span className={diffDays <= 3 ? 'text-amber-600 font-bold' : 'text-slate-600'}>
                                  {unit.expiryDate} ({diffDays}d left)
                                </span>
                              </td>
                              <td className="py-2 px-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => onOpenRequisitionModal?.(unit)}
                                  className="text-xs font-semibold text-rose-700 hover:text-rose-800 hover:underline"
                                >
                                  Reserve for Patient
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
