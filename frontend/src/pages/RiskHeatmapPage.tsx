import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Map,
  Filter,
  Layers,
  Compass,
  Building,
  CreditCard,
  ShieldAlert,
  X,
  CheckCircle,
} from 'lucide-react';
import { useCyberPehra } from '../context/CyberPehraContext';
import { WithdrawalLocation, RiskLevel } from '../types';
import { RiskHeatmapLeaflet } from '../components/maps/RiskHeatmapLeaflet';
import { RiskScoreBadge } from '../components/common/RiskScoreBadge';
import { formatINR } from '../utils/formatters';

export const RiskHeatmapPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { locations, dispatchTeam, markSurveillance } = useCyberPehra();

  const paramLocId = searchParams.get('locationId');
  const [selectedLocation, setSelectedLocation] = useState<WithdrawalLocation | null>(
    locations.find((l) => l.id === paramLocId) || locations[0]
  );

  // Filters
  const [stateFilter, setStateFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [bankFilter, setBankFilter] = useState('ALL');

  const filteredLocations = locations.filter((loc) => {
    if (stateFilter !== 'ALL' && loc.state !== stateFilter) return false;
    if (riskFilter !== 'ALL' && loc.riskLevel !== riskFilter) return false;
    if (typeFilter !== 'ALL' && loc.type !== typeFilter) return false;
    if (bankFilter !== 'ALL' && loc.bankName !== bankFilter) return false;
    return true;
  });

  const states = Array.from(new Set(locations.map((l) => l.state)));
  const banks = Array.from(new Set(locations.map((l) => l.bankName)));

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-sky-600/20 text-sky-400 border border-sky-500/30">
              <Map className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-100">
              National Geospatial Risk Heatmap & ATM Grid
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time geospatial radar tracking predicted cash withdrawal points & hotspot clusters across India
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
          <span>Displaying:</span>
          <strong className="text-sky-400">{filteredLocations.length} Locations</strong>
          <span className="text-slate-500">/ {locations.length} Active Nodes</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-3.5 rounded-xl bg-[#0f172a] border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-400 font-semibold uppercase text-[11px]">
          <Filter className="w-3.5 h-3.5 text-sky-400" />
          <span>GIS Filters:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* State Filter */}
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none text-xs"
          >
            <option value="ALL">All States ({states.length})</option>
            {states.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          {/* Risk Level Filter */}
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none text-xs"
          >
            <option value="ALL">All Risk Tiers</option>
            <option value="CRITICAL">Critical (&gt;90 Score)</option>
            <option value="HIGH">High (75 - 89 Score)</option>
            <option value="MEDIUM">Medium (60 - 74 Score)</option>
            <option value="LOW">Low (&lt;60 Score)</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none text-xs"
          >
            <option value="ALL">All Facility Types</option>
            <option value="ATM">Standalone ATM</option>
            <option value="Bank Branch">Bank Branch Counter</option>
            <option value="CSP/Kiosk">Customer Service Point / Kiosk</option>
          </select>

          {/* Bank Filter */}
          <select
            value={bankFilter}
            onChange={(e) => setBankFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none text-xs"
          >
            <option value="ALL">All Bank Networks</option>
            {banks.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          {(stateFilter !== 'ALL' || riskFilter !== 'ALL' || typeFilter !== 'ALL' || bankFilter !== 'ALL') && (
            <button
              onClick={() => {
                setStateFilter('ALL');
                setRiskFilter('ALL');
                setTypeFilter('ALL');
                setBankFilter('ALL');
              }}
              className="p-1 text-slate-400 hover:text-white"
              title="Reset Filters"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Map & Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[600px]">
        {/* Full-bleed Leaflet Map Container */}
        <div className="lg:col-span-3 h-[600px]">
          <RiskHeatmapLeaflet
            locations={filteredLocations}
            selectedLocationId={selectedLocation?.id}
            onSelectLocation={(loc) => setSelectedLocation(loc)}
            onDispatch={(locId) => dispatchTeam('INV-7731', locId)}
          />
        </div>

        {/* Selected Marker Inspector Side Card */}
        <div className="lg:col-span-1 p-5 rounded-xl bg-[#0f172a] border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
          {selectedLocation ? (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Target Node Inspector
                </span>
                <RiskScoreBadge
                  score={selectedLocation.riskScore}
                  level={selectedLocation.riskLevel}
                />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-100">{selectedLocation.name}</h3>
                <span className="text-[11px] font-mono text-slate-400 block mt-0.5">
                  {selectedLocation.bankName} • {selectedLocation.type}
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">
                  {selectedLocation.address}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Time Window:</span>
                  <span className="font-mono text-amber-300 font-semibold">
                    {selectedLocation.predictedTimeWindow}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Amount at Risk:</span>
                  <span className="font-mono text-red-400 font-bold">
                    {formatINR(selectedLocation.amountAtRisk)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Confidence Score:</span>
                  <span className="font-mono text-sky-400 font-bold">
                    {selectedLocation.confidenceScore}%
                  </span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 text-[11px] block font-semibold uppercase mb-1">
                  Primary Risk Trigger:
                </span>
                <div className="p-2 rounded bg-red-950/30 border border-red-500/20 text-red-300 text-[11px] leading-relaxed">
                  {selectedLocation.reasons[0]?.description || 'Mule activity detected'}
                </div>
              </div>

              <div className="space-y-1 text-[11px] text-slate-400 font-mono">
                <div>Police: {selectedLocation.nearestPoliceStation}</div>
                <div>Distance: {selectedLocation.distanceToPatrolKm} km</div>
                <div>
                  CCTV:{' '}
                  <span className={selectedLocation.cctvOperational ? 'text-emerald-400' : 'text-red-400'}>
                    {selectedLocation.cctvOperational ? 'Online & Recording' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-500 text-xs">
              Click any map marker to inspect its tactical risk profile
            </div>
          )}

          {selectedLocation && (
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => dispatchTeam('INV-7731', selectedLocation.id)}
                className="w-full py-2 px-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-sky-900/30"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Deploy QRT to ATM Site</span>
              </button>
              <button
                onClick={() => markSurveillance(selectedLocation.id)}
                className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors flex items-center justify-center gap-1.5 border border-slate-700"
              >
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>Activate Surveillance</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
