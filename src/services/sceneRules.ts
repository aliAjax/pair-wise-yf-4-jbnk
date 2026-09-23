import type { SceneRevisionData, WindowScene } from '@/types'

export const REVISION_WINDOW_MS = 10 * 60 * 1000

/**
 * 修订保持原采样时刻排序；这里只按时刻返回，线路内的逆序展示由页面处理。
 */
export function sortScenesBySamplingTime(scenes: WindowScene[]): WindowScene[] {
  return [...scenes].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  )
}

/**
 * 十分钟以内且区间、座位方向均相同的其他记录会导致整次修订被拒绝。
 */
export function findRevisionConflict(
  scenes: WindowScene[],
  revision: SceneRevisionData,
  revisedId: string,
  originalTimestamp: string
): WindowScene | null {
  const originalTime = new Date(originalTimestamp).getTime()

  return (
    scenes.find((scene) => {
      if (scene.id === revisedId || scene.routeName !== revision.routeName) return false

      const sceneTime = new Date(scene.timestamp).getTime()
      return (
        Math.abs(sceneTime - originalTime) <= REVISION_WINDOW_MS &&
        scene.segment === revision.segment &&
        scene.seatDirection === revision.seatDirection
      )
    }) ?? null
  )
}
