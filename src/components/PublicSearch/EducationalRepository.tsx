import React, { useState } from 'react';
import { BookOpen, CheckCircle2, AlertCircle, Clock, Heart, Thermometer, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';

export const EducationalRepository: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'eligibility' | 'components' | 'benefits' | 'myths'>('eligibility');

  return (
    <div className="space-y-6">
      {/* Educational Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <BookOpen className="w-4 h-4" />
            <span>Clinical Reference & Transfusion Medicine Standards</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Blood Transfusion & Donor Health Repository
          </h1>
          <p className="mt-2 text-slate-300 text-sm leading-relaxed">
            Standard operating criteria derived from the Drugs & Cosmetics Rules and National Blood Transfusion Council (NBTC) guidelines for safe voluntary donation and optimal component therapy.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-wrap gap-2">
          {[
            { id: 'eligibility', label: 'Eligibility & Deferral Rules' },
            { id: 'components', label: 'Component Guide & Shelf-Life' },
            { id: 'benefits', label: 'Donor Health Benefits' },
            { id: 'myths', label: 'Myths vs Clinical Facts' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Eligibility & Deferral Rules */}
      {activeTab === 'eligibility' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Physical Benchmarks</h3>
              <ul className="text-xs text-slate-600 space-y-1.5 pt-1">
                <li>• <strong>Age:</strong> 18 – 65 years</li>
                <li>• <strong>Weight:</strong> Minimum 45 kg (for 350 mL) or 50 kg (for 450 mL bag)</li>
                <li>• <strong>Hemoglobin:</strong> Minimum 12.5 g/dL</li>
                <li>• <strong>Blood Pressure:</strong> Systolic 100-140 mmHg, Diastolic 60-90 mmHg</li>
                <li>• <strong>Pulse:</strong> 60 to 100 beats/min with regular rhythm</li>
              </ul>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2">
              <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Cooling-Off Intervals</h3>
              <ul className="text-xs text-slate-600 space-y-1.5 pt-1">
                <li>• <strong>Male Whole Blood:</strong> 90 days (3 months) mandatory wait</li>
                <li>• <strong>Female Whole Blood:</strong> 120 days (4 months) mandatory wait</li>
                <li>• <strong>Plateletpheresis:</strong> 14 days interval (up to 24 times/year)</li>
                <li>• <strong>Plasmapheresis:</strong> 14 days interval</li>
              </ul>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2">
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Temporary Deferrals</h3>
              <ul className="text-xs text-slate-600 space-y-1.5 pt-1">
                <li>• <strong>Tattoo or Body Piercing:</strong> 6 months deferral</li>
                <li>• <strong>Major Surgery:</strong> 6 months to 1 year</li>
                <li>• <strong>Dental Extraction:</strong> 72 hours (3 days)</li>
                <li>• <strong>Antibiotic Course:</strong> 14 days post last dose</li>
                <li>• <strong>Alcohol Consumption:</strong> Minimum 24 hours abstinence</li>
              </ul>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>Permanent Deferral Criteria (Transfusion Safety)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs text-slate-700">
              <div className="p-3 rounded-lg bg-rose-50/50 border border-rose-100">
                <strong>Infectious Pathogens:</strong> History of HIV, Hepatitis B (HBsAg), or Hepatitis C (HCV).
              </div>
              <div className="p-3 rounded-lg bg-rose-50/50 border border-rose-100">
                <strong>Cardiac Conditions:</strong> Coronary heart disease, past infarction, or valve disorders.
              </div>
              <div className="p-3 rounded-lg bg-rose-50/50 border border-rose-100">
                <strong>Bleeding Disorders:</strong> Hemophilia, severe coagulopathies, or factor deficiencies.
              </div>
              <div className="p-3 rounded-lg bg-rose-50/50 border border-rose-100">
                <strong>Chronic Illnesses:</strong> Insulin-dependent diabetes with organ involvement, active malignancy.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Component Guide & Shelf-Life */}
      {activeTab === 'components' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Packed Red Blood Cells (PRBC)
              </h3>
              <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md">
                Shelf Life: 42 Days
              </span>
            </div>
            <div className="text-xs text-slate-600 space-y-2">
              <p><strong>Storage Temperature:</strong> 2°C to 6°C in monitored blood bank cold chambers.</p>
              <p><strong>Clinical Indications:</strong> Surgical hemorrhage, acute trauma resuscitation, severe anemia (Hb &lt; 7 g/dL), thalassemia major management.</p>
              <p><strong>Separation:</strong> Prepared by centrifugation of whole blood, removing ~80% of plasma and suspending in SAGM preservative solution.</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Platelet Concentrate (RDP / SDP)
              </h3>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md">
                Shelf Life: 5 Days (Critical FIFO)
              </span>
            </div>
            <div className="text-xs text-slate-600 space-y-2">
              <p><strong>Storage Temperature:</strong> 20°C to 24°C under continuous horizontal agitation (to prevent platelet aggregation).</p>
              <p><strong>Clinical Indications:</strong> Severe thrombocytopenia (&lt; 20,000/μL), active bleeding in dengue hemorrhagic fever, leukemia & chemotherapy patients.</p>
              <p><strong>Emergency Nature:</strong> Shortest shelf-life of any blood product; requires strict FIFO dispatch tracking.</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Fresh Frozen Plasma (FFP)
              </h3>
              <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md">
                Shelf Life: 1 Year (365 Days)
              </span>
            </div>
            <div className="text-xs text-slate-600 space-y-2">
              <p><strong>Storage Temperature:</strong> -18°C or colder in specialized plasma deep freezers.</p>
              <p><strong>Clinical Indications:</strong> Multiple coagulation factor deficiencies, severe liver disease, massive transfusion protocol (1:1:1 ratio with PRBC & Platelets), Warfarin reversal.</p>
              <p><strong>Thawing Protocol:</strong> Thawed in 37°C water bath prior to immediate infusion.</p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Cryoprecipitate
              </h3>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md">
                Shelf Life: 1 Year (365 Days)
              </span>
            </div>
            <div className="text-xs text-slate-600 space-y-2">
              <p><strong>Storage Temperature:</strong> -18°C or colder.</p>
              <p><strong>Clinical Indications:</strong> Hypofibrinogenemia, Disseminated Intravascular Coagulation (DIC), Factor XIII deficiency, Uremic bleeding.</p>
              <p><strong>Constituents:</strong> High concentration of Fibrinogen (150-250 mg/unit), Factor VIII, and von Willebrand factor.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Benefits */}
      {activeTab === 'benefits' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Cardiovascular Wellness</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Regular blood donation reduces excess oxidative iron stores, lowering arterial oxidative stress and blood viscosity, associated with lower risk of myocardial infarction.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Hematopoietic Stimulation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Donating a single unit prompts the bone marrow to produce fresh, flexible erythrocytes within 24 to 48 hours, revitalizing oxygen carriage across vital organs.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2">
            <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Free Comprehensive Health Check</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Every donation includes confidential screening for Blood Pressure, Hemoglobin levels, ABO/Rh typing, and certified laboratory tests for HIV, Hepatitis B & C, Syphilis, and Malaria.
            </p>
          </div>
        </div>
      )}

      {/* Tab 4: Myths vs Facts */}
      {activeTab === 'myths' && (
        <div className="space-y-3">
          {[
            {
              myth: 'Donating blood makes you physically weak or permanently drains stamina.',
              fact: 'Plasma volume replenishes completely within 24-48 hours. Red blood cells fully regenerate in 4 to 8 weeks. Healthy individuals experience zero permanent loss of physical strength.'
            },
            {
              myth: 'You can contract infectious diseases or HIV while donating blood.',
              fact: 'Impossible. Every collection uses brand-new, factory-sealed, single-use sterile blood bag kits and needles opened directly in front of you and disposed of immediately into bio-medical waste.'
            },
            {
              myth: 'Blood donation is extremely painful.',
              fact: 'Only a mild pinch during needle insertion for 2 seconds. The donation itself takes only 8-10 minutes and is virtually painless in clean, air-conditioned donor lounges.'
            },
            {
              myth: 'Vegetarians do not have enough hemoglobin to donate blood.',
              fact: 'A balanced vegetarian diet rich in legumes, spinach, jaggery, beetroot, and nuts readily maintains hemoglobin well above the 12.5 g/dL safety mark.'
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2">
              <div className="text-xs font-bold text-rose-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-600" />
                <span>MYTH: "{item.myth}"</span>
              </div>
              <div className="text-xs text-slate-700 pl-3.5 border-l-2 border-emerald-500">
                <strong>CLINICAL FACT:</strong> {item.fact}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
