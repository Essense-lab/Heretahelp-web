"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createSupabaseClient } from "@/lib/supabase"
import { RewardsRepository, ACHIEVEMENTS_CATALOG } from "@/lib/repositories/rewards-repository"
import type {
  AchievementDto,
  CustomerPoints,
  RedeemedRewardDto,
  ReferralCodeDto,
  RewardDto,
} from "@/types"
import { RewardCategory, RewardStatus, RewardType } from "@/types"

const TAB_DEFINITIONS = [
  { key: "catalog", label: "Catalog", emoji: "🎁" },
  { key: "my-rewards", label: "My Rewards", emoji: "🎫" },
  { key: "achievements", label: "Achievements", emoji: "🏆" },
  { key: "referrals", label: "Referrals", emoji: "👥" },
] as const

type TabKey = (typeof TAB_DEFINITIONS)[number]["key"]

type LoadingState = {
  catalog: boolean
  myRewards: boolean
  achievements: boolean
  referrals: boolean
}

type ErrorState = {
  catalog: string | null
  myRewards: string | null
  achievements: string | null
  referrals: string | null
}

const CATEGORY_ORDER: RewardCategory[] = [
  RewardCategory.DISCOUNT,
  RewardCategory.FREE_SERVICE,
  RewardCategory.UPGRADES,
  RewardCategory.CREDITS,
  RewardCategory.EXCLUSIVE,
  RewardCategory.SEASONAL,
]

const CATEGORY_METADATA: Record<RewardCategory, { label: string; emoji: string }> = {
  [RewardCategory.DISCOUNT]: { label: "Discounts", emoji: "💰" },
  [RewardCategory.FREE_SERVICE]: { label: "Free Services", emoji: "🆓" },
  [RewardCategory.UPGRADES]: { label: "Upgrades", emoji: "⬆️" },
  [RewardCategory.CREDITS]: { label: "Credits", emoji: "💳" },
  [RewardCategory.EXCLUSIVE]: { label: "Exclusive", emoji: "⭐" },
  [RewardCategory.SEASONAL]: { label: "Seasonal", emoji: "🎉" },
}

