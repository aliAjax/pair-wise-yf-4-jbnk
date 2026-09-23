import { create } from 'zustand'
import type { WindowScene, SceneFormData, SceneRevisionData } from '@/types'
import {
  getAllScenes,
  saveScene as storageSaveScene,
  replaceScene as storageReplaceScene,
  deleteScene as storageDeleteScene,
  getScenesByRoute,
  getAllRouteNames,
  getRandomScene,
} from '@/services/storage'
import { findRevisionConflict } from '@/services/sceneRules'

interface SceneState {
  scenes: WindowScene[]
  routeNames: string[]
  currentRouteScenes: WindowScene[]
  selectedRoute: string
  randomScene: WindowScene | null

  loadAll: () => void
  saveScene: (data: SceneFormData) => void
  reviseScene: (id: string, data: SceneRevisionData) => WindowScene | null
  deleteScene: (id: string) => void
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

  reviseScene: (id: string, data: SceneRevisionData) => {
    const previousScenes = getAllScenes()
    const original = previousScenes.find((scene) => scene.id === id)
    if (!original) return null

    const conflict = findRevisionConflict(previousScenes, data, id, original.timestamp)
    if (conflict) return null

    const revisedScene: WindowScene = {
      ...original,
      ...data,
      id: original.id,
      timestamp: original.timestamp,
      revisedAt: new Date().toISOString(),
    }
    storageReplaceScene(revisedScene)

    const scenes = getAllScenes()
    const routeNames = getAllRouteNames()
    set((state) => ({
      scenes,
      routeNames,
      currentRouteScenes: state.selectedRoute
        ? getScenesByRoute(state.selectedRoute)
        : [],
    }))
    return revisedScene
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

  selectRoute: (routeName: string) => {
    const currentRouteScenes = routeName ? getScenesByRoute(routeName) : []
    set({ selectedRoute: routeName, currentRouteScenes })
  },

  refreshRandom: () => {
    const randomScene = getRandomScene()
    set({ randomScene })
  },
}))
