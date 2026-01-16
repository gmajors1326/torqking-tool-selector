// Hydraulic power system reference data
// These pumps power the hydraulic torque wrenches and tensioners

export interface HydraulicPowerSystem {
  id: string;
  name: string;
  brand: "HexPro" | "MaxDRV" | "PWRPAX";
  model: string;
  notes?: string[];
}

export const HYDRAULIC_POWER_SYSTEMS: HydraulicPowerSystem[] = [
  {
    id: "hexpro-hp-500",
    name: "HexPro Pump HP-500",
    brand: "HexPro",
    model: "HP-500"
  },
  {
    id: "hexpro-hp-1500",
    name: "HexPro Pump HP-1500",
    brand: "HexPro",
    model: "HP-1500"
  },
  {
    id: "maxdrv-md-1000",
    name: "MaxDRV Pump MD-1000",
    brand: "MaxDRV",
    model: "MD-1000"
  },
  {
    id: "maxdrv-md-2000",
    name: "MaxDRV Pump MD-2000",
    brand: "MaxDRV",
    model: "MD-2000"
  },
  {
    id: "pwrpax-px-1000",
    name: "PWRPAX Pump PX-1000",
    brand: "PWRPAX",
    model: "PX-1000"
  },
  {
    id: "pwrpax-px-3000",
    name: "PWRPAX Pump PX-3000",
    brand: "PWRPAX",
    model: "PX-3000"
  }
];
