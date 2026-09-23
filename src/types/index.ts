export type SeatDirection = '左' | '右'

export type Weather = '晴' | '多云' | '阴' | '小雨' | '大雨' | '雪' | '雾'

export type TreeDensity = '稀疏' | '适中' | '茂密'

export type PedestrianStatus = '稀少' | '零星' | '密集'

export const SEAT_OPTIONS: SeatDirection[] = ['左', '右']
export const WEATHER_OPTIONS: Weather[] = ['晴', '多云', '阴', '小雨', '大雨', '雪', '雾']
export const TREE_OPTIONS: TreeDensity[] = ['稀疏', '适中', '茂密']
export const PEDESTRIAN_OPTIONS: PedestrianStatus[] = ['稀少', '零星', '密集']

export interface WindowScene {
  id: string
  routeName: string
  segment: string
  seatDirection: SeatDirection
  timestamp: string
  weather: Weather
  signText: string
  treeDensity: TreeDensity
  pedestrianStatus: PedestrianStatus
  note: string
  /** 仅修订过的记录才写入，旧记录无此字段、无修订痕迹 */
  revisedAt?: string
}

export interface SceneFormData {
  routeName: string
  segment: string
  seatDirection: SeatDirection
  weather: Weather
  signText: string
  treeDensity: TreeDensity
  pedestrianStatus: PedestrianStatus
  note: string
}

/** 修订开放调整的字段：线路、区间、座位方向、天气、树木、行人、观察笔记 */
export interface RevisionFormData {
  routeName: string
  segment: string
  seatDirection: SeatDirection
  weather: Weather
  treeDensity: TreeDensity
  pedestrianStatus: PedestrianStatus
  note: string
}
