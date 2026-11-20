import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  Map as MapIcon,
  Package,
  ArrowLeftRight,
  BarChart3,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle2,
  X,
  Download,
  Flame,
  Layers,
  Box,
  ArrowRight,
  Info,
  Warehouse
} from 'lucide-react';

// ==========================================
// 1. INITIAL SEED DATA (BRD v2.0 Compliant)
// ==========================================
const PRODUCT_MASTER = {
  'SKU-RM-001': { sku: 'SKU-RM-001', name: 'Aluminum Coil 2mm', category: 'Raw Materials', uom: 'Roll', unitVolumeM3: 1.5 },
  'SKU-RM-002': { sku: 'SKU-RM-002', name: 'Polymer Resin Pellet', category: 'Raw Materials', uom: 'Pallet', unitVolumeM3: 1.2 },
  'SKU-RM-003': { sku: 'SKU-RM-003', name: 'Steel Rod 12mm', category: 'Raw Materials', uom: 'Bundle', unitVolumeM3: 2.0 },
  'SKU-FG-101': { sku: 'SKU-FG-101', name: 'Smart IoT Gateway v2', category: 'Finished Goods', uom: 'Master Box', unitVolumeM3: 0.4 },
  'SKU-FG-102': { sku: 'SKU-FG-102', name: 'Industrial Sensor Hub', category: 'Finished Goods', uom: 'Master Box', unitVolumeM3: 0.5 },
  'SKU-FG-103': { sku: 'SKU-FG-103', name: 'Control Panel Unit', category: 'Finished Goods', uom: 'Crate', unitVolumeM3: 1.8 },
  'SKU-PK-201': { sku: 'SKU-PK-201', name: 'Corrugated Carton XL', category: 'Packing Materials', uom: 'Pallet', unitVolumeM3: 1.6 },
  'SKU-PK-202': { sku: 'SKU-PK-202', name: 'Stretch Film 500mm', category: 'Packing Materials', uom: 'Box', unitVolumeM3: 0.25 },
};

const ZONES = [
  { id: 'ZONE-A', name: 'Zone A — Raw Materials', color: '#3b82f6', bg: '#eff6ff', bounds: { x: 40, y: 80, width: 270, height: 390 } },
  { id: 'ZONE-B', name: 'Zone B — Finished Goods', color: '#10b981', bg: '#ecfdf5', bounds: { x: 340, y: 80, width: 270, height: 390 } },
  { id: 'ZONE-C', name: 'Zone C — Packing Materials', color: '#f59e0b', bg: '#fffbeb', bounds: { x: 640, y: 80, width: 240, height: 390 } },
];

