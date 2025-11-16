import { BaseRepository } from './base-repository'
import { RewardCategory, RewardStatus, RewardType } from '@/types'
import type {
  AchievementDto,
  CustomerPoints,
  RedeemedRewardDto,
  ReferralCodeDto,
  RewardDto,
} from '@/types'

interface RedeemResult {
  reward: RewardDto
  redeemed: RedeemedRewardDto
  updatedPoints: CustomerPoints
}

const REWARDS_CATALOG: RewardDto[] = [
  {
    id: 'discount_10_percent',
    name: '10% Off Next Job',
    description: 'Get 10% off your next service',
    points_cost: 500,
    type: RewardType.DISCOUNT_PERCENTAGE,
    value: 10,
    emoji: '💰',
    is_active: true,
    tier_required: null,
    membership_required: null,
    expiry_days: 30,
    usage_limit: 1,
    category: RewardCategory.DISCOUNT,
    created_at: new Date(0).toISOString(),
  },
  {
    id: 'discount_20_dollars',
    name: '$20 Off',
    description: 'Save $20 on your next job',
    points_cost: 1000,
    type: RewardType.DISCOUNT_FIXED,
    value: 20,
    emoji: '💵',
    is_active: true,
    tier_required: null,
    membership_required: null,
    expiry_days: 30,
    usage_limit: 1,
    category: RewardCategory.DISCOUNT,
    created_at: new Date(0).toISOString(),
  },
  {
    id: 'free_diagnostic',
    name: 'Free Diagnostic',
    description: 'Free vehicle diagnostic service',
    points_cost: 1500,
    type: RewardType.FREE_SERVICE,
    value: 50,
    emoji: '🔧',
    is_active: true,
    tier_required: null,
    membership_required: null,
    expiry_days: 30,
    usage_limit: 1,
    category: RewardCategory.FREE_SERVICE,
    created_at: new Date(0).toISOString(),
  },
  {
    id: 'priority_listing',
    name: 'Priority Listing',
    description: 'Your job appears at the top for 24 hours',
    points_cost: 800,
    type: RewardType.UPGRADE,
    value: 0,
    emoji: '⬆️',
    is_active: true,
    tier_required: null,
    membership_required: null,
    expiry_days: 7,
    usage_limit: 1,
    category: RewardCategory.UPGRADES,
    created_at: new Date(0).toISOString(),
  },
  {
    id: 'account_credit_10',
    name: '$10 Account Credit',
    description: 'Add $10 to your account balance',
    points_cost: 750,
    type: RewardType.CREDIT,
    value: 10,
    emoji: '💳',
    is_active: true,
    tier_required: null,
    membership_required: null,
    expiry_days: 90,
    usage_limit: 1,
    category: RewardCategory.CREDITS,
    created_at: new Date(0).toISOString(),
  },
  {
    id: 'elite_tech_access',
    name: 'Elite Tech Access',
    description: 'Access to invite-only elite technicians',
    points_cost: 2000,
    type: RewardType.SPECIAL_ACCESS,
    value: 0,
    emoji: '⭐',
    is_active: true,
    tier_required: 'ROAD_HERO',
    membership_required: null,
    expiry_days: 30,
    usage_limit: 1,
    category: RewardCategory.EXCLUSIVE,
    created_at: new Date(0).toISOString(),
  },
  {
    id: 'membership_upgrade',
    name: '1 Month Premium',
    description: 'Upgrade to Premium for 1 month',
    points_cost: 2500,
    type: RewardType.UPGRADE,
    value: 9.99,
    emoji: '⚙️',
    is_active: true,
    tier_required: null,
    membership_required: null,
    expiry_days: 30,
    usage_limit: 1,
    category: RewardCategory.UPGRADES,
    created_at: new Date(0).toISOString(),
  },
  {
    id: 'mobile_wash_50_off',
    name: '50% Off Mobile Wash',
    description: 'Get 50% off your next mobile car wash service',
    points_cost: 600,
    type: RewardType.DISCOUNT_PERCENTAGE,
    value: 50,
    emoji: '🧼',
    is_active: true,
    tier_required: null,
    membership_required: null,
    expiry_days: 30,
    usage_limit: 1,
    category: RewardCategory.DISCOUNT,
    created_at: new Date(0).toISOString(),
  },
  {
    id: 'free_mobile_wash',
    name: 'Free Mobile Wash',
    description: 'One complimentary mobile car wash service',
    points_cost: 1200,
    type: RewardType.FREE_SERVICE,
    value: 40,
    emoji: '✨',
    is_active: true,
    tier_required: null,
    membership_required: null,
    expiry_days: 30,
    usage_limit: 1,
    category: RewardCategory.FREE_SERVICE,
    created_at: new Date(0).toISOString(),
  },
]

