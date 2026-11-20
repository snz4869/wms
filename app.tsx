import React, { useState, useMemo } from 'react';
import {
  Warehouse,
  LayoutGrid,
  Package,
  BarChart3,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Search,
  Filter,
  Flame,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowLeftRight,
  AlertTriangle,
  CheckCircle2,
  Layers,
  Box,
  Download,
  X,
  History,
  Info,
  MapPin
} from 'lucide-react';

// ============================================================================
// 1. SEED DATA & MASTER CONFIGURATION (BRD v2.0 Spec)
// ============================================================================

const PRODUCT_MASTER = [
  { sku: 'SKU-RM-001', name: 'Steel Coil 2mm', category: 'Raw Materials', uom: 'Pallet', unitVolumeM3: 1.5 },
  { sku: 'SKU-RM-002', name: 'Aluminum Ingot Grade A', category: 'Raw Materials', uom: 'Crate', unitVolumeM3: 1.2 },
  { sku: 'SKU-RM-003', name: 'Polymer Resin Granules', category: 'Raw Materials', uom: 'Bag', unitVolumeM3: 0.8 },
  { sku: 'SKU-FG-101', name: 'Industrial Servo Motor', category: 'Finished Goods', uom: 'Box', unitVolumeM3: 1.0 },
  { sku: 'SKU-FG-102', name: 'Control Panel Unit X2', category: 'Finished Goods', uom: 'Pallet', unitVolumeM3: 2.0 },
  { sku: 'SKU-FG-103', name: 'Hydraulic Pump Assembly', category: 'Finished Goods', uom: 'Crate', unitVolumeM3: 1.4 },
  { sku: 'SKU-PK-201', name: 'Corrugated Carton XL', category: 'Packing Materials', uom: 'Bundle', unitVolumeM3: 0.5 },
  { sku: 'SKU-PK-202', name: 'Heavy Duty Stretch Film', category: 'Packing Materials', uom: 'Roll', unitVolumeM3: 0.4 },
];

const ZONES = [
  {
    id: 'ZONE-A',
    name: 'Zone A — Raw Materials',
    shortName: 'Raw Materials',
    color: '#3b82f6',
    bgTint: 'rgba(59, 130, 246, 0.06)',
    bounds: { x: 40, y: 95, width: 250, height: 360 }
  },
  {
    id: 'ZONE-B',
    name: 'Zone B — Finished Goods',
    shortName: 'Finished Goods',
    color: '#10b981',
    bgTint: 'rgba(16, 185, 129, 0.06)',
    bounds: { x: 330, y: 95, width: 250, height: 360 }
  },
  {
    id: 'ZONE-C',
    name: 'Zone C — Packing Materials',
    shortName: 'Packing Materials',
    color: '#8b5cf6',
    bgTint: 'rgba(139, 92, 246, 0.06)',
    bounds: { x: 620, y: 95, width: 250, height: 360 }
  }
];

const INITIAL_RACKS = [
  // ZONE A - Raw Materials
  {
    id: 'A-01',
    zoneId: 'ZONE-A',
    rackType: 'Selective Pallet Rack',
    position: { x: 65, y: 145, width: 85, height: 120 },
    levels: [
      { levelId: 'L1', levelNumber: 1, maxVolumeM3: 10, items: [{ sku: 'SKU-RM-001', quantity: 6 }] }, // 9.0 m3 (90%)
      { levelId: 'L2', levelNumber: 2, maxVolumeM3: 10, items: [{ sku: 'SKU-RM-002', quantity: 7 }] }, // 8.4 m3 (84%)
      { levelId: 'L3', levelNumber: 3, maxVolumeM3: 10, items: [{ sku: 'SKU-RM-003', quantity: 10 }] }, // 8.0 m3 (80%)
    ]
  },
  {
    id: 'A-02',
    zoneId: 'ZONE-A',
    rackType: 'Selective Pallet Rack',
    position: { x: 180, y: 145, width: 85, height: 120 },
    levels: [
      { levelId: 'L1', levelNumber: 1, maxVolumeM3: 10, items: [{ sku: 'SKU-RM-001', quantity: 4 }] }, // 6.0 m3
      { levelId: 'L2', levelNumber: 2, maxVolumeM3: 10, items: [{ sku: 'SKU-RM-002', quantity: 3 }] }, // 3.6 m3
      { levelId: 'L3', levelNumber: 3, maxVolumeM3: 10, items: [] }, // 0 m3
    ]
  },
  {
    id: 'A-03',
    zoneId: 'ZONE-A',
    rackType: 'Heavy Duty Shelving',
    position: { x: 65, y: 300, width: 85, height: 120 },
    levels: [
      { levelId: 'L1', levelNumber: 1, maxVolumeM3: 12, items: [{ sku: 'SKU-RM-001', quantity: 8 }] }, // 12.0 m3 (100%)
      { levelId: 'L2', levelNumber: 2, maxVolumeM3: 12, items: [{ sku: 'SKU-RM-002', quantity: 10 }] }, // 12.0 m3 (100%)
      { levelId: 'L3', levelNumber: 3, maxVolumeM3: 12, items: [{ sku: 'SKU-RM-003', quantity: 15 }] }, // 12.0 m3 (100%)
    ]
  },
  {
    id: 'A-04',
    zoneId: 'ZONE-A',
    rackType: 'Heavy Duty Shelving',
    position: { x: 180, y: 300, width: 85, height: 120 },
    levels: [
      { levelId: 'L1', levelNumber: 1, maxVolumeM3: 10, items: [] },
      { levelId: 'L2', levelNumber: 2, maxVolumeM3: 10, items: [] },
      { levelId: 'L3', levelNumber: 3, maxVolumeM3: 10, items: [] },
    ]
  },

  // ZONE B - Finished Goods
  {
    id: 'B-01',
    zoneId: 'ZONE-B',
    rackType: 'Selective Pallet Rack',
    position: { x: 355, y: 145, width: 85, height: 120 },
    levels: [
      { levelId: 'L1', levelNumber: 1, maxVolumeM3: 10, items: [{ sku: 'SKU-FG-102', quantity: 5 }] }, // 10.0 m3
      { levelId: 'L2', levelNumber: 2, maxVolumeM3: 10, items: [{ sku: 'SKU-FG-101', quantity: 9 }] }, // 9.0 m3
      { levelId: 'L3', levelNumber: 3, maxVolumeM3: 10, items: [{ sku: 'SKU-FG-103', quantity: 6 }] }, // 8.4 m3
    ]
  },
  {
    id: 'B-02',
    zoneId: 'ZONE-B',
    rackType: 'Selective Pallet Rack',
    position: { x: 470, y: 145, width: 85, height: 120 },
    levels: [
      { levelId: 'L1', levelNumber: 1, maxVolumeM3: 10, items: [{ sku: 'SKU-FG-101', quantity: 5 }] }, // 5.0 m3
      { levelId: 'L2', levelNumber: 2, maxVolumeM3: 10, items: [{ sku: 'SKU-FG-103', quantity: 4 }] }, // 5.6 m3
      { levelId: 'L3', levelNumber: 3, maxVolumeM3: 10, items: [{ sku: 'SKU-FG-102', quantity: 2 }] }, // 4.0 m3
    ]
  },
  {
    id: 'B-03',
    zoneId: 'ZONE-B',
    rackType: 'Bulk Rack',
    position: { x: 355, y: 300, width: 85, height: 120 },
    levels: [
      { levelId: 'L1', levelNumber: 1, maxVolumeM3: 10, items: [{ sku: 'SKU-FG-102', quantity: 4 }] }, // 8.0 m3
      { levelId: 'L2', levelNumber: 2, maxVolumeM3: 10, items: [{ sku: 'SKU-FG-101', quantity: 8 }] }, // 8.0 m3
      { levelId: 'L3', levelNumber: 3, maxVolumeM3: 10, items: [{ sku: 'SKU-FG-103', quantity: 5 }] }, // 7.0 m3
    ]
  },
  {
    id: 'B-04',
    zoneId: 'ZONE-B',
    rackType: 'Bulk Rack',
    position: { x: 470, y: 300, width: 85, height: 120 },
    levels: [
      { levelId: 'L1', levelNumber: 1, maxVolumeM3: 10, items: [{ sku: 'SKU-FG-101', quantity: 2 }] }, // 2.0 m3
      { levelId: 'L2', levelNumber: 2, maxVolumeM3: 10, items: [] },
      { levelId: 'L3', levelNumber: 3, maxVolumeM3: 10, items: [] },
    ]
  },

  // ZONE C - Packing Materials
  {
    id: 'C-01',
    zoneId: 'ZONE-C',
    rackType: 'Heavy Duty Shelving',
    position: { x: 645, y: 145, width: 85, height: 120 },
    levels: [
      { levelId: 'L1', levelNumber: 1, maxVolumeM3: 8, items: [{ sku: 'SKU-PK-201', quantity: 10 }] }, // 5.0 m3
      { levelId: 'L2', levelNumber: 2, maxVolumeM3: 8, items: [{ sku: 'SKU-PK-202', quantity: 12 }] }, // 4.8 m3
      { levelId: 'L3', levelNumber: 3, maxVolumeM3: 8, items: [{ sku: 'SKU-PK-201', quantity: 8 }] }, // 4.0 m3
    ]
  },
  {
    id: 'C-02',
    zoneId: 'ZONE-C',
    rackType: 'Heavy Duty Shelving',
    position: { x: 760, y: 145, width: 85, height: 120 },
    levels: [
      { levelId: 'L1', levelNumber: 1, maxVolumeM3: 8, items: [{ sku: 'SKU-PK-202', quantity: 18 }] }, // 7.2 m3
      { levelId: 'L2', levelNumber: 2, maxVolumeM3: 8, items: [{ sku: 'SKU-PK-201', quantity: 15 }] }, // 7.5 m3
      { levelId: 'L3', levelNumber: 3, maxVolumeM3: 8, items: [{ sku: 'SKU-PK-202', quantity: 18 }] }, // 7.2 m3
    ]
  },
  {
    id: 'C-03',
    zoneId: 'ZONE-C',
    rackType: 'Selective Pallet Rack',
    position: { x: 645, y: 300, width: 85, height: 120 },
    levels: [
      { levelId: 'L1', levelNumber: 1, maxVolumeM3: 8, items: [] },
      { levelId: 'L2', levelNumber: 2, maxVolumeM3: 8, items: [] },
      { levelId: 'L3', levelNumber: 3, maxVolumeM3: 8, items: [] },
    ]
  },
  {
    id: 'C-04',
    zoneId: 'ZONE-C',
    rackType: 'Selective Pallet Rack',
    position: { x: 760, y: 300, width: 85, height: 120 },
    levels: [
      { levelId: 'L1', levelNumber: 1, maxVolumeM3: 8, items: [{ sku: 'SKU-PK-201', quantity: 6 }] }, // 3.0 m3
      { levelId: 'L2', levelNumber: 2, maxVolumeM3: 8, items: [{ sku: 'SKU-PK-202', quantity: 5 }] }, // 2.0 m3
      { levelId: 'L3', levelNumber: 3, maxVolumeM3: 8, items: [] },
    ]
  }
];

