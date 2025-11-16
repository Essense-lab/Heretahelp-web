export const ENGINE_OPTIONS = [
  '1.0L I3',
  '1.2L I3',
  '1.3L I4',
  '1.4L I4',
  '1.5L I4',
  '1.6L I4',
  '1.8L I4',
  '2.0L I4',
  '2.0L I4 Turbo',
  '2.2L I4',
  '2.3L I4',
  '2.4L I4',
  '2.5L I4',
  '2.5L I5',
  '2.5L V6',
  '2.7L V6',
  '2.8L V6',
  '3.0L I6',
  '3.0L V6',
  '3.2L V6',
  '3.3L V6',
  '3.5L V6',
  '3.6L V6',
  '3.7L V6',
  '3.8L V6',
  '3.9L V8',
  '4.0L I6',
  '4.0L V6',
  '4.0L V8',
  '4.2L V8',
  '4.3L V6',
  '4.4L V8',
  '4.8L v8',
  '4.6L V8',
  '4.7L V8',
  '5.0L V8',
  '5.2L V8',
  '5.3L V8',
  '5.4L V8',
  '5.5L V8',
  '5.6L V8',
  '5.7L V8',
  '6.0L V8',
  '6.2L V8',
  '6.4L V8',
  '6.6L V8 Diesel',
  '6.7L I6 Diesel',
  '6.7L V8',
  '6.7L V8 Diesel',
  '6.8L V8',
  '7.0L V8',
  '7.3L V8',
  '7.3L V8 Diesel',
  '8.0L V10',
  '8.4L V10',
  '6.0L V12',
  '1.9L I4 Diesel',
  '2.0L I4 Diesel',
  '2.2L I4 Diesel',
  '2.5L I4 Diesel',
  '2.8L I4 Diesel',
  '3.0L V6 Diesel',
  '3.0L I6 Diesel',
  'Electric Motor',
  'Hybrid',
  'Plug-in Hybrid',
  'Other',
]

export const FUEL_TYPES = [
  'Gasoline',
  'Premium Gasoline',
  'Diesel',
  'Electric',
  'Hybrid',
  'Plug-in Hybrid',
  'Flex Fuel (E85)',
  'Compressed Natural Gas',
  'Hydrogen',
  'Other',
]

export const HOURS_IN_MINUTE = 60
const DEFAULT_LABOR_RATE = 67
const MOBILE_SERVICE_FEE = 49
const LAUNCH_PROMO_DISCOUNT = 25

export const TRANSMISSIONS = [
  'Automatic',
  'Manual',
  'CVT',
  'DCT',
  'Single-Speed',
  'Semi-Automatic',
  'Other',
]

export const DRIVE_TYPES = ['FWD', 'RWD', 'AWD', '4WD', 'Other']

export const BODY_STYLES = [
  'Sedan',
  'Coupe',
  'Hatchback',
  'Wagon',
  'SUV',
  'Crossover',
  'Minivan',
  'Pickup Truck',
  'Convertible',
  'Sports Car',
  'Van',
  'Other',
]

export const DOOR_OPTIONS = ['2 Doors', '3 Doors', '4 Doors', '5 Doors']

export const TRIM_OPTIONS = [
  'Base',
  'S',
  'L',
  'LS',
  'LX',
  'SE',
  'EX',
  'SV',
  'SL',
  'LE',
  'XLE',
  'Sport',
  'Si',
  'Type R',
  'GT',
  'GTS',
  'R/T',
  'SS',
  'RS',
  'ST',
  'SRT',
  'Touring',
  'Limited',
  'Premium',
  'Platinum',
  'Elite',
  'Prestige',
  'Luxury',
  'Denali',
  'King Ranch',
  'Raptor',
  'TRD Pro',
  'Nismo',
  'M Sport',
  'AMG',
  'S-Line',
  'R-Design',
  'F Sport',
  'Hybrid',
  'Plug-in Hybrid',
  'EV',
  'Long Range',
  'Performance',
  'Plaid',
  'XL',
  'XLT',
  'Lariat',
  'LT',
  'LTZ',
  'High Country',
  'Laramie',
  'Rebel',
  'TRD Off-Road',
  'Custom',
]

export const SERVICE_LABEL_MAP = {
  car: 'Car Repair',
  tire: 'Tire Repair',
  wash: 'Mobile Wash',
} as const

export const STEP_DEFINITIONS = [
  { key: 'intro', label: 'Overview' },
  { key: 'agreement', label: 'Service Agreement' },
  { key: 'location', label: 'Location' },
  { key: 'vehicle', label: 'Vehicle' },
  { key: 'services', label: 'Services' },
  { key: 'schedule', label: 'Schedule' },
  { key: 'checkout', label: 'Checkout' },
  { key: 'confirmation', label: 'Confirmation' },
]

export const CAR_ONBOARDING_SERVICES = [
  {
    emoji: '🔧',
    title: 'Engine Repair',
    description: 'Complete engine diagnostics and repairs.',
  },
  {
    emoji: '🛞',
    title: 'Brake Service',
    description: 'Brake pads, rotors, and full brake system care.',
  },
  {
    emoji: '⚙️',
    title: 'Transmission',
    description: 'Transmission repair and preventative maintenance.',
  },
  {
    emoji: '🔋',
    title: 'Battery Service',
    description: 'Battery testing, replacement, and charging support.',
  },
  {
    emoji: '💨',
    title: 'AC Repair',
    description: 'Air conditioning diagnostics and recharge services.',
  },
  {
    emoji: '🔍',
    title: 'Diagnostics',
    description: 'Computer diagnostics and check engine light scanning.',
  },
]

export const CAR_ONBOARDING_BENEFITS = [
  {
    emoji: '🎓',
    title: 'Certified Mechanics',
    description: 'ASE certified and experienced technicians.',
  },
  {
    emoji: '🏠',
    title: 'Mobile Service',
    description: 'We come to your home, office, or roadside location.',
  },
  {
    emoji: '💰',
    title: 'Fair Pricing',
    description: 'Transparent pricing with no hidden fees.',
  },
  {
    emoji: '⚡',
    title: 'Fast Service',
    description: 'Quick turnaround times on most repairs.',
  },
  {
    emoji: '🛡️',
    title: 'Warranty',
    description: 'All work backed by our service guarantee.',
  },
]

export const CAR_REPAIR_AGREEMENT_SECTIONS = [
  {
    title: '1. Service Authorization',
    content:
      'By proceeding, you authorize Here Ta Help and its certified technicians to inspect, diagnose, and perform the agreed-upon repairs or maintenance on your vehicle.',
  },
  {
    title: '2. Estimate and Additional Work',
    content:
      'An initial estimate will be provided before any repair begins.\nIf additional issues are discovered, you will be notified, and no additional work will be performed without your consent.',
  },
  {
    title: '3. Vehicle Location and Accessibility',
    content:
      'You agree to ensure that your vehicle is located in a safe, accessible, and legal area where a technician can perform the required service.\n\nThis includes, but is not limited to:\n• A flat, stable surface (such as a driveway or parking lot)\n• Adequate space around the vehicle for tools and technician access\n• Proper permission to perform work at that location (if not your property)\n\nIf the vehicle is inaccessible, parked illegally, or in an unsafe environment, the technician may decline or postpone service. In such cases, cancellation or rescheduling fees may apply.',
  },
  {
    title: '4. Cancellation and Rescheduling Policy',
    content:
      'Once a service is scheduled, your technician reserves time and travel for your appointment.\n\n• Cancellations made more than 24 hours before your appointment: No fee\n• Cancellations within 24 hours of your scheduled time: 25% of the service fee\n• Cancellations after a technician is en route or on-site: 50% of the service fee\n• Rescheduling within 24 hours may incur a $25 rescheduling fee, depending on technician availability\n• If a technician cannot perform service due to unsafe or inaccessible conditions, the same fees apply\n\nAll fees are deducted automatically from the escrowed amount.',
  },
  {
    title: '5. Customer-Supplied Parts Policy',
    content:
      'Customers may provide their own parts, whether new or used, for service appointments.\n\n• No Warranty on Customer Parts: We do not guarantee, warrant, or assume responsibility for the performance, quality, or effectiveness of any customer-supplied parts.\n• Incorrect Parts: If an incorrect or incompatible part is provided, a $35 fee will be charged to cover the technician\'s time and travel for rescheduling or completing the job.\n• Our Parts Warranty: Only parts provided directly through Here Ta Help or authorized partners are covered under our warranty policy.\n• Responsibility for Compatibility: Customers must ensure all supplied parts are correct and suitable for the vehicle and service.',
  },
  {
    title: '6. Liability and Limitations',
    content:
      'While every precaution is taken during service, Here Ta Help is not responsible for:\n\n• Pre-existing mechanical or electrical issues\n• Hidden defects not visible during inspection\n• Loss, theft, or damage of personal belongings left in the vehicle\n• Failures or damages unrelated to the services performed\n• Any agreements, promises, or transactions made outside the app or platform\n\nAll official communications, quotes, and payments must occur within the app. We do not assume liability for off-app arrangements between customers and technicians.',
  },
  {
    title: '7. Parts and Warranties',
    content:
      'Parts used by Here Ta Help may be new, remanufactured, or OEM-equivalent depending on availability and service selection.\nWarranties apply only to parts and labor performed by Here Ta Help.',
  },
  {
    title: '8. Payment and Escrow Policy',
    content:
      'Full payment is required before a technician is dispatched.\nAll payments are securely held in escrow until:\n• The customer confirms satisfactory completion, or\n• Five (5) days have passed since service completion — whichever occurs first\n\nFunds are released to the technician once the above conditions are met.\nIf a dispute arises, the funds remain in escrow until a resolution is determined.',
  },
  {
    title: '9. Dispute Policy',
    content:
      'In the event of a disagreement between the customer and technician regarding quality, completion, or scope of service:\n\n• Report the Issue: Disputes must be filed within 48 hours of service completion through the app.\n• Escrow Hold: Funds remain in escrow while the dispute is reviewed.\n• Investigation: Here Ta Help may collect evidence, including photos, messages, and service notes.\n• Resolution: Funds may be released to the technician, refunded partially to the customer, or split as determined by the investigation.\n• Final Decision: All dispute resolutions made by Here Ta Help are final and binding.\n\nFailure to file a dispute within 48 hours will result in automatic release of escrowed funds to the technician.',
  },
  {
    title: '10. Acceptance',
    content:
      'By tapping "I Agree", you confirm that:\n• You are the owner or authorized representative of the vehicle\n• You have read, understood, and agree to these terms\n• You acknowledge that all transactions, payments, cancellations, and disputes must occur through the app',
  },
]

export type RepairServiceSpecification = {
  id: string
  name: string
  description: string
  estimatedTime?: string
  priceRange?: string
  baseTimeHours?: number
  baseLaborRate?: number
  basePartsCost?: number
}

export type RepairServiceSubcategory = {
  id: string
  name: string
  description: string
  estimatedTime?: string
  priceRange?: string
  baseTimeHours?: number
  baseLaborRate?: number
  basePartsCost?: number
  specifications: RepairServiceSpecification[]
}

export type RepairServiceCategory = {
  id: string
  name: string
  emoji: string
  subcategories: RepairServiceSubcategory[]
}

export type PartSupplier = {
  id: string
  name: string
  price: number
  inStock: boolean
  shippingDays: number
  brand?: string
  warranty?: string
  rating?: number
  reviewCount?: number
}

export type VehicleSpecificPart = {
  id: string
  name: string
  category: string
  description: string
  partNumber: string
  suppliers: PartSupplier[]
  fitmentNotes?: string
  specification?: Record<string, string>
}

export type SelectedPart = {
  partId: string
  supplierId: string
  quantity: number
}

export const calculateFlatFee = (
  baseTimeHours?: number,
  baseLaborRate: number = DEFAULT_LABOR_RATE,
  basePartsCost?: number,
  priceRange?: string
) => {
  if (baseTimeHours && baseTimeHours > 0) {
    const parts = basePartsCost ?? 0
    return baseTimeHours * baseLaborRate + parts
  }

  if (priceRange) {
    const numeric = priceRange
      .replace(/[$,]/g, '')
      .split('-')
      .map((value) => Number.parseFloat(value.trim()))
      .filter((value) => Number.isFinite(value))

    if (numeric.length === 1) {
      return numeric[0]
    }

    if (numeric.length >= 2) {
      return (numeric[0] + numeric[1]) / 2
    }
  }

  return baseLaborRate
}

const defaultSuppliers: PartSupplier[] = [
  {
    id: 'napa',
    name: 'NAPA Auto Parts',
    price: 185,
    inStock: true,
    shippingDays: 1,
    brand: 'NAPA Proformer',
    warranty: '2 years',
    rating: 4.6,
    reviewCount: 214,
  },
  {
    id: 'autozone',
    name: 'AutoZone',
    price: 172,
    inStock: true,
    shippingDays: 0,
    brand: 'Duralast Gold',
    warranty: 'Limited lifetime',
    rating: 4.5,
    reviewCount: 183,
  },
  {
    id: 'oreilly',
    name: "O'Reilly",
    price: 168,
    inStock: false,
    shippingDays: 2,
    brand: 'BrakeBest Select',
    warranty: '18 months',
    rating: 4.3,
    reviewCount: 141,
  },
]