const INITIAL_RACKS = [
  // ZONE A - Raw Materials (6 Racks)
  {
    id: 'A-01', zoneId: 'ZONE-A', rackType: 'Selective Pallet Rack',
    position: { x: 65, y: 125, width: 95, height: 65 },
    levels: [
      { levelId: 'L1', levelNumber: 1, maxVolumeM3: 12, items: [{ sku: 'SKU-RM-001', quantity: 6 }] },
      { levelId: 'L2', levelNumber: 2, maxVolumeM3: 12, items: [{ sku: 'SKU-RM-002', quantity: 8 }] },
      { levelId: 'L3', levelNumber: 3, maxVolumeM3: 10, items: [{ sku: 'SKU-RM-001', quantity: 5 }] },
    ]
  },
  {
    id: 'A-02', zoneId: 'ZONE-A', rackType: 'Selective Pallet Rack',
    position: { x: 185, y: 125, width: 95, height: 65 },
    levels: [
      { levelId: 'L1', levelNumber: 1, maxVolumeM3: 12, items: [{ sku: 'SKU-RM-003', quantity: 6 }] },
      { levelId: 'L2', levelNumber: 2, maxVolumeM3: 12, items: [{ sku: 'SKU-RM-003', quantity: 6 }] },
      { levelId: 'L3', levelNumber: 3, maxVolumeM3: 10, items: [{ sku: 'SKU-RM-002', quantity: 8 }] },
    ]
  },
  {
    id: 'A-03', zoneId: 'ZONE-A', rackType: 'Selective Pallet Rack',
    position: { x: 65, y: 235, width: 95, height: 65 },
    levels: [
      { levelId: 'L1', levelNumber: 1, maxVolumeM3: 12, items: [{ sku: 'SKU-RM-002', quantity: 5 }] },
      { levelId: 'L2', levelNumber: 2, maxVolumeM3: 12, items: [] },
      { levelId: 'L3', levelNumber: 3, maxVolumeM3: 10, items: [] },
    ]
  },
  {
    id: 'A-04', zoneId: 'ZONE-A', rackType: 'Selective Pallet Rack',
    position: { x: 185, y: 235, width: 95, height: 65 },
    levels: [
      { levelId: 'L1', levelNumber: 1, maxVolumeM3: 12, items: [{ sku: 'SKU-RM-001', quantity: 8 }] },
      { levelId: 'L2', levelNumber: 2, maxVolumeM3: 12, items: [{ sku: 'SKU-RM-002', quantity: 9 }] },
      { levelId: 'L3', levelNumber: 3, maxVolumeM3: 10, items: [{ sku: 'SKU-RM-003', quantity: 4 }] },
    ]
  },
  {
    id: 'A-05', zoneId: 'ZONE-A', rackType: 'Bulk Rack',
    position: { x: 65, y: 345, width: 95, height: 65 },
    levels: [
      { levelId: 'L1', levelNumber: 1, maxVolumeM3: 15, items: [] },
      { levelId: 'L2', levelNumber: 2, maxVolumeM3: 15, items: [] },
      { levelId: 'L3', levelNumber: 3, maxVolumeM3: 12, items: [] },
    ]
  },
  {
    id: 'A-06', zoneId: 'ZONE-A', rackType: 'Bulk Rack',
    position: { x: 185, y: 345, width: 95, height: 65 },
    levels: [
      { levelId: 'L1', levelNumber: 1, maxVolumeM3: 15, items: [{ sku: 'SKU-RM-003', quantity: 5 }] },
      { levelId: 'L2', levelNumber: 2, maxVolumeM3: 15, items: [{ sku: 'SKU-RM-001', quantity: 4 }] },
      { levelId: 'L3', levelNumber: 3, maxVolumeM3: 12, items: [] },
    ]
  },

  // ZONE B - Finished Goods (6 Racks)
  {
    id: 'B-01', zoneId: 'ZONE-B', rackType: 'Heavy Duty Shelving',
    position: { x: 365, y: 125, width: 95, height: 65 },
    levels: [
      { levelId: 'L1', levelNumber: 1, maxVolumeM3: 10, items: [{ sku: 'SKU-FG-101', quantity: 20 }] },
      { levelId: 'L2', levelNumber: 2, maxVolumeM3: 10, items: [{ sku: 'SKU-FG-102', quantity: 16 }] },
      { levelId: 'L3', levelNumber: 3, maxVolumeM3: 8, items: [{ sku: 'SKU-FG-101', quantity: 18 }] },
    ]
  },
  {
    id: 'B-02', zoneId: 'ZONE-B', rackType: 'Heavy Duty Shelving',
    position: { x: 485, y: 125, width: 95, height: 65 },
    levels: [
      { levelId: 'L1', levelNumber: 1, maxVolumeM3: 10, items: [{ sku: 'SKU-FG-103', quantity: 4 }] },
      { levelId: 'L2', levelNumber: 2, maxVolumeM3: 10, items: [{ sku: 'SKU-FG-102', quantity: 10 }] },
      { levelId: 'L3', levelNumber: 3, maxVolumeM3: 8, items: [] },
    ]
  },
  {
    id: 'B-03', zoneId: 'ZONE-B', rackType: 'Heavy Duty Shelving',
    position: { x: 365, y: 235, width: 95, height: 65 },
    levels: [
      { levelId: 'L1', levelNumber: 1, maxVolumeM3: 10, items: [{ sku: 'SKU-FG-101', quantity: 10 }] },
      { levelId: 'L2', levelNumber: 2, maxVolumeM3: 10, items: [{ sku: 'SKU-FG-102', quantity: 8 }] },
      { levelId: 'L3', levelNumber: 3, maxVolumeM3: 8, items: [{ sku: 'SKU-FG-101', quantity: 5 }] },
    ]
  },
  {
    id: 'B-04', zoneId: 'ZONE-B', rackType: 'Selective Pallet Rack',
    position: { x: 485, y: 235, width: 95, height: 65 },
    levels: [
      { levelId: 'L1', levelNumber: 1, maxVolumeM3: 12, items: [{ sku: 'SKU-FG-103', quantity: 6 }] },
      { levelId: 'L2', levelNumber: 2, maxVolumeM3: 12, items: [{ sku: 'SKU-FG-103', quantity: 6 }] },
      { levelId: 'L3', levelNumber: 3, maxVolumeM3: 10, items: [{ sku: 'SKU-FG-101', quantity: 25 }] },
    ]
  },
  {
    id: 'B-05', zoneId: 'ZONE-B', rackType: 'Heavy Duty Shelving',
    position: { x: 365, y: 345, width: 95, height: 65 },
    levels: [
      { levelId: 'L1', levelNumber: 1, maxVolumeM3: 10, items: [] },
      { levelId: 'L2', levelNumber: 2, maxVolumeM3: 10, items: [] },
      { levelId: 'L3', levelNumber: 3, maxVolumeM3: 8, items: [] },
    ]
  },
  {
    id: 'B-06', zoneId: 'ZONE-B', rackType: 'Heavy Duty Shelving',
    position: { x: 485, y: 345, width: 95, height: 65 },
    levels: [
      { levelId: 'L1', levelNumber: 1, maxVolumeM3: 10, items: [{ sku: 'SKU-FG-102', quantity: 14 }] },
      { levelId: 'L2', levelNumber: 2, maxVolumeM3: 10, items: [{ sku: 'SKU-FG-101', quantity: 12 }] },
      { levelId: 'L3', levelNumber: 3, maxVolumeM3: 8, items: [{ sku: 'SKU-FG-102', quantity: 6 }] },
    ]
  },

  // ZONE C - Packing Materials (4 Racks)
  {
    id: 'C-01', zoneId: 'ZONE-C', rackType: 'Selective Pallet Rack',
    position: { x: 665, y: 125, width: 85, height: 95 },
    levels: [
      { levelId: 'L1', levelNumber: 1, maxVolumeM3: 12, items: [{ sku: 'SKU-PK-201', quantity: 6 }] },
      { levelId: 'L2', levelNumber: 2, maxVolumeM3: 12, items: [{ sku: 'SKU-PK-202', quantity: 32 }] },
      { levelId: 'L3', levelNumber: 3, maxVolumeM3: 10, items: [{ sku: 'SKU-PK-202', quantity: 20 }] },
    ]
  },
  {
    id: 'C-02', zoneId: 'ZONE-C', rackType: 'Selective Pallet Rack',
    position: { x: 770, y: 125, width: 85, height: 95 },
    levels: [
      { levelId: 'L1', levelNumber: 1, maxVolumeM3: 12, items: [{ sku: 'SKU-PK-201', quantity: 5 }] },
      { levelId: 'L2', levelNumber: 2, maxVolumeM3: 12, items: [{ sku: 'SKU-PK-201', quantity: 4 }] },
      { levelId: 'L3', levelNumber: 3, maxVolumeM3: 10, items: [] },
    ]
  },
  {
    id: 'C-03', zoneId: 'ZONE-C', rackType: 'Heavy Duty Shelving',
    position: { x: 665, y: 270, width: 85, height: 95 },
    levels: [
      { levelId: 'L1', levelNumber: 1, maxVolumeM3: 10, items: [{ sku: 'SKU-PK-202', quantity: 38 }] },
      { levelId: 'L2', levelNumber: 2, maxVolumeM3: 10, items: [{ sku: 'SKU-PK-202', quantity: 36 }] },
      { levelId: 'L3', levelNumber: 3, maxVolumeM3: 8, items: [{ sku: 'SKU-PK-201', quantity: 5 }] },
    ]
  },
  {
    id: 'C-04', zoneId: 'ZONE-C', rackType: 'Heavy Duty Shelving',
    position: { x: 770, y: 270, width: 85, height: 95 },
    levels: [
      { levelId: 'L1', levelNumber: 1, maxVolumeM3: 10, items: [] },
      { levelId: 'L2', levelNumber: 2, maxVolumeM3: 10, items: [] },
      { levelId: 'L3', levelNumber: 3, maxVolumeM3: 8, items: [] },
    ]
  },
];

// ==========================================
// 2. VOLUMETRIC & STATUS HELPER FUNCTIONS
// ==========================================
const calcLevelOccupiedM3 = (level) => {
  return Number(
    level.items.reduce((sum, item) => {
      const prod = PRODUCT_MASTER[item.sku];
      return sum + item.quantity * (prod ? prod.unitVolumeM3 : 0);
    }, 0).toFixed(2)
  );
};

const getRackMetrics = (rack) => {
  let maxVolumeM3 = 0;
  let occupiedVolumeM3 = 0;
  let hasFullLevel = false;

  const enrichedLevels = rack.levels.map((lvl) => {
    const occ = calcLevelOccupiedM3(lvl);
    const util = lvl.maxVolumeM3 > 0 ? Number(((occ / lvl.maxVolumeM3) * 100).toFixed(1)) : 0;
    if (util >= 100) hasFullLevel = true;
    maxVolumeM3 += lvl.maxVolumeM3;
    occupiedVolumeM3 += occ;
    return {
      ...lvl,
      occupiedVolumeM3: occ,
      availableVolumeM3: Number((lvl.maxVolumeM3 - occ).toFixed(2)),
      utilization: util,
    };
  });

  occupiedVolumeM3 = Number(occupiedVolumeM3.toFixed(2));
  const availableVolumeM3 = Number((maxVolumeM3 - occupiedVolumeM3).toFixed(2));
  const utilization = maxVolumeM3 > 0 ? Number(((occupiedVolumeM3 / maxVolumeM3) * 100).toFixed(1)) : 0;

  return {
    ...rack,
    maxVolumeM3,
    occupiedVolumeM3,
    availableVolumeM3,
    utilization,
    hasFullLevel,
    levels: enrichedLevels,
  };
};