const INITIAL_LOGS = [
  {
    id: 'LOG-001',
    timestamp: '14:10:05',
    action: 'RECEIVING',
    sku: 'SKU-RM-001',
    quantity: 6,
    volumeM3: 9.0,
    toLocation: 'A-01-L1'
  },
  {
    id: 'LOG-002',
    timestamp: '14:25:42',
    action: 'RELOCATION',
    sku: 'SKU-FG-101',
    quantity: 4,
    volumeM3: 4.0,
    fromLocation: 'B-04-L2',
    toLocation: 'B-01-L2'
  }
];

// ============================================================================
// 2. PURE VOLUMETRIC CALCULATION UTILITIES (BRD Business Rules BR-001..BR-009)
// ============================================================================

const getProductMap = () => {
  const map = {};
  PRODUCT_MASTER.forEach((p) => {
    map[p.sku] = p;
  });
  return map;
};

const PRODUCT_MAP = getProductMap();

function calculateLevelStats(level) {
  const occupiedVolumeM3 = level.items.reduce((sum, item) => {
    const product = PRODUCT_MAP[item.sku];
    return sum + item.quantity * (product ? product.unitVolumeM3 : 0);
  }, 0);

  const roundedOccupied = Math.round(occupiedVolumeM3 * 100) / 100;
  const availableVolumeM3 = Math.max(0, Math.round((level.maxVolumeM3 - roundedOccupied) * 100) / 100);
  const utilization = level.maxVolumeM3 > 0 ? Math.round((roundedOccupied / level.maxVolumeM3) * 1000) / 10 : 0;

  return {
    ...level,
    occupiedVolumeM3: roundedOccupied,
    availableVolumeM3,
    utilization
  };
}

function calculateRackStats(rack) {
  const enrichedLevels = rack.levels.map(calculateLevelStats);
  const maxVolumeM3 = enrichedLevels.reduce((s, l) => s + l.maxVolumeM3, 0);
  const occupiedVolumeM3 = Math.round(enrichedLevels.reduce((s, l) => s + l.occupiedVolumeM3, 0) * 100) / 100;
  const availableVolumeM3 = Math.max(0, Math.round((maxVolumeM3 - occupiedVolumeM3) * 100) / 100);
  const utilization = maxVolumeM3 > 0 ? Math.round((occupiedVolumeM3 / maxVolumeM3) * 1000) / 10 : 0;
  const hasFullLevel = enrichedLevels.some((l) => l.utilization >= 100);

  return {
    ...rack,
    levels: enrichedLevels,
    maxVolumeM3,
    occupiedVolumeM3,
    availableVolumeM3,
    utilization,
    hasFullLevel
  };
}

function getStatusConfig(utilization) {
  if (utilization <= 0) {
    return {
      key: 'EMPTY',
      label: 'Empty',
      hex: '#94A3B8', // slate-400
      bgLight: 'bg-slate-100',
      textClass: 'text-slate-700',
      borderClass: 'border-slate-300',
      badgeBg: 'bg-slate-500'
    };
  }
  if (utilization < 70) {
    return {
      key: 'AVAILABLE',
      label: 'Available',
      hex: '#10B981', // emerald-500
      bgLight: 'bg-emerald-50',
      textClass: 'text-emerald-700',
      borderClass: 'border-emerald-300',
      badgeBg: 'bg-emerald-500'
    };
  }
  if (utilization < 90) {
    return {
      key: 'HIGH_OCCUPANCY',
      label: 'High Occupancy',
      hex: '#F59E0B', // amber-500
      bgLight: 'bg-amber-50',
      textClass: 'text-amber-700',
      borderClass: 'border-amber-300',
      badgeBg: 'bg-amber-500'
    };
  }
  if (utilization < 100) {
    return {
      key: 'NEAR_FULL',
      label: 'Near Full',
      hex: '#F97316', // orange-500
      bgLight: 'bg-orange-50',
      textClass: 'text-orange-700',
      borderClass: 'border-orange-300',
      badgeBg: 'bg-orange-500'
    };
  }
  return {
    key: 'FULL',
    label: 'Full',
    hex: '#EF4444', // red-500
    bgLight: 'bg-red-50',
    textClass: 'text-red-700',
    borderClass: 'border-red-300',
    badgeBg: 'bg-red-500'
  };
}

