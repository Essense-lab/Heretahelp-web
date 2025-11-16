// User Types
export enum UserType {
  CUSTOMER = 'CUSTOMER',
  TECHNICIAN = 'TECHNICIAN',
  CAR_TECHNICIAN = 'CAR_TECHNICIAN',
  BOAT_TECHNICIAN = 'BOAT_TECHNICIAN',
  TIRE_TECHNICIAN = 'TIRE_TECHNICIAN',
  DIESEL_TECHNICIAN = 'DIESEL_TECHNICIAN',
  MOBILE_WASH_TECHNICIAN = 'MOBILE_WASH_TECHNICIAN',
  LOCKSMITH = 'LOCKSMITH',
  TOW_TRUCK_DRIVER = 'TOW_TRUCK_DRIVER',
  ADMIN = 'ADMIN',
}

export interface UserProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  phoneNumber?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  userType: UserType
  profilePictureUrl?: string
  onboardingCompleted: boolean
  createdAt: string
  updatedAt: string
}

// Vehicle Information
export interface VehicleInfo {
  year: string
  make: string
  model: string
  engineSize: string
  mileage: string
  vin: string
  trim: string
  fuelType: string
  transmission?: string
  driveType?: string
  bodyStyle?: string
  doors?: string
}

// Location Types
export interface ServiceLocation {
  address: string
  city: string
  state: string
  zipCode: string
  latitude?: number
  longitude?: number
}

export interface TowingLocation extends ServiceLocation {
  crossStreet?: string
}

// Service Types
export interface ServiceCategory {
  id: string
  name: string
  description: string
  icon: string
  isActive: boolean
}

// Repair Board Types
export interface RepairBoardPost {
  id: string
  userId: string
  userName: string
  vehicleYear: string
  vehicleMake: string
  vehicleModel: string
  vehicleEngine: string
  serviceCategory: string
  serviceSubcategory: string
  serviceSpecification: string
  locationAddress: string
  locationCity: string
  locationState: string
  locationZipCode: string
  locationLatitude?: number
  locationLongitude?: number
  problemDescription: string
  dateTimePreference: string
  preferredDateTime?: string
  pricingType: string
  userBudget?: number
  taxAmount: number
  postingFee: number
  totalCost: number
  serviceEstimate?: number
  status: string
  photoUrls: string[]
  createdAt: string
  updatedAt: string
  isPublic: boolean
}

export interface RepairBoardPostDto {
  id: string
  user_id: string
  user_name: string
  vehicle_year: string
  vehicle_make: string
  vehicle_model: string
  vehicle_engine: string
  vehicle_vin?: string
  vehicle_mileage?: string
  vehicle_trim?: string
  vehicle_fuel_type?: string
  vehicle_transmission?: string
  vehicle_drive_type?: string
  vehicle_body_style?: string
  vehicle_doors?: string
  service_category: string
  service_subcategory: string
  service_specification: string
  location_address: string
  location_city: string
  location_state: string
  location_zip_code: string
  location_latitude?: number
  location_longitude?: number
  problem_description: string
  date_time_preference: string
  preferred_date_time?: string
  pricing_type: string
  user_budget?: number
  tax_amount: number
  posting_fee: number
  total_cost: number
  service_estimate?: number
  status: string
  photo_urls: string[]
  created_at: string
  updated_at: string
  is_public: boolean
  car_tech: boolean
  boat_tech: boolean
  diesel_tech: boolean
  tire_tech: boolean
  locksmith_tech: boolean
}

// Towing Types
export enum TowingServiceType {
  FLATBED = 'FLATBED',
  WHEEL_LIFT = 'WHEEL_LIFT',
  HOOK_AND_CHAIN = 'HOOK_AND_CHAIN',
  INTEGRATED = 'INTEGRATED',
  HEAVY_DUTY = 'HEAVY_DUTY',
}

export enum TowingMethod {
  FRONT_WHEEL_LIFT = 'FRONT_WHEEL_LIFT',
  REAR_WHEEL_LIFT = 'REAR_WHEEL_LIFT',
  ALL_WHEEL_LIFT = 'ALL_WHEEL_LIFT',
  FLATBED_LOADING = 'FLATBED_LOADING',
}

