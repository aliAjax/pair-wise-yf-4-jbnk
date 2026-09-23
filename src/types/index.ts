export type SeatDirection = '左' | '右'

export type Weather = '晴' | '多云' | '阴' | '小雨' | '大雨' | '雪' | '雾'

export type TreeDensity = '稀疏' | '适中' | '茂密'

export type PedestrianStatus = '稀少' | '零星' | '密集'

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

export type SceneRevisionData = Pick<
  SceneFormData,
  | 'routeName'
  | 'segment'
  | 'seatDirection'
  | 'weather'
  | 'treeDensity'
  | 'pedestrianStatus'
  | 'note'
>