const padRotorParts: VehicleSpecificPart[] = [
  {
    id: 'pads_rotors_premium',
    name: 'Premium Ceramic Pads & Rotors (Axle)',
    category: 'Brakes',
    description: 'Includes ceramic pads, coated rotors, hardware kit, and break-in service.',
    partNumber: 'BRK-PRM-001',
    suppliers: defaultSuppliers,
    fitmentNotes: 'Fits most midsize sedans and crossovers. Includes noise-dampening shims.',
    specification: {
      Material: 'Ceramic pads / coated rotors',
      Warranty: '24 months / 24k miles',
    },
  },
  {
    id: 'pads_rotors_value',
    name: 'Value Pads & Rotors Bundle (Axle)',
    category: 'Brakes',
    description: 'Balanced pads and rotors for commuters and light-duty driving.',
    partNumber: 'BRK-VALUE-103',
    suppliers: [
      {
        id: 'autozone',
        name: 'AutoZone',
        price: 142,
        inStock: true,
        shippingDays: 0,
        brand: 'Duralast',
        warranty: '12 months',
        rating: 4.2,
        reviewCount: 275,
      },
      {
        id: 'advance',
        name: 'Advance Auto Parts',
        price: 149,
        inStock: true,
        shippingDays: 1,
        brand: 'Carquest Platinum',
        warranty: '18 months',
        rating: 4.4,
        reviewCount: 96,
      },
    ],
    fitmentNotes: 'Sold per axle. Suitable for vehicles up to 4,000 lbs curb weight.',
    specification: {
      Material: 'Semi-metallic pads',
      Includes: 'Rotor hardware kit',
    },
  },
  {
    id: 'pads_rotors_performance',
    name: 'Performance Slotted Kit (Axle)',
    category: 'Brakes',
    description: 'PowerStop-style drilled and slotted rotors with carbon-ceramic pads.',
    partNumber: 'BRK-PERF-212',
    suppliers: [
      {
        id: 'summit',
        name: 'Summit Racing',
        price: 236,
        inStock: true,
        shippingDays: 2,
        brand: 'PowerStop',
        warranty: '36 months',
        rating: 4.8,
        reviewCount: 321,
      },
      {
        id: 'amazon',
        name: 'Amazon Automotive',
        price: 224,
        inStock: true,
        shippingDays: 2,
        brand: 'PowerStop',
        warranty: '36 months',
        rating: 4.7,
        reviewCount: 588,
      },
    ],
    fitmentNotes: 'Ideal for towing packages and performance vehicles. Verify wheel size clearance.',
    specification: {
      RotorFinish: 'Drilled & slotted',
      PadCompound: 'Carbon-ceramic',
    },
  },
]

const sparkPlugParts: VehicleSpecificPart[] = [
  {
    id: 'spark_plug_iridium',
    name: 'Iridium Spark Plug Set',
    category: 'Ignition',
    description: 'Full set of NGK iridium spark plugs with anti-seize and dielectric grease.',
    partNumber: 'SPK-IR-SET',
    suppliers: [
      {
        id: 'rockauto',
        name: 'RockAuto',
        price: 68,
        inStock: true,
        shippingDays: 3,
        brand: 'NGK',
        warranty: 'Limited lifetime',
        rating: 4.9,
        reviewCount: 420,
      },
      {
        id: 'oreilly',
        name: "O'Reilly",
        price: 74,
        inStock: true,
        shippingDays: 1,
        brand: 'Bosch',
        warranty: '24 months',
        rating: 4.6,
        reviewCount: 189,
      },
    ],
    fitmentNotes: 'Gap pre-set to 0.044". Confirm engine code for forced induction applications.',
    specification: {
      Material: 'Iridium center electrode',
    },
  },
  {
    id: 'coil_boot_kit',
    name: 'Ignition Coil Boot Kit',
    category: 'Ignition',
    description: 'Set of 4 silicone coil boots with spring terminals.',
    partNumber: 'IGN-BOOT-4PK',
    suppliers: [
      {
        id: 'advance',
        name: 'Advance Auto Parts',
        price: 36,
        inStock: true,
        shippingDays: 0,
        brand: 'Carquest Premium',
        warranty: '12 months',
        rating: 4.3,
        reviewCount: 88,
      },
    ],
    fitmentNotes: 'Recommended when replacing spark plugs on high-mileage vehicles.',
    specification: {
      Temperature: 'Up to 480°F',
    },
  },
]

const batteryParts: VehicleSpecificPart[] = [
  {
    id: 'agm_battery',
    name: 'AGM Group 48 Battery',
    category: 'Electrical',
    description: 'Absorbed glass mat battery with enhanced cold cranking amps.',
    partNumber: 'BAT-AGM-48',
    suppliers: [
      {
        id: 'napa',
        name: 'NAPA Auto Parts',
        price: 229,
        inStock: true,
        shippingDays: 0,
        brand: 'NAPA Legend AGM',
        warranty: '36 months',
        rating: 4.7,
        reviewCount: 134,
      },
      {
        id: 'costco',
        name: 'Costco Wholesale',
        price: 209,
        inStock: true,
        shippingDays: 0,
        brand: 'Interstate AGM',
        warranty: '36 months',
        rating: 4.9,
        reviewCount: 512,
      },
    ],
    fitmentNotes: 'Verify CCA requirement. Includes registration for BMW/Mercedes.',
    specification: {
      CCA: '760',
      ReserveCapacity: '140 minutes',
    },
  },
]

const airFilterParts: VehicleSpecificPart[] = [
  {
    id: 'engine_air_filter_oem',
    name: 'OEM Engine Air Filter Kit',
    category: 'Air Intake',
    description: 'Direct-replacement filter media for proper airflow and filtration.',
    partNumber: 'AIR-OEM-001',
    suppliers: [
      {
        id: 'autozone',
        name: 'AutoZone',
        price: 24,
        inStock: true,
        shippingDays: 0,
        brand: 'STP',
        warranty: '12 months',
        rating: 4.4,
        reviewCount: 215,
      },
      {
        id: 'napa',
        name: 'NAPA Auto Parts',
        price: 27,
        inStock: true,
        shippingDays: 1,
        brand: 'NAPA Gold',
        warranty: '24 months',
        rating: 4.6,
        reviewCount: 132,
      },
    ],
    fitmentNotes: 'Confirm engine size for exact filter dimensions.',
    specification: {
      FilterMedia: 'Cellulose blend',
      ServiceInterval: 'Replace every 12,000 miles',
    },
  },
  {
    id: 'engine_air_filter_performance',
    name: 'High-Flow Performance Filter',
    category: 'Air Intake',
    description: 'Reusable high-flow filter with improved airflow and filtration.',
    partNumber: 'AIR-PERF-204',
    suppliers: [
      {
        id: 'amazon',
        name: 'Amazon Automotive',
        price: 59,
        inStock: true,
        shippingDays: 2,
        brand: 'K&N',
        warranty: 'Million mile',
        rating: 4.8,
        reviewCount: 545,
      },
    ],
    fitmentNotes: 'Requires cleaning every 50,000 miles.',
    specification: {
      Washable: 'Yes',
      Warranty: 'Million mile',
    },
  },
]

const serpentineBeltParts: VehicleSpecificPart[] = [
  {
    id: 'serpentine_belt_premium',
    name: 'Serpentine Belt & Tensioner Kit',
    category: 'Belts',
    description: 'Belt, tensioner, and idler pulley for complete drive-belt service.',
    partNumber: 'BELT-KIT-301',
    suppliers: [
      {
        id: 'oreilly',
        name: "O'Reilly",
        price: 129,
        inStock: true,
        shippingDays: 0,
        brand: 'Gates',
        warranty: '24 months',
        rating: 4.6,
        reviewCount: 167,
      },
      {
        id: 'autozone',
        name: 'AutoZone',
        price: 118,
        inStock: true,
        shippingDays: 0,
        brand: 'Dayco',
        warranty: '12 months',
        rating: 4.4,
        reviewCount: 143,
      },
    ],
    fitmentNotes: 'Select correct engine size before ordering.',
    specification: {
      Components: 'Belt, tensioner, idler pulley',
    },
  },
  {
    id: 'timing_chain_service',
    name: 'Timing Chain Service Kit',
    category: 'Belts',
    description: 'Chain, guides, and tensioners for timing system refresh.',
    partNumber: 'TC-KIT-188',
    suppliers: [
      {
        id: 'rockauto',
        name: 'RockAuto',
        price: 289,
        inStock: true,
        shippingDays: 3,
        brand: 'Cloyes',
        warranty: 'Limited lifetime',
        rating: 4.5,
        reviewCount: 101,
      },
    ],
    fitmentNotes: 'Includes updated tensioner design to prevent chain slap.',
    specification: {
      Includes: 'Primary chain, guides, tensioners, seals',
    },
  },
]

const coolantServiceParts: VehicleSpecificPart[] = [
  {
    id: 'coolant_service_kit',
    name: 'Extended Life Coolant Service Kit',
    category: 'Cooling',
    description: 'Pre-mixed coolant, flush additive, and new radiator cap.',
    partNumber: 'COOL-KIT-210',
    suppliers: [
      {
        id: 'advance',
        name: 'Advance Auto Parts',
        price: 89,
        inStock: true,
        shippingDays: 0,
        brand: 'Peak',
        warranty: '12 months',
        rating: 4.3,
        reviewCount: 97,
      },
      {
        id: 'napa',
        name: 'NAPA Auto Parts',
        price: 94,
        inStock: true,
        shippingDays: 1,
        brand: 'NAPA',
        warranty: '12 months',
        rating: 4.4,
        reviewCount: 84,
      },
    ],
    fitmentNotes: 'Select correct coolant blend (green/orange) per owner manual.',
    specification: {
      CoolantType: 'Extended life 50/50',
      Includes: 'Flush additive, coolant, radiator cap',
    },
  },
  {
    id: 'coolant_sensor_bundle',
    name: 'Coolant Temperature Sensor Bundle',
    category: 'Cooling',
    description: 'OEM spec temperature sensor with harness clip and thread sealant.',
    partNumber: 'CTS-BND-090',
    suppliers: [
      {
        id: 'autozone',
        name: 'AutoZone',
        price: 46,
        inStock: true,
        shippingDays: 0,
        brand: 'Duralast',
        warranty: 'Limited lifetime',
        rating: 4.5,
        reviewCount: 136,
      },
    ],
    fitmentNotes: 'Includes high-temp thread sealant for leak-free install.',
    specification: {
      SensorType: 'Thermistor',
      Warranty: 'Limited lifetime',
    },
  },
]

const sensorReplacementParts: VehicleSpecificPart[] = [
  {
    id: 'engine_sensor_kit_standard',
    name: 'Engine Sensor Replacement Kit',
    category: 'Sensors',
    description: 'Crankshaft and camshaft position sensors with harness clips.',
    partNumber: 'SNS-KIT-112',
    suppliers: [
      {
        id: 'autozone',
        name: 'AutoZone',
        price: 129,
        inStock: true,
        shippingDays: 0,
        brand: 'Duralast',
        warranty: 'Limited lifetime',
        rating: 4.6,
        reviewCount: 142,
      },
      {
        id: 'oreilly',
        name: "O'Reilly",
        price: 134,
        inStock: true,
        shippingDays: 1,
        brand: 'Import Direct',
        warranty: '24 months',
        rating: 4.4,
        reviewCount: 87,
      },
    ],
    fitmentNotes: 'Includes alignment spacers for precise pickup gap.',
    specification: {
      Includes: 'Crankshaft sensor, camshaft sensor, mounting hardware',
    },
  },
  {
    id: 'maf_sensor_upgrade',
    name: 'Mass Air Flow Sensor Upgrade',
    category: 'Sensors',
    description: 'Remanufactured MAF sensor with lifetime warranty.',
    partNumber: 'MAF-UG-220',
    suppliers: [
      {
        id: 'advance',
        name: 'Advance Auto Parts',
        price: 156,
        inStock: true,
        shippingDays: 0,
        brand: 'Carquest Premium',
        warranty: 'Limited lifetime',
        rating: 4.5,
        reviewCount: 75,
      },
    ],
    fitmentNotes: 'Requires throttle body relearn after installation.',
    specification: {
      Warranty: 'Limited lifetime',
    },
  },
]