export enum TowingReason {
  ACCIDENT = 'ACCIDENT',
  VEHICLE_FIRE = 'VEHICLE_FIRE',
  HIGHWAY_BREAKDOWN = 'HIGHWAY_BREAKDOWN',
  STUCK_DITCH = 'STUCK_DITCH',
  FLOOD_DAMAGE = 'FLOOD_DAMAGE',
  WINTER_INCIDENT = 'WINTER_INCIDENT',
  DEAD_BATTERY = 'DEAD_BATTERY',
  MECHANICAL_FAILURE = 'MECHANICAL_FAILURE',
  OUT_OF_GAS = 'OUT_OF_GAS',
  WONT_START = 'WONT_START',
  FLAT_TIRE = 'FLAT_TIRE',
  LOCKED_OUT = 'LOCKED_OUT',
  VEHICLE_PURCHASE = 'VEHICLE_PURCHASE',
  RELOCATION = 'RELOCATION',
  IMPOUND_RETRIEVAL = 'IMPOUND_RETRIEVAL',
  ILLEGAL_PARKING = 'ILLEGAL_PARKING',
}

export enum TowingUrgency {
  EMERGENCY = 'EMERGENCY',
  URGENT = 'URGENT',
  SCHEDULED = 'SCHEDULED',
  TOWING_BOARD = 'TOWING_BOARD',
  APPOINTMENT = 'APPOINTMENT',
}

export enum VehicleDrivability {
  DRIVABLE = 'DRIVABLE',
  NOT_DRIVABLE = 'NOT_DRIVABLE',
  PARTIALLY_DRIVABLE = 'PARTIALLY_DRIVABLE',
}

export enum DamageLevel {
  NO_DAMAGE = 'NO_DAMAGE',
  MINOR_DAMAGE = 'MINOR_DAMAGE',
  MODERATE_DAMAGE = 'MODERATE_DAMAGE',
  SEVERE_DAMAGE = 'SEVERE_DAMAGE',
  TOTAL_LOSS = 'TOTAL_LOSS',
}

export enum SpecialEquipment {
  WINCH = 'WINCH',
  DOLLIES = 'DOLLIES',
  CHAINS = 'CHAINS',
  STRAPS = 'STRAPS',
  WHEEL_NETS = 'WHEEL_NETS',
  GO_JACKS = 'GO_JACKS',
}

// Rewards & Points Types
export interface CustomerPoints {
  customer_id: string
  total_points: number
  lifetime_points: number
  points_spent: number
  points_multiplier: number
  last_updated: string
}

export enum RewardType {
  DISCOUNT_PERCENTAGE = 'DISCOUNT_PERCENTAGE',
  DISCOUNT_FIXED = 'DISCOUNT_FIXED',
  FREE_SERVICE = 'FREE_SERVICE',
  UPGRADE = 'UPGRADE',
  CREDIT = 'CREDIT',
  SPECIAL_ACCESS = 'SPECIAL_ACCESS',
}

export enum RewardCategory {
  DISCOUNT = 'DISCOUNT',
  FREE_SERVICE = 'FREE_SERVICE',
  UPGRADES = 'UPGRADES',
  CREDITS = 'CREDITS',
  EXCLUSIVE = 'EXCLUSIVE',
  SEASONAL = 'SEASONAL',
}

export enum RewardStatus {
  ACTIVE = 'ACTIVE',
  USED = 'USED',
  EXPIRED = 'EXPIRED',
  REFUNDED = 'REFUNDED',
}

export interface RewardDto {
  id: string
  name: string
  description: string
  points_cost: number
  type: RewardType
  value: number
  image_url?: string | null
  emoji?: string | null
  is_active: boolean
  tier_required?: string | null
  membership_required?: string | null
  expiry_days: number
  usage_limit: number
  category: RewardCategory
  created_at: string
}

export interface RedeemedRewardDto {
  id: string
  customer_id: string
  reward_id: string
  points_spent: number
  redeemed_at: string
  expires_at: string
  used_at?: string | null
  used_on_job_id?: string | null
  status: RewardStatus
  times_used: number
}

export interface PointsTransactionDto {
  id: string
  customer_id: string
  points: number
  type: string
  reason: string
  multiplier: number
  related_id?: string | null
  created_at: string
}

export interface ReferralCodeDto {
  id: string
  customer_id: string
  code: string
  total_referrals: number
  successful_referrals: number
  points_earned: number
  is_active: boolean
  created_at: string
}