const getStatusMeta = (utilization) => {
  if (utilization === 0) {
    return { key: 'EMPTY', label: 'Empty', hex: '#94a3b8', bgLight: 'bg-slate-100', textCol: 'text-slate-700', badge: 'bg-slate-200 text-slate-700' };
  }
  if (utilization < 70) {
    return { key: 'AVAILABLE', label: 'Available', hex: '#10b981', bgLight: 'bg-emerald-50', textCol: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-800' };
  }
  if (utilization < 90) {
    return { key: 'HIGH_OCCUPANCY', label: 'High Occupancy', hex: '#f59e0b', bgLight: 'bg-amber-50', textCol: 'text-amber-700', badge: 'bg-amber-100 text-amber-800' };
  }
  if (utilization < 100) {
    return { key: 'NEAR_FULL', label: 'Near Full', hex: '#f97316', bgLight: 'bg-orange-50', textCol: 'text-orange-700', badge: 'bg-orange-100 text-orange-800' };
  }
  return { key: 'FULL', label: 'Full', hex: '#ef4444', bgLight: 'bg-red-50', textCol: 'text-red-700', badge: 'bg-red-100 text-red-800' };
};

const getHeatmapColor = (utilization) => {
  if (utilization === 0) return '#e2e8f0';
  if (utilization < 30) return '#bae6fd';
  if (utilization < 60) return '#38bdf8';
  if (utilization < 80) return '#facc15';
  if (utilization < 95) return '#fb923c';
  return '#dc2626';
};

// ==========================================
// 3. MAIN APPLICATION COMPONENT
// ==========================================
export default function App() {
  const [activeTab, setActiveTab] = useState('layout');
  const [racks, setRacks] = useState(INITIAL_RACKS);
  const [selectedRackId, setSelectedRackId] = useState(null);
  const [hoveredRack, setHoveredRack] = useState(null);

  // Layout Canvas Controls
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [heatmapMode, setHeatmapMode] = useState(false);
  const [zoneFilter, setZoneFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Inventory Filter
  const [invSearch, setInvSearch] = useState('');
  const [invCategory, setInvCategory] = useState('ALL');

  // Simulation Form & Logs
  const [simAction, setSimAction] = useState('RECEIVING');
  const [simSku, setSimSku] = useState('SKU-RM-001');
  const [simQty, setSimQty] = useState(2);
  const [simTargetRack, setSimTargetRack] = useState('A-03');
  const [simTargetLevel, setSimTargetLevel] = useState('L2');
  const [simSourceRack, setSimSourceRack] = useState('A-01');
  const [simSourceLevel, setSimSourceLevel] = useState('L1');
  const [simFeedback, setSimFeedback] = useState(null);
  const [simLogs, setSimLogs] = useState([
    { id: 'LOG-001', timestamp: '09:15:00', action: 'RECEIVING', sku: 'SKU-RM-001', quantity: 6, volumeM3: 9.0, toLocation: 'A-01-L1' },
    { id: 'LOG-002', timestamp: '10:05:22', action: 'RELOCATION', sku: 'SKU-FG-101', quantity: 5, volumeM3: 2.0, fromLocation: 'B-01-L1', toLocation: 'B-03-L3' },
  ]);

  // Enriched Metrics
  const enrichedRacks = useMemo(() => racks.map(getRackMetrics), [racks]);

  const kpis = useMemo(() => {
    const totalRacks = enrichedRacks.length;
    const totalLevels = enrichedRacks.reduce((s, r) => s + r.levels.length, 0);
    const maxVol = Number(enrichedRacks.reduce((s, r) => s + r.maxVolumeM3, 0).toFixed(2));
    const occVol = Number(enrichedRacks.reduce((s, r) => s + r.occupiedVolumeM3, 0).toFixed(2));
    const availVol = Number((maxVol - occVol).toFixed(2));
    const util = maxVol > 0 ? Number(((occVol / maxVol) * 100).toFixed(1)) : 0;

    const skuSet = new Set();
    let totalUnits = 0;
    enrichedRacks.forEach((r) =>
      r.levels.forEach((l) =>
        l.items.forEach((it) => {
          if (it.quantity > 0) {
            skuSet.add(it.sku);
            totalUnits += it.quantity;
          }
        })
      )
    );

    const criticalRacks = enrichedRacks.filter((r) => r.utilization >= 90 || r.hasFullLevel);

    return {
      totalRacks,
      totalLevels,
      maxVol,
      occVol,
      availVol,
      util,
      activeSkus: skuSet.size,
      totalUnits,
      criticalRacks,
    };
  }, [enrichedRacks]);

  const selectedRack = useMemo(
    () => enrichedRacks.find((r) => r.id === selectedRackId) || null,
    [enrichedRacks, selectedRackId]
  );

  // Inventory Aggregation
  const inventoryList = useMemo(() => {
    return Object.values(PRODUCT_MASTER).map((prod) => {
      let totalQty = 0;
      const locations = [];
      enrichedRacks.forEach((r) => {
        r.levels.forEach((l) => {
          const found = l.items.find((i) => i.sku === prod.sku);
          if (found && found.quantity > 0) {
            totalQty += found.quantity;
            locations.push({
              rackId: r.id,
              levelId: l.levelId,
              code: `${r.id}-${l.levelId}`,
              quantity: found.quantity,
              volumeM3: Number((found.quantity * prod.unitVolumeM3).toFixed(2)),
            });
          }
        });
      });
      return {
        ...prod,
        totalQty,
        totalVolumeM3: Number((totalQty * prod.unitVolumeM3).toFixed(2)),
        locations,
      };
    });
  }, [enrichedRacks]);

  // Simulation Handler
  const executeSimulation = (e) => {
    e.preventDefault();
    setSimFeedback(null);
    const qty = Number(simQty);
    const product = PRODUCT_MASTER[simSku];
    if (!product || qty <= 0 || isNaN(qty)) {
      setSimFeedback({ type: 'error', msg: 'Quantity harus lebih besar dari 0.' });
      return;
    }

    const reqVolume = Number((qty * product.unitVolumeM3).toFixed(2));
    const nowTime = new Date().toTimeString().split(' ')[0];

    if (simAction === 'RECEIVING') {
      const targetRack = enrichedRacks.find((r) => r.id === simTargetRack);
      const targetLvl = targetRack?.levels.find((l) => l.levelId === simTargetLevel);
      if (!targetLvl) return;

      if (targetLvl.occupiedVolumeM3 + reqVolume > targetLvl.maxVolumeM3) {
        setSimFeedback({
          type: 'error',
          msg: `Kapasitas Volumetrik Tidak Cukup! Butuh ${reqVolume} m³, sisa ruang di ${simTargetRack}-${simTargetLevel} hanya ${targetLvl.availableVolumeM3} m³.`,
        });
        return;
      }

      setRacks((prev) =>
        prev.map((r) => {
          if (r.id !== simTargetRack) return r;
          return {
            ...r,
            levels: r.levels.map((l) => {
              if (l.levelId !== simTargetLevel) return l;
              const existing = l.items.find((i) => i.sku === simSku);
              const newItems = existing
                ? l.items.map((i) => (i.sku === simSku ? { ...i, quantity: i.quantity + qty } : i))
                : [...l.items, { sku: simSku, quantity: qty }];
              return { ...l, items: newItems };
            }),
          };
        })
      );

      setSimLogs((prev) => [
        {
          id: `LOG-${Date.now()}`,
          timestamp: nowTime,
          action: 'RECEIVING',
          sku: simSku,
          quantity: qty,
          volumeM3: reqVolume,
          toLocation: `${simTargetRack}-${simTargetLevel}`,
        },
        ...prev,
      ]);
      setSimFeedback({
        type: 'success',
        msg: `Berhasil Receiving ${qty} ${product.uom} (${reqVolume} m³) ke ${simTargetRack}-${simTargetLevel}.`,
      });
    } else if (simAction === 'PICKING') {
      const srcRack = enrichedRacks.find((r) => r.id === simSourceRack);
      const srcLvl = srcRack?.levels.find((l) => l.levelId === simSourceLevel);
      const existingItem = srcLvl?.items.find((i) => i.sku === simSku);

      if (!existingItem || existingItem.quantity < qty) {
        setSimFeedback({
          type: 'error',
          msg: `Stok tidak mencukupi di ${simSourceRack}-${simSourceLevel}. Stok tersedia untuk ${simSku}: ${existingItem ? existingItem.quantity : 0} ${product.uom}.`,
        });
        return;
      }

      setRacks((prev) =>
        prev.map((r) => {
          if (r.id !== simSourceRack) return r;
          return {
            ...r,
            levels: r.levels.map((l) => {
              if (l.levelId !== simSourceLevel) return l;
              const updatedItems = l.items
                .map((i) => (i.sku === simSku ? { ...i, quantity: i.quantity - qty } : i))
                .filter((i) => i.quantity > 0);
              return { ...l, items: updatedItems };
            }),
          };
        })
      );

      setSimLogs((prev) => [
        {
          id: `LOG-${Date.now()}`,
          timestamp: nowTime,
          action: 'PICKING',
          sku: simSku,
          quantity: qty,
          volumeM3: reqVolume,
          fromLocation: `${simSourceRack}-${simSourceLevel}`,
        },
        ...prev,
      ]);
      setSimFeedback({
        type: 'success',
        msg: `Berhasil Picking ${qty} ${product.uom} (${reqVolume} m³) dari ${simSourceRack}-${simSourceLevel}.`,
      });
    } else if (simAction === 'RELOCATION') {
      if (simSourceRack === simTargetRack && simSourceLevel === simTargetLevel) {
        setSimFeedback({ type: 'error', msg: 'Lokasi asal dan tujuan tidak boleh sama.' });
        return;
      }

      const srcRack = enrichedRacks.find((r) => r.id === simSourceRack);
      const srcLvl = srcRack?.levels.find((l) => l.levelId === simSourceLevel);
      const existingItem = srcLvl?.items.find((i) => i.sku === simSku);

      if (!existingItem || existingItem.quantity < qty) {
        setSimFeedback({
          type: 'error',
          msg: `Stok asal tidak mencukupi di ${simSourceRack}-${simSourceLevel} (Tersedia: ${existingItem ? existingItem.quantity : 0}).`,
        });
        return;
      }

      const targetRack = enrichedRacks.find((r) => r.id === simTargetRack);
      const targetLvl = targetRack?.levels.find((l) => l.levelId === simTargetLevel);

      if (!targetLvl || targetLvl.occupiedVolumeM3 + reqVolume > targetLvl.maxVolumeM3) {
        setSimFeedback({
          type: 'error',
          msg: `Ruang tujuan ${simTargetRack}-${simTargetLevel} penuh! Butuh ${reqVolume} m³, sisa kapasitas ${targetLvl?.availableVolumeM3 ?? 0} m³.`,
        });
        return;
      }

      setRacks((prev) =>
        prev.map((r) => {
          let updatedLevels = r.levels;
          if (r.id === simSourceRack) {
            updatedLevels = updatedLevels.map((l) => {
              if (l.levelId !== simSourceLevel) return l;
              return {
                ...l,
                items: l.items
                  .map((i) => (i.sku === simSku ? { ...i, quantity: i.quantity - qty } : i))
                  .filter((i) => i.quantity > 0),
              };
            });
          }
          if (r.id === simTargetRack) {
            updatedLevels = updatedLevels.map((l) => {
              if (l.levelId !== simTargetLevel) return l;
              const exist = l.items.find((i) => i.sku === simSku);
              return {
                ...l,
                items: exist
                  ? l.items.map((i) => (i.sku === simSku ? { ...i, quantity: i.quantity + qty } : i))
                  : [...l.items, { sku: simSku, quantity: qty }],
              };
            });
          }
          return { ...r, levels: updatedLevels };
        })
      );

      setSimLogs((prev) => [
        {
          id: `LOG-${Date.now()}`,
          timestamp: nowTime,
          action: 'RELOCATION',
          sku: simSku,
          quantity: qty,
          volumeM3: reqVolume,
          fromLocation: `${simSourceRack}-${simSourceLevel}`,
          toLocation: `${simTargetRack}-${simTargetLevel}`,
        },
        ...prev,
      ]);
      setSimFeedback({
        type: 'success',
        msg: `Berhasil memindahkan ${qty} ${product.uom} (${reqVolume} m³) dari ${simSourceRack}-${simSourceLevel} ke ${simTargetRack}-${simTargetLevel}.`,
      });
    }
  };

  const handleResetSimulation = () => {
    setRacks(INITIAL_RACKS);
    setSimLogs([]);
    setSimFeedback({ type: 'success', msg: 'Seluruh data simulasi berhasil di-reset ke kondisi awal (Seed JSON).' });
  };

  const handleExportCSV = () => {
    const headers = ['Rack ID', 'Zone', 'Rack Type', 'Max Volume (m3)', 'Occupied Volume (m3)', 'Available Volume (m3)', 'Utilization (%)', 'Status'];
    const rows = enrichedRacks.map((r) => [
      r.id,
      r.zoneId,
      r.rackType,
      r.maxVolumeM3,
      r.occupiedVolumeM3,
      r.availableVolumeM3,
      r.utilization,
      getStatusMeta(r.utilization).label,
    ]);
    const csvContent = [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'PrimaWMS_Warehouse_Analytics.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openQuickSimFromDrawer = (action, rackId, levelId) => {
    setSimAction(action);
    if (action === 'RECEIVING') {
      setSimTargetRack(rackId);
      setSimTargetLevel(levelId);
    } else {
      setSimSourceRack(rackId);
      setSimSourceLevel(levelId);
    }
    setActiveTab('simulation');
    setSelectedRackId(null);
  };

  // Canvas Drag Handlers
  const handleMouseDown = (e) => {
    if (e.target.closest('.rack-node')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };
  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* TOP NAVIGATION BAR */}
      <header className="bg-slate-900 text-white border-b border-slate-800 px-4 lg:px-6 py-3 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Warehouse className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight">PrimaWMS</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded-full">
                Layout Simulator v2.0
              </span>
            </div>
            <p className="text-xs text-slate-400">2D Top-Down Multi-Level & Volumetric (m³) Engine</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'layout', label: '2D Warehouse Map', icon: MapIcon },
            { id: 'inventory', label: 'Inventory Explorer', icon: Package },
            { id: 'simulation', label: 'Simulation', icon: ArrowLeftRight },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  active
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <button
          onClick={handleResetSimulation}
          className="flex items-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg transition"
          title="Reset seluruh simulasi ke data awal JSON"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          Reset Seed
        </button>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6">
        {/* ==================== TAB 1: DASHBOARD ==================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500 font-medium">Zones & Racks</p>
                <p className="text-xl font-bold text-slate-900 mt-1">3 Zones / {kpis.totalRacks}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{kpis.totalLevels} Shelf Levels</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500 font-medium">Total Capacity</p>
                <p className="text-xl font-bold text-slate-900 mt-1">{kpis.maxVol} m³</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Volumetric Max</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500 font-medium">Occupied Volume</p>
                <p className="text-xl font-bold text-blue-600 mt-1">{kpis.occVol} m³</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Active Storage</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500 font-medium">Available Space</p>
                <p className="text-xl font-bold text-emerald-600 mt-1">{kpis.availVol} m³</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Free Volumetric</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500 font-medium">Warehouse Util.</p>
                <p className="text-xl font-bold text-slate-900 mt-1">{kpis.util}%</p>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                  <div className="bg-blue-600 h-full" style={{ width: `${kpis.util}%` }} />
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-xs text-slate-500 font-medium">Active SKUs</p>
                <p className="text-xl font-bold text-slate-900 mt-1">{kpis.activeSkus} SKUs</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{kpis.totalUnits} Total Units</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Zone Breakdown */}
              <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-slate-900 text-sm">Volumetric Utilization by Operational Zone</h2>
                  <button
                    onClick={() => setActiveTab('layout')}
                    className="text-xs text-blue-600 hover:underline font-medium flex items-center gap-1"
                  >
                    Buka Denah 2D <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-4">
                  {ZONES.map((z) => {
                    const zRacks = enrichedRacks.filter((r) => r.zoneId === z.id);
                    const zMax = zRacks.reduce((s, r) => s + r.maxVolumeM3, 0);
                    const zOcc = Number(zRacks.reduce((s, r) => s + r.occupiedVolumeM3, 0).toFixed(2));
                    const zUtil = zMax > 0 ? Number(((zOcc / zMax) * 100).toFixed(1)) : 0;
                    return (
                      <div key={z.id} className="p-3.5 rounded-lg bg-slate-50 border border-slate-100">
                        <div className="flex justify-between items-center text-xs mb-1.5">
                          <span className="font-bold text-slate-800">{z.name}</span>
                          <span className="font-semibold text-slate-600">
                            {zOcc} / {zMax} m³ ({zUtil}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{ width: `${zUtil}%`, backgroundColor: z.color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Critical Bottleneck Alerts */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  <h2 className="font-bold text-slate-900 text-sm">Capacity & Bottleneck Alerts</h2>
                </div>
                {kpis.criticalRacks.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">Semua rak berada pada kapasitas aman (&lt;90%).</p>
                ) : (
                  <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                    {kpis.criticalRacks.map((r) => {
                      const meta = getStatusMeta(r.utilization);
                      return (
                        <div
                          key={r.id}
                          onClick={() => {
                            setSelectedRackId(r.id);
                            setActiveTab('layout');
                          }}
                          className="p-3 rounded-lg border border-slate-200 hover:border-blue-400 cursor-pointer transition flex items-center justify-between"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-slate-900">Rack {r.id}</span>
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${meta.badge}`}>
                                {r.utilization >= 90 ? meta.label : 'Has Full Level'}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {r.occupiedVolumeM3} / {r.maxVolumeM3} m³ ({r.utilization}%)
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-400" />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: 2D WAREHOUSE MAP ==================== */}
        {activeTab === 'layout' && (
          <div className="space-y-4">
            {/* Toolbar Controls */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {/* Search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari Rack ID / SKU..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 w-44"
                  />
                </div>

                {/* Zone Filter */}
                <select
                  value={zoneFilter}
                  onChange={(e) => setZoneFilter(e.target.value)}
                  className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:border-blue-500"
                >
                  <option value="ALL">Semua Zona</option>
                  {ZONES.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name}
                    </option>
                  ))}
                </select>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:border-blue-500"
                >
                  <option value="ALL">Semua Status</option>
                  <option value="EMPTY">Empty (0%)</option>
                  <option value="AVAILABLE">Available (1-69%)</option>
                  <option value="HIGH_OCCUPANCY">High (70-89%)</option>
                  <option value="NEAR_FULL">Near Full (90-99%)</option>
                  <option value="FULL">Full (100%)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                {/* Heatmap Toggle */}
                <button
                  onClick={() => setHeatmapMode(!heatmapMode)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                    heatmapMode
                      ? 'bg-orange-500 text-white border-orange-600 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  {heatmapMode ? 'Heatmap: ON' : 'Heatmap Mode'}
                </button>

                {/* Zoom Controls */}
                <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
                  <button
                    onClick={() => setZoom((z) => Math.max(0.6, Number((z - 0.15).toFixed(2))))}
                    className="p-1.5 hover:bg-white rounded-md text-slate-600"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-semibold px-2 text-slate-600">{Math.round(zoom * 100)}%</span>
                  <button
                    onClick={() => setZoom((z) => Math.min(1.8, Number((z + 0.15).toFixed(2))))}
                    className="p-1.5 hover:bg-white rounded-md text-slate-600"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setZoom(1);
                      setPan({ x: 0, y: 0 });
                    }}
                    className="p-1.5 hover:bg-white rounded-md text-slate-600 border-l border-slate-200 ml-0.5"
                    title="Reset View"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive SVG Canvas */}
            <div
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="relative bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-[540px] cursor-grab active:cursor-grabbing select-none"
            >
              {/* Floating Tooltip */}
              {hoveredRack && (
                <div className="absolute top-3 left-3 z-20 bg-slate-900/95 text-white px-3.5 py-2.5 rounded-xl shadow-lg text-xs pointer-events-none border border-slate-700">
                  <div className="flex items-center gap-2 font-bold">
                    <span>Rack {hoveredRack.id}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-200">
                      {hoveredRack.levels.length} Levels
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] mt-0.5">{hoveredRack.rackType}</p>
                  <div className="mt-1.5 pt-1.5 border-t border-slate-700 flex justify-between gap-4">
                    <span className="text-slate-400">Volume:</span>
                    <span className="font-semibold">
                      {hoveredRack.occupiedVolumeM3} / {hoveredRack.maxVolumeM3} m³ ({hoveredRack.utilization}%)
                    </span>
                  </div>
                </div>
              )}

              {/* Color Legend Overlay */}
              <div className="absolute bottom-3 left-3 z-20 bg-white/95 backdrop-blur px-3 py-2 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-3 text-[11px]">
                {heatmapMode ? (
                  <>
                    <span className="font-bold text-slate-700">Heatmap Density:</span>
                    <span className="flex items-center gap-1"><i className="w-3 h-3 rounded-sm inline-block bg-[#e2e8f0]" /> 0%</span>
                    <span className="flex items-center gap-1"><i className="w-3 h-3 rounded-sm inline-block bg-[#38bdf8]" /> &lt;60%</span>
                    <span className="flex items-center gap-1"><i className="w-3 h-3 rounded-sm inline-block bg-[#facc15]" /> &lt;80%</span>
                    <span className="flex items-center gap-1"><i className="w-3 h-3 rounded-sm inline-block bg-[#fb923c]" /> &lt;95%</span>
                    <span className="flex items-center gap-1"><i className="w-3 h-3 rounded-sm inline-block bg-[#dc2626]" /> 95-100%</span>
                  </>
                ) : (
                  <>
                    <span className="font-bold text-slate-700">Occupancy Status:</span>
                    <span className="flex items-center gap-1"><i className="w-3 h-3 rounded-sm inline-block bg-[#94a3b8]" /> Empty (0%)</span>
                    <span className="flex items-center gap-1"><i className="w-3 h-3 rounded-sm inline-block bg-[#10b981]" /> Available (1-69%)</span>
                    <span className="flex items-center gap-1"><i className="w-3 h-3 rounded-sm inline-block bg-[#f59e0b]" /> High (70-89%)</span>
                    <span className="flex items-center gap-1"><i className="w-3 h-3 rounded-sm inline-block bg-[#f97316]" /> Near Full (90-99%)</span>
                    <span className="flex items-center gap-1"><i className="w-3 h-3 rounded-sm inline-block bg-[#ef4444]" /> Full (100%)</span>
                  </>
                )}
              </div>

              <div className="absolute bottom-3 right-3 z-20 text-[11px] text-slate-400 bg-white/90 px-2.5 py-1 rounded-lg border border-slate-200">
                Klik rak untuk detail level (L1–L3) • Drag kanvas untuk geser
              </div>

              {/* SVG FLOOR PLAN */}
              <svg viewBox="0 0 920 530" className="w-full h-full">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1" />
                  </pattern>
                </defs>

                <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
                  {/* Warehouse Floor Background */}
                  <rect x="15" y="15" width="890" height="500" rx="12" fill="url(#grid)" stroke="#cbd5e1" strokeWidth="2" />

                  {/* Receiving & Shipping Docks */}
                  <rect x="40" y="25" width="270" height="36" rx="6" fill="#e0f2fe" stroke="#0284c7" strokeDasharray="4 2" />
                  <text x="175" y="47" textAnchor="middle" className="text-[11px] font-bold fill-sky-800">
                    ⬇ INBOUND / RECEIVING DOCK
                  </text>

                  <rect x="640" y="25" width="240" height="36" rx="6" fill="#fef3c7" stroke="#d97706" strokeDasharray="4 2" />
                  <text x="760" y="47" textAnchor="middle" className="text-[11px] font-bold fill-amber-800">
                    ⬆ OUTBOUND / SHIPPING DOCK
                  </text>

                  {/* Main Aisle Labels */}
                  <text x="325" y="280" textAnchor="middle" transform="rotate(-90 325 280)" className="text-[10px] font-bold tracking-widest fill-slate-400">
                    MAIN FORKLIFT AISLE 01
                  </text>
                  <text x="625" y="280" textAnchor="middle" transform="rotate(-90 625 280)" className="text-[10px] font-bold tracking-widest fill-slate-400">
                    MAIN FORKLIFT AISLE 02
                  </text>

                  {/* Operational Zones */}
                  {ZONES.map((z) => (
                    <g key={z.id}>
                      <rect
                        x={z.bounds.x}
                        y={z.bounds.y}
                        width={z.bounds.width}
                        height={z.bounds.height}
                        rx="10"
                        fill={z.bg}
                        stroke={z.color}
                        strokeWidth="1.5"
                        strokeOpacity="0.5"
                      />
                      <text
                        x={z.bounds.x + 12}
                        y={z.bounds.y + 22}
                        className="text-xs font-bold"
                        fill={z.color}
                      >
                        {z.name}
                      </text>
                    </g>
                  ))}

                  {/* Racks */}
                  {enrichedRacks.map((rack) => {
                    const statusMeta = getStatusMeta(rack.utilization);
                    const fillColor = heatmapMode ? getHeatmapColor(rack.utilization) : statusMeta.hex;

                    const matchesZone = zoneFilter === 'ALL' || rack.zoneId === zoneFilter;
                    const matchesStatus = statusFilter === 'ALL' || statusMeta.key === statusFilter;
                    const q = searchQuery.trim().toLowerCase();
                    const matchesSearch =
                      !q ||
                      rack.id.toLowerCase().includes(q) ||
                      rack.levels.some((l) => l.items.some((i) => i.sku.toLowerCase().includes(q)));

                    const isDimmed = !matchesZone || !matchesStatus || !matchesSearch;
                    const isHighlighted = q && matchesSearch;
                    const isSelected = selectedRackId === rack.id;

                    return (
                      <g
                        key={rack.id}
                        className="rack-node cursor-pointer transition-opacity duration-200"
                        style={{ opacity: isDimmed ? 0.22 : 1 }}
                        onClick={() => setSelectedRackId(rack.id)}
                        onMouseEnter={() => setHoveredRack(rack)}
                        onMouseLeave={() => setHoveredRack(null)}
                      >
                        {/* Selection / Search Halo */}
                        {(isSelected || isHighlighted) && (
                          <rect
                            x={rack.position.x - 4}
                            y={rack.position.y - 4}
                            width={rack.position.width + 8}
                            height={rack.position.height + 8}
                            rx="9"
                            fill="none"
                            stroke="#2563eb"
                            strokeWidth="3"
                          />
                        )}

                        {/* Main Rack Rectangle */}
                        <rect
                          x={rack.position.x}
                          y={rack.position.y}
                          width={rack.position.width}
                          height={rack.position.height}
                          rx="6"
                          fill={fillColor}
                          stroke="#1e293b"
                          strokeWidth="1.2"
                        />

                        {/* Rack ID Text */}
                        <text
                          x={rack.position.x + rack.position.width / 2}
                          y={rack.position.y + rack.position.height / 2 - 4}
                          textAnchor="middle"
                          className="text-xs font-extrabold fill-white pointer-events-none"
                          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.45)' }}
                        >
                          {rack.id}
                        </text>

                        {/* Utilization & Level Count */}
                        <text
                          x={rack.position.x + rack.position.width / 2}
                          y={rack.position.y + rack.position.height / 2 + 12}
                          textAnchor="middle"
                          className="text-[10px] font-semibold fill-white pointer-events-none"
                          style={{ textShadow: '0 1px 2px rgba(0,0,0,0.45)' }}
                        >
                          {rack.utilization}% • {rack.levels.length}L
                        </text>

                        {/* Full Level Warning Dot */}
                        {rack.hasFullLevel && !heatmapMode && (
                          <circle
                            cx={rack.position.x + rack.position.width - 8}
                            cy={rack.position.y + 8}
                            r="4.5"
                            fill="#fef08a"
                            stroke="#b91c1c"
                            strokeWidth="1.5"
                          />
                        )}
                      </g>
                    );
                  })}
                </g>
              </svg>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: INVENTORY EXPLORER ==================== */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-bold text-slate-900 text-sm">Inventory Explorer & Multi-Level Location Map</h2>
                <p className="text-xs text-slate-500">Klik badge lokasi (contoh: A-01-L1) untuk melihat posisi rak di denah 2D</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari SKU atau Nama Produk..."
                    value={invSearch}
                    onChange={(e) => setInvSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 w-52"
                  />
                </div>
                <select
                  value={invCategory}
                  onChange={(e) => setInvCategory(e.target.value)}
                  className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white"
                >
                  <option value="ALL">Semua Kategori</option>
                  <option value="Raw Materials">Raw Materials</option>
                  <option value="Finished Goods">Finished Goods</option>
                  <option value="Packing Materials">Packing Materials</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <th className="py-3 px-4">SKU Code</th>
                    <th className="py-3 px-4">Product Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Unit Vol.</th>
                    <th className="py-3 px-4">Total Stock</th>
                    <th className="py-3 px-4">Total Vol.</th>
                    <th className="py-3 px-4">Rack & Level Locations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inventoryList
                    .filter((item) => {
                      const matchCat = invCategory === 'ALL' || item.category === invCategory;
                      const q = invSearch.toLowerCase();
                      const matchQ = !q || item.sku.toLowerCase().includes(q) || item.name.toLowerCase().includes(q);
                      return matchCat && matchQ;
                    })
                    .map((item) => (
                      <tr key={item.sku} className="hover:bg-slate-50/80">
                        <td className="py-3 px-4 font-bold text-slate-900">{item.sku}</td>
                        <td className="py-3 px-4 font-medium text-slate-800">{item.name}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[11px] bg-slate-100 text-slate-700 font-medium">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-600">{item.unitVolumeM3} m³ / {item.uom}</td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {item.totalQty} {item.uom}
                        </td>
                        <td className="py-3 px-4 font-semibold text-blue-600">{item.totalVolumeM3} m³</td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1.5">
                            {item.locations.length === 0 ? (
                              <span className="text-slate-400 italic">Out of stock</span>
                            ) : (
                              item.locations.map((loc) => (
                                <button
                                  key={loc.code}
                                  onClick={() => {
                                    setSelectedRackId(loc.rackId);
                                    setActiveTab('layout');
                                  }}
                                  className="px-2 py-0.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-medium text-[11px] transition"
                                >
                                  {loc.code} ({loc.quantity} {item.uom})
                                </button>
                              ))
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================== TAB 4: SIMULATION WORKSPACE ==================== */}
        {activeTab === 'simulation' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Simulation Form */}
            <div className="lg:col-span-5 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h2 className="font-bold text-slate-900 text-sm mb-1">Operational Warehouse Simulator</h2>
              <p className="text-xs text-slate-500 mb-4">Simulasi transaksi stok dengan validasi kapasitas volumetrik (m³)</p>

              {/* Action Selector */}
              <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl mb-4">
                {[
                  { id: 'RECEIVING', label: 'Receiving (+)' },
                  { id: 'PICKING', label: 'Picking (-)' },
                  { id: 'RELOCATION', label: 'Relocate (⇄)' },
                ].map((act) => (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => {
                      setSimAction(act.id);
                      setSimFeedback(null);
                    }}
                    className={`py-2 rounded-lg text-xs font-semibold transition ${
                      simAction === act.id
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {act.label}
                  </button>
                ))}
              </div>

              <form onSubmit={executeSimulation} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pilih Produk (SKU)</label>
                  <select
                    value={simSku}
                    onChange={(e) => setSimSku(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-white"
                  >
                    {Object.values(PRODUCT_MASTER).map((p) => (
                      <option key={p.sku} value={p.sku}>
                        {p.sku} — {p.name} ({p.unitVolumeM3} m³/{p.uom})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Quantity ({PRODUCT_MASTER[simSku]?.uom}) — Est. Volume:{' '}
                    <span className="text-blue-600 font-bold">
                      {Number(((simQty || 0) * (PRODUCT_MASTER[simSku]?.unitVolumeM3 || 0)).toFixed(2))} m³
                    </span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={simQty}
                    onChange={(e) => setSimQty(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2"
                  />
                </div>

                {/* Source Location (for Picking & Relocation) */}
                {(simAction === 'PICKING' || simAction === 'RELOCATION') && (
                  <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200/80 space-y-2">
                    <p className="font-bold text-amber-900">Lokasi Asal (Source)</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-slate-600 mb-1">Source Rack</label>
                        <select
                          value={simSourceRack}
                          onChange={(e) => setSimSourceRack(e.target.value)}
                          className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white"
                        >
                          {enrichedRacks.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.id} ({r.utilization}%)
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-600 mb-1">Shelf Level</label>
                        <select
                          value={simSourceLevel}
                          onChange={(e) => setSimSourceLevel(e.target.value)}
                          className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white"
                        >
                          {['L1', 'L2', 'L3'].map((l) => (
                            <option key={l} value={l}>
                              Level {l}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Target Location (for Receiving & Relocation) */}
                {(simAction === 'RECEIVING' || simAction === 'RELOCATION') && (
                  <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-200/80 space-y-2">
                    <p className="font-bold text-blue-900">Lokasi Tujuan (Destination)</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-slate-600 mb-1">Target Rack</label>
                        <select
                          value={simTargetRack}
                          onChange={(e) => setSimTargetRack(e.target.value)}
                          className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white"
                        >
                          {enrichedRacks.map((r) => (
                            <option key={r.id} value={r.id}>
                              {r.id} (Sisa {r.availableVolumeM3} m³)
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-600 mb-1">Shelf Level</label>
                        <select
                          value={simTargetLevel}
                          onChange={(e) => setSimTargetLevel(e.target.value)}
                          className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 bg-white"
                        >
                          {['L1', 'L2', 'L3'].map((l) => (
                            <option key={l} value={l}>
                              Level {l}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {simFeedback && (
                  <div
                    className={`p-3 rounded-lg flex items-start gap-2 text-xs ${
                      simFeedback.type === 'error'
                        ? 'bg-red-50 text-red-700 border border-red-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {simFeedback.type === 'error' ? (
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    )}
                    <span>{simFeedback.msg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg shadow-sm transition"
                >
                  Eksekusi Simulasi {simAction}
                </button>
              </form>
            </div>

            {/* Activity Log */}
            <div className="lg:col-span-7 bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-bold text-slate-900 text-sm">Simulation Activity Log</h2>
                  <p className="text-xs text-slate-500">Riwayat transaksi volumetrik pada sesi simulasi aktif</p>
                </div>
                <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-semibold">
                  {simLogs.length} Transaksi
                </span>
              </div>

              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                      <th className="py-2.5 px-3">Time</th>
                      <th className="py-2.5 px-3">Action</th>
                      <th className="py-2.5 px-3">SKU</th>
                      <th className="py-2.5 px-3">Qty / Vol</th>
                      <th className="py-2.5 px-3">Movement Path</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {simLogs.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-slate-400">
                          Belum ada aktivitas simulasi.
                        </td>
                      </tr>
                    ) : (
                      simLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50">
                          <td className="py-2.5 px-3 text-slate-500 font-mono">{log.timestamp}</td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                log.action === 'RECEIVING'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : log.action === 'PICKING'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {log.action}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-slate-800">{log.sku}</td>
                          <td className="py-2.5 px-3 text-slate-700">
                            {log.quantity} ({log.volumeM3} m³)
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                            {log.fromLocation && log.toLocation
                              ? `${log.fromLocation} → ${log.toLocation}`
                              : log.toLocation
                              ? `DOCK → ${log.toLocation}`
                              : `${log.fromLocation} → SHIPPING`}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 5: ANALYTICS & CSV EXPORT ==================== */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div>
                <h2 className="font-bold text-slate-900 text-sm">Warehouse Volumetric Analytics & Ranking</h2>
                <p className="text-xs text-slate-500">Analisis efisiensi ruang (m³) dan peringkat okupansi rak secara real-time</p>
              </div>
              <button
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition"
              >
                <Download className="w-3.5 h-3.5" />
                Export Analytics to CSV
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top 10 Occupied Racks */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 text-sm mb-3">Top 10 Most Occupied Racks (by Volume %)</h3>
                <div className="space-y-2.5">
                  {[...enrichedRacks]
                    .sort((a, b) => b.utilization - a.utilization)
                    .slice(0, 10)
                    .map((r, idx) => {
                      const meta = getStatusMeta(r.utilization);
                      return (
                        <div key={r.id} className="flex items-center gap-3 text-xs">
                          <span className="w-5 font-bold text-slate-400">#{idx + 1}</span>
                          <span className="w-12 font-bold text-slate-900">{r.id}</span>
                          <div className="flex-1 bg-slate-100 h-2.5 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{ width: `${r.utilization}%`, backgroundColor: meta.hex }}
                            />
                          </div>
                          <span className="w-24 text-right font-semibold text-slate-700">
                            {r.occupiedVolumeM3}/{r.maxVolumeM3}m³ ({r.utilization}%)
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Empty Storage Locations & Status Summary */}
              <div className="space-y-6">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-900 text-sm mb-3">Rack Occupancy Status Distribution</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
                    {[
                      { label: 'Empty', count: enrichedRacks.filter((r) => r.utilization === 0).length, color: 'bg-slate-100 text-slate-700' },
                      { label: 'Available', count: enrichedRacks.filter((r) => r.utilization > 0 && r.utilization < 70).length, color: 'bg-emerald-100 text-emerald-800' },
                      { label: 'High', count: enrichedRacks.filter((r) => r.utilization >= 70 && r.utilization < 90).length, color: 'bg-amber-100 text-amber-800' },
                      { label: 'Near Full', count: enrichedRacks.filter((r) => r.utilization >= 90 && r.utilization < 100).length, color: 'bg-orange-100 text-orange-800' },
                      { label: 'Full', count: enrichedRacks.filter((r) => r.utilization === 100).length, color: 'bg-red-100 text-red-800' },
                    ].map((st) => (
                      <div key={st.label} className={`p-3 rounded-xl ${st.color}`}>
                        <p className="text-lg font-extrabold">{st.count}</p>
                        <p className="text-[11px] font-semibold">{st.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="font-bold text-slate-900 text-sm mb-2">Empty Racks Ready for Putaway (0%)</h3>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {enrichedRacks
                      .filter((r) => r.utilization === 0)
                      .map((r) => (
                        <button
                          key={r.id}
                          onClick={() => {
                            setSelectedRackId(r.id);
                            setActiveTab('layout');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 text-xs font-bold transition"
                        >
                          {r.id} ({r.maxVolumeM3} m³ free)
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ==================== SLIDE-OVER RACK & SHELF LEVEL DRAWER ==================== */}
      {selectedRack && (
        <div className="fixed inset-0 z-40 flex justify-end bg-slate-900/40 backdrop-blur-[1px]">
          <div className="w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold">Rack {selectedRack.id}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {selectedRack.zoneId}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{selectedRack.rackType} • {selectedRack.levels.length} Shelf Levels</p>
              </div>
              <button
                onClick={() => setSelectedRackId(null)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Volumetric Summary */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 grid grid-cols-3 gap-2 text-center">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <p className="text-[11px] text-slate-500">Max Volume</p>
                <p className="text-sm font-bold text-slate-900">{selectedRack.maxVolumeM3} m³</p>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <p className="text-[11px] text-slate-500">Occupied</p>
                <p className="text-sm font-bold text-blue-600">{selectedRack.occupiedVolumeM3} m³</p>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <p className="text-[11px] text-slate-500">Utilization</p>
                <p className="text-sm font-bold text-slate-900">{selectedRack.utilization}%</p>
              </div>
            </div>

            {/* Multi-Level Shelf Breakdown */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Shelf Level Breakdown (Top to Ground)</span>
              </div>

              {[...selectedRack.levels]
                .sort((a, b) => b.levelNumber - a.levelNumber)
                .map((lvl) => {
                  const lvlMeta = getStatusMeta(lvl.utilization);
                  return (
                    <div key={lvl.levelId} className="border border-slate-200 rounded-xl p-3.5 bg-white shadow-sm">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs bg-slate-900 text-white px-2 py-0.5 rounded">
                            {selectedRack.id}-{lvl.levelId}
                          </span>
                          <span className="text-xs text-slate-500">
                            {lvl.levelNumber === 1 ? 'Ground Level' : `Shelf Level ${lvl.levelNumber}`}
                          </span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${lvlMeta.badge}`}>
                          {lvl.utilization}% ({lvl.occupiedVolumeM3}/{lvl.maxVolumeM3} m³)
                        </span>
                      </div>

                      {/* Level Progress Bar */}
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
                        <div
                          className="h-full transition-all"
                          style={{ width: `${lvl.utilization}%`, backgroundColor: lvlMeta.hex }}
                        />
                      </div>

                      {/* Items in Level */}
                      {lvl.items.length === 0 ? (
                        <p className="text-xs text-slate-400 italic py-1">Slot kosong (0 m³ terpakai)</p>
                      ) : (
                        <div className="space-y-1.5 mb-3">
                          {lvl.items.map((it) => {
                            const prod = PRODUCT_MASTER[it.sku];
                            const itemVol = Number((it.quantity * (prod?.unitVolumeM3 || 0)).toFixed(2));
                            return (
                              <div
                                key={it.sku}
                                className="flex items-center justify-between text-xs bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100"
                              >
                                <div>
                                  <p className="font-bold text-slate-800">{prod?.name || it.sku}</p>
                                  <p className="text-[10px] text-slate-500">{it.sku}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-slate-900">
                                    {it.quantity} {prod?.uom}
                                  </p>
                                  <p className="text-[10px] text-blue-600 font-semibold">{itemVol} m³</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Quick Simulation Buttons */}
                      <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => openQuickSimFromDrawer('RECEIVING', selectedRack.id, lvl.levelId)}
                          className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-semibold transition"
                        >
                          <Plus className="w-3 h-3" /> Receive
                        </button>
                        {lvl.items.length > 0 && (
                          <>
                            <button
                              onClick={() => openQuickSimFromDrawer('PICKING', selectedRack.id, lvl.levelId)}
                              className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 text-[11px] font-semibold transition"
                            >
                              <Minus className="w-3 h-3" /> Pick
                            </button>
                            <button
                              onClick={() => openQuickSimFromDrawer('RELOCATION', selectedRack.id, lvl.levelId)}
                              className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-semibold transition"
                            >
                              <ArrowLeftRight className="w-3 h-3" /> Move
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