const gasketServiceParts: VehicleSpecificPart[] = [
  {
    id: 'engine_gasket_master',
    name: 'Engine Gasket Master Set',
    category: 'Gaskets & Seals',
    description: 'Includes valve cover, oil pan, timing cover, and front seals.',
    partNumber: 'GST-MSTR-400',
    suppliers: [
      {
        id: 'rockauto',
        name: 'RockAuto',
        price: 178,
        inStock: true,
        shippingDays: 3,
        brand: 'Fel-Pro',
        warranty: '12 months',
        rating: 4.7,
        reviewCount: 211,
      },
      {
        id: 'napa',
        name: 'NAPA Auto Parts',
        price: 189,
        inStock: true,
        shippingDays: 1,
        brand: 'Mahle',
        warranty: '12 months',
        rating: 4.6,
        reviewCount: 95,
      },
    ],
    fitmentNotes: 'Includes anaerobic sealant for timing cover surfaces.',
    specification: {
      Material: 'Multi-layer steel & molded rubber',
    },
  },
  {
    id: 'front_cover_gasket',
    name: 'Timing Cover Gasket Kit',
    category: 'Gaskets & Seals',
    description: 'Front cover gasket with crank seal and RTV silicone.',
    partNumber: 'GST-FRNT-115',
    suppliers: [
      {
        id: 'autozone',
        name: 'AutoZone',
        price: 42,
        inStock: true,
        shippingDays: 0,
        brand: 'Fel-Pro',
        warranty: '12 months',
        rating: 4.4,
        reviewCount: 133,
      },
    ],
    fitmentNotes: 'Use torque sequence supplied for leak-free seal.',
    specification: {
      Includes: 'Timing cover gasket, crankshaft seal, RTV',
    },
  },
]

const transmissionServiceParts: VehicleSpecificPart[] = [
  {
    id: 'transmission_service_kit',
    name: 'Transmission Service Kit',
    category: 'Transmission',
    description: 'Filter, pan gasket, and synthetic ATF for drain-and-fill service.',
    partNumber: 'TRANS-KIT-502',
    suppliers: [
      {
        id: 'advance',
        name: 'Advance Auto Parts',
        price: 119,
        inStock: true,
        shippingDays: 0,
        brand: 'Valvoline',
        warranty: '12 months',
        rating: 4.5,
        reviewCount: 168,
      },
      {
        id: 'autozone',
        name: 'AutoZone',
        price: 112,
        inStock: true,
        shippingDays: 0,
        brand: 'Duralast',
        warranty: '12 months',
        rating: 4.3,
        reviewCount: 142,
      },
    ],
    fitmentNotes: 'Includes reusable drain plug gasket.',
    specification: {
      FluidType: 'Synthetic ATF',
      Includes: 'Filter, pan gasket, 6 quarts ATF',
    },
  },
  {
    id: 'transmission_fluid_full',
    name: 'Full Synthetic Transmission Fluid Pack',
    category: 'Transmission',
    description: 'Full case of ATF with conditioner for high-mile transmissions.',
    partNumber: 'TRANS-FLD-220',
    suppliers: [
      {
        id: 'oreilly',
        name: "O'Reilly",
        price: 89,
        inStock: true,
        shippingDays: 0,
        brand: 'Mobil 1',
        warranty: '12 months',
        rating: 4.7,
        reviewCount: 108,
      },
    ],
    fitmentNotes: 'Meets Dexron VI & Mercon LV specifications.',
    specification: {
      Quantity: '12 quarts',
    },
  },
]

const drivetrainParts: VehicleSpecificPart[] = [
  {
    id: 'cv_axle_new',
    name: 'Complete CV Axle Assembly',
    category: 'Drivetrain',
    description: 'Fully assembled CV axle with lifetime warranty and hardware.',
    partNumber: 'CV-AXL-550',
    suppliers: [
      {
        id: 'autozone',
        name: 'AutoZone',
        price: 189,
        inStock: true,
        shippingDays: 0,
        brand: 'Duralast Gold',
        warranty: 'Limited lifetime',
        rating: 4.5,
        reviewCount: 201,
      },
      {
        id: 'advance',
        name: 'Advance Auto Parts',
        price: 179,
        inStock: true,
        shippingDays: 0,
        brand: 'Carquest New',
        warranty: 'Limited lifetime',
        rating: 4.4,
        reviewCount: 156,
      },
    ],
    fitmentNotes: 'Verify side (left/right) before ordering. Includes axle nut.',
    specification: {
      Warranty: 'Limited lifetime',
    },
  },
  {
    id: 'cv_boot_service',
    name: 'Heavy-Duty CV Boot Kit',
    category: 'Drivetrain',
    description: 'Neoprene boot, grease, and clamps for reboot service.',
    partNumber: 'CV-BOOT-210',
    suppliers: [
      {
        id: 'rockauto',
        name: 'RockAuto',
        price: 39,
        inStock: true,
        shippingDays: 3,
        brand: 'EMPI',
        warranty: '12 months',
        rating: 4.4,
        reviewCount: 88,
      },
    ],
    fitmentNotes: 'Includes stainless clamps and high-temp grease.',
    specification: {
      Includes: 'Boot, clamps, grease, circlip',
    },
  },
]

const engineMountParts: VehicleSpecificPart[] = [
  {
    id: 'engine_mount_hydraulic',
    name: 'Hydraulic Engine Mount Kit',
    category: 'Mounts',
    description: 'Hydraulic engine mounts with vibration isolators.',
    partNumber: 'MNT-HYD-120',
    suppliers: [
      {
        id: 'oreilly',
        name: "O'Reilly",
        price: 168,
        inStock: true,
        shippingDays: 0,
        brand: 'Anchor',
        warranty: '12 months',
        rating: 4.3,
        reviewCount: 73,
      },
      {
        id: 'autozone',
        name: 'AutoZone',
        price: 159,
        inStock: true,
        shippingDays: 0,
        brand: 'Duralast',
        warranty: 'Limited lifetime',
        rating: 4.4,
        reviewCount: 81,
      },
    ],
    fitmentNotes: 'Includes torque specs and install hardware.',
    specification: {
      Warranty: 'Limited lifetime',
    },
  },
  {
    id: 'transmission_mount',
    name: 'Transmission Mount Assembly',
    category: 'Mounts',
    description: 'Poly-filled transmission mount to reduce driveline lash.',
    partNumber: 'MNT-TRANS-055',
    suppliers: [
      {
        id: 'advance',
        name: 'Advance Auto Parts',
        price: 94,
        inStock: true,
        shippingDays: 0,
        brand: 'Carquest',
        warranty: '12 months',
        rating: 4.2,
        reviewCount: 54,
      },
    ],
    fitmentNotes: 'Reuse original bolts where applicable.',
    specification: {
      Construction: 'Poly-filled rubber',
    },
  },
]

const engineInternalParts: VehicleSpecificPart[] = [
  {
    id: 'camshaft_kit_oem',
    name: 'OEM Camshaft & Lifter Kit',
    category: 'Engine Internals',
    description: 'Camshaft, lifters, and gasket set for factory-style rebuilds.',
    partNumber: 'ENG-CAM-410',
    suppliers: [
      {
        id: 'summit',
        name: 'Summit Racing',
        price: 649,
        inStock: true,
        shippingDays: 2,
        brand: 'Melling',
        warranty: '12 months',
        rating: 4.5,
        reviewCount: 82,
      },
      {
        id: 'rockauto',
        name: 'RockAuto',
        price: 618,
        inStock: true,
        shippingDays: 3,
        brand: 'Mahle',
        warranty: '12 months',
        rating: 4.4,
        reviewCount: 67,
      },
    ],
    fitmentNotes: 'Choose correct engine code for lobe profile match.',
    specification: {
      Includes: 'Camshaft, lifters, seals, installation lube',
    },
  },
  {
    id: 'crankshaft_kit_reman',
    name: 'Remanufactured Crankshaft Kit',
    category: 'Engine Internals',
    description: 'Polished crankshaft with matched bearings and thrust washers.',
    partNumber: 'ENG-CRK-215',
    suppliers: [
      {
        id: 'autozone',
        name: 'AutoZone',
        price: 489,
        inStock: true,
        shippingDays: 2,
        brand: 'Duralast',
        warranty: 'Limited lifetime',
        rating: 4.3,
        reviewCount: 54,
      },
      {
        id: 'oreilly',
        name: "O'Reilly",
        price: 472,
        inStock: true,
        shippingDays: 2,
        brand: 'PowerTorque',
        warranty: '12 months',
        rating: 4.2,
        reviewCount: 49,
      },
    ],
    fitmentNotes: 'Includes undersized bearings matched to grind specification.',
    specification: {
      Includes: 'Crankshaft, main & rod bearings, thrust washers',
    },
  },
  {
    id: 'cylinder_head_complete',
    name: 'Assembled Cylinder Head',
    category: 'Engine Internals',
    description: 'Remanufactured cylinder head with valves, springs, and seals installed.',
    partNumber: 'ENG-HED-905',
    suppliers: [
      {
        id: 'advance',
        name: 'Advance Auto Parts',
        price: 729,
        inStock: true,
        shippingDays: 3,
        brand: 'Surefire',
        warranty: '36 months',
        rating: 4.6,
        reviewCount: 91,
      },
      {
        id: 'jasper',
        name: 'Jasper Engines & Transmissions',
        price: 789,
        inStock: true,
        shippingDays: 4,
        brand: 'Jasper',
        warranty: '36 months / 75k miles',
        rating: 4.7,
        reviewCount: 76,
      },
    ],
    fitmentNotes: 'Requires core return. Includes cam bearings pre-installed when applicable.',
    specification: {
      Warranty: '36 months / 75k miles',
    },
  },
]

const engineControlModuleParts: VehicleSpecificPart[] = [
  {
    id: 'pcm_replacement_programmed',
    name: 'Pre-Programmed PCM/ECM Module',
    category: 'Electronics',
    description: 'Plug-and-play replacement module programmed to VIN.',
    partNumber: 'PCM-PP-900',
    suppliers: [
      {
        id: 'autozone',
        name: 'AutoZone',
        price: 789,
        inStock: true,
        shippingDays: 2,
        brand: 'Cardone',
        warranty: 'Limited lifetime',
        rating: 4.5,
        reviewCount: 62,
      },
      {
        id: 'flagshipone',
        name: 'Flagship One',
        price: 739,
        inStock: true,
        shippingDays: 2,
        brand: 'FS1',
        warranty: 'Lifetime',
        rating: 4.6,
        reviewCount: 89,
      },
    ],
    fitmentNotes: 'Requires VIN and mileage during order. Includes anti-theft relearn instructions.',
    specification: {
      Programming: 'VIN-matched, latest calibration',
    },
  },
  {
    id: 'pcm_repair_service',
    name: 'PCM Repair & Return Service',
    category: 'Electronics',
    description: 'Send-in repair service with upgraded components and bench testing.',
    partNumber: 'PCM-RPR-115',
    suppliers: [
      {
        id: 'moduleexperts',
        name: 'Module Experts',
        price: 329,
        inStock: true,
        shippingDays: 5,
        brand: 'Module Experts',
        warranty: '24 months',
        rating: 4.4,
        reviewCount: 47,
      },
    ],
    fitmentNotes: 'Vehicle down time 5-7 business days. Includes shipping label.',
    specification: {
      Service: 'Component level repair & bench test',
    },
  },
]

const fuelSystemParts: VehicleSpecificPart[] = [
  {
    id: 'fuel_pump_module',
    name: 'Complete Fuel Pump Module',
    category: 'Fuel System',
    description: 'Drop-in fuel pump module with float arm and new strainer.',
    partNumber: 'FUEL-MOD-330',
    suppliers: [
      {
        id: 'oreilly',
        name: "O'Reilly",
        price: 229,
        inStock: true,
        shippingDays: 0,
        brand: 'Spectra Premium',
        warranty: '12 months',
        rating: 4.5,
        reviewCount: 116,
      },
      {
        id: 'autozone',
        name: 'AutoZone',
        price: 248,
        inStock: true,
        shippingDays: 0,
        brand: 'Delphi',
        warranty: 'Limited lifetime',
        rating: 4.6,
        reviewCount: 132,
      },
    ],
    fitmentNotes: 'Always replace tank seal. Includes new strainer.',
    specification: {
      Warranty: 'Limited lifetime',
    },
  },
  {
    id: 'throttle_body_cleaning',
    name: 'Throttle Body Service Kit',
    category: 'Fuel System',
    description: 'OEM throttle body gasket set, cleaner, and nylon brush kit.',
    partNumber: 'THRT-SVC-082',
    suppliers: [
      {
        id: 'napa',
        name: 'NAPA Auto Parts',
        price: 39,
        inStock: true,
        shippingDays: 0,
        brand: 'CRC',
        warranty: '12 months',
        rating: 4.4,
        reviewCount: 143,
      },
    ],
    fitmentNotes: 'Includes lint-free wipes for sensor safe cleaning.',
    specification: {
      Includes: 'Cleaner, brushes, gasket, instructions',
    },
  },
]