export default function RewardsPage() {
  const router = useRouter()

  const supabase = useMemo(() => createSupabaseClient(), [])
  const rewardsRepository = useMemo(() => new RewardsRepository(), [])

  const [loading, setLoading] = useState(true)
  const [globalError, setGlobalError] = useState<string | null>(null)

  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [points, setPoints] = useState<CustomerPoints | null>(null)

  const [selectedTab, setSelectedTab] = useState<TabKey>("catalog")
  const [categoryFilter, setCategoryFilter] = useState<RewardCategory | null>(null)

  const [catalog, setCatalog] = useState<RewardDto[]>([])
  const [activeRewards, setActiveRewards] = useState<RedeemedRewardDto[]>([])
  const [achievements, setAchievements] = useState<AchievementDto[]>([])
  const [referralCode, setReferralCode] = useState<ReferralCodeDto | null>(null)
  const [pointsHistory, setPointsHistory] = useState<any[]>([])

  const [loadingState, setLoadingState] = useState<LoadingState>({
    catalog: true,
    myRewards: true,
    achievements: true,
    referrals: true,
  })

  const [errorState, setErrorState] = useState<ErrorState>({
    catalog: null,
    myRewards: null,
    achievements: null,
    referrals: null,
  })

  const [redeemInFlight, setRedeemInFlight] = useState<string | null>(null)
  const [redeemFeedback, setRedeemFeedback] = useState<string | null>(null)
  const [clipboardMessage, setClipboardMessage] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const boot = async () => {
      try {
        setLoading(true)
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()

        if (error) throw error
        if (!user) {
          router.replace("/auth/sign-in")
          return
        }

        if (!mounted) return

        setCurrentUserId(user.id)

        const [pointsResult, rewardsResult] = await Promise.all([
          rewardsRepository.getCustomerPoints(user.id),
          rewardsRepository.getAvailableRewards(),
        ])

        if (!mounted) return

        setPoints(pointsResult)
        setCatalog(rewardsResult)
        setLoadingState((prev) => ({ ...prev, catalog: false }))

        await Promise.all([
          refreshActiveRewards(user.id),
          refreshAchievements(user.id),
          refreshReferral(user.id),
          refreshPointsHistory(user.id),
        ])

        if (mounted) {
          setLoading(false)
        }
      } catch (err: any) {
        console.error("Failed to load rewards center:", err)
        if (mounted) {
          setGlobalError(err?.message ?? "Unable to load Rewards Center")
          setLoading(false)
        }
      }
    }

    boot()

    return () => {
      mounted = false
    }
  }, [router, supabase, rewardsRepository])

  const refreshActiveRewards = useCallback(
    async (userId: string) => {
      try {
        setLoadingState((prev) => ({ ...prev, myRewards: true }))
        const rewards = await rewardsRepository.getActiveRewards(userId)
        setActiveRewards(rewards)
        setErrorState((prev) => ({ ...prev, myRewards: null }))
      } catch (err: any) {
        console.error("Failed to load active rewards:", err)
        setErrorState((prev) => ({ ...prev, myRewards: err?.message ?? "Unable to load active rewards" }))
      } finally {
        setLoadingState((prev) => ({ ...prev, myRewards: false }))
      }
    },
    [rewardsRepository]
  )

  const refreshAchievements = useCallback(
    async (userId: string) => {
      try {
        setLoadingState((prev) => ({ ...prev, achievements: true }))
        const unlocked = await rewardsRepository.getUnlockedAchievements(userId)
        setAchievements(unlocked)
        setErrorState((prev) => ({ ...prev, achievements: null }))
      } catch (err: any) {
        console.error("Failed to load achievements:", err)
        setErrorState((prev) => ({ ...prev, achievements: err?.message ?? "Unable to load achievements" }))
      } finally {
        setLoadingState((prev) => ({ ...prev, achievements: false }))
      }
    },
    [rewardsRepository]
  )

  const refreshReferral = useCallback(
    async (userId: string) => {
      try {
        setLoadingState((prev) => ({ ...prev, referrals: true }))
        const code = await rewardsRepository.getReferralCode(userId)
        setReferralCode(code)
        setErrorState((prev) => ({ ...prev, referrals: null }))
      } catch (err: any) {
        console.error("Failed to load referral code:", err)
        setErrorState((prev) => ({ ...prev, referrals: err?.message ?? "Unable to load referral code" }))
      } finally {
        setLoadingState((prev) => ({ ...prev, referrals: false }))
      }
    },
    [rewardsRepository]
  )

  const refreshPointsHistory = useCallback(
    async (userId: string) => {
      try {
        const rows = await rewardsRepository.getPointsHistory(userId)
        setPointsHistory(rows)
      } catch (err) {
        console.warn("Failed to load points history", err)
      }
    },
    [rewardsRepository]
  )

  const handleRedeem = useCallback(
    async (reward: RewardDto) => {
      if (!currentUserId || !points) return

      if (points.total_points < reward.points_cost) {
        setRedeemFeedback("Not enough points to redeem this reward.")
        return
      }

      try {
        setRedeemInFlight(reward.id)
        const result = await rewardsRepository.redeemReward(currentUserId, reward.id)
        setPoints(result.updatedPoints)
        await Promise.all([
          refreshActiveRewards(currentUserId),
          refreshPointsHistory(currentUserId),
        ])
        setRedeemFeedback(`Redeemed ${reward.name}!`)
      } catch (err: any) {
        console.error("Redeem failed:", err)
        setRedeemFeedback(err?.message ?? "Unable to redeem reward.")
      } finally {
        setRedeemInFlight(null)
      }
    },
    [currentUserId, points, refreshActiveRewards, refreshPointsHistory, rewardsRepository]
  )

  const handleCopyReferral = useCallback(async () => {
    if (!referralCode?.code) return
    try {
      await navigator.clipboard.writeText(referralCode.code)
      setClipboardMessage("Referral code copied!")
      setTimeout(() => setClipboardMessage(null), 2000)
    } catch (err) {
      console.warn("Clipboard copy failed", err)
      setClipboardMessage("Unable to copy automatically. Please copy manually.")
      setTimeout(() => setClipboardMessage(null), 3000)
    }
  }, [referralCode?.code])

  const handleShareReferral = useCallback(async () => {
    if (!referralCode?.code) return
    const shareText = `Join Here Ta Help with my referral code: ${referralCode.code} and earn bonus points!`

    if (navigator.share) {
      try {
        await navigator.share({ title: "Here Ta Help", text: shareText })
      } catch (err) {
        console.warn("Share cancelled or failed", err)
      }
    } else {
      handleCopyReferral()
    }
  }, [handleCopyReferral, referralCode?.code])

  const filteredCatalog = catalog.filter((reward) =>
    categoryFilter ? reward.category === categoryFilter : true
  )

  const rewardLookup = useMemo(() => {
    const map = new Map<string, RewardDto>()
    catalog.forEach((reward) => {
      map.set(reward.id, reward)
    })
    return map
  }, [catalog])

  const unlockedAchievementIds = useMemo(
    () => new Set(achievements.map((achievement) => achievement.id)),
    [achievements]
  )

  const isLoadingTab = loading || loadingState[selectedTab as keyof LoadingState]
  const tabError = errorState[selectedTab as keyof ErrorState]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-[#0D1B2A]">
          <div className="h-12 w-12 rounded-full border-4 border-[#0D1B2A]/30 border-t-[#0D1B2A] animate-spin" />
          <p className="text-sm font-medium">Loading Rewards Center…</p>
        </div>
      </div>
    )
  }

  if (globalError || !points || !currentUserId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-6 rounded-3xl bg-white p-8 shadow-lg text-center">
          <div className="text-5xl" aria-hidden>
            ⚠️
          </div>
          <h1 className="text-xl font-semibold text-[#0D1B2A]">We couldn’t open Rewards Center</h1>
          <p className="text-sm text-gray-600">{globalError ?? "Something went wrong while loading your rewards."}</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-xl bg-[#0D1B2A] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#0A1625]"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[#0D1B2A]/70">Here Ta Help</p>
            <h1 className="text-2xl font-semibold text-[#0D1B2A]">Rewards Center</h1>
            <p className="text-sm text-gray-600">Earn, redeem, and track your loyalty perks.</p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 rounded-full border border-[#0D1B2A] px-3 py-1 text-xs font-semibold text-[#0D1B2A] transition hover:bg-[#0D1B2A] hover:text-white"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8">
        <PointsBalanceCard points={points} history={pointsHistory} />

        {redeemFeedback ? (
          <div className="rounded-2xl border border-[#0D1B2A]/15 bg-[#0D1B2A]/5 px-4 py-3 text-sm text-[#0D1B2A]">
            {redeemFeedback}
          </div>
        ) : null}
        {clipboardMessage ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {clipboardMessage}
          </div>
        ) : null}

        <TabNavigation selectedTab={selectedTab} onSelect={setSelectedTab} />

        {tabError ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{tabError}</div>
        ) : null}

        <section className="min-h-[420px] rounded-3xl bg-white p-6 shadow-sm">
          {isLoadingTab ? (
            <div className="flex h-full items-center justify-center">
              <div className="flex flex-col items-center gap-3 text-[#0D1B2A]">
                <div className="h-10 w-10 rounded-full border-4 border-[#0D1B2A]/30 border-t-[#0D1B2A] animate-spin" />
                <p className="text-xs font-medium">Loading…</p>
              </div>
            </div>
          ) : (
            <RewardsTabContent
              tab={selectedTab}
              catalog={filteredCatalog}
              points={points.total_points}
              categoryFilter={categoryFilter}
              onCategoryChange={setCategoryFilter}
              onRedeem={handleRedeem}
              redeemInFlight={redeemInFlight}
              activeRewards={activeRewards}
              rewardLookup={rewardLookup}
              achievementsCatalog={ACHIEVEMENTS_CATALOG}
              unlockedAchievementIds={unlockedAchievementIds}
              referralCode={referralCode}
              onCopyReferral={handleCopyReferral}
              onShareReferral={handleShareReferral}
            />
          )}
        </section>
      </main>
    </div>
  )
}

