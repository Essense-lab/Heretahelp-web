import { BaseRepository } from './base-repository'
import type { Database } from '@/lib/supabase'
import type {
  RepairBoardPost,
  RepairBoardPostDto,
  TechnicianBid,
  TechnicianBidDto,
  RepairBoardMessage,
  RepairBoardMessageDto,
  UserType,
} from '@/types'

type RepairBoardPostInsert = Database['public']['Tables']['repair_board_posts']['Insert']
type RepairBoardPostUpdate = Database['public']['Tables']['repair_board_posts']['Update']
type TechnicianBidInsert = Database['public']['Tables']['technician_bids']['Insert']

export class RepairBoardRepository extends BaseRepository {
  // ==================== POST MANAGEMENT ====================
  
  async createPost(postData: Omit<RepairBoardPostDto, 'id' | 'created_at' | 'updated_at'>): Promise<RepairBoardPostDto> {
    try {
      const timestamp = this.formatTimestamp()
      const postDto: RepairBoardPostDto = {
        ...postData,
        id: this.generateId(),
        created_at: timestamp,
        updated_at: timestamp,
      }

      const { data, error } = await this.supabase
        .from('repair_board_posts')
        .insert(postDto as never)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      this.handleError(error, 'create repair board post')
    }
  }

  async getPostById(postId: string): Promise<RepairBoardPostDto> {
    try {
      const { data, error } = await this.supabase
        .from('repair_board_posts')
        .select('*')
        .eq('id', postId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      this.handleError(error, 'get repair board post')
    }
  }

  async getPostsByUser(userId: string): Promise<RepairBoardPostDto[]> {
    try {
      const { data, error } = await this.supabase
        .from('repair_board_posts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      this.handleError(error, 'get user repair board posts')
    }
  }

  async getPublicPosts(techType?: string): Promise<RepairBoardPostDto[]> {
    try {
      let query = this.supabase
        .from('repair_board_posts')
        .select('*')
        .eq('is_public', true)
        .eq('status', 'ACTIVE')

      // Filter by technician type if specified
      if (techType) {
        switch (techType.toLowerCase()) {
          case 'car':
            query = query.eq('car_tech', true)
            break
          case 'boat':
            query = query.eq('boat_tech', true)
            break
          case 'diesel':
            query = query.eq('diesel_tech', true)
            break
          case 'tire':
            query = query.eq('tire_tech', true)
            break
          case 'locksmith':
            query = query.eq('locksmith_tech', true)
            break
        }
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      this.handleError(error, 'get public repair board posts')
    }
  }

  async updatePostStatus(postId: string, status: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('repair_board_posts')
        .update({
          status,
          updated_at: this.formatTimestamp(),
        } as never)
        .eq('id', postId)

      if (error) throw error
    } catch (error) {
      this.handleError(error, 'update post status')
    }
  }

  async cancelPostWithFee(
    postId: string,
    cancelledBy: string,
    cancellationFee: number,
    userBudget: number
  ): Promise<void> {
    try {
      const refundAmount = Math.max(0, userBudget - cancellationFee)

      const { error } = await this.supabase
        .from('repair_board_posts')
        .update({
          status: 'CANCELLED',
          cancellation_fee: cancellationFee,
          cancelled_by: cancelledBy,
          cancelled_at: this.formatTimestamp(),
          refund_amount: refundAmount,
          updated_at: this.formatTimestamp(),
        } as never)
        .eq('id', postId)

      if (error) throw error
    } catch (error) {
      this.handleError(error, 'cancel post with fee')
    }
  }

  async deletePost(postId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('repair_board_posts')
        .delete()
        .eq('id', postId)

      if (error) throw error
    } catch (error) {
      this.handleError(error, 'delete repair board post')
    }
  }

  // ==================== BIDDING SYSTEM ====================

  async submitBid(bidData: Omit<TechnicianBidDto, 'id' | 'created_at' | 'updated_at'>): Promise<TechnicianBidDto> {
    try {
      const timestamp = this.formatTimestamp()
      const bidDto: TechnicianBidDto = {
        ...bidData,
        id: this.generateId(),
        created_at: timestamp,
        updated_at: timestamp,
      }

      const { data, error } = await this.supabase
        .from('technician_bids')
        .insert(bidDto as never)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      this.handleError(error, 'submit technician bid')
    }
  }

  async getBidsForPost(postId: string): Promise<TechnicianBidDto[]> {
    try {
      const { data, error } = await this.supabase
        .from('technician_bids')
        .select('*')
        .eq('post_id', postId)
        .order('bid_amount', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      this.handleError(error, 'get bids for post')
    }
  }

  async getTechnicianBids(technicianId: string): Promise<TechnicianBidDto[]> {
    try {
      const { data, error } = await this.supabase
        .from('technician_bids')
        .select('*')
        .eq('technician_id', technicianId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      this.handleError(error, 'get technician bids')
    }
  }

  async acceptBid(bidId: string, postId: string): Promise<void> {
    try {
      // Start a transaction-like operation
      // 1. Accept the selected bid
      const { error: acceptError } = await this.supabase
        .from('technician_bids')
        .update({
          status: 'ACCEPTED',
          updated_at: this.formatTimestamp()
        } as never)
        .eq('id', bidId)

      if (acceptError) throw acceptError

      // 2. Reject all other bids for this post
      const { error: rejectError } = await this.supabase
        .from('technician_bids')
        .update({ 
          status: 'REJECTED',
          updated_at: this.formatTimestamp()
        } as never)
        .eq('post_id', postId)
        .neq('id', bidId)

      if (rejectError) throw rejectError

      // 3. Update post status to IN_PROGRESS
      await this.updatePostStatus(postId, 'IN_PROGRESS')

    } catch (error) {
      this.handleError(error, 'accept bid')
    }
  }

  async rejectBid(bidId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('technician_bids')
        .update({ 
          status: 'REJECTED',
          updated_at: this.formatTimestamp()
        } as never)
        .eq('id', bidId)

      if (error) throw error
    } catch (error) {
      this.handleError(error, 'reject bid')
    }
  }

  // ==================== MESSAGING SYSTEM ====================

  async sendMessage(messageData: Omit<RepairBoardMessageDto, 'id' | 'created_at'>): Promise<RepairBoardMessageDto> {
    try {
      const messageDto: RepairBoardMessageDto = {
        ...messageData,
        id: this.generateId(),
        created_at: this.formatTimestamp(),
      }

      const { data, error } = await this.supabase
        .from('repair_board_messages')
        .insert(messageDto as never)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      this.handleError(error, 'send message')
    }
  }

  async getMessages(postId: string): Promise<RepairBoardMessageDto[]> {
    try {
      const { data, error } = await this.supabase
        .from('repair_board_messages')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true })

      if (error) throw error
      return data || []
    } catch (error) {
      this.handleError(error, 'get messages')
    }
  }

