import { BaseRepository } from './base-repository'
import type { 
  TowingBoardPost, 
  TowingBoardPostDto, 
  TowingBid, 
  TowingBidDto,
  TowingQAMessage,
  TowingQAMessageDto,
  TowingCostBreakdown,
  VehicleInfo,
  TowingLocation
} from '@/types'

export class TowingBoardRepository extends BaseRepository {
  // ==================== POST MANAGEMENT ====================
  
  async createPost(postData: Omit<TowingBoardPostDto, 'id' | 'created_at' | 'updated_at'>): Promise<TowingBoardPostDto> {
    try {
      const timestamp = this.formatTimestamp()
      const postDto: TowingBoardPostDto = {
        ...postData,
        id: this.generateId(),
        created_at: timestamp,
        updated_at: timestamp,
      }

      const { data, error } = await this.supabase
        .from('towing_board_posts')
        .insert(postDto as never)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      this.handleError(error, 'create towing board post')
    }
  }

  async getPostById(postId: string): Promise<TowingBoardPostDto> {
    try {
      const { data, error } = await this.supabase
        .from('towing_board_posts')
        .select('*')
        .eq('id', postId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      this.handleError(error, 'get towing board post')
    }
  }

  async getPostsByUser(userId: string): Promise<TowingBoardPostDto[]> {
    try {
      const { data, error } = await this.supabase
        .from('towing_board_posts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      this.handleError(error, 'get user towing board posts')
    }
  }

  async getPublicPosts(): Promise<TowingBoardPostDto[]> {
    try {
      const { data, error } = await this.supabase
        .from('towing_board_posts')
        .select('*')
        .eq('is_public', true)
        .eq('status', 'ACTIVE')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      this.handleError(error, 'get public towing board posts')
    }
  }

  async updatePostStatus(postId: string, status: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('towing_board_posts')
        .update({ 
          status, 
          updated_at: this.formatTimestamp() 
        } as never)
        .eq('id', postId)

      if (error) throw error
    } catch (error) {
      this.handleError(error, 'update towing post status')
    }
  }

  async assignTechnician(postId: string, technicianId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('towing_board_posts')
        .update({ 
          assigned_technician_id: technicianId,
          status: 'ASSIGNED',
          updated_at: this.formatTimestamp() 
        } as never)
        .eq('id', postId)

      if (error) throw error
    } catch (error) {
      this.handleError(error, 'assign technician to towing post')
    }
  }

