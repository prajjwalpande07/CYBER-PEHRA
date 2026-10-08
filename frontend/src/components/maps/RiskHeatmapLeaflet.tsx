import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Layers, Compass } from 'lucide-react';
import { WithdrawalLocation } from '../../types';
import { formatINR } from '../../utils/formatters';

interface RiskHeatmapLeafletProps {
  locations: WithdrawalLocation[];
  onSelectLocation?: (location: WithdrawalLocation) => void;
  selectedLocationId?: string;
  onDispatch?: (locId: string) => void;
}

export const RiskHeatmapLeaflet: React.FC<RiskHeatmapLeafletProps> = ({
  locations,
  onSelectLocation,
  selectedLocationId,
  onDispatch: _onDispatch,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});

  // Layer groups
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const heatmapLayerRef = useRef<L.LayerGroup | null>(null);
  const clustersLayerRef = useRef<L.LayerGroup | null>(null);
  const cctvLayerRef = useRef<L.LayerGroup | null>(null);

  // Layer visibility toggles
  const [showMarkers, setShowMarkers] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showClusters, setShowClusters] = useState(true);
  const [showCCTV, setShowCCTV] = useState(true);

  const isFirstRender = useRef(true);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center map over Nanded, Maharashtra, India (Lat: 19.1383, Lng: 77.3210)
    const map = L.map(mapContainerRef.current, {
      center: [19.1383, 77.3210],
      zoom: 13,
      zoomControl: true,
      attributionControl: true,
    });

    // Real OpenStreetMap geographic tile layer (Free, no API key required)
    // Renders real streets, roads, localities, district boundaries, and landmarks of Nanded
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Initialize Layer Groups
    heatmapLayerRef.current = L.layerGroup().addTo(map);
    clustersLayerRef.current = L.layerGroup().addTo(map);
    cctvLayerRef.current = L.layerGroup().addTo(map);
    markersLayerRef.current = L.layerGroup().addTo(map);

    // Add scale control
    L.control.scale({ imperial: false, position: 'bottomright' }).addTo(map);

    mapInstanceRef.current = map;

    // Ensure full-bleed responsive rendering
    const resizeTimer = setTimeout(() => {
      map.invalidateSize();
    }, 250);

    return () => {
      clearTimeout(resizeTimer);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update layer visibility on toggle
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (markersLayerRef.current) {
      if (showMarkers) {
        if (!map.hasLayer(markersLayerRef.current)) map.addLayer(markersLayerRef.current);
      } else {
        if (map.hasLayer(markersLayerRef.current)) map.removeLayer(markersLayerRef.current);
      }
    }

    if (heatmapLayerRef.current) {
      if (showHeatmap) {
        if (!map.hasLayer(heatmapLayerRef.current)) map.addLayer(heatmapLayerRef.current);
      } else {
        if (map.hasLayer(heatmapLayerRef.current)) map.removeLayer(heatmapLayerRef.current);
      }
    }

    if (clustersLayerRef.current) {
      if (showClusters) {
        if (!map.hasLayer(clustersLayerRef.current)) map.addLayer(clustersLayerRef.current);
      } else {
        if (map.hasLayer(clustersLayerRef.current)) map.removeLayer(clustersLayerRef.current);
      }
    }

    if (cctvLayerRef.current) {
      if (showCCTV) {
        if (!map.hasLayer(cctvLayerRef.current)) map.addLayer(cctvLayerRef.current);
      } else {
        if (map.hasLayer(cctvLayerRef.current)) map.removeLayer(cctvLayerRef.current);
      }
    }
  }, [showMarkers, showHeatmap, showClusters, showCCTV]);

  // Update layers content when locations or selectedLocationId change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing layer contents
    markersLayerRef.current?.clearLayers();
    heatmapLayerRef.current?.clearLayers();
    clustersLayerRef.current?.clearLayers();
    cctvLayerRef.current?.clearLayers();
    markersRef.current = {};

    // 1. Build Hotspot Clusters Layer
    if (clustersLayerRef.current) {
      // Nanded City Hotspot Cluster
      const nandedCluster = L.circle([19.1450, 77.3200], {
        radius: 2800,
        color: '#0284c7',
        dashArray: '6, 6',
        weight: 2,
        fillColor: '#0284c7',
        fillOpacity: 0.08,
      }).bindTooltip('📍 Nanded City Cluster — High ATM Density & Transit Hub', {
        permanent: false,
        direction: 'top',
        className: 'bg-slate-900 text-sky-300 border border-slate-700 font-mono text-[10px] px-2 py-1 rounded shadow-lg',
      });
      nandedCluster.addTo(clustersLayerRef.current);

      // Mewat-Bharatpur Border Hotspot Cluster
      const bharatpurCluster = L.circle([27.6534, 77.2684], {
        radius: 3500,
        color: '#ef4444',
        dashArray: '6, 6',
        weight: 2,
        fillColor: '#ef4444',
        fillOpacity: 0.08,
      }).bindTooltip('⚠️ Mewat-Bharatpur Border Cluster — Jamtara/Alwar Cyber Syndicate', {
        permanent: false,
        direction: 'top',
        className: 'bg-slate-900 text-red-300 border border-slate-700 font-mono text-[10px] px-2 py-1 rounded shadow-lg',
      });
      bharatpurCluster.addTo(clustersLayerRef.current);
    }

    // 2. Build Markers, Heatmap Gradient & CCTV Coverage for each location
    locations.forEach((loc) => {
      let ringColor = 'rgba(16, 185, 129, 0.4)';
      let hexColor = '#10b981';
      if (loc.riskLevel === 'CRITICAL') {
        ringColor = 'rgba(239, 68, 68, 0.7)';
        hexColor = '#ef4444';
      } else if (loc.riskLevel === 'HIGH') {
        ringColor = 'rgba(249, 115, 22, 0.6)';
        hexColor = '#f97316';
      } else if (loc.riskLevel === 'MEDIUM') {
        ringColor = 'rgba(245, 158, 11, 0.5)';
        hexColor = '#f59e0b';
      }

      // Heatmap Gradient aura
      if (heatmapLayerRef.current) {
        const heatRadius =
          loc.riskScore >= 90 ? 1200 : loc.riskScore >= 75 ? 900 : loc.riskScore >= 60 ? 600 : 400;
        L.circle([loc.latitude, loc.longitude], {
          radius: heatRadius,
          color: hexColor,
          weight: 1,
          opacity: 0.35,
          fillColor: hexColor,
          fillOpacity: loc.riskScore >= 90 ? 0.22 : 0.14,
        }).addTo(heatmapLayerRef.current);
      }

      // CCTV Coverage circle
      if (cctvLayerRef.current) {
        L.circle([loc.latitude, loc.longitude], {
          radius: 350,
          color: loc.cctvOperational ? '#10b981' : '#ef4444',
          dashArray: loc.cctvOperational ? undefined : '4, 4',
          weight: 1.5,
          opacity: 0.7,
          fillColor: loc.cctvOperational ? '#10b981' : '#ef4444',
          fillOpacity: 0.08,
        })
          .bindTooltip(
            `CCTV: ${loc.cctvOperational ? 'Online & Recording (350m)' : 'OFFLINE Vulnerability'}`,
            {
              permanent: false,
              className:
                'bg-slate-900 text-slate-200 border border-slate-700 font-mono text-[10px] px-2 py-0.5 rounded',
            }
          )
          .addTo(cctvLayerRef.current);
      }

      const isSelected = loc.id === selectedLocationId;

      // Custom HTML Marker Icon
      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
            ${
              loc.riskScore >= 80
                ? `<div style="position: absolute; width: 100%; height: 100%; border-radius: 50%; background: ${ringColor}; animation: radar-pulse 2s infinite ease-out;"></div>`
                : ''
            }
            <div style="width: ${isSelected ? '28px' : '22px'}; height: ${
          isSelected ? '28px' : '22px'
        }; border-radius: 50%; background: ${hexColor}; border: ${
          isSelected ? '3px solid #38bdf8' : '2px solid white'
        }; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px rgba(0,0,0,0.8); z-index: 10;">
              <span style="color: white; font-size: 10px; font-weight: bold; font-family: monospace;">${
                loc.riskScore
              }</span>
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -18],
      });

      const marker = L.marker([loc.latitude, loc.longitude], { icon: customIcon });

      // Popup content
      const popupHtml = `
        <div style="min-width: 250px; font-family: 'Inter', sans-serif; font-size: 12px; line-height: 1.4; color: #f1f5f9;">
          <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #334155; padding-bottom: 6px; margin-bottom: 8px;">
            <strong style="color: #38bdf8; font-size: 13px;">${loc.name}</strong>
            <span style="background: ${hexColor}; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold;">
              ${loc.riskLevel} (${loc.riskScore}/100)
            </span>
          </div>

          <div style="margin-bottom: 4px; color: #cbd5e1;">
            <strong>Type:</strong> ${loc.type} • <strong>Bank:</strong> ${loc.bankName}
          </div>
          <div style="margin-bottom: 4px; color: #cbd5e1;">
            <strong>District/State:</strong> ${loc.district}, ${loc.state}
          </div>
          <div style="margin-bottom: 4px; color: #cbd5e1;">
            <strong>Window:</strong> <span style="color: #fbbf24; font-weight: 600;">${loc.predictedTimeWindow}</span>
          </div>
          <div style="margin-bottom: 6px; color: #cbd5e1;">
            <strong>Amount at Risk:</strong> <span style="color: #f87171; font-weight: bold; font-family: monospace;">${formatINR(loc.amountAtRisk)}</span>
          </div>
          <div style="margin-bottom: 6px; color: #94a3b8; font-size: 11px;">
            <strong>Reason:</strong> ${loc.reasons[0]?.factor || 'High transaction velocity'}
          </div>

          <div style="display: flex; gap: 6px; margin-top: 8px; pt: 6px; border-top: 1px solid #334155;">
            <button id="btn-select-${loc.id}" style="flex: 1; background: #0284c7; color: white; border: none; border-radius: 4px; padding: 4px 8px; font-size: 11px; cursor: pointer; font-weight: 500;">
              Inspect Risk Card
            </button>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-select-${loc.id}`);
        if (btn) {
          btn.onclick = () => {
            if (onSelectLocation) onSelectLocation(loc);
          };
        }
      });

      marker.on('click', () => {
        if (onSelectLocation) onSelectLocation(loc);
      });

      if (markersLayerRef.current) {
        marker.addTo(markersLayerRef.current);
      }
      markersRef.current[loc.id] = marker;
    });

    // Centering & Selected Location management
    if (selectedLocationId && markersRef.current[selectedLocationId]) {
      const selected = locations.find((l) => l.id === selectedLocationId);
      if (selected) {
        if (isFirstRender.current) {
          isFirstRender.current = false;
          // Initial load: ensure map loads centered on Nanded, Maharashtra
          if (selected.district === 'Nanded' || selected.id === 'LOC-MH-02') {
            map.setView([19.1383, 77.3210], 13);
            markersRef.current[selectedLocationId].openPopup();
          } else {
            // Keep centered on Nanded on initial load
            map.setView([19.1383, 77.3210], 13);
          }
        } else {
          // Interactive pan on user marker selection
          map.setView([selected.latitude, selected.longitude], 13, { animate: true });
          markersRef.current[selectedLocationId].openPopup();
        }
      }
    } else if (isFirstRender.current) {
      isFirstRender.current = false;
      map.setView([19.1383, 77.3210], 13);
    }
  }, [locations, selectedLocationId, onSelectLocation]);

  const handleRecenterNanded = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([19.1383, 77.3210], 13, { animate: true });
      if (markersRef.current['LOC-MH-02']) {
        markersRef.current['LOC-MH-02'].openPopup();
      }
    }
  };

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* Real Map Leaflet Container */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[500px]" />

      {/* Floating Layer Toggles Widget */}
      <div className="absolute top-4 right-4 z-[1000] bg-[#090e1d]/90 backdrop-blur-md p-3 rounded-lg border border-slate-800 text-xs shadow-xl space-y-2 pointer-events-auto min-w-[200px]">
        <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-300 uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span>GIS Map Layers</span>
          </div>
          <span className="text-[10px] font-mono text-sky-400">Live</span>
        </div>

        <div className="space-y-1.5 text-[11px]">
          <label className="flex items-center gap-2 cursor-pointer hover:text-white select-none">
            <input
              type="checkbox"
              checked={showMarkers}
              onChange={(e) => setShowMarkers(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-sky-600 focus:ring-0 w-3.5 h-3.5 cursor-pointer"
            />
            <span className="text-slate-300">Risk Markers</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:text-white select-none">
            <input
              type="checkbox"
              checked={showHeatmap}
              onChange={(e) => setShowHeatmap(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-sky-600 focus:ring-0 w-3.5 h-3.5 cursor-pointer"
            />
            <span className="text-slate-300">Heatmap Gradient</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:text-white select-none">
            <input
              type="checkbox"
              checked={showClusters}
              onChange={(e) => setShowClusters(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-sky-600 focus:ring-0 w-3.5 h-3.5 cursor-pointer"
            />
            <span className="text-slate-300">Hotspot Clusters</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:text-white select-none">
            <input
              type="checkbox"
              checked={showCCTV}
              onChange={(e) => setShowCCTV(e.target.checked)}
              className="rounded bg-slate-900 border-slate-700 text-sky-600 focus:ring-0 w-3.5 h-3.5 cursor-pointer"
            />
            <span className="text-slate-300">CCTV Coverage</span>
          </label>
        </div>

        <button
          onClick={handleRecenterNanded}
          className="w-full mt-2 py-1 px-2 rounded bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/30 text-[10px] font-medium flex items-center justify-center gap-1.5 transition-colors"
          title="Recenter view on Nanded, Maharashtra"
        >
          <Compass className="w-3 h-3 text-sky-400" />
          <span>Center on Nanded, MH</span>
        </button>
      </div>

      {/* Map Legend Floating Widget */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-[#090e1d]/90 backdrop-blur-md p-3 rounded-lg border border-slate-800 text-xs shadow-xl space-y-2 pointer-events-auto max-w-[220px]">
        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
          Threat Heatmap Tiers
        </div>
        <div className="space-y-1 text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-ping inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 -ml-5 inline-block" />
            <span className="text-slate-200">Critical (&gt;90) — Imminent Cashout</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" />
            <span className="text-slate-300">High (75 - 89) — Active Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
            <span className="text-slate-300">Medium (60 - 74) — Monitored</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span className="text-slate-300">Low (&lt;60) — Baseline Node</span>
          </div>
        </div>
      </div>
    </div>
  );
};
