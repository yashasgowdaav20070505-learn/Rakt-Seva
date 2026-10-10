import React, { useState } from 'react';
import { CitizenUser, OrgUser } from './LoginPage';
import { BloodGroup } from '../../types';
import { 
  Camera, 
  X, 
  Check, 
  Droplet, 
  Building2, 
  User, 
  ShieldCheck, 
  Smartphone, 
  Mail, 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';

interface EditProfileModalProps {
  citizenUser?: CitizenUser | null;
  orgUser?: OrgUser | null;
  initialTab?: 'details' | 'verification';
  onSaveCitizen: (updated: CitizenUser) => void;
  onSaveOrg: (updated: OrgUser) => void;
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  citizenUser,
  orgUser,
  initialTab = 'details',
  onSaveCitizen,
  onSaveOrg,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'verification'>(initialTab);

  // Citizen details state
  const [name, setName] = useState(citizenUser?.name || '');
  const [email, setEmail] = useState(citizenUser?.email || '');
  const [phone, setPhone] = useState(citizenUser?.phone || '');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>(citizenUser?.bloodGroup || 'O+');
  const [location, setLocation] = useState(citizenUser?.location || '');
  const [photoUrl, setPhotoUrl] = useState(citizenUser?.photoUrl || '');

  // Org details state
  const [orgName, setOrgName] = useState(orgUser?.orgName || '');
  const [orgEmail, setOrgEmail] = useState(orgUser?.email || '');
  const [orgPhone, setOrgPhone] = useState(orgUser?.phone || '');
  const [orgType, setOrgType] = useState(orgUser?.orgType || 'NGO');
  const [orgRegNo, setOrgRegNo] = useState(orgUser?.registrationNumber || '');
  const [orgLocation, setOrgLocation] = useState(orgUser?.location || '');
  const [logoUrl, setLogoUrl] = useState(orgUser?.logoUrl || '');

  // Verification states
  const [isMobileVerified, setIsMobileVerified] = useState(true);
  const [isEmailVerified, setIsEmailVerified] = useState(true);
  const [isAadhaarVerified, setIsAadhaarVerified] = useState(true);
  
  // OTP flow states
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpSentNotice, setOtpSentNotice] = useState(false);

  // Email verification flow states
  const [showEmailCodeInput, setShowEmailCodeInput] = useState(false);
  const [enteredEmailCode, setEnteredEmailCode] = useState('');

  // Aadhaar flow states
  const [aadhaarNumber, setAadhaarNumber] = useState('XXXX-XXXX-8921');
  const [aadhaarDocUploaded, setAadhaarDocUploaded] = useState(true);
  const [aadhaarVerifying, setAadhaarVerifying] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, isOrg: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (isOrg) setLogoUrl(reader.result as string);
        else setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendMobileOtp = () => {
    setOtpSentNotice(true);
    setShowOtpInput(true);
  };

  const handleVerifyMobileOtp = () => {
    if (enteredOtp.length >= 4) {
      setIsMobileVerified(true);
      setShowOtpInput(false);
      setOtpSentNotice(false);
    }
  };

  const handleSendEmailCode = () => {
    setShowEmailCodeInput(true);
  };

  const handleVerifyEmailCode = () => {
    if (enteredEmailCode.length >= 4) {
      setIsEmailVerified(true);
      setShowEmailCodeInput(false);
    }
  };

  const handleVerifyAadhaar = () => {
    setAadhaarVerifying(true);
    setTimeout(() => {
      setAadhaarVerifying(false);
      setIsAadhaarVerified(true);
      setAadhaarDocUploaded(true);
    }, 1200);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (citizenUser) {
      onSaveCitizen({
        ...citizenUser,
        name,
        email,
        phone,
        bloodGroup,
        location,
        photoUrl
      });
    } else if (orgUser) {
      onSaveOrg({
        ...orgUser,
        orgName,
        email: orgEmail,
        phone: orgPhone,
        orgType: orgType as any,
        registrationNumber: orgRegNo,
        location: orgLocation,
        logoUrl
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative space-y-4 text-xs my-8">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-rose-100 pb-3">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-rose-600 uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Identity & Security</span>
            </div>
            <h2 className="text-lg font-black text-slate-900 mt-0.5">
              {citizenUser ? 'Citizen Profile & Verification' : 'Organization Verification'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher: Details vs Verification */}
        {citizenUser && (
          <div className="flex p-1 bg-rose-50/80 rounded-2xl border border-rose-100 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('details')}
              className={`flex-1 py-2 rounded-xl transition-all ${
                activeTab === 'details'
                  ? 'bg-white text-rose-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              1. Edit Profile & Photo
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('verification')}
              className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'verification'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>2. Verification Center</span>
            </button>
          </div>
        )}

        {/* TAB 1: DETAILS & PHOTO */}
        {activeTab === 'details' && (
          <form onSubmit={handleSave} className="space-y-4">
            {/* Photo Picker */}
            <div className="flex items-center gap-4 p-3 rounded-2xl bg-[#FFF9F8] border border-rose-100">
              <div className="relative group shrink-0">
                <img
                  src={citizenUser ? photoUrl : logoUrl}
                  alt="Avatar"
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-rose-300 shadow-sm"
                />
                <label className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e, Boolean(orgUser))}
                    className="hidden"
                  />
                </label>
              </div>
              <div>
                <div className="font-extrabold text-slate-800 text-xs">
                  {citizenUser ? 'Profile Picture' : 'Institutional Logo'}
                </div>
                <label className="text-[11px] text-rose-600 hover:underline font-bold cursor-pointer block mt-0.5">
                  Click to upload new image from device
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e, Boolean(orgUser))}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {citizenUser ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#FFF9F8] border border-rose-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                      Blood Group *
                    </label>
                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                      className="w-full bg-[#FFF9F8] border border-rose-200 rounded-xl px-3.5 py-2 text-slate-900 font-extrabold text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    >
                      {(['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'] as BloodGroup[]).map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                      Mobile Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#FFF9F8] border border-rose-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#FFF9F8] border border-rose-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                    Home Address / Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-[#FFF9F8] border border-rose-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                    Organization Legal Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full bg-[#FFF9F8] border border-rose-200 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                      Registration Number
                    </label>
                    <input
                      type="text"
                      value={orgRegNo}
                      onChange={(e) => setOrgRegNo(e.target.value)}
                      className="w-full bg-[#FFF9F8] border border-rose-200 rounded-xl px-3.5 py-2 text-slate-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 text-[11px]">
                      Organization Type
                    </label>
                    <input
                      type="text"
                      value={orgType}
                      onChange={(e) => setOrgType(e.target.value as any)}
                      className="w-full bg-[#FFF9F8] border border-rose-200 rounded-xl px-3.5 py-2 text-slate-900"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: VERIFICATION CENTER (Mobile, Email, Aadhaar) */}
        {activeTab === 'verification' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <p className="text-[11px] text-slate-500">
              Verified donors receive the official trust badge and are prioritized for rapid hospital matching.
            </p>

            {/* 1. Mobile Phone Verification */}
            <div className="p-3.5 rounded-2xl bg-[#FFF9F8] border border-rose-100 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-rose-600" />
                  <span className="font-extrabold text-slate-900 text-xs">Mobile Number Verification</span>
                </div>
                {isMobileVerified ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Verified</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                    Action Needed
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-600">
                Current Number: <strong className="text-slate-900">{phone || '+91 98765 43210'}</strong>
              </div>

              {!isMobileVerified && (
                <div className="pt-1">
                  {!showOtpInput ? (
                    <button
                      type="button"
                      onClick={handleSendMobileOtp}
                      className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
                    >
                      Send OTP Verification Code
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="Enter OTP (e.g. 4829)"
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value)}
                        className="bg-white border border-rose-300 rounded-xl px-3 py-1.5 text-xs font-mono font-bold w-40"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyMobileOtp}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                      >
                        Verify OTP
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 2. Email Address Verification */}
            <div className="p-3.5 rounded-2xl bg-[#FFF9F8] border border-rose-100 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-rose-600" />
                  <span className="font-extrabold text-slate-900 text-xs">Email ID Verification</span>
                </div>
                {isEmailVerified ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Verified</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                    Action Needed
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-600">
                Current Email: <strong className="text-slate-900">{email || 'rahul.sharma@example.com'}</strong>
              </div>

              {!isEmailVerified && (
                <div className="pt-1">
                  {!showEmailCodeInput ? (
                    <button
                      type="button"
                      onClick={handleSendEmailCode}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs"
                    >
                      Send Verification Link / Code
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="Enter Code (e.g. 7721)"
                        value={enteredEmailCode}
                        onChange={(e) => setEnteredEmailCode(e.target.value)}
                        className="bg-white border border-rose-300 rounded-xl px-3 py-1.5 text-xs font-mono font-bold w-40"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyEmailCode}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                      >
                        Verify Code
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 3. Government Aadhaar / ID Verification */}
            <div className="p-3.5 rounded-2xl bg-[#FFF9F8] border border-rose-100 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-rose-600" />
                  <span className="font-extrabold text-slate-900 text-xs">
                    Government Aadhaar / ID Verification
                  </span>
                </div>
                {isAadhaarVerified ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>UIDAI Verified</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full">
                    Not Verified
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    12-Digit Aadhaar Card Number
                  </label>
                  <input
                    type="text"
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(e.target.value)}
                    placeholder="e.g. 5421-9982-8921"
                    className="w-full bg-white border border-rose-200 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div className="p-2.5 rounded-xl bg-white border border-rose-100 flex items-center justify-between">
                  <div className="text-[11px] text-slate-600 flex items-center gap-2">
                    <Upload className="w-3.5 h-3.5 text-rose-500" />
                    <span>{aadhaarDocUploaded ? 'aadhaar_card_masked.pdf (Uploaded)' : 'Upload Aadhaar Card Document'}</span>
                  </div>
                  <label className="text-[10px] text-rose-600 font-bold hover:underline cursor-pointer">
                    Replace Document
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={() => setAadhaarDocUploaded(true)}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="pt-1">
                  <button
                    type="button"
                    disabled={aadhaarVerifying || isAadhaarVerified}
                    onClick={handleVerifyAadhaar}
                    className={`w-full py-2.5 px-4 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 ${
                      isAadhaarVerified
                        ? 'bg-emerald-600 text-white cursor-default'
                        : 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm'
                    }`}
                  >
                    {aadhaarVerifying ? (
                      <span>Verifying with UIDAI gateway...</span>
                    ) : isAadhaarVerified ? (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Aadhaar Authenticated Successfully</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Submit for Aadhaar UIDAI Verification</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-extrabold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
