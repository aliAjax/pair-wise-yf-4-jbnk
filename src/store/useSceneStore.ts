import { create } from 'zustand'
import type { WindowScene, SceneFormData, RevisionFormData } from '@/types'
import {
  getAllScenes,
  saveScene as storageSaveScene,
  deleteScene as storageDeleteScene,
  updateScene as storageUpdateScene,
  getScenesByRoute,
  getAllRouteNames,
  getRandomScene,
} from '@/services/storage'
import { applyRevision, findRevisionConflict } from '@/services/revisionRules'

export interface RevisionResult {
  ok: boolean
  conflict?: WindowScene
}

interface SceneState {
  scenes: WindowScene[]
  routeNames: string[]
  currentRouteScenes: WindowScene[]
  selectedRoute: string
  randomScene: WindowScene | null

  loadAll: () => void
  saveScene: (data: SceneFormData) => void
  deleteScene: (id: string) => void
  reviseScene: (id: string, data: RevisionFormData) => RevisionResult
  selectRoute: (routeName: string) => void
  refreshRandom: () => void
}

export const useSceneStore = create<SceneState>((set) => ({
  scenes: [],
  routeNames: [],
  currentRouteScenes: [],
  selectedRoute: '',
  randomScene: null,

  loadAll: () => {
    const scenes = getAllScenes()
    const routeNames = getAllRouteNames()
    set({ scenes, routeNames })
  },

  saveScene: (data: SceneFormData) => {
    const scene: WindowScene = {
      ...data,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    }
    storageSaveScene(scene)
    const scenes = getAllScenes()
    const routeNames = getAllRouteNames()
    set((state) => {
      const currentRouteScenes =
        state.selectedRoute ? getScenesByRoute(state.selectedRoute) : []
      return { scenes, routeNames, currentRouteScenes }
    })
  },

  deleteScene: (id: string) => {
    storageDeleteScene(id)
    const scenes = getAllScenes()
    const routeNames = getAllRouteNames()
    set((state) => {
      const currentRouteScenes =
        state.selectedRoute ? getScenesByRoute(state.selectedRoute) : []
      return { scenes, routeNames, currentRouteScenes }
    })
  },

  reviseScene: (id: string, data: RevisionFormData): RevisionResult => {
    const scenes = getAllScenes()
    const original = scenes.find((s) => s.id === id)
    if (!original) return { ok: false }
    const revised = applyRevision(original, data, new Date().toISOString())
    const conflict = findRevisionConflict(scenes, revised)
    // 整次拒绝：不写存储、不改状态，两个线路的列表保持原样
    if (conflict) return { ok: false, conflict }
    storageUpdateScene(revised)
    const all = getAllScenes()
    const routeNames = getAllRouteNames()
    set((state) => {
      const currentRouteScenes =
        state.selectedRoute ? getScenesByRoute(state.selectedRoute) : []
      return { scenes: all, routeNames, currentRouteScenes }
    })
    return { ok: true }
  },

  selectRoute: (routeName: string) => {
    const currentRouteScenes = routeName ? getScenesByRoute(routeName) : []
    set({ selectedRoute: routeName, currentRouteScenes })
  },

  refreshRandom: () => {
    const randomScene = getRandomScene()
    set({ randomScene })
  },
}))