const emissionSystemParts: VehicleSpecificPart[] = [
  {
    id: 'o2_sensor_kit',
    name: 'Oxygen Sensor Replacement Kit',
    category: 'Emissions',
    description: 'Upstream and downstream O2 sensors with anti-seize compound.',
    partNumber: 'O2-KIT-420',
    suppliers: [
      {
        id: 'autozone',
        name: 'AutoZone',
        price: 178,
        inStock: true,
        shippingDays: 0,
        brand: 'Bosch',
        warranty: 'Limited lifetime',
        rating: 4.5,
        reviewCount: 121,
      },
      {
        id: 'advance',
        name: 'Advance Auto Parts',
        price: 169,
        inStock: true,
        shippingDays: 0,
        brand: 'NTK',
        warranty: '24 months',
        rating: 4.4,
        reviewCount: 98,
      },
    ],
    fitmentNotes: 'Includes harness adaptors for universal fit.',
    specification: {
      Includes: 'Upstream & downstream sensors, anti-seize',
    },
  },
  {
    id: 'catalytic_converter_universal',
    name: 'Universal Catalytic Converter Kit',
    category: 'Emissions',
    description: 'High-flow converter with welding sleeves and O2 port.',
    partNumber: 'CAT-UNI-305',
    suppliers: [
      {
        id: 'rockauto',
        name: 'RockAuto',
        price: 329,
        inStock: true,
        shippingDays: 3,
        brand: 'Walker',
        warranty: '5 year / 50k mile',
        rating: 4.3,
        reviewCount: 77,
      },
    ],
    fitmentNotes: 'Includes install hardware. Verify legality in your state.',
    specification: {
      Warranty: '5 year / 50k mile',
    },
  },
]

const alternatorParts: VehicleSpecificPart[] = [
  {
    id: 'alternator_premium',
    name: 'Premium Reman Alternator',
    category: 'Charging System',
    description: 'High-output alternator with new bearings and regulator.',
    partNumber: 'ALT-PRM-160',
    suppliers: [
      {
        id: 'autozone',
        name: 'AutoZone',
        price: 239,
        inStock: true,
        shippingDays: 0,
        brand: 'Duralast Gold',
        warranty: 'Limited lifetime',
        rating: 4.6,
        reviewCount: 190,
      },
      {
        id: 'advance',
        name: 'Advance Auto Parts',
        price: 229,
        inStock: true,
        shippingDays: 0,
        brand: 'Carquest',
        warranty: 'Limited lifetime',
        rating: 4.4,
        reviewCount: 154,
      },
    ],
    fitmentNotes: 'Includes pulley and voltage regulator. Core charge refundable.',
    specification: {
      Amperage: '160A output',
    },
  },
]

const starterParts: VehicleSpecificPart[] = [
  {
    id: 'starter_high_torque',
    name: 'High Torque Starter',
    category: 'Starting System',
    description: 'High torque starter with new solenoid and gears.',
    partNumber: 'STR-HT-120',
    suppliers: [
      {
        id: 'autozone',
        name: 'AutoZone',
        price: 189,
        inStock: true,
        shippingDays: 0,
        brand: 'Duralast Gold',
        warranty: 'Limited lifetime',
        rating: 4.5,
        reviewCount: 143,
      },
      {
        id: 'oreilly',
        name: "O'Reilly",
        price: 179,
        inStock: true,
        shippingDays: 0,
        brand: 'Ultima',
        warranty: 'Limited lifetime',
        rating: 4.4,
        reviewCount: 111,
      },
    ],
    fitmentNotes: 'Return core for full credit. Includes shim pack.',
    specification: {
      Warranty: 'Limited lifetime',
    },
  },
]

const engineOilServiceParts: VehicleSpecificPart[] = [
  {
    id: 'engine_oil_service',
    name: 'Full Synthetic Oil Change Kit',
    category: 'Maintenance',
    description: 'Includes 5 quarts full synthetic oil, premium filter, and crush washer.',
    partNumber: 'OIL-SVC-101',
    suppliers: [
      {
        id: 'costco',
        name: 'Costco Wholesale',
        price: 49,
        inStock: true,
        shippingDays: 0,
        brand: 'Kirkland Signature',
        warranty: '12 months',
        rating: 4.8,
        reviewCount: 256,
      },
      {
        id: 'autozone',
        name: 'AutoZone',
        price: 62,
        inStock: true,
        shippingDays: 0,
        brand: 'Mobil 1',
        warranty: '12 months',
        rating: 4.7,
        reviewCount: 312,
      },
    ],
    fitmentNotes: 'Select correct viscosity for engine spec.',
    specification: {
      Viscosity: '5W-30 full synthetic',
      Includes: 'Oil filter, 5 qt oil, drain plug washer',
    },
  },
]

const PART_LIBRARY: Record<string, VehicleSpecificPart[]> = {
  'pad-rotor-replacement': padRotorParts,
  spark_plugs: sparkPlugParts,
  spark_plug_replacement: sparkPlugParts,
  battery_replacement: batteryParts,
  air_filter_replacement: airFilterParts,
  coolant_change: coolantServiceParts,
  coolant_leak_diagnosis: coolantServiceParts,
  coolant_reservoir_replacement: coolantServiceParts,
  radiator_replacement: coolantServiceParts,
  engine_coolant_temp_sensor: coolantServiceParts,
  camshaft_position_sensor: sensorReplacementParts,
  crankshaft_position_sensor: sensorReplacementParts,
  camshaft_replacement: engineInternalParts,
  crankshaft_replacement: engineInternalParts,
  cylinder_head_replacement: engineInternalParts,
  engine_front_cover_gasket: gasketServiceParts,
  engine_oil_filter_adapter: gasketServiceParts,
  engine_leak_inspection: gasketServiceParts,
  drive_belt_tensioner: serpentineBeltParts,
  serpentine_belt_replacement: serpentineBeltParts,
  timing_chain_replacement: serpentineBeltParts,
  timing_chain_tensioner: serpentineBeltParts,
  engine_mount_replacement: engineMountParts,
  trans_mount_replacement: engineMountParts,
  drive_axle_drain_refill: drivetrainParts,
  drive_axle_leak_inspection: drivetrainParts,
  cv_axle_replacement: drivetrainParts,
  cv_boot_replacement: drivetrainParts,
  transmission_filter_fluid: transmissionServiceParts,
  transmission_fluid_change: transmissionServiceParts,
  trans_oil_pan_gasket: transmissionServiceParts,
  engine_control_module: engineControlModuleParts,
  powertrain_control_module: engineControlModuleParts,
  throttle_body_replacement: fuelSystemParts,
  fuel_pump_replacement: fuelSystemParts,
  emission_control_inspect: emissionSystemParts,
  emission_system_diagnosis: emissionSystemParts,
  engine_oil_cooler: coolantServiceParts,
  engine_compression_test: engineOilServiceParts,
  air_intake_cleaning: airFilterParts,
  alternator_replacement: alternatorParts,
  starter_replacement: starterParts,
}

const KEYWORD_PART_LIBRARY: { pattern: RegExp; parts: VehicleSpecificPart[] }[] = [
  { pattern: /spark(?:[-_\s]?plug)?|ignition/i, parts: sparkPlugParts },
  { pattern: /air(?:[-_\s]?filter)?|intake/i, parts: airFilterParts },
  { pattern: /(serpentine|drive[-_\s]?belt|timing[-_\s]?(chain|belt)|tensioner)/i, parts: serpentineBeltParts },
  { pattern: /(coolant|radiator|water[-_\s]?pump|thermostat|heater)/i, parts: coolantServiceParts },
  { pattern: /(sensor|maf|map)/i, parts: sensorReplacementParts },
  { pattern: /(gasket|seal)/i, parts: gasketServiceParts },
  { pattern: /(transmission|trans[-_\s]|gearbox)/i, parts: transmissionServiceParts },
  { pattern: /(cv[-_\s]?|axle|drive[-_\s]?shaft|driveline)/i, parts: drivetrainParts },
  { pattern: /(mount|bushing)/i, parts: engineMountParts },
  { pattern: /(fuel|injector|throttle)/i, parts: fuelSystemParts },
  { pattern: /(emission|catalytic|oxygen|o2)/i, parts: emissionSystemParts },
  { pattern: /(control[-_\s]?module|pcm|ecm)/i, parts: engineControlModuleParts },
  { pattern: /(camshaft|crankshaft|cylinder[-_\s]?head|engine[-_\s]?rebuild|piston)/i, parts: engineInternalParts },
  { pattern: /alternator/i, parts: alternatorParts },
  { pattern: /starter/i, parts: starterParts },
  { pattern: /battery/i, parts: batteryParts },
  { pattern: /(oil[-_\s]?change|engine[-_\s]?oil)/i, parts: engineOilServiceParts },
]

const SPEC_PART_LIBRARY: Record<string, VehicleSpecificPart[]> = {
  'front-pads-rotors': padRotorParts,
  'rear-pads-rotors': padRotorParts,
  'pads-rotors-all': padRotorParts,
  'spark-plugs-4cyl': sparkPlugParts,
  'spark-plugs-6cyl': sparkPlugParts,
  'spark-plugs-8cyl': sparkPlugParts,
  battery_replacement: batteryParts,
}

export const getPartsForSubcategory = (
  subcategoryId: string,
  specificationId?: string,
  subcategoryName?: string,
  specificationName?: string
): VehicleSpecificPart[] => {
  const canonicalize = (value?: string | null) =>
    value ? value.toLowerCase().replace(/[^a-z0-9]/g, '') : null

  const findPartsByLibraryKey = (value?: string | null) => {
    const key = canonicalize(value)
    if (!key) return null

    for (const [libraryKey, parts] of Object.entries(SPEC_PART_LIBRARY)) {
      if (canonicalize(libraryKey) === key) {
        return parts
      }
    }

    for (const [libraryKey, parts] of Object.entries(PART_LIBRARY)) {
      if (canonicalize(libraryKey) === key) {
        return parts
      }
    }

    return null
  }

  const matchFallbackByName = (value?: string | null) => {
    const key = canonicalize(value)
    if (!key) return null

    for (const category of SERVICE_CATEGORIES) {
      for (const subcategory of category.subcategories) {
        const subKey = canonicalize(subcategory.id)
        const subNameKey = canonicalize(subcategory.name)

        if (subKey === key || subNameKey === key) {
          const parts = findPartsByLibraryKey(subcategory.id) ?? findPartsByLibraryKey(subcategory.name)
          if (parts) return parts
        }

        for (const specification of subcategory.specifications) {
          const specKey = canonicalize(specification.id)
          const specNameKey = canonicalize(specification.name)

          if (specKey === key || specNameKey === key) {
            const specParts =
              findPartsByLibraryKey(specification.id) ??
              findPartsByLibraryKey(specification.name) ??
              findPartsByLibraryKey(subcategory.id)
            if (specParts) return specParts
          }
        }
      }
    }

    return null
  }

  const specMatch = findPartsByLibraryKey(specificationId) ?? matchFallbackByName(specificationId)
  if (specMatch) return specMatch

  const subcategoryMatch =
    findPartsByLibraryKey(subcategoryId) ??
    findPartsByLibraryKey(subcategoryName) ??
    matchFallbackByName(subcategoryId) ??
    matchFallbackByName(subcategoryName)

  if (subcategoryMatch) return subcategoryMatch

  const searchPhrases = [subcategoryId, subcategoryName, specificationId, specificationName]
    .filter(Boolean)
    .map((value) => value!.replace(/[-_]/g, ' '))

  for (const phrase of searchPhrases) {
    for (const entry of KEYWORD_PART_LIBRARY) {
      if (entry.pattern.test(phrase)) {
        return entry.parts
      }
    }
  }

  const normalizedId = subcategoryId.replace(/[-_]/g, ' ')
  for (const entry of KEYWORD_PART_LIBRARY) {
    if (entry.pattern.test(normalizedId)) {
      return entry.parts
    }
  }

  return []
}