export interface AchievementDto {
  id: string
  name: string
  description: string
  emoji: string
  category: string
  points_reward: number
  requirement: number
  is_secret: boolean
  tier: string
}

export interface UnlockedAchievementDto {
  id: string
  customer_id: string
  achievement_id: string
  unlocked_at: string
  points_awarded: number
  is_displayed: boolean
}

export interface CustomerNotificationDto {
  id: string
  user_id: string
  post_id?: string | null
  type: NotificationType | string
  title: string
  message: string
  data?: Record<string, unknown> | null
  is_read: boolean
  read_at?: string | null
  created_at?: string | null
  updated_at?: string | null
}

export interface TowingBoardPost {
  id: string
  userId: string
  userName: string
  vehicleYear: string
  vehicleMake: string
  vehicleModel: string
  vehicleEngine: string
  vehicleVin?: string
  vehicleType: string
  pickupAddress: string
  pickupCity: string
  pickupState: string
  pickupZipCode: string
  pickupCrossStreet?: string
  pickupLatitude?: number
  pickupLongitude?: number
  dropoffAddress: string
  dropoffCity: string
  dropoffState: string
  dropoffZipCode: string
  dropoffCrossStreet?: string
  dropoffLatitude?: number
  dropoffLongitude?: number
  towingServiceType: string
  towingMethod?: string
  towingReason: string
  urgencyLevel: string
  vehicleDrivability: string
  vehicleDamageLevel: string
  keysAvailable: boolean
  doorsUnlocked: boolean
  parkingBrakeEngaged: boolean
  inGearOrPark: boolean
  specialEquipmentNeeded: string[]
  distance: number
  baseFee: number
  perMileRate: number
  distanceFee: number
  urgencySurcharge: number
  equipmentFee: number
  subtotal: number
  taxAmount: number
  postingFee: number
  totalCost: number
  pricingType: string
  minimumBid?: number
  maximumBid?: number
  dateTimePreference: string
  preferredDateTime?: string
  estimatedResponseTime: string
  photoUrls: string[]
  problemDescription: string
  status: string
  createdAt: string
  updatedAt: string
  isPublic: boolean
}

export interface TowingBoardPostDto {
  id: string
  user_id: string
  user_name: string
  vehicle_year: string
  vehicle_make: string
  vehicle_model: string
  vehicle_engine: string
  vehicle_vin?: string
  vehicle_mileage?: string
  vehicle_trim?: string
  vehicle_fuel_type?: string
  vehicle_transmission?: string
  vehicle_drive_type?: string
  vehicle_body_style?: string
  vehicle_doors?: string
  vehicle_weight?: number
  vehicle_type: string
  pickup_address: string
  pickup_city: string
  pickup_state: string
  pickup_zip_code: string
  pickup_cross_street?: string
  pickup_latitude?: number
  pickup_longitude?: number
  dropoff_address: string
  dropoff_city: string
  dropoff_state: string
  dropoff_zip_code: string
  dropoff_cross_street?: string
  dropoff_latitude?: number
  dropoff_longitude?: number
  towing_service_type: string
  towing_method?: string
  towing_reason: string
  urgency_level: string
  reason_category?: string
  is_emergency?: boolean
  is_accident?: boolean
  is_vehicle_fire?: boolean
  is_highway_breakdown?: boolean
  is_stuck_ditch?: boolean
  is_flood_damage?: boolean
  is_winter_incident?: boolean
  is_dead_battery?: boolean
  is_mechanical_failure?: boolean
  is_out_of_gas?: boolean
  is_wont_start?: boolean
  is_flat_tire?: boolean
  is_locked_out?: boolean
  is_vehicle_purchase?: boolean
  is_relocation?: boolean
  is_impound_retrieval?: boolean
  is_illegal_parking?: boolean
  vehicle_drivability: string
  vehicle_damage_level: string
  keys_available: boolean
  doors_unlocked: boolean
  parking_brake_engaged: boolean
  in_gear_or_park: boolean
  special_equipment_needed: string[]
  distance: number
  base_fee: number
  per_mile_rate: number
  distance_fee: number
  urgency_surcharge: number
  equipment_fee: number
  subtotal: number
  tax_amount: number
  posting_fee: number
  service_fee?: number
  platform_fee?: number
  platform_fee_rate?: number
  discount_amount?: number
  discount_code?: string
  reward_points_used?: number
  reward_discount?: number
  total_cost: number
  pricing_type: string
  minimum_bid?: number
  maximum_bid?: number
  date_time_preference: string
  preferred_date_time?: string
  estimated_response_time: string
  photo_urls: string[]
  problem_description: string
  status: string
  created_at: string
  updated_at: string
  is_public: boolean
  assigned_technician_id?: string
}