  async markMessageAsRead(messageId: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('repair_board_messages')
        .update({ is_read: true } as never)
        .eq('id', messageId)

      if (error) throw error
    } catch (error) {
      this.handleError(error, 'mark message as read')
    }
  }

  // ==================== PHOTO MANAGEMENT ====================

  async uploadPhotos(postId: string, files: File[]): Promise<string[]> {
    try {
      const uploadPromises = files.map(async (file, index) => {
        const fileName = `repair_${postId}_${Date.now()}_${index}.${file.name.split('.').pop()}`

        const { data, error } = await this.supabase.storage
          .from('repair-photos')
          .upload(fileName, file)

        if (error) throw error

        const { data: { publicUrl } } = this.supabase.storage
          .from('repair-photos')
          .getPublicUrl(fileName)

        return publicUrl
      })

      return await Promise.all(uploadPromises)
    } catch (error) {
      this.handleError(error, 'upload photos')
    }
  }

  async savePhotosToDatabase(postId: string, photoUrls: string[]): Promise<any[]> {
    try {
      const timestamp = this.formatTimestamp()
      const payload = photoUrls.map((url) => ({
        id: this.generateId(),
        post_id: postId,
        photo_url: url,
        uploaded_at: timestamp,
      }))

      const { data, error } = await this.supabase
        .from('post_photos')
        .insert(payload as never)
        .select()

      if (error) throw error
      return (data ?? []) as any[]
    } catch (error) {
      this.handleError(error, 'save post photos')
    }
  }

  async updatePostPhotos(postId: string, photoUrls: string[]): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('repair_board_posts')
        .update({ photo_urls: photoUrls, updated_at: this.formatTimestamp() } as never)
        .eq('id', postId)

      if (error) throw error
    } catch (error) {
      this.handleError(error, 'update repair board post photos')
    }
  }

  async deletePhoto(photoUrl: string): Promise<void> {
    try {
      // Extract file name from URL
      const fileName = photoUrl.split('/').pop()
      if (!fileName) throw new Error('Invalid photo URL')

      const { error } = await this.supabase.storage
        .from('repair-photos')
        .remove([fileName])

      if (error) throw error
    } catch (error) {
      this.handleError(error, 'delete photo')
    }
  }

  // ==================== HELPER METHODS ====================

  private determineTechFlags(serviceCategory: string) {
    const category = serviceCategory.toLowerCase()
    return {
      car_tech: category.includes('car'),
      boat_tech: category.includes('boat'),
      diesel_tech: category.includes('diesel'),
      tire_tech: category.includes('tire'),
      locksmith_tech: category.includes('locksmith'),
    }
  }

  // Convert DTO to domain model
  dtoToPost(dto: RepairBoardPostDto): RepairBoardPost {
    return {
      id: dto.id,
      userId: dto.user_id,
      userName: dto.user_name,
      vehicleYear: dto.vehicle_year,
      vehicleMake: dto.vehicle_make,
      vehicleModel: dto.vehicle_model,
      vehicleEngine: dto.vehicle_engine,
      serviceCategory: dto.service_category,
      serviceSubcategory: dto.service_subcategory,
      serviceSpecification: dto.service_specification,
      locationAddress: dto.location_address,
      locationCity: dto.location_city,
      locationState: dto.location_state,
      locationZipCode: dto.location_zip_code,
      locationLatitude: dto.location_latitude,
      locationLongitude: dto.location_longitude,
      problemDescription: dto.problem_description,
      dateTimePreference: dto.date_time_preference,
      preferredDateTime: dto.preferred_date_time,
      pricingType: dto.pricing_type,
      userBudget: dto.user_budget,
      taxAmount: dto.tax_amount,
      postingFee: dto.posting_fee,
      totalCost: dto.total_cost,
      serviceEstimate: dto.service_estimate,
      status: dto.status,
      photoUrls: dto.photo_urls,
      createdAt: dto.created_at,
      updatedAt: dto.updated_at,
      isPublic: dto.is_public,
    }
  }

  // Convert domain model to DTO
  postToDto(post: RepairBoardPost): RepairBoardPostDto {
    const techFlags = this.determineTechFlags(post.serviceCategory)
    
    return {
      id: post.id,
      user_id: post.userId,
      user_name: post.userName,
      vehicle_year: post.vehicleYear,
      vehicle_make: post.vehicleMake,
      vehicle_model: post.vehicleModel,
      vehicle_engine: post.vehicleEngine,
      service_category: post.serviceCategory,
      service_subcategory: post.serviceSubcategory,
      service_specification: post.serviceSpecification,
      location_address: post.locationAddress,
      location_city: post.locationCity,
      location_state: post.locationState,
      location_zip_code: post.locationZipCode,
      location_latitude: post.locationLatitude,
      location_longitude: post.locationLongitude,
      problem_description: post.problemDescription,
      date_time_preference: post.dateTimePreference,
      preferred_date_time: post.preferredDateTime,
      pricing_type: post.pricingType,
      user_budget: post.userBudget,
      tax_amount: post.taxAmount,
      posting_fee: post.postingFee,
      total_cost: post.totalCost,
      service_estimate: post.serviceEstimate,
      status: post.status,
      photo_urls: post.photoUrls,
      created_at: post.createdAt,
      updated_at: post.updatedAt,
      is_public: post.isPublic,
      ...techFlags,
    }
  }

  dtoToBid(dto: TechnicianBidDto): TechnicianBid {
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

  bidToDto(bid: TechnicianBid): TechnicianBidDto {
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

  dtoToMessage(dto: RepairBoardMessageDto): RepairBoardMessage {
    return {
      id: dto.id,
      postId: dto.post_id,
      userId: dto.user_id,
      userName: dto.user_name,
      userType: dto.user_type,
      message: dto.message,
      isRead: dto.is_read,
      createdAt: dto.created_at,
    }
  }

  messageToDto(message: RepairBoardMessage): RepairBoardMessageDto {
    return {
      id: message.id,
      post_id: message.postId,
      user_id: message.userId,
      user_name: message.userName,
      user_type: message.userType,
      message: message.message,
      is_read: message.isRead,
      created_at: message.createdAt,
    }
  }
}