type PointsBalanceProps = {
  points: CustomerPoints
  history: any[]
}

function PointsBalanceCard({ points, history }: PointsBalanceProps) {
  return (
    <section className="rounded-3xl bg-[#0D1B2A] p-6 text-white shadow-lg">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-white/70">Total Points</p>
          <div className="mt-2 flex items-end gap-4">
            <span className="text-4xl">⭐</span>
            <span className="text-5xl font-semibold">{points.total_points}</span>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <PointsMetric label="Lifetime" value={points.lifetime_points.toLocaleString()} icon="💎" />
            <PointsMetric label="Spent" value={points.points_spent.toLocaleString()} icon="🎁" />
            <PointsMetric label="Multiplier" value={`${points.points_multiplier.toFixed(1)}x`} icon="🚀" />
          </div>
        </div>
        <div className="rounded-2xl bg-white/10 p-4 text-sm">
          <p className="font-semibold">Recent Activity</p>
          {history.length === 0 ? (
            <p className="mt-2 text-white/70">No recent points activity.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {history.slice(0, 4).map((row) => (
                <li key={row.id} className="flex items-center justify-between gap-4 text-xs">
                  <span className="text-white/80">
                    {row.reason}
                    <span className="ml-2 text-white/60">{formatDate(row.created_at)}</span>
                  </span>
                  <span className={`font-semibold ${row.type === 'SPENT' ? 'text-rose-200' : 'text-emerald-200'}`}>
                    {row.type === 'SPENT' ? '-' : '+'}
                    {row.points}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}

function PointsMetric({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3">
      <p className="flex items-center gap-2 text-sm font-semibold">
        <span>{icon}</span>
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  )
}

type TabNavigationProps = {
  selectedTab: TabKey
  onSelect: (tab: TabKey) => void
}

function TabNavigation({ selectedTab, onSelect }: TabNavigationProps) {
  return (
    <nav className="flex w-full gap-2 overflow-x-auto rounded-full bg-white p-2 shadow-sm">
      {TAB_DEFINITIONS.map((tab) => {
        const isActive = tab.key === selectedTab
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onSelect(tab.key)}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
              isActive ? 'bg-[#0D1B2A] text-white shadow' : 'text-[#0D1B2A] hover:bg-[#0D1B2A]/10'
            }`}
          >
            <span aria-hidden>{tab.emoji}</span>
            {tab.label}
          </button>
        )
      })}
    </nav>
  )
}

type RewardsTabContentProps = {
  tab: TabKey
  catalog: RewardDto[]
  points: number
  categoryFilter: RewardCategory | null
  onCategoryChange: (category: RewardCategory | null) => void
  onRedeem: (reward: RewardDto) => void
  redeemInFlight: string | null
  activeRewards: RedeemedRewardDto[]
  rewardLookup: Map<string, RewardDto>
  achievementsCatalog: AchievementDto[]
  unlockedAchievementIds: Set<string>
  referralCode: ReferralCodeDto | null
  onCopyReferral: () => void
  onShareReferral: () => void
}

function RewardsTabContent(props: RewardsTabContentProps) {
  const {
    tab,
    catalog,
    points,
    categoryFilter,
    onCategoryChange,
    onRedeem,
    redeemInFlight,
    activeRewards,
    rewardLookup,
    achievementsCatalog,
    unlockedAchievementIds,
    referralCode,
    onCopyReferral,
    onShareReferral,
  } = props

  switch (tab) {
    case "catalog":
      return (
        <CatalogTab
          catalog={catalog}
          availablePoints={points}
          categoryFilter={categoryFilter}
          onCategoryChange={onCategoryChange}
          onRedeem={onRedeem}
          redeemInFlight={redeemInFlight}
        />
      )
    case "my-rewards":
      return <ActiveRewardsTab rewards={activeRewards} rewardLookup={rewardLookup} />
    case "achievements":
      return (
        <AchievementsTab
          catalog={achievementsCatalog}
          unlockedAchievementIds={unlockedAchievementIds}
        />
      )
    case "referrals":
      return (
        <ReferralsTab
          referralCode={referralCode}
          onCopy={onCopyReferral}
          onShare={onShareReferral}
        />
      )
    default:
      return null
  }
}

type CatalogTabProps = {
  catalog: RewardDto[]
  availablePoints: number
  categoryFilter: RewardCategory | null
  onCategoryChange: (category: RewardCategory | null) => void
  onRedeem: (reward: RewardDto) => void
  redeemInFlight: string | null
}

function CatalogTab({
  catalog,
  availablePoints,
  categoryFilter,
  onCategoryChange,
  onRedeem,
  redeemInFlight,
}: CatalogTabProps) {
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => onCategoryChange(null)}
          className={`rounded-full border px-3 py-1 text-sm transition ${
            categoryFilter === null
              ? 'border-[#0D1B2A] bg-[#0D1B2A] text-white'
              : 'border-gray-200 text-gray-600 hover:border-[#0D1B2A] hover:text-[#0D1B2A]'
          }`}
        >
          <span className="mr-1" aria-hidden>
            🎁
          </span>
          All
        </button>
        {CATEGORY_ORDER.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => onCategoryChange(category)}
            className={`rounded-full border px-3 py-1 text-sm transition ${
              categoryFilter === category
                ? 'border-[#0D1B2A] bg-[#0D1B2A] text-white'
                : 'border-gray-200 text-gray-600 hover:border-[#0D1B2A] hover:text-[#0D1B2A]'
            }`}
          >
            <span className="mr-1" aria-hidden>
              {CATEGORY_METADATA[category].emoji}
            </span>
            {CATEGORY_METADATA[category].label}
          </button>
        ))}
      </div>

      {catalog.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-gray-500">
          <span className="text-5xl" aria-hidden>
            🤔
          </span>
          <p className="text-sm">No rewards found in this category right now.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {catalog.map((reward) => {
            const canAfford = availablePoints >= reward.points_cost
            const isRedeeming = redeemInFlight === reward.id
            return (
              <div
                key={reward.id}
                className={`flex h-full flex-col justify-between rounded-2xl border p-5 transition shadow-sm ${
                  canAfford ? 'border-[#0D1B2A]/20 hover:shadow-md' : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-4xl" aria-hidden>
                    {reward.emoji ?? '🎁'}
                  </span>
                  <div>
                    <p className="text-base font-semibold text-[#0D1B2A]">{reward.name}</p>
                    <p className="text-xs text-gray-500">{reward.description}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <div className="text-[#0D1B2A] font-semibold flex items-center gap-2">
                    <span aria-hidden>⭐</span>
                    {reward.points_cost.toLocaleString()} points
                  </div>
                  <p className="text-xs text-gray-400">Expires {reward.expiry_days} days after redeeming</p>
                </div>
                <button
                  type="button"
                  onClick={() => onRedeem(reward)}
                  disabled={!canAfford || isRedeeming}
                  className={`mt-6 inline-flex w-full items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    !canAfford
                      ? 'cursor-not-allowed bg-gray-200 text-gray-500'
                      : isRedeeming
                      ? 'bg-[#0D1B2A]/70 text-white'
                      : 'bg-[#0D1B2A] text-white hover:bg-[#0A1625]'
                  }`}
                >
                  {isRedeeming ? 'Redeeming…' : canAfford ? 'Redeem now' : 'Not enough points'}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

type ActiveRewardsTabProps = {
  rewards: RedeemedRewardDto[]
  rewardLookup: Map<string, RewardDto>
}

function ActiveRewardsTab({ rewards, rewardLookup }: ActiveRewardsTabProps) {
  if (rewards.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-gray-500">
        <span className="text-5xl" aria-hidden>
          🎫
        </span>
        <p className="text-sm font-medium text-[#0D1B2A]">No active rewards</p>
        <p className="text-xs">Redeem rewards from the catalog to see them here.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {rewards.map((reward) => (
        <ActiveRewardCard key={reward.id} redeemedReward={reward} rewardLookup={rewardLookup} />
      ))}
    </div>
  )
}

type ActiveRewardCardProps = {
  redeemedReward: RedeemedRewardDto
  rewardLookup: Map<string, RewardDto>
}

function ActiveRewardCard({ redeemedReward, rewardLookup }: ActiveRewardCardProps) {
  const reward = rewardLookup.get(redeemedReward.reward_id)
  const statusBadge = getStatusMeta(redeemedReward.status)

  return (
    <div className="rounded-2xl border border-[#0D1B2A]/10 bg-[#0D1B2A]/5 p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-3xl" aria-hidden>
              {reward?.emoji ?? '🎁'}
            </span>
            <div>
              <p className="text-base font-semibold text-[#0D1B2A]">{reward?.name ?? 'Reward'}</p>
              <p className="text-xs text-gray-500">Redeemed {formatDate(redeemedReward.redeemed_at)}</p>
            </div>
          </div>
          {reward?.description ? (
            <p className="mt-3 text-sm text-gray-600">{reward.description}</p>
          ) : null}
          <div className="mt-3 inline-flex items-center gap-2 text-xs text-gray-500">
            <span aria-hidden>⏰</span>
            Expires {formatDate(redeemedReward.expires_at)}
          </div>
        </div>
        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${statusBadge.bg} ${statusBadge.text}`}>
          {statusBadge.label}
        </span>
      </div>
    </div>
  )
}

type AchievementsTabProps = {
  catalog: AchievementDto[]
  unlockedAchievementIds: Set<string>
}

function AchievementsTab({ catalog, unlockedAchievementIds }: AchievementsTabProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {catalog.map((achievement) => {
        const unlocked = unlockedAchievementIds.has(achievement.id)
        return (
          <div
            key={achievement.id}
            className={`rounded-2xl border p-5 shadow-sm transition ${
              unlocked ? 'border-amber-300 bg-amber-50' : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl" aria-hidden>
                {unlocked ? achievement.emoji : '🔒'}
              </span>
              <div>
                <p className={`text-base font-semibold ${unlocked ? 'text-[#0D1B2A]' : 'text-gray-500'}`}>
                  {achievement.name}
                </p>
                <p className="text-xs text-gray-500">{achievement.description}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="rounded-full bg-[#0D1B2A]/10 px-3 py-1 font-semibold text-[#0D1B2A]/80">
                +{achievement.points_reward} pts
              </span>
              <span className="text-gray-500">Requirement: {achievement.requirement}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

type ReferralsTabProps = {
  referralCode: ReferralCodeDto | null
  onCopy: () => void
  onShare: () => void
}

function ReferralsTab({ referralCode, onCopy, onShare }: ReferralsTabProps) {
  return (
    <div className="flex h-full flex-col gap-5">
      <div className="rounded-3xl bg-[#0D1B2A] p-6 text-white shadow-sm">
        <p className="text-xs uppercase tracking-wide text-white/70">Your referral code</p>
        <p className="mt-3 text-4xl font-semibold tracking-[0.6rem]">
          {referralCode?.code ?? '— — — — — —'}
        </p>
        <p className="mt-3 text-xs text-white/70">
          Share your code with friends. You both earn bonus points on their first job.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#0D1B2A] transition hover:bg-white/90"
          >
            <span aria-hidden>📋</span>
            Copy code
          </button>
          <button
            type="button"
            onClick={onShare}
            className="inline-flex items-center gap-2 rounded-xl border border-white bg-[#0D1B2A] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0A1625]"
          >
            <span aria-hidden>📤</span>
            Share invite
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <ReferralStat label="Total referrals" value={referralCode?.total_referrals ?? 0} emoji="👥" />
        <ReferralStat label="Successful" value={referralCode?.successful_referrals ?? 0} emoji="✅" />
        <ReferralStat label="Points earned" value={referralCode?.points_earned ?? 0} emoji="⭐" />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-600 shadow-sm">
        <h2 className="text-base font-semibold text-[#0D1B2A]">How referrals work</h2>
        <ol className="mt-3 space-y-2 text-xs">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-[#0D1B2A]" aria-hidden>
              1.
            </span>
            Share your code with friends
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-[#0D1B2A]" aria-hidden>
              2.
            </span>
            They sign up and enter your code
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-[#0D1B2A]" aria-hidden>
              3.
            </span>
            Earn bonus points when they book and complete their first job
          </li>
        </ol>
      </div>
    </div>
  )
}

function ReferralStat({ label, value, emoji }: { label: string; value: number; emoji: string }) {
  return (
    <div className="rounded-2xl border border-[#0D1B2A]/10 bg-white p-4 text-center shadow-sm">
      <p className="text-3xl" aria-hidden>
        {emoji}
      </p>
      <p className="mt-2 text-2xl font-semibold text-[#0D1B2A]">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  )
}

function getStatusMeta(status: RewardStatus) {
  switch (status) {
    case RewardStatus.ACTIVE:
      return { label: 'Active', bg: 'bg-emerald-100', text: 'text-emerald-700' }
    case RewardStatus.USED:
      return { label: 'Used', bg: 'bg-slate-100', text: 'text-slate-600' }
    case RewardStatus.EXPIRED:
      return { label: 'Expired', bg: 'bg-rose-100', text: 'text-rose-700' }
    case RewardStatus.REFUNDED:
      return { label: 'Refunded', bg: 'bg-amber-100', text: 'text-amber-700' }
    default:
      return { label: 'Active', bg: 'bg-emerald-100', text: 'text-emerald-700' }
  }
}

function formatDate(value: string | null | undefined) {
  if (!value) return '—'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return parsed.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
