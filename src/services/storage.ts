import type { WindowScene } from '@/types'
import { sortScenesBySamplingTime } from '@/services/sceneRules'

const STORAGE_KEY = 'bus_window_scenes'

function parseScenes(raw: string): WindowScene[] {
  const parsed = JSON.parse(raw) as WindowScene[]
  return parsed.map((scene) => ({
    ...scene,
    revisedAt: scene.revisedAt,
  }))
}

export function getAllScenes(): WindowScene[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return parseScenes(raw)
  } catch {
    return []
  }
}

function persistScenes(scenes: WindowScene[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(scenes))
}

export function saveScene(scene: WindowScene): void {
  const scenes = getAllScenes()
  scenes.push(scene)
  persistScenes(scenes)
}

export function replaceScene(revisedScene: WindowScene): void {
  const scenes = getAllScenes().map((scene) =>
    scene.id === revisedScene.id ? revisedScene : scene
  )
  persistScenes(scenes)
}

export function deleteScene(id: string): void {
  const scenes = getAllScenes().filter((s) => s.id !== id)
  persistScenes(scenes)
}

export function getScenesByRoute(routeName: string): WindowScene[] {
  return sortScenesBySamplingTime(
    getAllScenes().filter((s) => s.routeName === routeName)
  ).reverse()
}

export function getAllRouteNames(): string[] {
  const scenes = getAllScenes()
  const routeSet = new Set(scenes.map((s) => s.routeName))
  return Array.from(routeSet).sort()
}

export function getRandomScene(): WindowScene | null {
  const scenes = getAllScenes()
  if (scenes.length === 0) return null
  return scenes[Math.floor(Math.random() * scenes.length)]
}