const REWARDS_BY_CATEGORY: Record<RewardCategory, RewardDto[]> = REWARDS_CATALOG.reduce(
  (acc, reward) => {
    const list = acc[reward.category] ?? []
    list.push(reward)
    acc[reward.category] = list
    return acc
  },
  {} as Record<RewardCategory, RewardDto[]>
)

export class RewardsRepository extends BaseRepository {
  async getCustomerPoints(customerId: string): Promise<CustomerPoints> {
    const { data, error } = await this.supabase
      .from('customer_points')
      .select('*')
      .eq('customer_id', customerId)
      .maybeSingle()

    if (error) this.handleError(error, 'load customer points')

    if (data) {
      return data as CustomerPoints
    }

    const defaultRecord: CustomerPoints = {
      customer_id: customerId,
      total_points: 0,
      lifetime_points: 0,
      points_spent: 0,
      points_multiplier: 1,
      last_updated: new Date().toISOString(),
    }

    const { data: inserted, error: insertError } = await this.supabase
      .from('customer_points')
      .insert(defaultRecord as never)
      .select()
      .single()

    if (insertError) this.handleError(insertError, 'create customer points')

    return inserted as CustomerPoints
  }

  async getAvailableRewards(): Promise<RewardDto[]> {
    return REWARDS_CATALOG
  }

  async getRewardsByCategory(category: RewardCategory): Promise<RewardDto[]> {
    return REWARDS_BY_CATEGORY[category] ?? []
  }

  async getRedeemedRewards(customerId: string): Promise<RedeemedRewardDto[]> {
    const { data, error } = await this.supabase
      .from('redeemed_rewards')
      .select('*')
      .eq('customer_id', customerId)
      .order('redeemed_at', { ascending: false })

    if (error) this.handleError(error, 'load redeemed rewards')

    return (data ?? []) as RedeemedRewardDto[]
  }

  async getActiveRewards(customerId: string): Promise<RedeemedRewardDto[]> {
    const all = await this.getRedeemedRewards(customerId)
    const now = Date.now()
    return all.filter((reward) => {
      if (reward.status !== RewardStatus.ACTIVE) return false
      const expiresAt = new Date(reward.expires_at).getTime()
      return expiresAt > now
    })
  }

  async getPointsHistory(customerId: string, limit = 50) {
    const { data, error } = await this.supabase
      .from('points_transactions')
      .select('*')
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) this.handleError(error, 'load points transactions')

