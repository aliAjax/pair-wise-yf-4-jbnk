import { useState } from 'react'
import {
  X,
  Save,
  Bus,
  MapPin,
  Armchair,
  Clock,
  CloudSun,
  TreePine,
  Users,
  FileText,
  AlertCircle,
  BadgeCheck,
} from 'lucide-react'
import { useSceneStore } from '@/store/useSceneStore'
import {
  formatTimestamp,
  getWeatherIcon,
  getTreeIcon,
  getPedestrianIcon,
} from '@/utils/sceneHelpers'
import type {
  PedestrianStatus,
  SceneRevisionData,
  SeatDirection,
  TreeDensity,
  Weather,
  WindowScene,
} from '@/types'

const WEATHERS: Weather[] = ['晴', '多云', '阴', '小雨', '大雨', '雪', '雾']
const TREES: TreeDensity[] = ['稀疏', '适中', '茂密']
const PEDESTRIANS: PedestrianStatus[] = ['稀少', '零星', '密集']

interface SceneRevisionModalProps {
  scene: WindowScene
  onClose: () => void
  onSaved: (scene: WindowScene) => void
}

function toRevisionData(scene: WindowScene): SceneRevisionData {
  return {
    routeName: scene.routeName,
    segment: scene.segment,
    seatDirection: scene.seatDirection,
    weather: scene.weather,
    treeDensity: scene.treeDensity,
    pedestrianStatus: scene.pedestrianStatus,
    note: scene.note,
  }
}

export default function SceneRevisionModal({
  scene,
  onClose,
  onSaved,
}: SceneRevisionModalProps) {
  const reviseScene = useSceneStore((state) => state.reviseScene)
  const [form, setForm] = useState<SceneRevisionData>(() => toRevisionData(scene))
  const [conflict, setConflict] = useState(false)

  const update = <K extends keyof SceneRevisionData>(
    key: K,
    value: SceneRevisionData[K]
  ) => {
    setConflict(false)
    setForm((previous) => ({ ...previous, [key]: value }))
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const revised = reviseScene(scene.id, form)
    if (!revised) {
      setConflict(true)
      return
    }
    onSaved(revised)
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative mx-4 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-teal-700 bg-teal-900 p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-mist-400 transition-colors hover:text-mist-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-4 pr-8">
          <div className="flex items-center gap-2">
            <BadgeCheck className="w-5 h-5 text-dusk-400" />
            <h2 className="font-serif text-xl font-bold text-dusk-400">修订窗景</h2>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-mist-400">
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3 h-3" />
              采样时刻 {formatTimestamp(scene.timestamp)}
            </span>
            <span className="rounded bg-teal-800 px-2 py-0.5">
              编号 {scene.id.slice(0, 8)}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <section className="space-y-3">
            <h3 className="flex items-center gap-2 font-serif text-base text-dusk-400">
              <MapPin className="w-4 h-4" />线路与区间
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 flex items-center gap-1 text-xs text-mist-300">
                  <Bus className="w-3 h-3" />线路
                </label>
                <input
                  value={form.routeName}
                  onChange={(event) => update('routeName', event.target.value)}
                  required
                  className="w-full rounded-xl bg-teal-850 px-3 py-2 text-sm text-mist-100 outline-none focus:ring-1 focus:ring-dusk-400"
                />
              </div>
              <div>
                <label className="mb-1 flex items-center gap-1 text-xs text-mist-300">
                  <MapPin className="w-3 h-3" />区间
                </label>
                <input
                  value={form.segment}
                  onChange={(event) => update('segment', event.target.value)}
                  required
                  className="w-full rounded-xl bg-teal-850 px-3 py-2 text-sm text-mist-100 outline-none focus:ring-1 focus:ring-dusk-400"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 flex items-center gap-1 text-xs text-mist-300">
                <Armchair className="w-3 h-3" />座位方向
              </label>
              <div className="flex gap-2">
                {(['左', '右'] as SeatDirection[]).map((direction) => (
                  <button
                    key={direction}
                    type="button"
                    onClick={() => update('seatDirection', direction)}
                    className={`flex-1 rounded-xl border py-2 text-sm font-medium transition ${
                      form.seatDirection === direction
                        ? 'border-dusk-400 bg-dusk-400/20 text-dusk-400'
                        : 'border-transparent bg-teal-850 text-mist-300'
                    }`}
                  >
                    {direction}侧
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="flex items-center gap-2 font-serif text-base text-dusk-400">
              <CloudSun className="w-4 h-4" />窗景信息
            </h3>
            <div>
              <label className="mb-1 block text-xs text-mist-300">天气</label>
              <div className="grid grid-cols-4 gap-2">
                {WEATHERS.map((weather) => (
                  <button
                    key={weather}
                    type="button"
                    onClick={() => update('weather', weather)}
                    className={`flex flex-col items-center gap-1 rounded-xl border py-2 text-xs transition ${
                      form.weather === weather
                        ? 'border-dusk-400 bg-dusk-400/20 text-dusk-400'
                        : 'border-transparent bg-teal-850 text-mist-300'
                    }`}
                  >
                    {getWeatherIcon(weather)}
                    {weather}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 flex items-center gap-1 text-xs text-mist-300">
                  <TreePine className="w-3 h-3" />树木密度
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {TREES.map((density) => (
                    <button
                      key={density}
                      type="button"
                      onClick={() => update('treeDensity', density)}
                      className={`flex flex-col items-center gap-1 rounded-xl border py-2 text-xs transition ${
                        form.treeDensity === density
                          ? 'border-dusk-400 bg-dusk-400/20 text-dusk-400'
                          : 'border-transparent bg-teal-850 text-mist-300'
                      }`}
                    >
                      {getTreeIcon(density)}
                      {density}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1 flex items-center gap-1 text-xs text-mist-300">
                  <Users className="w-3 h-3" />行人状态
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PEDESTRIANS.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => update('pedestrianStatus', status)}
                      className={`flex flex-col items-center gap-1 rounded-xl border py-2 text-xs transition ${
                        form.pedestrianStatus === status
                          ? 'border-dusk-400 bg-dusk-400/20 text-dusk-400'
                          : 'border-transparent bg-teal-850 text-mist-300'
                      }`}
                    >
                      {getPedestrianIcon(status)}
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="flex items-center gap-2 font-serif text-base text-dusk-400">
              <FileText className="w-4 h-4" />观察笔记
            </h3>
            <textarea
              value={form.note}
              onChange={(event) => update('note', event.target.value)}
              className="h-24 w-full resize-none rounded-xl bg-teal-850 px-3 py-2 text-sm text-mist-100 outline-none focus:ring-1 focus:ring-dusk-400"
            />
          </section>

          {conflict && (
            <div className="flex items-start gap-2 rounded-xl border border-red-800 bg-red-950/40 px-3 py-2.5 text-xs text-red-200">
              <AlertCircle className="mt-0.5 w-4 h-4 shrink-0" />
              <span>
                同一线路十分钟内已有相同区间和座位方向的记录，本次修订已拒绝，原记录与线路列表均未改变。
              </span>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-teal-700 py-2.5 text-sm text-mist-300 transition-colors hover:bg-teal-800"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex flex-[2] items-center justify-center gap-2 rounded-xl bg-dusk-400 py-2.5 text-sm font-medium text-teal-950 transition active:scale-[0.99]"
            >
              <Save className="w-4 h-4" />
              保存修订
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