  async deletePost(postId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('towing_board_posts')
        .delete()
        .eq('id', postId)

      if (error) throw error
    } catch (error) {
      this.handleError(error, 'delete towing board post')
    }
  }

  // ==================== BIDDING SYSTEM ====================

  async submitBid(bidData: Omit<TowingBidDto, 'id' | 'created_at' | 'updated_at'>): Promise<TowingBidDto> {
    try {
      const timestamp = this.formatTimestamp()
      const bidDto: TowingBidDto = {
        ...bidData,
        id: this.generateId(),
        created_at: timestamp,
        updated_at: timestamp,
      }

      const { data, error } = await this.supabase
        .from('towing_bids')
        .insert(bidDto as never)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      this.handleError(error, 'submit towing bid')
    }
  }

  async getBidsForPost(postId: string): Promise<TowingBidDto[]> {
    try {
      const { data, error } = await this.supabase
        .from('towing_bids')
        .select('*')
        .eq('post_id', postId)
        .order('bid_amount', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      this.handleError(error, 'get towing bids for post')
    }
  }

  async getTechnicianBids(technicianId: string): Promise<TowingBidDto[]> {
    try {
      const { data, error } = await this.supabase
        .from('towing_bids')
        .select('*')
        .eq('technician_id', technicianId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      this.handleError(error, 'get towing technician bids')
    }
  }

  async acceptBid(bidId: string, postId: string): Promise<void> {
    try {
      // 1. Accept the selected bid
      const { error: acceptError } = await this.supabase
        .from('towing_bids')
        .update({ 
          status: 'ACCEPTED',
          updated_at: this.formatTimestamp()
        } as never)
        .eq('id', bidId)

      if (acceptError) throw acceptError

      // 2. Reject all other bids for this post
      const { error: rejectError } = await this.supabase
        .from('towing_bids')
        .update({ 
          status: 'REJECTED',
          updated_at: this.formatTimestamp()
        } as never)
        .eq('post_id', postId)
        .neq('id', bidId)

      if (rejectError) throw rejectError

      // 3. Update post status to ASSIGNED
      await this.updatePostStatus(postId, 'ASSIGNED')

    } catch (error) {
      this.handleError(error, 'accept towing bid')
    }
  }

  async rejectBid(bidId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('towing_bids')
        .update({ 
          status: 'REJECTED',
          updated_at: this.formatTimestamp()
        } as never)
        .eq('id', bidId)

      if (error) throw error
    } catch (error) {
      this.handleError(error, 'reject towing bid')
    }
  }

  // ==================== MESSAGING SYSTEM ====================

  async sendQAMessage(messageData: Omit<TowingQAMessageDto, 'id' | 'created_at'>): Promise<TowingQAMessageDto> {
    try {
      const messageDto: TowingQAMessageDto = {
        ...messageData,
        id: this.generateId(),
        created_at: this.formatTimestamp(),
      }

      const { data, error } = await this.supabase
        .from('towing_qa_messages')
        .insert(messageDto as never)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      this.handleError(error, 'send towing QA message')
    }
  }

  async getQAMessages(postId: string): Promise<TowingQAMessageDto[]> {
    try {
      const { data, error } = await this.supabase
        .from('towing_qa_messages')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      this.handleError(error, 'get towing QA messages')
    }
  }

  async markMessageAsRead(messageId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('towing_qa_messages')
        .update({ is_read: true } as never)
        .eq('id', messageId)

      if (error) throw error
    } catch (error) {
      this.handleError(error, 'mark towing message as read')
    }
  }

  // ==================== PHOTO MANAGEMENT ====================

  async uploadPhotos(postId: string, files: File[]): Promise<string[]> {
    try {
      const uploadPromises = files.map(async (file, index) => {
        const fileName = `towing_${postId}_${Date.now()}_${index}.${file.name.split('.').pop()}`
        
        const { data, error } = await this.supabase.storage
          .from('towing-photos')
          .upload(fileName, file)

        if (error) throw error

        const { data: { publicUrl } } = this.supabase.storage
          .from('towing-photos')
          .getPublicUrl(fileName)

        return publicUrl
      })

      return await Promise.all(uploadPromises)
    } catch (error) {
      this.handleError(error, 'upload towing photos')
    }
  }

  async linkPhotosToPost(postId: string, photoUrls: string[]): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('towing_board_posts')
        .update({ 
          photo_urls: photoUrls,
          updated_at: this.formatTimestamp()
        } as never)
        .eq('id', postId)

      if (error) throw error
    } catch (error) {
      this.handleError(error, 'link photos to towing post')
    }
  }

  async deletePhoto(photoUrl: string): Promise<void> {
    try {
      // Extract file name from URL
      const fileName = photoUrl.split('/').pop()
      if (!fileName) throw new Error('Invalid photo URL')

      const { error } = await this.supabase.storage
        .from('towing-photos')
        .remove([fileName])

      if (error) throw error
    } catch (error) {
      this.handleError(error, 'delete towing photo')
    }
  }

  // ==================== HELPER METHODS ====================

  private determineVehicleType(vehicleInfo: VehicleInfo): string {
    const model = vehicleInfo.model.toLowerCase()
    if (model.includes('motorcycle') || model.includes('bike')) return 'MOTORCYCLE'
    if (model.includes('truck') || model.includes('f-150') || model.includes('silverado')) return 'TRUCK'
    if (model.includes('suv') || model.includes('explorer') || model.includes('tahoe')) return 'SUV'
    return 'CAR'
  }

  private determineReasonFlags(reason: string) {
    const reasonUpper = reason.toUpperCase()
    return {
      is_emergency: ['ACCIDENT', 'VEHICLE_FIRE', 'HIGHWAY_BREAKDOWN', 'STUCK_DITCH', 'FLOOD_DAMAGE', 'WINTER_INCIDENT'].includes(reasonUpper),
      reason_category: ['ACCIDENT', 'VEHICLE_FIRE', 'HIGHWAY_BREAKDOWN', 'STUCK_DITCH', 'FLOOD_DAMAGE', 'WINTER_INCIDENT'].includes(reasonUpper) ? 'EMERGENCY' : 'NON_EMERGENCY',
      is_accident: reasonUpper === 'ACCIDENT',
      is_vehicle_fire: reasonUpper === 'VEHICLE_FIRE',
      is_highway_breakdown: reasonUpper === 'HIGHWAY_BREAKDOWN',
      is_stuck_ditch: reasonUpper === 'STUCK_DITCH',
      is_flood_damage: reasonUpper === 'FLOOD_DAMAGE',
      is_winter_incident: reasonUpper === 'WINTER_INCIDENT',
      is_dead_battery: reasonUpper === 'DEAD_BATTERY',
      is_mechanical_failure: reasonUpper === 'MECHANICAL_FAILURE',
      is_out_of_gas: reasonUpper === 'OUT_OF_GAS',
      is_wont_start: reasonUpper === 'WONT_START',
      is_flat_tire: reasonUpper === 'FLAT_TIRE',
      is_locked_out: reasonUpper === 'LOCKED_OUT',
      is_vehicle_purchase: reasonUpper === 'VEHICLE_PURCHASE',
      is_relocation: reasonUpper === 'RELOCATION',
      is_impound_retrieval: reasonUpper === 'IMPOUND_RETRIEVAL',
      is_illegal_parking: reasonUpper === 'ILLEGAL_PARKING',
    }
  }

  // Convert DTO to domain model
  dtoToPost(dto: TowingBoardPostDto): TowingBoardPost {
    return {
      id: dto.id,
      userId: dto.user_id,
      userName: dto.user_name,
      vehicleYear: dto.vehicle_year,
      vehicleMake: dto.vehicle_make,
      vehicleModel: dto.vehicle_model,
      vehicleEngine: dto.vehicle_engine,
      vehicleVin: dto.vehicle_vin,
      vehicleType: dto.vehicle_type,
      pickupAddress: dto.pickup_address,
      pickupCity: dto.pickup_city,
      pickupState: dto.pickup_state,
      pickupZipCode: dto.pickup_zip_code,
      pickupCrossStreet: dto.pickup_cross_street,
      pickupLatitude: dto.pickup_latitude,
      pickupLongitude: dto.pickup_longitude,
      dropoffAddress: dto.dropoff_address,
      dropoffCity: dto.dropoff_city,
      dropoffState: dto.dropoff_state,
      dropoffZipCode: dto.dropoff_zip_code,
      dropoffCrossStreet: dto.dropoff_cross_street,
      dropoffLatitude: dto.dropoff_latitude,
      dropoffLongitude: dto.dropoff_longitude,
      towingServiceType: dto.towing_service_type,
      towingMethod: dto.towing_method,
      towingReason: dto.towing_reason,
      urgencyLevel: dto.urgency_level,
      vehicleDrivability: dto.vehicle_drivability,
      vehicleDamageLevel: dto.vehicle_damage_level,
      keysAvailable: dto.keys_available,
      doorsUnlocked: dto.doors_unlocked,
      parkingBrakeEngaged: dto.parking_brake_engaged,
      inGearOrPark: dto.in_gear_or_park,
      specialEquipmentNeeded: dto.special_equipment_needed,
      distance: dto.distance,
      baseFee: dto.base_fee,
      perMileRate: dto.per_mile_rate,
      distanceFee: dto.distance_fee,
      urgencySurcharge: dto.urgency_surcharge,
      equipmentFee: dto.equipment_fee,
      subtotal: dto.subtotal,
      taxAmount: dto.tax_amount,
      postingFee: dto.posting_fee,
      totalCost: dto.total_cost,
      pricingType: dto.pricing_type,
      minimumBid: dto.minimum_bid,
      maximumBid: dto.maximum_bid,
      dateTimePreference: dto.date_time_preference,
      preferredDateTime: dto.preferred_date_time,
      estimatedResponseTime: dto.estimated_response_time,
      photoUrls: dto.photo_urls,
      problemDescription: dto.problem_description,
      status: dto.status,
      createdAt: dto.created_at,
      updatedAt: dto.updated_at,
      isPublic: dto.is_public,
    }
  }

  dtoToBid(dto: TowingBidDto): TowingBid {
    return {
      id: dto.id,
      postId: dto.post_id,
      technicianId: dto.technician_id,
      technicianName: dto.technician_name,
      bidAmount: dto.bid_amount,
      estimatedTime: dto.estimated_time,
      message: dto.message,
      status: dto.status as 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'DECLINED',
      createdAt: dto.created_at,
      updatedAt: dto.updated_at,
    }
  }

  bidToDto(bid: TowingBid): TowingBidDto {
    return {
      id: bid.id,
      post_id: bid.postId,
      technician_id: bid.technicianId,
      technician_name: bid.technicianName,
      bid_amount: bid.bidAmount,
      estimated_time: bid.estimatedTime,
      message: bid.message,
      status: bid.status,
      created_at: bid.createdAt,
      updated_at: bid.updatedAt,
    }
  }

  dtoToMessage(dto: TowingQAMessageDto): TowingQAMessage {
    return {
      id: dto.id,
      postId: dto.post_id,
      senderId: dto.sender_id,
      senderName: dto.sender_name,
      senderType: dto.sender_type,
      message: dto.message,
      isRead: dto.is_read,
      createdAt: dto.created_at,
    }
  }

  messageToDto(message: TowingQAMessage): TowingQAMessageDto {
    return {
      id: message.id,
      post_id: message.postId,
      sender_id: message.senderId,
      sender_name: message.senderName,
      sender_type: message.senderType,
      message: message.message,
      is_read: message.isRead,
      created_at: message.createdAt,
    }
  }
}