    return data ?? []
  }

  async getReferralCode(customerId: string): Promise<ReferralCodeDto> {
    const { data, error } = await this.supabase
      .from('referral_codes')
      .select('*')
      .eq('customer_id', customerId)
      .maybeSingle()

    if (error) this.handleError(error, 'load referral code')

    if (data) return data as ReferralCodeDto

    const code = this.generateReferralCode()
    const payload = {
      id: this.generateId(),
      customer_id: customerId,
      code,
      total_referrals: 0,
      successful_referrals: 0,
      points_earned: 0,
      is_active: true,
      created_at: new Date().toISOString(),
    }

    const { data: inserted, error: insertError } = await this.supabase
      .from('referral_codes')
      .insert(payload as never)
      .select()
      .single()

    if (insertError) this.handleError(insertError, 'create referral code')

    return inserted as ReferralCodeDto
  }

  async getUnlockedAchievements(customerId: string): Promise<AchievementDto[]> {
    const { data, error } = await this.supabase
      .from('unlocked_achievements')
      .select('achievement_id')
      .eq('customer_id', customerId)

    if (error) this.handleError(error, 'load unlocked achievements')

    const unlockedIds = new Set<string>((data ?? []).map((row: any) => row.achievement_id))

    // Filter the catalog to expose metadata. Until achievements live in Supabase, map locally.
    return ACHIEVEMENTS_CATALOG.filter((achievement) => unlockedIds.has(achievement.id))
  }

  async redeemReward(customerId: string, rewardId: string): Promise<RedeemResult> {
    const reward = REWARDS_CATALOG.find((item) => item.id === rewardId)
    if (!reward) {
      throw new Error('Reward not found')
    }

    const points = await this.getCustomerPoints(customerId)
    if (points.total_points < reward.points_cost) {
      throw new Error('Insufficient points')
    }

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + reward.expiry_days)

    const redeemedPayload: RedeemedRewardDto = {
      id: this.generateId(),
      customer_id: customerId,
      reward_id: rewardId,
      points_spent: reward.points_cost,
      redeemed_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
      status: RewardStatus.ACTIVE,
      times_used: 0,
      used_at: null,
      used_on_job_id: null,
    }

    const { error: redeemError } = await this.supabase
      .from('redeemed_rewards')
      .insert(redeemedPayload as never)

    if (redeemError) this.handleError(redeemError, 'redeem reward')

    const { error: transactionError } = await this.supabase
      .from('points_transactions')
      .insert({
        id: this.generateId(),
        customer_id: customerId,
        points: reward.points_cost,
        type: 'SPENT',
        reason: `Redeemed: ${reward.name}`,
        multiplier: 1,
        related_id: redeemedPayload.id,
        created_at: new Date().toISOString(),
      } as never)

    if (transactionError) this.handleError(transactionError, 'record points transaction')

    const updatedPoints: CustomerPoints = {
      ...points,
      total_points: points.total_points - reward.points_cost,
      points_spent: points.points_spent + reward.points_cost,
      last_updated: new Date().toISOString(),
    }

    const { error: updateError } = await this.supabase
      .from('customer_points')
      .update({
        total_points: updatedPoints.total_points,
        points_spent: updatedPoints.points_spent,
        last_updated: updatedPoints.last_updated,
      } as never)
      .eq('customer_id', customerId)

    if (updateError) this.handleError(updateError, 'update points balance')

    return {
      reward,
      redeemed: redeemedPayload,
      updatedPoints,
    }
  }

  private generateReferralCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    const random = Array.from({ length: 6 })
      .map(() => chars[Math.floor(Math.random() * chars.length)])
      .join('')
    return random
  }
}

export const ACHIEVEMENTS_CATALOG: AchievementDto[] = [
  {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Complete your first job',
    emoji: '👣',
    category: 'JOBS',
    points_reward: 100,
    requirement: 1,
    is_secret: false,
    tier: 'BRONZE',
  },
  {
    id: 'road_warrior',
    name: 'Road Warrior',
    description: 'Complete 10 jobs',
    emoji: '🚗',
    category: 'JOBS',
    points_reward: 500,
    requirement: 10,
    is_secret: false,
    tier: 'SILVER',
  },
  {
    id: 'master_customer',
    name: 'Master Customer',
    description: 'Complete 50 jobs',
    emoji: '👑',
    category: 'JOBS',
    points_reward: 2000,
    requirement: 50,
    is_secret: false,
    tier: 'GOLD',
  },
  {
    id: 'social_butterfly',
    name: 'Social Butterfly',
    description: 'Refer 5 friends',
    emoji: '🦋',
    category: 'REFERRALS',
    points_reward: 1000,
    requirement: 5,
    is_secret: false,
    tier: 'SILVER',
  },
  {
    id: 'big_spender',
    name: 'Big Spender',
    description: 'Spend $1000 on services',
    emoji: '💎',
    category: 'SPENDING',
    points_reward: 1500,
    requirement: 1000,
    is_secret: false,
    tier: 'GOLD',
  },
  {
    id: 'loyal_customer',
    name: 'Loyal Customer',
    description: 'Use the app for 1 year',
    emoji: '🏆',
    category: 'LOYALTY',
    points_reward: 2500,
    requirement: 365,
    is_secret: false,
    tier: 'PLATINUM',
  },
  {
    id: 'review_master',
    name: 'Review Master',
    description: 'Leave 20 reviews',
    emoji: '⭐',
    category: 'REVIEWS',
    points_reward: 800,
    requirement: 20,
    is_secret: false,
    tier: 'SILVER',
  },
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Book a job before 8 AM',
    emoji: '🌅',
    category: 'SPECIAL',
    points_reward: 200,
    requirement: 1,
    is_secret: true,
    tier: 'BRONZE',
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Book a job after 10 PM',
    emoji: '🦉',
    category: 'SPECIAL',
    points_reward: 200,
    requirement: 1,
    is_secret: true,
    tier: 'BRONZE',
  },
]
