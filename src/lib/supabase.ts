import { createClientComponentClient, createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client component client
export const createSupabaseClient = () => createClientComponentClient()

// Server component client
export const createSupabaseServerClient = () => createServerComponentClient({ cookies })

// Database types
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          phone_number: string | null
          address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          role: string
          profile_picture_url: string | null
          onboarding_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name: string
          last_name: string
          phone_number?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          role: string
          profile_picture_url?: string | null
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          phone_number?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          role?: string
          profile_picture_url?: string | null
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      repair_board_posts: {
        Row: {
          id: string
          user_id: string
          user_name: string
          vehicle_year: string
          vehicle_make: string
          vehicle_model: string
          vehicle_engine: string
          vehicle_vin: string | null
          vehicle_mileage: string | null
          vehicle_trim: string | null
          vehicle_fuel_type: string | null
          vehicle_transmission: string | null
          vehicle_drive_type: string | null
          vehicle_body_style: string | null
          vehicle_doors: string | null
          service_category: string
          service_subcategory: string
          service_specification: string
          location_address: string
          location_city: string
          location_state: string
          location_zip_code: string
          location_latitude: number | null
          location_longitude: number | null
          problem_description: string
          date_time_preference: string
          preferred_date_time: string | null
          pricing_type: string
          user_budget: number | null
          tax_amount: number
          posting_fee: number
          total_cost: number
          service_estimate: number | null
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
        Insert: {
          id?: string
          user_id: string
          user_name: string
          vehicle_year: string
          vehicle_make: string
          vehicle_model: string
          vehicle_engine: string
          vehicle_vin?: string | null
          vehicle_mileage?: string | null
          vehicle_trim?: string | null
          vehicle_fuel_type?: string | null
          vehicle_transmission?: string | null
          vehicle_drive_type?: string | null
          vehicle_body_style?: string | null
          vehicle_doors?: string | null
          service_category: string
          service_subcategory: string
          service_specification: string
          location_address: string
          location_city: string
          location_state: string
          location_zip_code: string
          location_latitude?: number | null
          location_longitude?: number | null
          problem_description: string
          date_time_preference: string
          preferred_date_time?: string | null
          pricing_type: string
          user_budget?: number | null
          tax_amount: number
          posting_fee: number
          total_cost: number
          service_estimate?: number | null
          status: string
          photo_urls: string[]
          created_at?: string
          updated_at?: string
          is_public: boolean
          car_tech: boolean
          boat_tech: boolean
          diesel_tech: boolean
          tire_tech: boolean
          locksmith_tech: boolean
        }
        Update: {
          id?: string
          user_id?: string
          user_name?: string
          vehicle_year?: string
          vehicle_make?: string
          vehicle_model?: string
          vehicle_engine?: string
          vehicle_vin?: string | null
          vehicle_mileage?: string | null
          vehicle_trim?: string | null
          vehicle_fuel_type?: string | null
          vehicle_transmission?: string | null
          vehicle_drive_type?: string | null
          vehicle_body_style?: string | null
          vehicle_doors?: string | null
          service_category?: string
          service_subcategory?: string
          service_specification?: string
          location_address?: string
          location_city?: string
          location_state?: string
          location_zip_code?: string
          location_latitude?: number | null
          location_longitude?: number | null
          problem_description?: string
          date_time_preference?: string
          preferred_date_time?: string | null
          pricing_type?: string
          user_budget?: number | null
          tax_amount?: number
          posting_fee?: number
          total_cost?: number
          service_estimate?: number | null
          status?: string
          photo_urls?: string[]
          created_at?: string
          updated_at?: string
          is_public?: boolean
          car_tech?: boolean
          boat_tech?: boolean
          diesel_tech?: boolean
          tire_tech?: boolean
          locksmith_tech?: boolean
        }
      }
      towing_board_posts: {
        Row: {
          id: string
          user_id: string
          user_name: string
          vehicle_year: string
          vehicle_make: string
          vehicle_model: string
          vehicle_engine: string
          vehicle_vin: string | null
          vehicle_mileage: string | null
          vehicle_trim: string | null
          vehicle_fuel_type: string | null
          vehicle_transmission: string | null
          vehicle_drive_type: string | null
          vehicle_body_style: string | null
          vehicle_doors: string | null
          vehicle_weight: number | null
          vehicle_type: string
          pickup_address: string
          pickup_city: string
          pickup_state: string
          pickup_zip_code: string
          pickup_cross_street: string | null
          pickup_latitude: number | null
          pickup_longitude: number | null
          dropoff_address: string
          dropoff_city: string
          dropoff_state: string
          dropoff_zip_code: string
          dropoff_cross_street: string | null
          dropoff_latitude: number | null
          dropoff_longitude: number | null
          towing_service_type: string
          towing_method: string | null
          towing_reason: string
          urgency_level: string
          reason_category: string | null
          is_emergency: boolean | null
          is_accident: boolean | null
          is_vehicle_fire: boolean | null
          is_highway_breakdown: boolean | null
          is_stuck_ditch: boolean | null
          is_flood_damage: boolean | null
          is_winter_incident: boolean | null
          is_dead_battery: boolean | null
          is_mechanical_failure: boolean | null
          is_out_of_gas: boolean | null
          is_wont_start: boolean | null
          is_flat_tire: boolean | null
          is_locked_out: boolean | null
          is_vehicle_purchase: boolean | null
          is_relocation: boolean | null
          is_impound_retrieval: boolean | null
          is_illegal_parking: boolean | null
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
          service_fee: number | null
          platform_fee: number | null
          platform_fee_rate: number | null
          discount_amount: number | null
          discount_code: string | null
          reward_points_used: number | null
          reward_discount: number | null
          total_cost: number
          pricing_type: string
          minimum_bid: number | null
          maximum_bid: number | null
          date_time_preference: string
          preferred_date_time: string | null
          estimated_response_time: string
          photo_urls: string[]
          problem_description: string
          status: string
          created_at: string
          updated_at: string
          is_public: boolean
          assigned_technician_id: string | null
        }
        Insert: {
          id?: string
          user_id: string
          user_name: string
          vehicle_year: string
          vehicle_make: string
          vehicle_model: string
          vehicle_engine: string
          vehicle_vin?: string | null
          vehicle_mileage?: string | null
          vehicle_trim?: string | null
          vehicle_fuel_type?: string | null
          vehicle_transmission?: string | null
          vehicle_drive_type?: string | null
          vehicle_body_style?: string | null
          vehicle_doors?: string | null
          vehicle_weight?: number | null
          vehicle_type: string
          pickup_address: string
          pickup_city: string
          pickup_state: string
          pickup_zip_code: string
          pickup_cross_street?: string | null
          pickup_latitude?: number | null
          pickup_longitude?: number | null
          dropoff_address: string
          dropoff_city: string
          dropoff_state: string
          dropoff_zip_code: string
          dropoff_cross_street?: string | null
          dropoff_latitude?: number | null
          dropoff_longitude?: number | null
          towing_service_type: string
          towing_method?: string | null
          towing_reason: string
          urgency_level: string
          reason_category?: string | null
          is_emergency?: boolean | null
          is_accident?: boolean | null
          is_vehicle_fire?: boolean | null
          is_highway_breakdown?: boolean | null
          is_stuck_ditch?: boolean | null
          is_flood_damage?: boolean | null
          is_winter_incident?: boolean | null
          is_dead_battery?: boolean | null
          is_mechanical_failure?: boolean | null
          is_out_of_gas?: boolean | null
          is_wont_start?: boolean | null
          is_flat_tire?: boolean | null
          is_locked_out?: boolean | null
          is_vehicle_purchase?: boolean | null
          is_relocation?: boolean | null
          is_impound_retrieval?: boolean | null
          is_illegal_parking?: boolean | null
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
          service_fee?: number | null
          platform_fee?: number | null
          platform_fee_rate?: number | null
          discount_amount?: number | null
          discount_code?: string | null
          reward_points_used?: number | null
          reward_discount?: number | null
          total_cost: number
          pricing_type: string
          minimum_bid?: number | null
          maximum_bid?: number | null
          date_time_preference: string
          preferred_date_time?: string | null
          estimated_response_time: string
          photo_urls: string[]
          problem_description: string
          status: string
          created_at?: string
          updated_at?: string
          is_public: boolean
          assigned_technician_id?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          user_name?: string
          vehicle_year?: string
          vehicle_make?: string
          vehicle_model?: string
          vehicle_engine?: string
          vehicle_vin?: string | null
          vehicle_mileage?: string | null
          vehicle_trim?: string | null
          vehicle_fuel_type?: string | null
          vehicle_transmission?: string | null
          vehicle_drive_type?: string | null
          vehicle_body_style?: string | null
          vehicle_doors?: string | null
          vehicle_weight?: number | null
          vehicle_type?: string
          pickup_address?: string
          pickup_city?: string
          pickup_state?: string
          pickup_zip_code?: string
          pickup_cross_street?: string | null
          pickup_latitude?: number | null
          pickup_longitude?: number | null
          dropoff_address?: string
          dropoff_city?: string
          dropoff_state?: string
          dropoff_zip_code?: string
          dropoff_cross_street?: string | null
          dropoff_latitude?: number | null
          dropoff_longitude?: number | null
          towing_service_type?: string
          towing_method?: string | null
          towing_reason?: string
          urgency_level?: string
          reason_category?: string | null
          is_emergency?: boolean | null
          is_accident?: boolean | null
          is_vehicle_fire?: boolean | null
          is_highway_breakdown?: boolean | null
          is_stuck_ditch?: boolean | null
          is_flood_damage?: boolean | null
          is_winter_incident?: boolean | null
          is_dead_battery?: boolean | null
          is_mechanical_failure?: boolean | null
          is_out_of_gas?: boolean | null
          is_wont_start?: boolean | null
          is_flat_tire?: boolean | null
          is_locked_out?: boolean | null
          is_vehicle_purchase?: boolean | null
          is_relocation?: boolean | null
          is_impound_retrieval?: boolean | null
          is_illegal_parking?: boolean | null
          vehicle_drivability?: string
          vehicle_damage_level?: string
          keys_available?: boolean
          doors_unlocked?: boolean
          parking_brake_engaged?: boolean
          in_gear_or_park?: boolean
          special_equipment_needed?: string[]
          distance?: number
          base_fee?: number
          per_mile_rate?: number
          distance_fee?: number
          urgency_surcharge?: number
          equipment_fee?: number
          subtotal?: number
          tax_amount?: number
          posting_fee?: number
          service_fee?: number | null
          platform_fee?: number | null
          platform_fee_rate?: number | null
          discount_amount?: number | null
          discount_code?: string | null
          reward_points_used?: number | null
          reward_discount?: number | null
          total_cost?: number
          pricing_type?: string
          minimum_bid?: number | null
          maximum_bid?: number | null
          date_time_preference?: string
          preferred_date_time?: string | null
          estimated_response_time?: string
          photo_urls?: string[]
          problem_description?: string
          status?: string
          created_at?: string
          updated_at?: string
          is_public?: boolean
          assigned_technician_id?: string | null
        }
      }
      technician_bids: {
        Row: {
          id: string
          post_id: string
          technician_id: string
          technician_name: string
          bid_amount: number
          estimated_time: string | null
          message: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          post_id: string
          technician_id: string
          technician_name: string
          bid_amount: number
          estimated_time?: string | null
          message?: string | null
          status: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          technician_id?: string
          technician_name?: string
          bid_amount?: number
          estimated_time?: string | null
          message?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      towing_bids: {
        Row: {
          id: string
          post_id: string
          technician_id: string
          technician_name: string
          bid_amount: number
          estimated_time: string | null
          message: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          post_id: string
          technician_id: string
          technician_name: string
          bid_amount: number
          estimated_time?: string | null
          message?: string | null
          status: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          technician_id?: string
          technician_name?: string
          bid_amount?: number
          estimated_time?: string | null
          message?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