// Bidding Types
export interface TechnicianBid {
  id: string
  postId: string
  technicianId: string
  technicianName: string
  bidAmount: number
  estimatedTime?: string
  message?: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'DECLINED'
  createdAt: string
  updatedAt: string
}

export interface TechnicianBidDto {
  id: string
  post_id: string
  technician_id: string
  technician_name: string
  bid_amount: number
  estimated_time?: string
  message?: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'DECLINED'
  created_at: string
  updated_at: string
}

export interface TowingBid {
  id: string
  postId: string
  technicianId: string
  technicianName: string
  bidAmount: number
  estimatedTime?: string
  message?: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'DECLINED'
  createdAt: string
  updatedAt: string
}

export interface TowingBidDto {
  id: string
  post_id: string
  technician_id: string
  technician_name: string
  bid_amount: number
  estimated_time?: string
  message?: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'DECLINED'
  created_at: string
  updated_at: string
}

// Messaging Types
export interface RepairBoardMessage {
  id: string
  postId: string
  userId: string
  userName: string
  userType: 'CUSTOMER' | 'TECHNICIAN'
  message: string
  isRead: boolean
  createdAt: string
}

export interface RepairBoardMessageDto {
  id: string
  post_id: string
  user_id: string
  user_name: string
  user_type: 'CUSTOMER' | 'TECHNICIAN'
  message: string
  is_read: boolean
  created_at: string
}

export interface TowingQAMessage {
  id: string
  postId: string
  senderId: string
  senderName: string
  senderType: 'CUSTOMER' | 'TOW_OPERATOR'
  message: string
  isRead: boolean
  createdAt: string
}

export interface TowingQAMessageDto {
  id: string
  post_id: string
  sender_id: string
  sender_name: string
  sender_type: 'CUSTOMER' | 'TOW_OPERATOR'
  message: string
  is_read: boolean
  created_at: string
}

// Notification Types
export enum NotificationType {
  NEW_BID = 'NEW_BID',
  NEW_MESSAGE = 'NEW_MESSAGE',
  JOB_IN_PROGRESS = 'JOB_IN_PROGRESS',
  JOB_COMPLETED = 'JOB_COMPLETED',
  REVIEW_REQUEST = 'REVIEW_REQUEST',
  BID_ACCEPTED = 'BID_ACCEPTED',
  BID_REJECTED = 'BID_REJECTED',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED',
}

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  relatedId?: string
  isRead: boolean
  createdAt: string
}

// Cost Breakdown Types
export interface TowingCostBreakdown {
  baseFee: number
  perMileRate: number
  distanceFee: number
  urgencySurcharge: number
  equipmentFee: number
  subtotal: number
  taxAmount: number
  postingFee: number
  serviceFee: number
  platformFee: number
  platformFeeRate: number
  discountAmount: number
  discountCode?: string
  rewardPointsUsed: number
  rewardDiscount: number
  totalCost: number
}

// API Response Types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  limit: number
  totalPages: number
}

// Form Types
export interface ContactForm {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export interface ServiceRequestForm {
  serviceCategory: string
  vehicleInfo: VehicleInfo
  location: ServiceLocation
  problemDescription: string
  urgency: string
  photos?: File[]
}

export interface TowingRequestForm {
  pickupLocation: TowingLocation
  dropoffLocation: TowingLocation
  vehicleInfo: VehicleInfo
  serviceType: TowingServiceType
  towingMethod?: TowingMethod
  reason: TowingReason
  drivability: VehicleDrivability
  damageLevel: DamageLevel
  keysAvailable: boolean
  doorsUnlocked: boolean
  parkingBrake: boolean
  inGear: boolean
  equipment: SpecialEquipment[]
  urgency: TowingUrgency
  scheduledDateTime?: string
  problemDescription: string
  photos?: File[]
}
