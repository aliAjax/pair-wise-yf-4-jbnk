import type { WindowScene, RevisionFormData } from '@/types'

/** 冲突判定的时间窗：同线路十分钟以内 */
export const REVISION_CONFLICT_WINDOW_MS = 10 * 60 * 1000

/**
 * 生成修订后的记录：
 * - 沿用原编号与采样时刻，排序位置不因修订改变
 * - 招牌等未开放修订的字段保持原值
 * - 写入修订时间，作为修订痕迹
 */
export function applyRevision(
  original: WindowScene,
  data: RevisionFormData,
  revisedAt: string
): WindowScene {
  return {
    ...original,
    ...data,
    id: original.id,
    timestamp: original.timestamp,
    revisedAt,
  }
}

/**
 * 冲突判定：同一线路内、采样时刻相差十分钟以内、
 * 区间与座位方向均相同的其他已有记录。
 * 命中即整次拒绝，调用方不得写入任何变更。
 */
export function findRevisionConflict(
  scenes: WindowScene[],
  revised: WindowScene
): WindowScene | null {
  const revisedTime = new Date(revised.timestamp).getTime()
  return (
    scenes.find(
      (s) =>
        s.id !== revised.id &&
        s.routeName === revised.routeName &&
        s.segment === revised.segment &&
        s.seatDirection === revised.seatDirection &&
        Math.abs(new Date(s.timestamp).getTime() - revisedTime) <=
          REVISION_CONFLICT_WINDOW_MS
    ) ?? null
  )
}
