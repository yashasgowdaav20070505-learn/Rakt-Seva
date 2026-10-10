import React, { useState, useMemo } from 'react';
import { BloodUnit, BloodGroup, ComponentType, UnitStatus, BloodBank } from '../../types';
import { api } from '../../services/api';
import { 
  Package, 
  Plus, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  Search, 
  ArrowUpDown, 
  Send,
  Building,
  Droplet,
  FileCheck
} from 'lucide-react';

interface InventoryIMSProps {
  units: BloodUnit[];
  bloodBanks: BloodBank[];
  onUnitUpdated: () => void;
  onOpenTestModalForUnit?: (unit: BloodUnit) => void;
}

export const InventoryIMS: React.FC<InventoryIMSProps> = ({
  units,
  bloodBanks,
  onUnitUpdated,
  onOpenTestModalForUnit
}) => {
  const [statusFilter, setStatusFilter] = useState<UnitStatus | 'ALL'>('ALL');
  const [bloodGroupFilter, setBloodGroupFilter] = useState<BloodGroup | 'ALL'>('ALL');
  const [componentFilter, setComponentFilter] = useState<ComponentType | 'ALL'>('ALL');
  const [searchBarcode, setSearchBarcode] = useState('');

  // Add Unit Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGroup, setNewGroup] = useState<BloodGroup>('O+');
  const [newComponent, setNewComponent] = useState<ComponentType>('Packed Red Blood Cells (PRBC)');
  const [newVolume, setNewVolume] = useState('450');
  const [newBagType, setNewBagType] = useState<'Single' | 'Double' | 'Triple' | 'Quadruple (SAGM)'>('Quadruple (SAGM)');
  const [newBankId, setNewBankId] = useState(bloodBanks[0]?.id || 'BB-01');
  const [newCollectionType, setNewCollectionType] = useState<'Camp' | 'Walk-in / In-house'>('Walk-in / In-house');

  // Issue Unit Modal state
  const [unitToIssue, setUnitToIssue] = useState<BloodUnit | null>(null);
  const [patientName, setPatientName] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [requisitionId, setRequisitionId] = useState('');

  // Counts summary
  const summaryCounts = useMemo(() => {
    return {
      total: units.length,
      cleared: units.filter(u => u.status === 'Cleared').length,
      quarantine: units.filter(u => u.status === 'Quarantine').length,
      reserved: units.filter(u => u.status === 'Reserved').length,
      discarded: units.filter(u => u.status === 'Discarded').length,
      issued: units.filter(u => u.status === 'Issued').length
    };
  }, [units]);

  // Filtered list
  const filteredUnits = useMemo(() => {
    return units.filter(u => {
      const matchStatus = statusFilter === 'ALL' || u.status === statusFilter;
      const matchGroup = bloodGroupFilter === 'ALL' || u.bloodGroup === bloodGroupFilter;
      const matchComp = componentFilter === 'ALL' || u.component === componentFilter;
      const matchSearch = !searchBarcode || 
        u.id.toLowerCase().includes(searchBarcode.toLowerCase()) ||
        u.storageLocation.toLowerCase().includes(searchBarcode.toLowerCase()) ||
        u.bloodBankName.toLowerCase().includes(searchBarcode.toLowerCase());
      return matchStatus && matchGroup && matchComp && matchSearch;
    });
  }, [units, statusFilter, bloodGroupFilter, componentFilter, searchBarcode]);

  const handleCreateUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    const bank = bloodBanks.find(b => b.id === newBankId) || bloodBanks[0];
    const today = new Date('2026-10-10');
    
    // Auto shelf life based on component
    let shelfDays = 42; // PRBC
    if (newComponent.includes('Platelet')) shelfDays = 5;
    if (newComponent.includes('Plasma') || newComponent.includes('Cryo')) shelfDays = 365;
    if (newComponent === 'Whole Blood') shelfDays = 35;

    const expiry = new Date(today);
    expiry.setDate(expiry.getDate() + shelfDays);

    try {
      await api.addBloodUnit({
        bloodBankId: bank.id,
        bloodBankName: bank.name,
        bloodGroup: newGroup,
        component: newComponent,
        volumeMl: Number(newVolume),
        bagType: newBagType,
        collectionDate: today.toISOString().split('T')[0],
        expiryDate: expiry.toISOString().split('T')[0],
        status: 'Quarantine', // Always start in quarantine until screening passes
        storageLocation: `Quarantine Section Q-${Math.floor(1 + Math.random() * 4)}`,
        collectionType: newCollectionType
      });
      setShowAddModal(false);
      onUnitUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmIssue = async () => {
    if (!unitToIssue) return;
    try {
      await api.updateUnitStatus(unitToIssue.id, {
        status: 'Issued',
        issuedTo: {
          patientName: patientName || 'Emergency Trauma Patient',
          hospitalName: hospitalName || 'General District Hospital',
          issueDate: new Date('2026-10-10').toISOString().split('T')[0],
          requisitionId: requisitionId || `REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`
        }
      });
      setUnitToIssue(null);
      setPatientName('');
      setHospitalName('');
      setRequisitionId('');
      onUnitUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* IMS Top Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Package className="w-4 h-4" />
            <span>Blood Transfusion Service · Tier-3 Inventory Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Blood Bank Unit Inventory Management (IMS)
          </h1>
          <p className="mt-1 text-slate-300 text-xs sm:text-sm">
            End-to-end chain of custody from bleeding chair to serological clearance, cold-chain storage, and hospital dispatch.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-colors flex items-center gap-2 self-start md:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>+ Log New Collection Unit</span>
        </button>
      </div>

      {/* Status Counters Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          type="button"
          onClick={() => setStatusFilter('ALL')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'ALL' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider opacity-75">All Units</div>
          <div className="text-2xl font-black mt-0.5">{summaryCounts.total}</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('Cleared')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'Cleared' ? 'border-emerald-700 bg-emerald-700 text-white' : 'border-slate-200 bg-white hover:border-emerald-200'
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Cleared (Active)</span>
          </div>
          <div className={`text-2xl font-black mt-0.5 ${statusFilter === 'Cleared' ? 'text-white' : 'text-emerald-700'}`}>
            {summaryCounts.cleared}
          </div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('Quarantine')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'Quarantine' ? 'border-amber-600 bg-amber-600 text-white' : 'border-slate-200 bg-white hover:border-amber-200'
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Quarantine</span>
          </div>
          <div className={`text-2xl font-black mt-0.5 ${statusFilter === 'Quarantine' ? 'text-white' : 'text-amber-700'}`}>
            {summaryCounts.quarantine}
          </div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('Reserved')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'Reserved' ? 'border-sky-700 bg-sky-700 text-white' : 'border-slate-200 bg-white hover:border-sky-200'
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-sky-600 flex items-center gap-1">
            <Package className="w-3.5 h-3.5" />
            <span>Reserved</span>
          </div>
          <div className={`text-2xl font-black mt-0.5 ${statusFilter === 'Reserved' ? 'text-white' : 'text-sky-700'}`}>
            {summaryCounts.reserved}
          </div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter('Discarded')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'Discarded' ? 'border-rose-700 bg-rose-700 text-white' : 'border-slate-200 bg-white hover:border-rose-200'
          }`}
        >
          <div className="text-[11px] font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Discarded</span>
          </div>
          <div className={`text-2xl font-black mt-0.5 ${statusFilter === 'Discarded' ? 'text-white' : 'text-rose-700'}`}>
            {summaryCounts.discarded}
          </div>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search Barcode ID (e.g. RS-2026-PL01), shelf rack, or blood center..."
            value={searchBarcode}
            onChange={(e) => setSearchBarcode(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
          />
        </div>

        <div className="sm:w-44">
          <select
            value={bloodGroupFilter}
            onChange={(e) => setBloodGroupFilter(e.target.value as any)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
          >
            <option value="ALL">All Blood Groups</option>
            {(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as BloodGroup[]).map(bg => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </div>

        <div className="sm:w-56">
          <select
            value={componentFilter}
            onChange={(e) => setComponentFilter(e.target.value as any)}
            className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
          >
            <option value="ALL">All Components</option>
            <option value="Packed Red Blood Cells (PRBC)">PRBC (42 days)</option>
            <option value="Platelet Concentrate">Platelets (5 days)</option>
            <option value="Fresh Frozen Plasma (FFP)">FFP (1 yr)</option>
            <option value="Whole Blood">Whole Blood (35 days)</option>
          </select>
        </div>
      </div>

      {/* Main Units Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="text-xs font-bold text-slate-900">
            Current Inventory Units ({filteredUnits.length} displayed)
          </div>
          <span className="text-[11px] text-slate-500">
            Sorted by FIFO Expiry Priority
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Barcode / Unit ID</th>
                <th className="py-2.5 px-4">Group</th>
                <th className="py-2.5 px-4">Component</th>
                <th className="py-2.5 px-4">Volume</th>
                <th className="py-2.5 px-4">Collection Date</th>
                <th className="py-2.5 px-4">Expiry Date</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">Storage Location</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUnits.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400">
                    No units matching selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredUnits.map(unit => {
                  const today = new Date('2026-10-10');
                  const expiry = new Date(unit.expiryDate);
                  const daysLeft = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24));
                  const isExpiringCritical = daysLeft <= 1;
                  const isExpiringSoon = daysLeft <= 3;

                  return (
                    <tr key={unit.id} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {unit.id}
                      </td>
                      <td className="py-3 px-4 font-black text-rose-700 text-sm">
                        {unit.bloodGroup}
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {unit.component}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {unit.volumeMl} mL ({unit.bagType})
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {unit.collectionDate}
                      </td>
                      <td className="py-3 px-4 font-medium">
                        <span className={isExpiringCritical ? 'text-rose-600 font-bold' : isExpiringSoon ? 'text-amber-600 font-bold' : 'text-slate-700'}>
                          {unit.expiryDate}
                        </span>
                        <span className="text-[10px] text-slate-400 ml-1">
                          ({daysLeft}d left)
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {unit.status === 'Cleared' && (
                          <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-semibold text-[11px]">
                            Cleared (Safe)
                          </span>
                        )}
                        {unit.status === 'Quarantine' && (
                          <span className="text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-semibold text-[11px]">
                            Quarantine (Pending Tests)
                          </span>
                        )}
                        {unit.status === 'Reserved' && (
                          <span className="text-sky-800 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded font-semibold text-[11px]">
                            Reserved
                          </span>
                        )}
                        {unit.status === 'Discarded' && (
                          <span className="text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded font-semibold text-[11px]">
                            Discarded
                          </span>
                        )}
                        {unit.status === 'Issued' && (
                          <span className="text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded font-semibold text-[11px]">
                            Issued
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        {unit.storageLocation}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {unit.status === 'Quarantine' && onOpenTestModalForUnit && (
                          <button
                            type="button"
                            onClick={() => onOpenTestModalForUnit(unit)}
                            className="text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-200"
                          >
                            Enter Lab Tests →
                          </button>
                        )}

                        {unit.status === 'Cleared' && (
                          <button
                            type="button"
                            onClick={() => setUnitToIssue(unit)}
                            className="text-xs font-bold text-rose-700 hover:text-rose-800 bg-rose-50 px-2.5 py-1 rounded border border-rose-200 flex items-center gap-1 ml-auto"
                          >
                            <Send className="w-3 h-3" />
                            <span>Dispatch / Issue</span>
                          </button>
                        )}

                        {unit.status === 'Issued' && unit.issuedTo && (
                          <span className="text-[11px] text-slate-500">
                            To: {unit.issuedTo.patientName}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Unit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
                  Post-Bleeding Intake Form
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  Log New Blood Collection Unit
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUnit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Blood Group
                  </label>
                  <select
                    value={newGroup}
                    onChange={(e) => setNewGroup(e.target.value as BloodGroup)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-bold text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    {(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as BloodGroup[]).map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Component Type
                  </label>
                  <select
                    value={newComponent}
                    onChange={(e) => setNewComponent(e.target.value as ComponentType)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="Packed Red Blood Cells (PRBC)">PRBC (42 days)</option>
                    <option value="Platelet Concentrate">Platelet Concentrate (5 days)</option>
                    <option value="Fresh Frozen Plasma (FFP)">FFP (1 yr)</option>
                    <option value="Whole Blood">Whole Blood (35 days)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Volume Collected
                  </label>
                  <select
                    value={newVolume}
                    onChange={(e) => setNewVolume(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="350">350 mL Bag</option>
                    <option value="450">450 mL Bag</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Bag Type
                  </label>
                  <select
                    value={newBagType}
                    onChange={(e) => setNewBagType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="Single">Single Bag</option>
                    <option value="Double">Double Bag</option>
                    <option value="Triple">Triple Bag</option>
                    <option value="Quadruple (SAGM)">Quadruple with SAGM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Collection Facility / Blood Bank
                </label>
                <select
                  value={newBankId}
                  onChange={(e) => setNewBankId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  {bloodBanks.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Collection Source
                </label>
                <select
                  value={newCollectionType}
                  onChange={(e) => setNewCollectionType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="Walk-in / In-house">Walk-in Voluntary In-House Donor</option>
                  <option value="Camp">External Community Donation Camp</option>
                </select>
              </div>

              <div className="p-3 rounded-lg bg-amber-50 text-amber-900 text-xs">
                <strong>Mandatory Safety Rule:</strong> All newly added units are placed in <strong>Quarantine</strong>. They cannot be allocated until serological viral screening (HIV, HBV, HCV, Syphilis, Malaria) is submitted and confirmed Non-Reactive.
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 px-5 rounded-xl shadow-sm"
                >
                  Log into Quarantine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dispatch / Issue Modal */}
      {unitToIssue && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-4 text-xs">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
                  Requisition Fulfillment
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  Issue Unit {unitToIssue.id} ({unitToIssue.bloodGroup} {unitToIssue.component})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setUnitToIssue(null)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Recipient Patient Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sneha Kulkarni"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Receiving Hospital / Trauma Ward
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. City Trauma & Surgical ICU"
                  value={hospitalName}
                  onChange={(e) => setHospitalName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Requisition Order ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. REQ-2026-9041"
                  value={requisitionId}
                  onChange={(e) => setRequisitionId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setUnitToIssue(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmIssue}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 px-5 rounded-xl shadow-sm"
                >
                  Confirm Dispatch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