export const SERVICE_CATEGORIES: RepairServiceCategory[] = [
  {
    id: 'powertrain',
    name: 'Powertrain',
    emoji: '⚙️',
    subcategories: [
      {
        id: 'air_filter_replacement',
        name: 'Air Filter Replacement',
        description: 'Engine air filter inspection and replacement',
        baseTimeHours: 0.5,
        baseLaborRate: 50.0,
        basePartsCost: 25.0,
        specifications: []
      },
      {
        id: 'camshaft_position_sensor',
        name: 'Camshaft Position Sensor Replacement',
        description: 'Camshaft position sensor diagnosis and replacement',
        baseTimeHours: 0.75,
        baseLaborRate: 50.0,
        basePartsCost: 150.0,
        specifications: []
      },
      {
        id: 'camshaft_replacement',
        name: 'Camshaft Replacement',
        description: 'Camshaft removal and replacement service',
        baseTimeHours: 6.0,
        baseLaborRate: 50.0,
        basePartsCost: 800.0,
        specifications: []
      },
      {
        id: 'coolant_change',
        name: 'Coolant Change',
        description: 'Engine coolant drain and refill service',
        baseTimeHours: 0.6,
        baseLaborRate: 50.0,
        basePartsCost: 40.0,
        specifications: []
      },
      {
        id: 'coolant_leak_diagnosis',
        name: 'Coolant Leak Diagnosis',
        description: 'Coolant system leak detection and diagnosis',
        baseTimeHours: 1.5,
        baseLaborRate: 50.0,
        basePartsCost: 20.0,
        specifications: []
      },
      {
        id: 'coolant_reservoir_replacement',
        name: 'Coolant Reservoir Replacement',
        description: 'Coolant overflow tank replacement',
        baseTimeHours: 0.75,
        baseLaborRate: 50.0,
        basePartsCost: 80.0,
        specifications: []
      },
      {
        id: 'crankshaft_position_sensor',
        name: 'Crankshaft Position Sensor Replacement',
        description: 'Crankshaft position sensor replacement',
        baseTimeHours: 1.0,
        baseLaborRate: 50.0,
        basePartsCost: 120.0,
        specifications: []
      },
      {
        id: 'cv_axle_replacement',
        name: 'CV Axle Replacement',
        description: 'CV joint and axle assembly replacement',
        baseTimeHours: 3.0,
        baseLaborRate: 50.0,
        basePartsCost: 200.0,
        specifications: []
      },
      {
        id: 'cv_boot_replacement',
        name: 'CV Boot Replacement',
        description: 'CV joint boot replacement and re-greasing',
        baseTimeHours: 1.5,
        baseLaborRate: 50.0,
        basePartsCost: 100.0,
        specifications: []
      },
      {
        id: 'cylinder_head_replacement',
        name: 'Cylinder Head Replacement',
        description: 'Cylinder head removal and replacement',
        baseTimeHours: 9.0,
        baseLaborRate: 50.0,
        basePartsCost: 1500.0,
        specifications: []
      },
      {
        id: 'drive_axle_drain_refill',
        name: 'Drive Axle Assembly Drain & Refill',
        description: 'Differential fluid service',
        baseTimeHours: 0.6,
        baseLaborRate: 50.0,
        basePartsCost: 50.0,
        specifications: []
      },
      {
        id: 'drive_axle_leak_inspection',
        name: 'Drive Axle Assembly Leak Inspection',
        description: 'Differential leak inspection and diagnosis',
        baseTimeHours: 0.75,
        baseLaborRate: 50.0,
        basePartsCost: 20.0,
        specifications: []
      },
      {
        id: 'drive_belt_tensioner',
        name: 'Drive Belt Tensioner Replacement',
        description: 'Serpentine belt tensioner replacement',
        estimatedTime: '1-2 hours',
        priceRange: '$150-$350',
        specifications: []
      },
      {
        id: 'emission_control_inspect',
        name: 'Emission Control System Inspect',
        description: 'Emissions system inspection and testing',
        estimatedTime: '1-2 hours',
        priceRange: '$100-$200',
        specifications: []
      },
      {
        id: 'emission_system_diagnosis',
        name: 'Emission System Diagnosis & Testing',
        description: 'Comprehensive emissions system diagnosis',
        estimatedTime: '1-3 hours',
        priceRange: '$150-$300',
        specifications: []
      },
      {
        id: 'engine_compression_test',
        name: 'Engine Compression Test',
        description: 'Cylinder compression testing',
        estimatedTime: '1-2 hours',
        priceRange: '$150-$250',
        specifications: []
      },
      {
        id: 'engine_control_module',
        name: 'Engine Control Module (ECM) Replacement',
        description: 'ECM/PCM replacement and programming',
        estimatedTime: '2-4 hours',
        priceRange: '$800-$2000',
        specifications: []
      },
      {
        id: 'engine_coolant_temp_sensor',
        name: 'Engine Coolant Temperature Sensor Replacement',
        description: 'Coolant temperature sensor replacement',
        estimatedTime: '30-60 min',
        priceRange: '$100-$200',
        specifications: []
      },
      {
        id: 'engine_front_cover_gasket',
        name: 'Engine Front Cover Gasket Replacement',
        description: 'Timing cover gasket replacement',
        estimatedTime: '3-6 hours',
        priceRange: '$400-$1200',
        specifications: []
      },
      {
        id: 'engine_leak_inspection',
        name: 'Engine Leak Inspection',
        description: 'Engine oil and fluid leak diagnosis',
        estimatedTime: '30-60 min',
        priceRange: '$80-$150',
        specifications: []
      },
      {
        id: 'engine_mount_replacement',
        name: 'Engine Mount Replacement',
        description: 'Motor mount replacement service',
        estimatedTime: '1-3 hours',
        priceRange: '$200-$600',
        specifications: []
      },
      {
        id: 'engine_oil_cooler',
        name: 'Engine Oil Cooler Replacement',
        description: 'Oil cooler replacement and lines',
        estimatedTime: '2-4 hours',
        priceRange: '$300-$800',
        specifications: []
      },
      {
        id: 'engine_oil_filter_adapter',
        name: 'Engine Oil Filter Adapter Replacement',
        description: 'Oil filter housing replacement',
        estimatedTime: '1-2 hours',
        priceRange: '$150-$400',
        specifications: []
      },
      {
        id: 'engine_oil_level_sensor',
        name: 'Engine Oil Level Sensor Replacement',
        description: 'Oil level sensor replacement',
        estimatedTime: '30-60 min',
        priceRange: '$150-$300',
        specifications: []
      },
      {
        id: 'engine_oil_pan',
        name: 'Engine Oil Pan Replacement',
        description: 'Oil pan removal and replacement',
        estimatedTime: '2-4 hours',
        priceRange: '$300-$800',
        specifications: []
      },
      {
        id: 'exhaust_manifold_gasket',
        name: 'Exhaust Manifold Gasket Replacement',
        description: 'Exhaust manifold gasket service',
        estimatedTime: '2-4 hours',
        priceRange: '$300-$700',
        specifications: []
      },
      {
        id: 'exhaust_manifold_replacement',
        name: 'Exhaust Manifold Replacement',
        description: 'Exhaust manifold replacement',
        estimatedTime: '2-5 hours',
        priceRange: '$400-$1000',
        specifications: []
      },
      {
        id: 'exhaust_pipe_replacement',
        name: 'Exhaust Pipe Replacement',
        description: 'Exhaust pipe section replacement',
        estimatedTime: '1-2 hours',
        priceRange: '$200-$500',
        specifications: []
      },
      {
        id: 'fuel_evap_canister',
        name: 'Fuel Evaporative Canister Replacement',
        description: 'EVAP canister replacement',
        estimatedTime: '1-2 hours',
        priceRange: '$200-$500',
        specifications: []
      },
      {
        id: 'fuel_injector_replacement',
        name: 'Fuel Injector Replacement',
        description: 'Fuel injector replacement service',
        estimatedTime: '2-4 hours',
        priceRange: '$300-$1200',
        specifications: []
      },
      {
        id: 'fuel_level_sending_unit',
        name: 'Fuel Level Sending Unit Replacement',
        description: 'Fuel gauge sender replacement',
        estimatedTime: '2-3 hours',
        priceRange: '$250-$600',
        specifications: []
      },
      {
        id: 'fuel_pressure_sensor',
        name: 'Fuel Pressure Sensor Replacement',
        description: 'Fuel rail pressure sensor replacement',
        estimatedTime: '30-60 min',
        priceRange: '$150-$350',
        specifications: []
      },
      {
        id: 'fuel_pump_replacement',
        name: 'Fuel Pump Replacement',
        description: 'Electric fuel pump replacement',
        estimatedTime: '2-4 hours',
        priceRange: '$400-$1000',
        specifications: []
      },
      {
        id: 'fuel_tank_replacement',
        name: 'Fuel Tank Replacement',
        description: 'Fuel tank removal and replacement',
        estimatedTime: '3-6 hours',
        priceRange: '$600-$1500',
        specifications: []
      },
      {
        id: 'gas_cap_replacement',
        name: 'Gas Cap Replacement',
        description: 'Fuel filler cap replacement',
        estimatedTime: '5-10 min',
        priceRange: '$20-$50',
        specifications: []
      },
      {
        id: 'head_gasket_replacement',
        name: 'Head Gasket Replacement',
        description: 'Cylinder head gasket replacement',
        estimatedTime: '8-12 hours',
        priceRange: '$1500-$3500',
        specifications: []
      },
      {
        id: 'ignition_coil_replacement',
        name: 'Ignition Coil Replacement',
        description: 'Ignition coil pack replacement',
        estimatedTime: '30-90 min',
        priceRange: '$150-$400',
        specifications: []
      },
      {
        id: 'intake_air_temp_sensor',
        name: 'Intake Air Temperature (IAT) Sensor Replacement',
        description: 'IAT sensor replacement',
        estimatedTime: '15-30 min',
        priceRange: '$80-$200',
        specifications: []
      },
      {
        id: 'intake_manifold_gasket',
        name: 'Intake Manifold Gasket Replacement',
        description: 'Intake manifold gasket service',
        estimatedTime: '3-6 hours',
        priceRange: '$400-$1000',
        specifications: []
      },
      {
        id: 'intercooler_replacement',
        name: 'Intercooler Replacement',
        description: 'Turbo intercooler replacement',
        estimatedTime: '2-4 hours',
        priceRange: '$400-$1200',
        specifications: []
      },
      {
        id: 'knock_sensor_replacement',
        name: 'Knock Sensor Replacement',
        description: 'Engine knock sensor replacement',
        estimatedTime: '1-2 hours',
        priceRange: '$150-$350',
        specifications: []
      },
      {
        id: 'map_sensor_replacement',
        name: 'MAP Sensor Replacement',
        description: 'Manifold absolute pressure sensor replacement',
        estimatedTime: '15-30 min',
        priceRange: '$100-$250',
        specifications: []
      },
      {
        id: 'mass_airflow_sensor',
        name: 'Mass Airflow Sensor Replacement',
        description: 'MAF sensor cleaning or replacement',
        estimatedTime: '15-30 min',
        priceRange: '$150-$400',
        specifications: []
      },
      {
        id: 'obdii_drive_cycle',
        name: 'OBDII Drive Cycle Test',
        description: 'Emissions readiness drive cycle',
        estimatedTime: '30-60 min',
        priceRange: '$80-$150',
        specifications: []
      },
      {
        id: 'oil_change',
        name: 'Oil Change',
        description: 'Engine oil and filter change',
        estimatedTime: '30-45 min',
        priceRange: '$30-$100',
        specifications: []
      },
      {
        id: 'oil_pan_gasket',
        name: 'Oil Pan Gasket Replacement',
        description: 'Oil pan gasket replacement',
        estimatedTime: '2-4 hours',
        priceRange: '$250-$600',
        specifications: []
      },
      {
        id: 'oil_pressure_sensor',
        name: 'Oil Pressure Sensor Replacement',
        description: 'Oil pressure switch replacement',
        estimatedTime: '30-60 min',
        priceRange: '$100-$250',
        specifications: []
      },
      {
        id: 'oil_pump_replacement',
        name: 'Oil Pump Replacement',
        description: 'Engine oil pump replacement',
        estimatedTime: '4-8 hours',
        priceRange: '$600-$1500',
        specifications: []
      },
      {
        id: 'oxygen_sensor_replacement',
        name: 'Oxygen Sensor Replacement',
        description: 'O2 sensor replacement',
        estimatedTime: '30-60 min',
        priceRange: '$150-$400',
        specifications: []
      },
      {
        id: 'powertrain_control_module',
        name: 'Powertrain Control Module Replacement',
        description: 'PCM replacement and programming',
        estimatedTime: '2-4 hours',
        priceRange: '$800-$2000',
        specifications: []
      },
      {
        id: 'powertrain_control_diagnosis',
        name: 'Powertrain Control System Diagnosis & Testing',
        description: 'PCM system diagnosis',
        estimatedTime: '1-3 hours',
        priceRange: '$150-$300',
        specifications: []
      },
      {
        id: 'purge_valve_replacement',
        name: 'Purge Valve Replacement',
        description: 'EVAP purge valve replacement',
        estimatedTime: '30-60 min',
        priceRange: '$100-$250',
        specifications: []
      },
      {
        id: 'radiator_fan_motor',
        name: 'Radiator Fan Motor Replacement',
        description: 'Cooling fan motor replacement',
        estimatedTime: '1-2 hours',
        priceRange: '$200-$500',
        specifications: []
      },
      {
        id: 'radiator_hose_replacement',
        name: 'Radiator Hose Replacement',
        description: 'Upper/lower radiator hose replacement',
        estimatedTime: '30-60 min',
        priceRange: '$100-$250',
        specifications: []
      },
      {
        id: 'radiator_replacement',
        name: 'Radiator Replacement',
        description: 'Engine radiator replacement',
        estimatedTime: '2-4 hours',
        priceRange: '$300-$800',
        specifications: []
      },
      {
        id: 'serpentine_belt_replacement',
        name: 'Serpentine Belt Replacement',
        description: 'Drive belt replacement',
        estimatedTime: '30-60 min',
        priceRange: '$80-$200',
        specifications: []
      },
      {
        id: 'spark_plug_replacement',
        name: 'Spark Plug Replacement',
        description: 'Spark plug replacement service',
        estimatedTime: '1-2 hours',
        priceRange: '$100-$300',
        specifications: []
      },
      {
        id: 'throttle_body_replacement',
        name: 'Throttle Body Replacement',
        description: 'Throttle body cleaning or replacement',
        estimatedTime: '1-2 hours',
        priceRange: '$200-$600',
        specifications: []
      },
      {
        id: 'timing_chain_replacement',
        name: 'Timing Chain Replacement',
        description: 'Timing chain and guides replacement',
        estimatedTime: '4-8 hours',
        priceRange: '$800-$2500',
        specifications: []
      },
      {
        id: 'timing_chain_tensioner',
        name: 'Timing Chain Tensioner Replacement',
        description: 'Timing chain tensioner replacement',
        estimatedTime: '3-6 hours',
        priceRange: '$400-$1200',
        specifications: []
      },
      {
        id: 'trans_mount_replacement',
        name: 'Trans Mount Replacement',
        description: 'Transmission mount replacement',
        estimatedTime: '1-2 hours',
        priceRange: '$150-$400',
        specifications: []
      },
      {
        id: 'trans_oil_pan_gasket',
        name: 'Trans Oil Pan Gasket Replacement',
        description: 'Transmission pan gasket replacement',
        estimatedTime: '1-2 hours',
        priceRange: '$150-$350',
        specifications: []
      },
      {
        id: 'transmission_filter_fluid',
        name: 'Transmission Filter and Fluid Change',
        description: 'Complete transmission service',
        estimatedTime: '1-2 hours',
        priceRange: '$150-$400',
        specifications: []
      },
      {
        id: 'transmission_fluid_change',
        name: 'Transmission Fluid Change',
        description: 'Transmission fluid drain and fill',
        estimatedTime: '30-60 min',
        priceRange: '$100-$200',
        specifications: []
      },
      {
        id: 'transmission_leak_inspection',
        name: 'Transmission Leak Inspection',
        description: 'Transmission leak diagnosis',
        estimatedTime: '30-60 min',
        priceRange: '$80-$150',
        specifications: []
      },
      {
        id: 'turbocharger_assembly',
        name: 'Turbocharger Assembly Replacement',
        description: 'Turbo replacement service',
        estimatedTime: '4-8 hours',
        priceRange: '$1500-$4000',
        specifications: []
      },
      {
        id: 'turbocharger_boost_sensor',
        name: 'Turbocharger Boost Sensor Replacement',
        description: 'Boost pressure sensor replacement',
        estimatedTime: '30-60 min',
        priceRange: '$150-$350',
        specifications: []
      },
      {
        id: 'turbocharger_intercooler_tube',
        name: 'Turbocharger Intercooler Tube Replacement',
        description: 'Turbo intercooler piping replacement',
        estimatedTime: '1-2 hours',
        priceRange: '$200-$500',
        specifications: []
      },
      {
        id: 'turbocharger_oil_line',
        name: 'Turbocharger Oil Line Replacement',
        description: 'Turbo oil feed/return line replacement',
        estimatedTime: '2-4 hours',
        priceRange: '$300-$800',
        specifications: []
      },
      {
        id: 'water_pump_replacement',
        name: 'Water Pump Replacement',
        description: 'Engine water pump replacement',
        estimatedTime: '2-5 hours',
        priceRange: '$300-$800',
        specifications: []
      },
    ],
  },
  {
    id: 'suspension_steering',
    name: 'Suspension & Steering',
    emoji: '🚗',
    subcategories: [
      {
        id: 'active_suspension_diagnosis',
        name: 'Active Suspension System Diagnosis & Testing',
        description: 'Active suspension system diagnosis and testing',
        estimatedTime: '1-2 hours',
        priceRange: '$150-$300',
        specifications: []
      },
      {
        id: 'control_arm_replacement',
        name: 'Control Arm Replacement',
        description: 'Control arm replacement service',
        estimatedTime: '2-4 hours',
        priceRange: '$300-$800',
        specifications: []
      },
      {
        id: 'power_steering_leak_inspection',
        name: 'Power Steering System Leak Inspection',
        description: 'Power steering system leak inspection and diagnosis',
        estimatedTime: '1-2 hours',
        priceRange: '$100-$200',
        specifications: []
      },
      {
        id: 'rack_pinion_replacement',
        name: 'Rack and Pinion Replacement',
        description: 'Steering rack and pinion replacement',
        estimatedTime: '3-5 hours',
        priceRange: '$800-$1500',
        specifications: []
      },
      {
        id: 'stabilizer_bar_link_kit',
        name: 'Stabilizer Bar Link Kit Replacement',
        description: 'Stabilizer bar link kit replacement',
        estimatedTime: '1-2 hours',
        priceRange: '$150-$400',
        specifications: []
      },
      {
        id: 'stabilizer_bushing_replacement',
        name: 'Stabilizer Bushing Replacement',
        description: 'Stabilizer bar bushing replacement',
        estimatedTime: '1-2 hours',
        priceRange: '$100-$300',
        specifications: []
      },
      {
        id: 'steering_knuckle_replacement',
        name: 'Steering Knuckle Replacement',
        description: 'Steering knuckle replacement service',
        estimatedTime: '3-4 hours',
        priceRange: '$400-$800',
        specifications: []
      },
      {
        id: 'suspension_ball_joint',
        name: 'Suspension Ball Joint Replacement',
        description: 'Suspension ball joint replacement',
        estimatedTime: '2-3 hours',
        priceRange: '$200-$600',
        specifications: []
      },
      {
        id: 'suspension_control_arm_bushings',
        name: 'Suspension Control Arm Bushings Replacement',
        description: 'Control arm bushing replacement',
        estimatedTime: '2-3 hours',
        priceRange: '$200-$500',
        specifications: []
      },
      {
        id: 'suspension_shock_strut',
        name: 'Suspension Shock or Strut Replacement',
        description: 'Shock absorber or strut replacement',
        estimatedTime: '2-4 hours',
        priceRange: '$300-$1200',
        specifications: []
      },
      {
        id: 'suspension_system_inspect',
        name: 'Suspension System Inspect',
        description: 'Complete suspension system inspection',
        estimatedTime: '1-2 hours',
        priceRange: '$100-$200',
        specifications: []
      },
      {
        id: 'tie_rod_replacement',
        name: 'Tie Rod Replacement',
        description: 'Tie rod end replacement service',
        estimatedTime: '1-3 hours',
        priceRange: '$150-$500',
        specifications: []
      },
      {
        id: 'tire_balancing',
        name: 'Tire Balancing',
        description: 'Wheel and tire balancing service',
        estimatedTime: '30-60 min',
        priceRange: '$60-$120',
        specifications: []
      },
      {
        id: 'tire_rotation',
        name: 'Tire Rotation',
        description: 'Tire rotation service',
        estimatedTime: '30-45 min',
        priceRange: '$50-$100',
        specifications: []
      },
      {
        id: 'wheel_alignment',
        name: 'Wheel Alignment',
        description: 'Front end alignment service',
        estimatedTime: '1-2 hours',
        priceRange: '$80-$200',
        specifications: []
      },
      {
        id: 'wheel_bearing_replacement',
        name: 'Wheel Bearing Replacement',
        description: 'Wheel bearing replacement service',
        estimatedTime: '2-4 hours',
        priceRange: '$300-$700',
        specifications: []
      },
      {
        id: 'wheel_hub_assembly',
        name: 'Wheel Hub Assembly Replacement',
        description: 'Complete wheel hub assembly replacement',
        estimatedTime: '2-4 hours',
        priceRange: '$400-$800',
        specifications: []
      },
      {
        id: 'wheel_hub_replacement',
        name: 'Wheel Hub Replacement',
        description: 'Wheel hub replacement service',
        estimatedTime: '2-3 hours',
        priceRange: '$300-$600',
        specifications: []
      },
      {
        id: 'wheel_replacement',
        name: 'Wheel Replacement',
        description: 'Individual wheel replacement service',
        estimatedTime: '30-60 min',
        priceRange: '$100-$500',
        specifications: []
      },
    ],
  },
  {
    id: 'heating_air',
    name: 'Heating & Air',
    emoji: '❄️',
    subcategories: [
      {
        id: 'ac_compressor_replacement',
        name: 'AC Compressor Replacement',
        description: 'Air conditioning compressor replacement',
        estimatedTime: '3-5 hours',
        priceRange: '$800-$2000',
        specifications: []
      },
      {
        id: 'ac_condenser_replacement',
        name: 'AC Condenser Replacement',
        description: 'Air conditioning condenser replacement',
        estimatedTime: '2-4 hours',
        priceRange: '$400-$1200',
        specifications: []
      },
      {
        id: 'ac_diagnosis',
        name: 'AC Diagnosis',
        description: 'Air conditioning system diagnosis and testing',
        estimatedTime: '1-2 hours',
        priceRange: '$150-$300',
        specifications: []
      },
      {
        id: 'ac_recharge_leak_inspection',
        name: 'AC Recharge and Leak Inspection',
        description: 'Refrigerant recharge and leak detection service',
        estimatedTime: '1-2 hours',
        priceRange: '$150-$300',
        specifications: []
      },
      {
        id: 'ac_expansion_valve',
        name: 'Air Conditioning Expansion Valve Replacement',
        description: 'AC expansion valve replacement',
        estimatedTime: '2-3 hours',
        priceRange: '$300-$600',
        specifications: []
      },
      {
        id: 'ac_receiver_drier',
        name: 'Air Conditioning Receiver Drier Assembly Replacement',
        description: 'AC receiver drier assembly replacement',
        estimatedTime: '1-2 hours',
        priceRange: '$200-$400',
        specifications: []
      },
      {
        id: 'ac_refrigerant_line',
        name: 'Air Conditioning Refrigerant Line Replacement',
        description: 'AC refrigerant line replacement',
        estimatedTime: '2-4 hours',
        priceRange: '$300-$800',
        specifications: []
      },
      {
        id: 'ac_pressure_sensor',
        name: 'Air Conditioning Refrigerant Pressure Sensor Replacement',
        description: 'AC refrigerant pressure sensor replacement',
        estimatedTime: '30-60 min',
        priceRange: '$150-$350',
        specifications: []
      },
      {
        id: 'ac_pressure_switch',
        name: 'Air Conditioning Refrigerant Pressure Switch Replacement',
        description: 'AC refrigerant pressure switch replacement',
        estimatedTime: '30-60 min',
        priceRange: '$100-$250',
        specifications: []
      },
      {
        id: 'ac_refrigerant_recover',
        name: 'Air Conditioning Refrigerant Recover',
        description: 'AC refrigerant recovery service',
        estimatedTime: '30-60 min',
        priceRange: '$100-$200',
        specifications: []
      },
      {
        id: 'ac_system_leak_inspection',
        name: 'Air Conditioning System Leak Inspection',
        description: 'Complete AC system leak inspection',
        estimatedTime: '1-2 hours',
        priceRange: '$150-$300',
        specifications: []
      },
      {
        id: 'ambient_air_temp_sensor',
        name: 'Ambient Air Temperature Sensor Replacement',
        description: 'Ambient air temperature sensor replacement',
        estimatedTime: '30-60 min',
        priceRange: '$100-$250',
        specifications: []
      },
      {
        id: 'blower_motor_replacement',
        name: 'Blower Motor Replacement',
        description: 'Cabin air blower motor replacement',
        estimatedTime: '1-3 hours',
        priceRange: '$200-$500',
        specifications: []
      },
      {
        id: 'cabin_air_filter_replacement',
        name: 'Cabin Air Filter Replacement',
        description: 'Cabin air filter replacement service',
        estimatedTime: '15-30 min',
        priceRange: '$30-$100',
        specifications: []
      },
      {
        id: 'heater_core_replacement',
        name: 'Heater Core Replacement',
        description: 'Heater core replacement service',
        estimatedTime: '4-8 hours',
        priceRange: '$500-$1200',
        specifications: []
      },
      {
        id: 'heater_hose_replacement',
        name: 'Heater Hose Replacement',
        description: 'Heater hose replacement service',
        estimatedTime: '1-2 hours',
        priceRange: '$100-$300',
        specifications: []
      },
      {
        id: 'hvac_air_door_actuator',
        name: 'HVAC Air Door Actuator Replacement',
        description: 'HVAC air door actuator replacement',
        estimatedTime: '1-3 hours',
        priceRange: '$200-$500',
        specifications: []
      },
    ],
  },
  {
    id: 'brakes',
    name: 'Brakes',
    emoji: '🛑',
    subcategories: [
      {
        id: 'abs_control_module',
        name: 'ABS Control Module Replacement',
        description: 'ABS control module replacement and programming',
        estimatedTime: '2-4 hours',
        priceRange: '$800-$1500',
        specifications: []
      },
      {
        id: 'abs_hydraulic_control_unit',
        name: 'ABS Hydraulic Control Unit Replacement',
        description: 'ABS hydraulic unit replacement',
        estimatedTime: '3-5 hours',
        priceRange: '$1000-$2000',
        specifications: []
      },
      {
        id: 'abs_diagnosis',
        name: 'Anti-lock Brake System (ABS) Diagnosis',
        description: 'ABS system diagnosis and troubleshooting',
        estimatedTime: '1-2 hours',
        priceRange: '$150-$300',
        specifications: []
      },
      {
        id: 'abs_inspect',
        name: 'Anti-lock Brake System Inspect',
        description: 'ABS system inspection and testing',
        estimatedTime: '30-60 min',
        priceRange: '$100-$200',
        specifications: []
      },
      {
        id: 'brake_bleed',
        name: 'Brake Bleed',
        description: 'Brake system bleeding and air removal',
        estimatedTime: '30-60 min',
        priceRange: '$80-$150',
        specifications: []
      },
      {
        id: 'brake_booster_replacement',
        name: 'Brake Booster Replacement',
        description: 'Power brake booster replacement',
        estimatedTime: '2-4 hours',
        priceRange: '$400-$800',
        specifications: []
      },
      {
        id: 'brake_caliper_replacement',
        name: 'Brake Caliper Replacement',
        description: 'Brake caliper replacement service',
        estimatedTime: '1-3 hours',
        priceRange: '$200-$500',
        specifications: []
      },
      {
        id: 'brake_hose_replacement',
        name: 'Brake Hose Replacement',
        description: 'Brake hose replacement and inspection',
        estimatedTime: '1-2 hours',
        priceRange: '$100-$300',
        specifications: []
      },
      {
        id: 'brake_master_cylinder',
        name: 'Brake Master Cylinder Replacement',
        description: 'Master cylinder replacement and bleeding',
        estimatedTime: '2-3 hours',
        priceRange: '$300-$600',
        specifications: []
      },
      {
        id: 'brake_master_cylinder_reservoir',
        name: 'Brake Master Cylinder Reservoir Replacement',
        description: 'Master cylinder reservoir replacement',
        estimatedTime: '30-60 min',
        priceRange: '$100-$250',
        specifications: []
      },
      {
        id: 'brake_pad_replacement',
        name: 'Brake Pad Replacement',
        description: 'Brake pad replacement service',
        estimatedTime: '1-2 hours',
        priceRange: '$150-$400',
        specifications: []
      },
      {
        id: 'brake_pressure_sensor',
        name: 'Brake Pressure Sensor Replacement',
        description: 'Brake pressure sensor replacement',
        estimatedTime: '30-90 min',
        priceRange: '$150-$350',
        specifications: []
      },
      {
        id: 'brake_rotor_replacement',
        name: 'Brake Rotor Replacement',
        description: 'Brake rotor replacement or resurfacing',
        estimatedTime: '1-3 hours',
        priceRange: '$150-$500',
        specifications: []
      },
      {
        id: 'brake_system_inspect',
        name: 'Brake System Inspect',
        description: 'Complete brake system inspection',
        estimatedTime: '30-60 min',
        priceRange: '$80-$150',
        specifications: []
      },
      {
        id: 'brake_vacuum_pump',
        name: 'Brake Vacuum Pump Replacement',
        description: 'Brake vacuum pump replacement',
        estimatedTime: '2-3 hours',
        priceRange: '$300-$700',
        specifications: []
      },
      {
        id: 'parking_brake_switch',
        name: 'Parking Brake Activation Switch Replacement',
        description: 'Parking brake switch replacement',
        estimatedTime: '30-60 min',
        priceRange: '$80-$200',
        specifications: []
      },
      {
        id: 'wheel_speed_sensor',
        name: 'Wheel Speed Sensor Replacement',
        description: 'ABS wheel speed sensor replacement',
        estimatedTime: '1-2 hours',
        priceRange: '$150-$350',
        specifications: []
      },
    ],
  },
  {
    id: 'body_interior',
    name: 'Body & Interior',
    emoji: '🚪',
    subcategories: [
      {
        id: 'air_bag_control_module',
        name: 'Air Bag Control Module Replacement',
        description: 'Air bag control module replacement and programming',
        estimatedTime: '2-4 hours',
        priceRange: '$500-$1200',
        specifications: []
      },
      {
        id: 'air_bag_crash_sensor',
        name: 'Air Bag Crash Sensor Replacement',
        description: 'Air bag crash sensor replacement',
        estimatedTime: '1-2 hours',
        priceRange: '$200-$500',
        specifications: []
      },
      {
        id: 'air_bag_occupant_sensor',
        name: 'Air Bag Occupant Sensor Replacement',
        description: 'Air bag occupant sensor replacement',
        estimatedTime: '1-2 hours',
        priceRange: '$150-$400',
        specifications: []
      },
      {
        id: 'dashboard_replacement',
        name: 'Dashboard Replacement',
        description: 'Dashboard replacement service',
        estimatedTime: '4-8 hours',
        priceRange: '$800-$2000',
        specifications: []
      },
      {
        id: 'door_handle_replacement',
        name: 'Door Handle Replacement',
        description: 'Door handle replacement service',
        estimatedTime: '1-2 hours',
        priceRange: '$100-$300',
        specifications: []
      },
      {
        id: 'door_lock_actuator',
        name: 'Door Lock Actuator Replacement',
        description: 'Door lock actuator replacement',
        estimatedTime: '1-3 hours',
        priceRange: '$150-$400',
        specifications: []
      },
      {
        id: 'door_lock_cylinder',
        name: 'Door Lock Cylinder Replacement',
        description: 'Door lock cylinder replacement',
        estimatedTime: '1-2 hours',
        priceRange: '$80-$200',
        specifications: []
      },
      {
        id: 'door_mirror_replacement',
        name: 'Door Mirror Replacement',
        description: 'Door mirror replacement service',
        estimatedTime: '30-60 min',
        priceRange: '$100-$300',
        specifications: []
      },
      {
        id: 'fuel_door_release_actuator',
        name: 'Fuel Door Release Actuator Replacement',
        description: 'Fuel door release actuator replacement',
        estimatedTime: '1-2 hours',
        priceRange: '$100-$250',
        specifications: []
      },
      {
        id: 'hood_latch_replacement',
        name: 'Hood Latch Replacement',
        description: 'Hood latch replacement service',
        estimatedTime: '1-2 hours',
        priceRange: '$80-$200',
        specifications: []
      },
      {
        id: 'hood_release_cable',
        name: 'Hood Release Cable Replacement',
        description: 'Hood release cable replacement',
        estimatedTime: '1-2 hours',
        priceRange: '$80-$200',
        specifications: []
      },
      {
        id: 'hood_support_strut',
        name: 'Hood Support Strut Replacement',
        description: 'Hood support strut replacement',
        estimatedTime: '30-60 min',
        priceRange: '$50-$150',
        specifications: []
      },
      {
        id: 'power_door_lock_switch',
        name: 'Power Door Lock Switch Replacement',
        description: 'Power door lock switch replacement',
        estimatedTime: '30-60 min',
        priceRange: '$80-$200',
        specifications: []
      },
      {
        id: 'power_lumbar_switch',
        name: 'Power Lumbar Switch Replacement',
        description: 'Power lumbar switch replacement',
        estimatedTime: '1-2 hours',
        priceRange: '$100-$250',
        specifications: []
      },
      {
        id: 'power_seat_motor',
        name: 'Power Seat Motor Replacement',
        description: 'Power seat motor replacement',
        estimatedTime: '2-4 hours',
        priceRange: '$300-$800',
        specifications: []
      },
      {
        id: 'power_seat_switch',
        name: 'Power Seat Switch Replacement',
        description: 'Power seat switch replacement',
        estimatedTime: '1-2 hours',
        priceRange: '$100-$250',
        specifications: []
      },
      {
        id: 'seat_heater_replacement',
        name: 'Seat Heater Replacement',
        description: 'Seat heater replacement service',
        estimatedTime: '2-4 hours',
        priceRange: '$200-$600',
        specifications: []
      },
      {
        id: 'sunroof_motor_replacement',
        name: 'Sunroof Motor Replacement',
        description: 'Sunroof motor replacement service',
        estimatedTime: '2-4 hours',
        priceRange: '$300-$700',
        specifications: []
      },
      {
        id: 'sunroof_switch_replacement',
        name: 'Sunroof Switch Replacement',
        description: 'Sunroof switch replacement service',
        estimatedTime: '30-60 min',
        priceRange: '$80-$200',
        specifications: []
      },
      {
        id: 'trunk_lock_actuator',
        name: 'Trunk Lock Actuator Replacement',
        description: 'Trunk lock actuator replacement',
        estimatedTime: '1-2 hours',
        priceRange: '$100-$250',
        specifications: []
      },
      {
        id: 'window_regulator_replacement',
        name: 'Window Regulator Replacement',
        description: 'Window regulator replacement service',
        estimatedTime: '2-4 hours',
        priceRange: '$200-$600',
        specifications: []
      },
      {
        id: 'window_switch_replacement',
        name: 'Window Switch Replacement',
        description: 'Window switch replacement service',
        estimatedTime: '30-60 min',
        priceRange: '$80-$200',
        specifications: []
      },
    ],
  },
  {
    id: 'electrical_lights',
    name: 'Electrical & Lights',
    emoji: '💡',
    subcategories: [
      {
        id: 'alternator_replacement',
        name: 'Alternator Replacement',
        description: 'Alternator replacement and testing',
        estimatedTime: '2-4 hours',
        priceRange: '$400-$1000',
        specifications: []
      },
      {
        id: 'antitheft_system_diagnosis',
        name: 'Antitheft System Diagnosis & Testing',
        description: 'Antitheft system diagnosis and testing',
        estimatedTime: '1-3 hours',
        priceRange: '$150-$400',
        specifications: []
      },
      {
        id: 'backup_warning_sensor',
        name: 'Backup Warning System Sensor Replacement',
        description: 'Backup warning system sensor replacement',
        estimatedTime: '1-2 hours',
        priceRange: '$150-$350',
        specifications: []
      },
      {
        id: 'battery_cable_terminal',
        name: 'Battery Cable Battery Terminal End Service',
        description: 'Battery cable terminal end service and cleaning',
        estimatedTime: '30-60 min',
        priceRange: '$50-$150',
        specifications: []
      },
      {
        id: 'battery_cable_replacement',
        name: 'Battery Cable Replacement',
        description: 'Battery cable replacement service',
        estimatedTime: '1-2 hours',
        priceRange: '$100-$300',
        specifications: []
      },
      {
        id: 'battery_replacement',
        name: 'Battery Replacement',
        description: 'Battery replacement service',
        estimatedTime: '30-60 min',
        priceRange: '$100-$300',
        specifications: []
      },
      {
        id: 'battery_test',
        name: 'Battery Test',
        description: 'Battery testing and diagnostic service',
        estimatedTime: '30 min',
        priceRange: '$50-$100',
        specifications: []
      },
      {
        id: 'body_control_diagnosis',
        name: 'Body Control System Diagnosis & Testing',
        description: 'Body control system diagnosis and testing',
        estimatedTime: '1-3 hours',
        priceRange: '$150-$400',
        specifications: []
      },
      {
        id: 'brake_light_switch',
        name: 'Brake Light Switch Replacement',
        description: 'Brake light switch replacement',
        estimatedTime: '30-60 min',
        priceRange: '$50-$150',
        specifications: []
      },
      {
        id: 'electrical_system_diagnosis',
        name: 'Electrical System Diagnosis',
        description: 'Electrical system diagnosis and testing',
        estimatedTime: '1-4 hours',
        priceRange: '$150-$500',
        specifications: []
      },
      {
        id: 'headlamp_alignment',
        name: 'Headlamp Alignment Adjust',
        description: 'Headlamp alignment adjustment service',
        estimatedTime: '30-60 min',
        priceRange: '$50-$150',
        specifications: []
      },
      {
        id: 'headlamp_control_module',
        name: 'Headlamp Control Module Replacement',
        description: 'Headlamp control module replacement',
        estimatedTime: '1-2 hours',
        priceRange: '$200-$500',
        specifications: []
      },
      {
        id: 'headlamp_switch',
        name: 'Headlamp Switch Replacement',
        description: 'Headlamp switch replacement',
        estimatedTime: '1-2 hours',
        priceRange: '$80-$200',
        specifications: []
      },
      {
        id: 'headlight_bulb',
        name: 'Headlight Bulb Replacement',
        description: 'Headlight bulb replacement service',
        estimatedTime: '30-60 min',
        priceRange: '$50-$150',
        specifications: []
      },
      {
        id: 'horn_replacement',
        name: 'Horn Replacement',
        description: 'Horn replacement service',
        estimatedTime: '30-60 min',
        priceRange: '$50-$150',
        specifications: []
      },
      {
        id: 'ignition_switch',
        name: 'Ignition Switch Replacement',
        description: 'Ignition switch replacement service',
        estimatedTime: '1-3 hours',
        priceRange: '$150-$400',
        specifications: []
      },
      {
        id: 'instrument_cluster',
        name: 'Instrument Cluster Replacement',
        description: 'Instrument cluster replacement service',
        estimatedTime: '2-4 hours',
        priceRange: '$300-$800',
        specifications: []
      },
      {
        id: 'multi_function_switch',
        name: 'Multi-Function Switch Replacement',
        description: 'Multi-function switch replacement',
        estimatedTime: '1-2 hours',
        priceRange: '$100-$300',
        specifications: []
      },
      {
        id: 'park_assist_camera',
        name: 'Park Assist Camera Replacement',
        description: 'Park assist camera replacement',
        estimatedTime: '1-3 hours',
        priceRange: '$200-$600',
        specifications: []
      },
      {
        id: 'starter_replacement',
        name: 'Starter Replacement',
        description: 'Starter motor replacement service',
        estimatedTime: '2-4 hours',
        priceRange: '$250-$700',
        specifications: []
      },
      {
        id: 'tpms_relearn',
        name: 'Tire Pressure Monitoring System Relearn',
        description: 'TPMS sensor relearn and programming',
        estimatedTime: '30-60 min',
        priceRange: '$50-$150',
        specifications: []
      },
      {
        id: 'washer_fluid_sensor',
        name: 'Washer Fluid Level Sensor Replacement',
        description: 'Washer fluid level sensor replacement',
        estimatedTime: '30-60 min',
        priceRange: '$80-$200',
        specifications: []
      },
      {
        id: 'window_regulator_motor',
        name: 'Window Regulator Motor Replacement',
        description: 'Window regulator motor replacement',
        estimatedTime: '2-3 hours',
        priceRange: '$150-$400',
        specifications: []
      },
      {
        id: 'washer_fluid_reservoir',
        name: 'Windshield Washer Fluid Reservoir Replacement',
        description: 'Windshield washer fluid reservoir replacement',
        estimatedTime: '1-2 hours',
        priceRange: '$80-$200',
        specifications: []
      },
      {
        id: 'washer_pump',
        name: 'Windshield Washer Pump Replacement',
        description: 'Windshield washer pump replacement',
        estimatedTime: '1-2 hours',
        priceRange: '$80-$200',
        specifications: []
      },
      {
        id: 'wiper_arm',
        name: 'Windshield Wiper Arm Replacement',
        description: 'Windshield wiper arm replacement',
        estimatedTime: '30-60 min',
        priceRange: '$50-$150',
        specifications: []
      },
      {
        id: 'wiper_blade',
        name: 'Windshield Wiper Blade Replacement',
        description: 'Windshield wiper blade replacement',
        estimatedTime: '15-30 min',
        priceRange: '$20-$60',
        specifications: []
      },
      {
        id: 'wiper_motor',
        name: 'Windshield Wiper Motor Replacement',
        description: 'Windshield wiper motor replacement',
        estimatedTime: '2-3 hours',
        priceRange: '$200-$500',
        specifications: []
      },
    ],
  },
  {
    id: 'scheduled_maintenance',
    name: 'Scheduled Maintenance',
    emoji: '📅',
    subcategories: [
      {
        id: '10k_mile_service',
        name: '10,000 Mile Service',
        description: 'Basic maintenance service including oil change, filter check, and fluid inspection',
        estimatedTime: '1-2 hours',
        priceRange: '$150-$350',
        specifications: []
      },
      {
        id: '20k_mile_service',
        name: '20,000 Mile Service',
        description: 'Intermediate maintenance service with tire rotation and comprehensive inspection',
        estimatedTime: '1.5-2.5 hours',
        priceRange: '$250-$550',
        specifications: []
      },
      {
        id: '30k_mile_service',
        name: '30,000 Mile Service',
        description: 'Major maintenance service including air filter, cabin filter, and fluid changes',
        estimatedTime: '2-3 hours',
        priceRange: '$350-$750',
        specifications: []
      },
      {
        id: '40k_mile_service',
        name: '40,000 Mile Service',
        description: 'Comprehensive maintenance service with brake inspection and belt check',
        estimatedTime: '2-3 hours',
        priceRange: '$400-$800',
        specifications: []
      },
      {
        id: '50k_mile_service',
        name: '50,000 Mile Service',
        description: 'Major service interval with transmission service and cooling system check',
        estimatedTime: '2.5-4 hours',
        priceRange: '$500-$1000',
        specifications: []
      },
      {
        id: '60k_mile_service',
        name: '60,000 Mile Service',
        description: 'Comprehensive maintenance including spark plugs, filters, and major fluid services',
        estimatedTime: '3-5 hours',
        priceRange: '$600-$1200',
        specifications: []
      },
      {
        id: '70k_mile_service',
        name: '70,000 Mile Service',
        description: 'Major maintenance service with brake fluid change and comprehensive inspection',
        estimatedTime: '2.5-4 hours',
        priceRange: '$500-$1000',
        specifications: []
      },
      {
        id: '80k_mile_service',
        name: '80,000 Mile Service',
        description: 'Comprehensive service including transmission filter and differential service',
        estimatedTime: '3-4 hours',
        priceRange: '$550-$1100',
        specifications: []
      },
      {
        id: '90k_mile_service',
        name: '90,000 Mile Service',
        description: 'Major maintenance interval with timing belt inspection and major fluid changes',
        estimatedTime: '3-5 hours',
        priceRange: '$650-$1300',
        specifications: []
      },
      {
        id: '100k_mile_service',
        name: '100,000 Mile Service',
        description: 'Major milestone service with comprehensive system inspection and major component service',
        estimatedTime: '4-6 hours',
        priceRange: '$800-$1600',
        specifications: []
      },
      {
        id: '110k_mile_service',
        name: '110,000 Mile Service',
        description: 'Comprehensive maintenance service with cooling system service and belt replacement',
        estimatedTime: '3-4 hours',
        priceRange: '$600-$1200',
        specifications: []
      },
      {
        id: '120k_mile_service',
        name: '120,000 Mile Service',
        description: 'Major service interval with spark plugs, filters, and comprehensive fluid service',
        estimatedTime: '3-5 hours',
        priceRange: '$700-$1400',
        specifications: []
      },
      {
        id: '130k_mile_service',
        name: '130,000 Mile Service',
        description: 'Comprehensive maintenance including transmission service and brake system inspection',
        estimatedTime: '3-4 hours',
        priceRange: '$650-$1300',
        specifications: []
      },
      {
        id: '140k_mile_service',
        name: '140,000 Mile Service',
        description: 'Major maintenance service with timing system inspection and major fluid changes',
        estimatedTime: '3-5 hours',
        priceRange: '$700-$1400',
        specifications: []
      },
      {
        id: '150k_mile_service',
        name: '150,000 Mile Service',
        description: 'Major milestone service with comprehensive system overhaul and major component replacement',
        estimatedTime: '4-6 hours',
        priceRange: '$900-$1800',
        specifications: []
      },
    ],
  },
  {
    id: 'diagnosis_testing',
    name: 'Diagnosis & Testing',
    emoji: '🔍',
    subcategories: [
      {
        id: 'check_engine_light',
        name: 'Check Engine Light Diagnosis & Testing',
        description: 'Check engine light diagnosis and testing service',
        estimatedTime: '1-3 hours',
        priceRange: '$150-$400',
        specifications: []
      },
      {
        id: 'engine_oil_light',
        name: 'Engine Oil Light Diagnosis',
        description: 'Engine oil light diagnosis and testing',
        estimatedTime: '30-60 min',
        priceRange: '$80-$200',
        specifications: []
      },
      {
        id: 'general_diagnosis',
        name: 'General Diagnosis',
        description: 'General vehicle diagnosis and testing service',
        estimatedTime: '1-4 hours',
        priceRange: '$200-$600',
        specifications: []
      },
      {
        id: 'no_start_diagnosis',
        name: 'No Start Diagnosis',
        description: 'No start condition diagnosis and testing',
        estimatedTime: '1-3 hours',
        priceRange: '$150-$400',
        specifications: []
      },
      {
        id: 'noise_diagnosis',
        name: 'Noise Diagnosis',
        description: 'Unusual noise identification and diagnosis',
        estimatedTime: '1-3 hours',
        priceRange: '$150-$400',
        specifications: []
      },
      {
        id: 'pre_purchase_inspection',
        name: 'Pre-Purchase Car Inspection',
        description: 'Comprehensive pre-purchase vehicle inspection',
        estimatedTime: '2-4 hours',
        priceRange: '$300-$800',
        specifications: []
      },
      {
        id: 'tpms_lamp_diagnosis',
        name: 'Tire Pressure Monitor Lamp Diagnosis',
        description: 'Tire pressure monitor lamp diagnosis and testing',
        estimatedTime: '30-90 min',
        priceRange: '$80-$200',
        specifications: []
      },
      {
        id: 'vibration_diagnosis',
        name: 'Vibration Diagnosis',
        description: 'Vibration and handling issue diagnosis',
        estimatedTime: '1-3 hours',
        priceRange: '$150-$400',
        specifications: []
      },
    ],
  },
];