function getHeatmapColor(utilization) {
  // Smooth thermal gradient from cool blue/cyan (0%) -> emerald -> yellow -> deep crimson (100%)
  if (utilization <= 0) return '#e2e8f0';
  if (utilization < 25) return '#38bdf8';
  if (utilization < 50) return '#34d399';
  if (utilization < 75) return '#facc15';
  if (utilization < 90) return '#fb923c';
  return '#dc2626';
}

// ============================================================================
// 3. MAIN APPLICATION COMPONENT
// ============================================================================

export default function App() {
  // Navigation & Global State
  const [activeTab, setActiveTab] = useState('map'); // 'map' | 'inventory' | 'analytics'
  const [racksData, setRacksData] = useState(() => JSON.parse(JSON.stringify(INITIAL_RACKS)));
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [selectedRackId, setSelectedRackId] = useState('A-01');
  const [toast, setToast] = useState(null);

  // Map Interaction States
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredRack, setHoveredRack] = useState(null);
  const [heatmapMode, setHeatmapMode] = useState(false);

  // Filters & Search
  const [zoneFilter, setZoneFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Quick Simulation Form State inside Drawer
  const [simMode, setSimMode] = useState('RECEIVING'); // 'RECEIVING' | 'PICKING' | 'RELOCATION'
  const [simLevelId, setSimLevelId] = useState('L1');
  const [simSku, setSimSku] = useState('SKU-RM-001');
  const [simQty, setSimQty] = useState(1);
  const [targetRackId, setTargetRackId] = useState('A-02');
  const [targetLevelId, setTargetLevelId] = useState('L1');
  const [simError, setSimError] = useState('');

  // Inventory Explorer Search/Filter
  const [invSearch, setInvSearch] = useState('');
  const [invCategory, setInvCategory] = useState('ALL');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Enriched Racks & Global KPIs
  const enrichedRacks = useMemo(() => racksData.map(calculateRackStats), [racksData]);

  const globalKpis = useMemo(() => {
    const totalRacks = enrichedRacks.length;
    const totalLevels = enrichedRacks.reduce((s, r) => s + r.levels.length, 0);
    const totalCapacityM3 = Math.round(enrichedRacks.reduce((s, r) => s + r.maxVolumeM3, 0) * 10) / 10;
    const occupiedVolumeM3 = Math.round(enrichedRacks.reduce((s, r) => s + r.occupiedVolumeM3, 0) * 10) / 10;
    const availableVolumeM3 = Math.max(0, Math.round((totalCapacityM3 - occupiedVolumeM3) * 10) / 10);
    const utilization = totalCapacityM3 > 0 ? Math.round((occupiedVolumeM3 / totalCapacityM3) * 1000) / 10 : 0;

    return {
      totalRacks,
      totalLevels,
      totalCapacityM3,
      occupiedVolumeM3,
      availableVolumeM3,
      utilization
    };
  }, [enrichedRacks]);

  const selectedRack = useMemo(
    () => enrichedRacks.find((r) => r.id === selectedRackId) || null,
    [enrichedRacks, selectedRackId]
  );

  // Sync default SKU & Level when selected rack changes
  const handleSelectRack = (rackId) => {
    setSelectedRackId(rackId);
    setSimError('');
    const rack = enrichedRacks.find((r) => r.id === rackId);
    if (rack) {
      setSimLevelId(rack.levels[0]?.levelId || 'L1');
      // Pick an existing SKU if available in L1, otherwise default by zone
      const firstItem = rack.levels[0]?.items[0];
      if (firstItem) {
        setSimSku(firstItem.sku);
      } else if (rack.zoneId === 'ZONE-A') {
        setSimSku('SKU-RM-001');
      } else if (rack.zoneId === 'ZONE-B') {
        setSimSku('SKU-FG-101');
      } else {
        setSimSku('SKU-PK-201');
      }
    }
  };

  // Reset Simulation Handler (BR-009)
  const handleResetSimulation = () => {
    setRacksData(JSON.parse(JSON.stringify(INITIAL_RACKS)));
    setLogs(INITIAL_LOGS);
    setSimError('');
    showToast('Simulation state reset to initial seed JSON.', 'info');
  };

  // ============================================================================
  // 4. SIMULATION ENGINE HANDLERS (Receiving, Picking, Relocation)
  // ============================================================================

  const executeSimulation = (e) => {
    e.preventDefault();
    setSimError('');

    if (!selectedRack) return;
    const qty = Number(simQty);
    if (!Number.isInteger(qty) || qty <= 0) {
      setSimError('Quantity must be a positive integer (> 0).');
      return;
    }

    const product = PRODUCT_MAP[simSku];
    if (!product) {
      setSimError('Invalid SKU selected.');
      return;
    }

    const moveVolumeM3 = Math.round(qty * product.unitVolumeM3 * 100) / 100;
    const nowTime = new Date().toTimeString().split(' ')[0];

    // 1. RECEIVING (INBOUND)
    if (simMode === 'RECEIVING') {
      const targetLevel = selectedRack.levels.find((l) => l.levelId === simLevelId);
      if (!targetLevel) return;

      if (targetLevel.occupiedVolumeM3 + moveVolumeM3 > targetLevel.maxVolumeM3 + 0.001) {
        setSimError(
          `Capacity Exceeded! Required: ${moveVolumeM3} m³, Available in ${selectedRack.id}-${simLevelId}: ${targetLevel.availableVolumeM3} m³.`
        );
        return;
      }

      setRacksData((prev) =>
        prev.map((rack) => {
          if (rack.id !== selectedRack.id) return rack;
          return {
            ...rack,
            levels: rack.levels.map((lvl) => {
              if (lvl.levelId !== simLevelId) return lvl;
              const existingIdx = lvl.items.findIndex((i) => i.sku === simSku);
              const updatedItems = [...lvl.items];
              if (existingIdx >= 0) {
                updatedItems[existingIdx] = {
                  ...updatedItems[existingIdx],
                  quantity: updatedItems[existingIdx].quantity + qty
                };
              } else {
                updatedItems.push({ sku: simSku, quantity: qty });
              }
              return { ...lvl, items: updatedItems };
            })
          };
        })
      );

      setLogs((prev) => [
        {
          id: `LOG-${Date.now()}`,
          timestamp: nowTime,
          action: 'RECEIVING',
          sku: simSku,
          quantity: qty,
          volumeM3: moveVolumeM3,
          toLocation: `${selectedRack.id}-${simLevelId}`
        },
        ...prev
      ]);

      showToast(`Received +${qty} ${product.uom} (${moveVolumeM3} m³) into ${selectedRack.id}-${simLevelId}`);
    }

    // 2. PICKING (OUTBOUND)
    if (simMode === 'PICKING') {
      const sourceLevel = selectedRack.levels.find((l) => l.levelId === simLevelId);
      const storedItem = sourceLevel?.items.find((i) => i.sku === simSku);

      if (!storedItem || storedItem.quantity < qty) {
        setSimError(
          `Insufficient Stock! ${selectedRack.id}-${simLevelId} only has ${storedItem ? storedItem.quantity : 0} ${product.uom} of ${simSku}.`
        );
        return;
      }

      setRacksData((prev) =>
        prev.map((rack) => {
          if (rack.id !== selectedRack.id) return rack;
          return {
            ...rack,
            levels: rack.levels.map((lvl) => {
              if (lvl.levelId !== simLevelId) return lvl;
              const updatedItems = lvl.items
                .map((i) => (i.sku === simSku ? { ...i, quantity: i.quantity - qty } : i))
                .filter((i) => i.quantity > 0);
              return { ...lvl, items: updatedItems };
            })
          };
        })
      );

      setLogs((prev) => [
        {
          id: `LOG-${Date.now()}`,
          timestamp: nowTime,
          action: 'PICKING',
          sku: simSku,
          quantity: qty,
          volumeM3: moveVolumeM3,
          fromLocation: `${selectedRack.id}-${simLevelId}`
        },
        ...prev
      ]);

      showToast(`Picked -${qty} ${product.uom} (${moveVolumeM3} m³) from ${selectedRack.id}-${simLevelId}`);
    }

    // 3. RELOCATION (INTER-RACK / INTER-LEVEL TRANSFER)
    if (simMode === 'RELOCATION') {
      const sourceLoc = `${selectedRack.id}-${simLevelId}`;
      const destLoc = `${targetRackId}-${targetLevelId}`;

      if (sourceLoc === destLoc) {
        setSimError('Source and Destination location cannot be identical (BR-008).');
        return;
      }

      const sourceLevel = selectedRack.levels.find((l) => l.levelId === simLevelId);
      const storedItem = sourceLevel?.items.find((i) => i.sku === simSku);
      if (!storedItem || storedItem.quantity < qty) {
        setSimError(
          `Insufficient Stock in ${sourceLoc}! Available: ${storedItem ? storedItem.quantity : 0} ${product.uom}.`
        );
        return;
      }

      const destRack = enrichedRacks.find((r) => r.id === targetRackId);
      const destLevel = destRack?.levels.find((l) => l.levelId === targetLevelId);
      if (!destLevel) {
        setSimError('Destination level not found.');
        return;
      }

      if (destLevel.occupiedVolumeM3 + moveVolumeM3 > destLevel.maxVolumeM3 + 0.001) {
        setSimError(
          `Destination Full! ${destLoc} only has ${destLevel.availableVolumeM3} m³ free (needs ${moveVolumeM3} m³).`
        );
        return;
      }

      setRacksData((prev) =>
        prev.map((rack) => {
          let updatedLevels = rack.levels;

          // Deduct from source
          if (rack.id === selectedRack.id) {
            updatedLevels = updatedLevels.map((lvl) => {
              if (lvl.levelId !== simLevelId) return lvl;
              const itemsAfterDeduct = lvl.items
                .map((i) => (i.sku === simSku ? { ...i, quantity: i.quantity - qty } : i))
                .filter((i) => i.quantity > 0);
              return { ...lvl, items: itemsAfterDeduct };
            });
          }

          // Add to destination
          if (rack.id === targetRackId) {
            updatedLevels = updatedLevels.map((lvl) => {
              if (lvl.levelId !== targetLevelId) return lvl;
              const existingIdx = lvl.items.findIndex((i) => i.sku === simSku);
              const itemsAfterAdd = [...lvl.items];
              if (existingIdx >= 0) {
                itemsAfterAdd[existingIdx] = {
                  ...itemsAfterAdd[existingIdx],
                  quantity: itemsAfterAdd[existingIdx].quantity + qty
                };
              } else {
                itemsAfterAdd.push({ sku: simSku, quantity: qty });
              }
              return { ...lvl, items: itemsAfterAdd };
            });
          }

          return { ...rack, levels: updatedLevels };
        })
      );

      setLogs((prev) => [
        {
          id: `LOG-${Date.now()}`,
          timestamp: nowTime,
          action: 'RELOCATION',
          sku: simSku,
          quantity: qty,
          volumeM3: moveVolumeM3,
          fromLocation: sourceLoc,
          toLocation: destLoc
        },
        ...prev
      ]);

      showToast(`Relocated ${qty} ${product.uom} (${moveVolumeM3} m³): ${sourceLoc} → ${destLoc}`);
    }
  };

  // ============================================================================
  // 5. SVG PAN & ZOOM HANDLERS
  // ============================================================================

  const handleMouseDown = (e) => {
    if (e.target.closest('.rack-node')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetCamera = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Check if rack matches active filters/search
  const isRackHighlighted = (rack) => {
    const statusObj = getStatusConfig(rack.utilization);
    if (zoneFilter !== 'ALL' && rack.zoneId !== zoneFilter) return false;
    if (statusFilter !== 'ALL' && statusObj.key !== statusFilter) return false;

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchId = rack.id.toLowerCase().includes(q);
      const matchSku = rack.levels.some((lvl) =>
        lvl.items.some(
          (i) =>
            i.sku.toLowerCase().includes(q) ||
            (PRODUCT_MAP[i.sku]?.name.toLowerCase().includes(q) ?? false)
        )
      );
      return matchId || matchSku;
    }

    return true;
  };

  // ============================================================================
  // 6. INVENTORY EXPLORER & ANALYTICS AGGREGATIONS
  // ============================================================================

  const inventorySummary = useMemo(() => {
    return PRODUCT_MASTER.map((prod) => {
      let totalQty = 0;
      const locations = [];

      enrichedRacks.forEach((rack) => {
        rack.levels.forEach((lvl) => {
          const found = lvl.items.find((i) => i.sku === prod.sku);
          if (found && found.quantity > 0) {
            totalQty += found.quantity;
            locations.push({
              rackId: rack.id,
              levelId: lvl.levelId,
              quantity: found.quantity,
              volumeM3: Math.round(found.quantity * prod.unitVolumeM3 * 100) / 100
            });
          }
        });
      });

      return {
        ...prod,
        totalQty,
        totalVolumeM3: Math.round(totalQty * prod.unitVolumeM3 * 100) / 100,
        locations
      };
    }).filter((item) => {
      if (invCategory !== 'ALL' && item.category !== invCategory) return false;
      if (invSearch.trim() !== '') {
        const q = invSearch.toLowerCase();
        return item.sku.toLowerCase().includes(q) || item.name.toLowerCase().includes(q);
      }
      return true;
    });
  }, [enrichedRacks, invCategory, invSearch]);

  const zoneAnalytics = useMemo(() => {
    return ZONES.map((z) => {
      const zoneRacks = enrichedRacks.filter((r) => r.zoneId === z.id);
      const maxM3 = zoneRacks.reduce((s, r) => s + r.maxVolumeM3, 0);
      const occM3 = Math.round(zoneRacks.reduce((s, r) => s + r.occupiedVolumeM3, 0) * 10) / 10;
      const availM3 = Math.max(0, Math.round((maxM3 - occM3) * 10) / 10);
      const util = maxM3 > 0 ? Math.round((occM3 / maxM3) * 1000) / 10 : 0;
      return { ...z, maxM3, occM3, availM3, util };
    });
  }, [enrichedRacks]);

  const statusDistribution = useMemo(() => {
    const counts = {
      EMPTY: 0,
      AVAILABLE: 0,
      HIGH_OCCUPANCY: 0,
      NEAR_FULL: 0,
      FULL: 0
    };
    enrichedRacks.forEach((r) => {
      const st = getStatusConfig(r.utilization).key;
      counts[st]++;
    });
    return counts;
  }, [enrichedRacks]);

  const handleExportCsv = () => {
    const headers = ['Rack ID', 'Zone', 'Rack Type', 'Max Volume (m3)', 'Occupied Volume (m3)', 'Available Volume (m3)', 'Utilization (%)', 'Status'];
    const rows = enrichedRacks.map((r) => {
      const zName = ZONES.find((z) => z.id === r.zoneId)?.shortName || r.zoneId;
      const statusLabel = getStatusConfig(r.utilization).label;
      return [r.id, zName, r.rackType, r.maxVolumeM3, r.occupiedVolumeM3, r.availableVolumeM3, `${r.utilization}%`, statusLabel];
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PrimaTech_Warehouse_Analytics_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Warehouse Volumetric Analytics exported to CSV.');
  };

  // ============================================================================
  // 7. RENDER UI
  // ============================================================================

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all ${
            toast.type === 'info'
              ? 'bg-slate-900 text-white border-slate-700'
              : 'bg-emerald-900 text-white border-emerald-700'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* TOP HEADER & NAVIGATION */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center shadow-md">
              <Warehouse className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-sm sm:text-base">
                  Prima Technology
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  WMS PROTOTYPE v2.0
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Interactive Warehouse Layout Simulator (2D Top-Down & Volumetric m³)
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/80">
            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'map'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>2D Floor Map & Simulator</span>
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'inventory'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Inventory Explorer</span>
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'analytics'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </button>
          </nav>

          {/* Reset Simulation Action */}
          <button
            onClick={handleResetSimulation}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-rose-950/70 text-slate-200 hover:text-rose-300 border border-slate-700 hover:border-rose-800 transition-colors"
            title="Reset all simulated changes to initial seed JSON"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reset Simulation</span>
          </button>
        </div>
      </header>

      {/* VOLUMETRIC KPI SUMMARY BAR */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3.5">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                  Racks & Shelf Levels
                </p>
                <p className="text-lg font-bold text-slate-900 mt-0.5">
                  {globalKpis.totalRacks} <span className="text-xs font-normal text-slate-500">Racks</span> /{' '}
                  {globalKpis.totalLevels} <span className="text-xs font-normal text-slate-500">Levels</span>
                </p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                  Total Capacity
                </p>
                <p className="text-lg font-bold text-slate-900 mt-0.5">
                  {globalKpis.totalCapacityM3} <span className="text-xs font-semibold text-slate-500">m³</span>
                </p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <Box className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                  Occupied Volume
                </p>
                <p className="text-lg font-bold text-amber-600 mt-0.5">
                  {globalKpis.occupiedVolumeM3} <span className="text-xs font-semibold text-slate-500">m³</span>
                </p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200/80 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                  Available Volume
                </p>
                <p className="text-lg font-bold text-emerald-600 mt-0.5">
                  {globalKpis.availableVolumeM3} <span className="text-xs font-semibold text-slate-500">m³</span>
                </p>
              </div>
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-slate-50 rounded-xl p-3 border border-slate-200/80 flex flex-col justify-center">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                  Overall Utilization
                </span>
                <span className="text-sm font-bold text-slate-900">{globalKpis.utilization}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-300"
                  style={{ width: `${Math.min(100, globalKpis.utilization)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================================== */}
      {/* VIEW 1: 2D FLOOR MAP & RACK DETAIL/SIMULATION DRAWER                 */}
      {/* ==================================================================== */}
      {activeTab === 'map' && (
        <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 py-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* LEFT / CENTER: 2D TOP-DOWN SVG CANVAS */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
            {/* Toolbar: Search, Filters, Heatmap Toggle */}
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[240px]">
                {/* Search */}
                <div className="relative flex-1 min-w-[180px] max-w-xs">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search Rack ID or SKU..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Zone Filter */}
                <div className="flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={zoneFilter}
                    onChange={(e) => setZoneFilter(e.target.value)}
                    className="text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ALL">All Zones</option>
                    {ZONES.map((z) => (
                      <option key={z.id} value={z.id}>
                        {z.shortName}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="EMPTY">Empty (0%)</option>
                  <option value="AVAILABLE">Available (1–69%)</option>
                  <option value="HIGH_OCCUPANCY">High (70–89%)</option>
                  <option value="NEAR_FULL">Near Full (90–99%)</option>
                  <option value="FULL">Full (100%)</option>
                </select>
              </div>

              {/* Heatmap Mode Toggle */}
              <button
                onClick={() => setHeatmapMode(!heatmapMode)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  heatmapMode
                    ? 'bg-orange-500 text-white border-orange-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Flame className={`w-4 h-4 ${heatmapMode ? 'text-yellow-200' : 'text-orange-500'}`} />
                <span>Heatmap Mode: {heatmapMode ? 'ON' : 'OFF'}</span>
              </button>
            </div>

            {/* Interactive SVG Map Container */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col relative flex-1 min-h-[520px]">
              {/* Map Top Overlay Legend */}
              <div className="px-4 py-2.5 bg-slate-50/90 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 font-medium text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>2D Top-Down Floor Plan (Click any rack to inspect shelf levels)</span>
                </div>

                {/* Legend */}
                {!heatmapMode ? (
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#94A3B8]" /> Empty (0%)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#10B981]" /> Available (1–69%)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#F59E0B]" /> High (70–89%)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#F97316]" /> Near Full (90–99%)
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#EF4444]" /> Full (100%)
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">Low Density (0 m³)</span>
                    <div className="w-28 h-2.5 rounded-full bg-gradient-to-r from-slate-200 via-emerald-400 via-yellow-400 to-red-600" />
                    <span className="text-slate-500">High Density (Max m³)</span>
                  </div>
                )}
              </div>

              {/* Zoom / Pan Floating Controls */}
              <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1 bg-white/95 backdrop-blur p-1 rounded-lg border border-slate-200 shadow-md">
                <button
                  onClick={() => setZoom((z) => Math.min(1.8, +(z + 0.15).toFixed(2)))}
                  className="p-1.5 hover:bg-slate-100 rounded text-slate-700"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <span className="text-xs font-semibold px-1.5 text-slate-600">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={() => setZoom((z) => Math.max(0.65, +(z - 0.15).toFixed(2)))}
                  className="p-1.5 hover:bg-slate-100 rounded text-slate-700"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <div className="w-px h-4 bg-slate-200 mx-0.5" />
                <button
                  onClick={resetCamera}
                  className="p-1.5 hover:bg-slate-100 rounded text-slate-700"
                  title="Reset View"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>

              {/* Hover Tooltip */}
              {hoveredRack && (
                <div className="absolute top-14 right-4 z-10 bg-slate-900/95 text-white px-3.5 py-2.5 rounded-xl shadow-lg border border-slate-700 text-xs pointer-events-none">
                  <div className="flex items-center justify-between gap-4 mb-1">
                    <span className="font-bold text-sm text-blue-300">Rack {hoveredRack.id}</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px]">
                      {hoveredRack.rackType}
                    </span>
                  </div>
                  <p className="text-slate-300">
                    Volume: <strong className="text-white">{hoveredRack.occupiedVolumeM3}</strong> /{' '}
                    {hoveredRack.maxVolumeM3} m³ ({hoveredRack.utilization}%)
                  </p>
                  <p className="text-slate-400 mt-0.5">
                    Levels: {hoveredRack.levels.map((l) => `${l.levelId}:${l.utilization}%`).join(' | ')}
                  </p>
                </div>
              )}

              {/* SVG FLOOR PLAN */}
              <div
                className="flex-1 bg-[#f8fafc] cursor-grab active:cursor-grabbing select-none overflow-hidden flex items-center justify-center"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <svg
                  viewBox="0 0 910 540"
                  className="w-full h-full max-h-[560px]"
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                    transformOrigin: 'center center',
                    transition: isDragging ? 'none' : 'transform 0.15s ease-out'
                  }}
                >
                  {/* Background Grid Pattern */}
                  <defs>
                    <pattern id="warehouseGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path
                        d="M 20 0 L 0 0 0 20"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="0.8"
                      />
                    </pattern>
                  </defs>
                  <rect width="910" height="540" fill="url(#warehouseGrid)" />

                  {/* Outer Warehouse Wall */}
                  <rect
                    x="20"
                    y="20"
                    width="870"
                    height="500"
                    rx="12"
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="3"
                  />

                  {/* Top Operational Docks */}
                  <g>
                    <rect
                      x="40"
                      y="32"
                      width="210"
                      height="36"
                      rx="6"
                      fill="#dbeafe"
                      stroke="#3b82f6"
                      strokeDasharray="4 2"
                    />
                    <text
                      x="145"
                      y="54"
                      textAnchor="middle"
                      className="text-[11px] font-bold fill-blue-800"
                    >
                      ⬇ RECEIVING / INBOUND DOCK
                    </text>

                    <rect
                      x="330"
                      y="32"
                      width="250"
                      height="36"
                      rx="6"
                      fill="#f1f5f9"
                      stroke="#cbd5e1"
                    />
                    <text
                      x="455"
                      y="54"
                      textAnchor="middle"
                      className="text-[11px] font-semibold fill-slate-500"
                    >
                      STAGING & QUALITY INSPECTION AREA
                    </text>

                    <rect
                      x="660"
                      y="32"
                      width="210"
                      height="36"
                      rx="6"
                      fill="#dcfce7"
                      stroke="#10b981"
                      strokeDasharray="4 2"
                    />
                    <text
                      x="765"
                      y="54"
                      textAnchor="middle"
                      className="text-[11px] font-bold fill-emerald-800"
                    >
                      ⬆ SHIPPING / DISPATCH DOCK
                    </text>
                  </g>

                  {/* 3 WAREHOUSE ZONES */}
                  {ZONES.map((zone) => (
                    <g key={zone.id}>
                      <rect
                        x={zone.bounds.x}
                        y={zone.bounds.y}
                        width={zone.bounds.width}
                        height={zone.bounds.height}
                        rx="10"
                        fill={zone.bgTint}
                        stroke={zone.color}
                        strokeWidth="1.5"
                        strokeDasharray="6 3"
                      />
                      <text
                        x={zone.bounds.x + 12}
                        y={zone.bounds.y + 22}
                        className="text-[12px] font-bold"
                        fill={zone.color}
                      >
                        {zone.name}
                      </text>
                      {/* Main Aisle Label inside Zone */}
                      <text
                        x={zone.bounds.x + zone.bounds.width / 2}
                        y={zone.bounds.y + 188}
                        textAnchor="middle"
                        className="text-[10px] font-semibold fill-slate-400 tracking-widest"
                      >
                        — FORKLIFT AISLE —
                      </text>
                    </g>
                  ))}

                  {/* INTERACTIVE RACK NODES */}
                  {enrichedRacks.map((rack) => {
                    const isSelected = rack.id === selectedRackId;
                    const highlighted = isRackHighlighted(rack);
                    const statusCfg = getStatusConfig(rack.utilization);
                    const fillColor = heatmapMode
                      ? getHeatmapColor(rack.utilization)
                      : statusCfg.hex;

                    return (
                      <g
                        key={rack.id}
                        className="rack-node cursor-pointer transition-opacity duration-200"
                        style={{ opacity: highlighted ? 1 : 0.22 }}
                        onClick={() => handleSelectRack(rack.id)}
                        onMouseEnter={() => setHoveredRack(rack)}
                        onMouseLeave={() => setHoveredRack(null)}
                      >
                        {/* Selection Halo */}
                        {isSelected && (
                          <rect
                            x={rack.position.x - 5}
                            y={rack.position.y - 5}
                            width={rack.position.width + 10}
                            height={rack.position.height + 10}
                            rx="10"
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
                          rx="7"
                          fill={fillColor}
                          stroke={isSelected ? '#1e3a8a' : '#1e293b'}
                          strokeWidth={isSelected ? '2.5' : '1.2'}
                        />

                        {/* Rack ID Header Pill */}
                        <rect
                          x={rack.position.x + 6}
                          y={rack.position.y + 6}
                          width={rack.position.width - 12}
                          height="22"
                          rx="4"
                          fill="rgba(15, 23, 42, 0.82)"
                        />
                        <text
                          x={rack.position.x + rack.position.width / 2}
                          y={rack.position.y + 21}
                          textAnchor="middle"
                          className="text-[11px] font-bold fill-white"
                        >
                          {rack.id} ({rack.levels.length}L)
                        </text>

                        {/* Utilization Percentage */}
                        <text
                          x={rack.position.x + rack.position.width / 2}
                          y={rack.position.y + 52}
                          textAnchor="middle"
                          className="text-[15px] font-extrabold"
                          fill={rack.utilization === 0 && !heatmapMode ? '#1e293b' : '#ffffff'}
                        >
                          {rack.utilization}%
                        </text>

                        {/* Volume m3 Subtext */}
                        <text
                          x={rack.position.x + rack.position.width / 2}
                          y={rack.position.y + 68}
                          textAnchor="middle"
                          className="text-[9.5px] font-semibold"
                          fill={rack.utilization === 0 && !heatmapMode ? '#334155' : 'rgba(255,255,255,0.92)'}
                        >
                          {rack.occupiedVolumeM3}/{rack.maxVolumeM3} m³
                        </text>

                        {/* Mini 3-Level Visual Bars at Bottom of Rack Node */}
                        <g transform={`translate(${rack.position.x + 8}, ${rack.position.y + 80})`}>
                          {rack.levels.map((lvl, idx) => (
                            <g key={lvl.levelId} transform={`translate(0, ${idx * 10})`}>
                              <rect
                                x="0"
                                y="0"
                                width={rack.position.width - 16}
                                height="6"
                                rx="2"
                                fill="rgba(15, 23, 42, 0.35)"
                              />
                              <rect
                                x="0"
                                y="0"
                                width={((rack.position.width - 16) * Math.min(100, lvl.utilization)) / 100}
                                height="6"
                                rx="2"
                                fill="#ffffff"
                              />
                            </g>
                          ))}
                        </g>

                        {/* Warning Badge if any single level is 100% Full */}
                        {rack.hasFullLevel && rack.utilization < 100 && (
                          <g transform={`translate(${rack.position.x + rack.position.width - 14}, ${rack.position.y - 4})`}>
                            <circle cx="8" cy="8" r="8" fill="#ef4444" stroke="#fff" strokeWidth="1.5" />
                            <text x="8" y="11.5" textAnchor="middle" className="text-[10px] font-bold fill-white">
                              !
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}

                  {/* Bottom Main Corridor Label */}
                  <rect
                    x="40"
                    y="472"
                    width="830"
                    height="32"
                    rx="6"
                    fill="#f1f5f9"
                    stroke="#cbd5e1"
                  />
                  <text
                    x="455"
                    y="492"
                    textAnchor="middle"
                    className="text-[11px] font-semibold fill-slate-500 tracking-wider"
                  >
                    MAIN CROSS-DOCKING & AGV TRANSPORT CORRIDOR
                  </text>
                </svg>
              </div>
            </div>

            {/* LIVE SIMULATION ACTIVITY LOG */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-800">
                    Simulation Activity Log (Session History)
                  </h3>
                </div>
                <span className="text-xs text-slate-500">{logs.length} transactions</span>
              </div>
              <div className="max-h-36 overflow-y-auto divide-y divide-slate-100 text-xs">
                {logs.map((log) => {
                  const prod = PRODUCT_MAP[log.sku];
                  return (
                    <div key={log.id} className="py-2 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-slate-400">{log.timestamp}</span>
                        <span
                          className={`px-2 py-0.5 rounded font-semibold text-[10px] ${
                            log.action === 'RECEIVING'
                              ? 'bg-emerald-100 text-emerald-700'
                              : log.action === 'PICKING'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {log.action}
                        </span>
                        <span className="font-semibold text-slate-800">
                          {log.sku} ({prod?.name})
                        </span>
                      </div>
                      <div className="text-right text-slate-600">
                        <span className="font-bold text-slate-900">
                          {log.quantity} {prod?.uom}
                        </span>{' '}
                        ({log.volumeM3} m³) —{' '}
                        <span className="font-mono font-semibold text-blue-600">
                          {log.action === 'RELOCATION'
                            ? `${log.fromLocation} → ${log.toLocation}`
                            : log.toLocation || log.fromLocation}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE PANEL: RACK & MULTI-LEVEL INSPECTOR + QUICK SIMULATOR */}
          <aside className="lg:col-span-5 xl:col-span-4 flex flex-col gap-4">
            {selectedRack ? (
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                {/* Drawer Header */}
                <div className="p-4 bg-slate-900 text-white flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold">Rack {selectedRack.id}</h2>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-bold text-white ${
                          getStatusConfig(selectedRack.utilization).badgeBg
                        }`}
                      >
                        {getStatusConfig(selectedRack.utilization).label} ({selectedRack.utilization}%)
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {ZONES.find((z) => z.id === selectedRack.zoneId)?.name} • {selectedRack.rackType}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedRackId(null)}
                    className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Rack Volumetric Summary */}
                <div className="p-4 bg-slate-50 border-b border-slate-200">
                  <div className="grid grid-cols-3 gap-2 text-center mb-2.5">
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <p className="text-[10px] text-slate-500 uppercase">Max Volume</p>
                      <p className="text-sm font-bold text-slate-900">{selectedRack.maxVolumeM3} m³</p>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <p className="text-[10px] text-slate-500 uppercase">Occupied</p>
                      <p className="text-sm font-bold text-amber-600">{selectedRack.occupiedVolumeM3} m³</p>
                    </div>
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <p className="text-[10px] text-slate-500 uppercase">Available</p>
                      <p className="text-sm font-bold text-emerald-600">{selectedRack.availableVolumeM3} m³</p>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, selectedRack.utilization)}%`,
                        backgroundColor: getStatusConfig(selectedRack.utilization).hex
                      }}
                    />
                  </div>
                </div>

                {/* Multi-Level Shelf Breakdown (L3 Top -> L1 Ground) */}
                <div className="p-4 border-b border-slate-200">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-600" />
                    Multi-Level Shelf Breakdown (m³)
                  </h3>

                  <div className="space-y-3">
                    {[...selectedRack.levels].reverse().map((lvl) => {
                      const lvlStatus = getStatusConfig(lvl.utilization);
                      return (
                        <div
                          key={lvl.levelId}
                          className={`p-3 rounded-xl border transition-all ${
                            simLevelId === lvl.levelId
                              ? 'border-blue-400 bg-blue-50/30'
                              : 'border-slate-200 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded bg-slate-800 text-white text-xs font-bold">
                                {selectedRack.id}-{lvl.levelId}
                              </span>
                              <span className="text-xs font-medium text-slate-500">
                                {lvl.levelNumber === 1
                                  ? 'Ground Level'
                                  : lvl.levelNumber === 2
                                  ? 'Middle Shelf'
                                  : 'Top Shelf'}
                              </span>
                            </div>
                            <span className={`text-xs font-bold ${lvlStatus.textClass}`}>
                              {lvl.occupiedVolumeM3} / {lvl.maxVolumeM3} m³ ({lvl.utilization}%)
                            </span>
                          </div>

                          {/* Level Progress Bar */}
                          <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-2">
                            <div
                              className="h-full transition-all duration-300"
                              style={{
                                width: `${Math.min(100, lvl.utilization)}%`,
                                backgroundColor: lvlStatus.hex
                              }}
                            />
                          </div>

                          {/* Stored SKUs inside Level */}
                          {lvl.items.length === 0 ? (
                            <p className="text-[11px] italic text-slate-400">Empty shelf slot</p>
                          ) : (
                            <div className="space-y-1">
                              {lvl.items.map((item) => {
                                const prod = PRODUCT_MAP[item.sku];
                                const itemVol = Math.round(item.quantity * (prod?.unitVolumeM3 || 0) * 100) / 100;
                                return (
                                  <div
                                    key={item.sku}
                                    className="flex items-center justify-between text-xs bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100"
                                  >
                                    <div>
                                      <span className="font-semibold text-slate-800">{item.sku}</span>
                                      <span className="text-slate-500 ml-1.5">{prod?.name}</span>
                                    </div>
                                    <div className="text-right font-medium">
                                      <span className="text-slate-900">
                                        {item.quantity} {prod?.uom}
                                      </span>
                                      <span className="text-slate-400 ml-1">({itemVol} m³)</span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* OPERATIONAL SIMULATION SANDBOX FORM */}
                <div className="p-4 bg-slate-50/70">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                    Warehouse Operations Simulator
                  </h3>

                  {/* Mode Switcher */}
                  <div className="grid grid-cols-3 gap-1.5 bg-slate-200/80 p-1 rounded-xl mb-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSimMode('RECEIVING');
                        setSimError('');
                      }}
                      className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        simMode === 'RECEIVING'
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <ArrowDownToLine className="w-3.5 h-3.5" />
                      <span>Receiving</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSimMode('PICKING');
                        setSimError('');
                      }}
                      className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        simMode === 'PICKING'
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <ArrowUpFromLine className="w-3.5 h-3.5" />
                      <span>Picking</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSimMode('RELOCATION');
                        setSimError('');
                      }}
                      className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        simMode === 'RELOCATION'
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <ArrowLeftRight className="w-3.5 h-3.5" />
                      <span>Relocate</span>
                    </button>
                  </div>

                  <form onSubmit={executeSimulation} className="space-y-3 text-xs">
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="block font-semibold text-slate-600 mb-1">
                          {simMode === 'RECEIVING' ? 'Target Level' : 'Source Level'}
                        </label>
                        <select
                          value={simLevelId}
                          onChange={(e) => setSimLevelId(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {selectedRack.levels.map((l) => (
                            <option key={l.levelId} value={l.levelId}>
                              {selectedRack.id}-{l.levelId} (Free: {l.availableVolumeM3} m³)
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-600 mb-1">Quantity (UOM)</label>
                        <input
                          type="number"
                          min="1"
                          value={simQty}
                          onChange={(e) => setSimQty(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-600 mb-1">Select Product / SKU</label>
                      <select
                        value={simSku}
                        onChange={(e) => setSimSku(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {PRODUCT_MASTER.map((p) => (
                          <option key={p.sku} value={p.sku}>
                            {p.sku} — {p.name} ({p.unitVolumeM3} m³/{p.uom})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Destination Selector for Relocation */}
                    {simMode === 'RELOCATION' && (
                      <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 grid grid-cols-2 gap-2">
                        <div>
                          <label className="block font-semibold text-blue-900 mb-1">
                            Destination Rack
                          </label>
                          <select
                            value={targetRackId}
                            onChange={(e) => setTargetRackId(e.target.value)}
                            className="w-full bg-white border border-blue-300 rounded-lg px-2 py-1.5 font-medium"
                          >
                            {enrichedRacks.map((r) => (
                              <option key={r.id} value={r.id}>
                                {r.id} ({r.availableVolumeM3} m³ free)
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block font-semibold text-blue-900 mb-1">
                            Destination Level
                          </label>
                          <select
                            value={targetLevelId}
                            onChange={(e) => setTargetLevelId(e.target.value)}
                            className="w-full bg-white border border-blue-300 rounded-lg px-2 py-1.5 font-medium"
                          >
                            <option value="L1">Level 1 (Ground)</option>
                            <option value="L2">Level 2 (Middle)</option>
                            <option value="L3">Level 3 (Top)</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Volume Impact Preview */}
                    <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-100 text-slate-600">
                      <span>Calculated Volume Impact:</span>
                      <span className="font-bold text-slate-900">
                        {Math.round((Number(simQty) || 0) * (PRODUCT_MAP[simSku]?.unitVolumeM3 || 0) * 100) / 100}{' '}
                        m³
                      </span>
                    </div>

                    {/* Validation Guard Error Alert */}
                    {simError && (
                      <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                        <span>{simError}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className={`w-full py-2.5 rounded-xl font-bold text-white shadow-sm transition-all ${
                        simMode === 'RECEIVING'
                          ? 'bg-emerald-600 hover:bg-emerald-700'
                          : simMode === 'PICKING'
                          ? 'bg-amber-600 hover:bg-amber-700'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {simMode === 'RECEIVING' && `Confirm Putaway to ${selectedRack.id}-${simLevelId}`}
                      {simMode === 'PICKING' && `Confirm Picking from ${selectedRack.id}-${simLevelId}`}
                      {simMode === 'RELOCATION' &&
                        `Transfer ${selectedRack.id}-${simLevelId} → ${targetRackId}-${targetLevelId}`}
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center flex flex-col items-center justify-center h-full">
                <Info className="w-10 h-10 text-slate-300 mb-3" />
                <h3 className="font-bold text-slate-700">No Rack Selected</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Click any rack on the 2D Warehouse Map to inspect shelf levels (m³) and run operational simulations.
                </p>
              </div>
            )}
          </aside>
        </main>
      )}

      {/* ==================================================================== */}
      {/* VIEW 2: INVENTORY EXPLORER (MULTI-RACK & LEVEL TRACKING)             */}
      {/* ==================================================================== */}
      {activeTab === 'inventory' && (
        <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 py-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Inventory Explorer & Multi-Level Location Mapping
                </h2>
                <p className="text-xs text-slate-500">
                  Click any location badge (e.g., A-01-L1) to jump directly to the rack on the 2D floor map.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={invSearch}
                    onChange={(e) => setInvSearch(e.target.value)}
                    placeholder="Search SKU or Product..."
                    className="pl-9 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={invCategory}
                  onChange={(e) => setInvCategory(e.target.value)}
                  className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">All Categories</option>
                  <option value="Raw Materials">Raw Materials</option>
                  <option value="Finished Goods">Finished Goods</option>
                  <option value="Packing Materials">Packing Materials</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase text-slate-500">
                    <th className="py-3 px-4">SKU Code</th>
                    <th className="py-3 px-4">Product Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4 text-right">Unit Vol (m³)</th>
                    <th className="py-3 px-4 text-right">Total Stock</th>
                    <th className="py-3 px-4 text-right">Total Vol (m³)</th>
                    <th className="py-3 px-4">Stored Rack & Shelf Locations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inventorySummary.map((item) => (
                    <tr key={item.sku} className="hover:bg-slate-50/80">
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-700">{item.sku}</td>
                      <td className="py-3.5 px-4 font-medium text-slate-900">{item.name}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-slate-600">
                        {item.unitVolumeM3} m³
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                        {item.totalQty} {item.uom}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-emerald-700">
                        {item.totalVolumeM3} m³
                      </td>
                      <td className="py-3.5 px-4">
                        {item.locations.length === 0 ? (
                          <span className="text-xs italic text-slate-400">Out of stock</span>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {item.locations.map((loc, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  handleSelectRack(loc.rackId);
                                  setActiveTab('map');
                                }}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 transition-colors"
                              >
                                <span className="font-bold">
                                  {loc.rackId}-{loc.levelId}
                                </span>
                                <span className="text-blue-600">
                                  ({loc.quantity} {item.uom} • {loc.volumeM3} m³)
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      )}

      {/* ==================================================================== */}
      {/* VIEW 3: WAREHOUSE ANALYTICS & CSV EXPORT (PHASE 3 SHOWCASE)          */}
      {/* ==================================================================== */}
      {activeTab === 'analytics' && (
        <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Volumetric Capacity Analytics & Space Utilization
              </h2>
              <p className="text-xs text-slate-500">
                Real-time space efficiency metrics across zones and multi-level racks.
              </p>
            </div>
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export Analytics to CSV</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Storage Utilization by Zone */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 mb-4">
                Storage Utilization by Zone (m³ Occupied vs Available)
              </h3>
              <div className="space-y-4">
                {zoneAnalytics.map((z) => (
                  <div key={z.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">{z.name}</span>
                      <span className="font-semibold text-slate-600">
                        {z.occM3} / {z.maxM3} m³ ({z.util}%)
                      </span>
                    </div>
                    <div className="w-full h-4 bg-slate-100 rounded-lg overflow-hidden flex border border-slate-200">
                      <div
                        className="h-full transition-all duration-300"
                        style={{ width: `${z.util}%`, backgroundColor: z.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rack Occupancy Status Distribution */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 mb-4">
                Rack Occupancy Status Breakdown ({globalKpis.totalRacks} Total Racks)
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { key: 'EMPTY', label: 'Empty (0%)', color: 'bg-slate-400' },
                  { key: 'AVAILABLE', label: 'Available', color: 'bg-emerald-500' },
                  { key: 'HIGH_OCCUPANCY', label: 'High (70-89%)', color: 'bg-amber-500' },
                  { key: 'NEAR_FULL', label: 'Near Full', color: 'bg-orange-500' },
                  { key: 'FULL', label: 'Full (100%)', color: 'bg-red-500' }
                ].map((st) => (
                  <div
                    key={st.key}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center"
                  >
                    <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${st.color}`} />
                    <p className="text-2xl font-extrabold text-slate-900">
                      {statusDistribution[st.key]}
                    </p>
                    <p className="text-[11px] font-medium text-slate-500 mt-0.5">{st.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Occupied Racks Ranking */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-3">
              Rack Utilization Ranking (Highest to Lowest Volume %)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {[...enrichedRacks]
                .sort((a, b) => b.utilization - a.utilization)
                .map((rack, index) => {
                  const st = getStatusConfig(rack.utilization);
                  return (
                    <div
                      key={rack.id}
                      onClick={() => {
                        handleSelectRack(rack.id);
                        setActiveTab('map');
                      }}
                      className="p-3 rounded-xl border border-slate-200 hover:border-blue-400 cursor-pointer transition-all bg-slate-50/50 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center">
                          #{index + 1}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{rack.id}</p>
                          <p className="text-[11px] text-slate-500">
                            {rack.occupiedVolumeM3}/{rack.maxVolumeM3} m³
                          </p>
                        </div>
                      </div>
                      <span
                        className="px-2 py-1 rounded-lg text-xs font-bold text-white"
                        style={{ backgroundColor: st.hex }}
                      >
                        {rack.utilization}%
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </main>
      )}
    </div>
  );
}