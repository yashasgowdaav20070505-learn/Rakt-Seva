import React, { useState } from 'react';
import { api } from '../../services/api';
import { Sparkles, Brain, Loader2, AlertTriangle, TrendingUp, Calendar, ShieldCheck } from 'lucide-react';

export const AiDemandForecaster: React.FC = () => {
  const [forecast, setForecast] = useState<string | null>(null);
  const [inventorySummary, setInventorySummary] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateForecast = async () => {
    setIsLoading(true);
    try {
      const data = await api.getInventoryDemandForecast();
      setForecast(data.forecastText);
      setInventorySummary(data.currentInventorySummary);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-rose-600 text-xs font-semibold uppercase tracking-wider">
            <Brain className="w-4 h-4" />
            <span>Gemini Pro Thinking Mode · Clinical Inventory Intelligence</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1">
            AI Demand Forecaster & Shortage Vulnerability Assessment
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Powered by high-reasoning Gemini models evaluating live inventory levels, 5-day platelet expiration curves, and seasonal demand fluctuations.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGenerateForecast}
          disabled={isLoading}
          className="bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-sm transition-colors flex items-center gap-2 shrink-0"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Synthesizing Demand Models...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Run Predictive AI Forecast</span>
            </>
          )}
        </button>
      </div>

      {forecast ? (
        <div className="space-y-4">
          <div className="bg-slate-900 text-white p-6 rounded-xl space-y-4 text-xs leading-relaxed font-sans shadow-inner">
            <div className="flex items-center gap-2 text-rose-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-800 pb-2">
              <Sparkles className="w-4 h-4" />
              <span>Clinical Strategic Evaluation Report</span>
            </div>
            
            <div className="prose prose-invert max-w-none text-slate-200 space-y-3 whitespace-pre-line text-xs">
              {forecast}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-xl space-y-2">
          <Brain className="w-10 h-10 text-rose-600/70 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">
            Demand Forecast Model Ready
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Click "Run Predictive AI Forecast" to evaluate current blood group distributions, identify critical negative Rh deficits, and generate proactive camp scheduling recommendations.
          </p>
        </div>
      )}
    </div>
  );
};