export const CAR_SERVICES = [
  {
    id: 'oil-change',
    emoji: '🛢️',
    title: 'Oil Change',
    description: 'Full synthetic oil change with filter replacement and inspection.',
    laborCost: 120,
    partsCost: 60,
    category: 'Car Repair',
    subcategory: 'Maintenance',
  },
  {
    id: 'brake-service',
    emoji: '🛞',
    title: 'Brake Service',
    description: 'Brake pad replacement, rotor resurfacing, and system checks.',
    laborCost: 280,
    partsCost: 150,
    category: 'Car Repair',
    subcategory: 'Brakes',
  },
  {
    id: 'battery-replacement',
    emoji: '🔋',
    title: 'Battery Replacement',
    description: 'On-site battery testing, replacement, and disposal of old battery.',
    laborCost: 90,
    partsCost: 180,
    category: 'Car Repair',
    subcategory: 'Electrical',
  },
  {
    id: 'engine-diagnostic',
    emoji: '🔧',
    title: 'Engine Diagnostic',
    description: 'Advanced scan, fault code analysis, and detailed repair plan.',
    laborCost: 140,
    partsCost: 0,
    category: 'Car Repair',
    subcategory: 'Diagnostics',
  },
  {
    id: 'suspension',
    emoji: '🛠️',
    title: 'Suspension Service',
    description: 'Shocks, struts, and ride control inspection with replacement available.',
    laborCost: 260,
    partsCost: 220,
    category: 'Car Repair',
    subcategory: 'Suspension',
  },
]

export const TIRE_SERVICES = [
  {
    id: 'tire-repair',
    emoji: '🛞',
    title: 'Tire Repair',
    description: 'Patch, plug, and balance service for flats and punctures.',
    laborCost: 80,
    partsCost: 25,
    category: 'Tire Repair',
    subcategory: 'Repair',
  },
  {
    id: 'tire-replacement',
    emoji: '⚙️',
    title: 'Tire Replacement',
    description: 'New tire installation with balancing and TPMS reset.',
    laborCost: 150,
    partsCost: 400,
    category: 'Tire Repair',
    subcategory: 'Replacement',
  },
  {
    id: 'rotation',
    emoji: '🔄',
    title: 'Rotation & Alignment',
    description: 'Four-wheel rotation with laser alignment and road test.',
    laborCost: 120,
    partsCost: 0,
    category: 'Tire Repair',
    subcategory: 'Maintenance',
  },
]

export const WASH_SERVICES = [
  {
    id: 'basic-wash',
    emoji: '🧼',
    title: 'Basic Wash',
    description: 'Exterior wash, dry, and tire shine completed on-site.',
    laborCost: 75,
    partsCost: 15,
    category: 'Mobile Wash',
    subcategory: 'Exterior',
  },
  {
    id: 'full-detail',
    emoji: '✨',
    title: 'Full Detail',
    description: 'Interior shampoo, exterior polish, ceramic spray, and odor neutralizer.',
    laborCost: 220,
    partsCost: 60,
    category: 'Mobile Wash',
    subcategory: 'Detailing',
  },
  {
    id: 'fleet-wash',
    emoji: '🚐',
    title: 'Fleet Wash',
    description: 'Customized multi-vehicle wash program for business fleets.',
    laborCost: 320,
    partsCost: 90,
    category: 'Mobile Wash',
    subcategory: 'Fleet',
  },
]
