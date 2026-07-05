import { useState, useEffect } from 'react'
import { Database, BookOpen, CheckCircle, AlertCircle, Search, Layers, Target } from 'lucide-react'
import { Badge } from '@/components/atoms/Badge'
import { Input } from '@/components/atoms/Input'
import { Spinner } from '@/components/atoms/Spinner'
import { Alert } from '@/components/atoms/Alert'
import { adminService } from '@/services/adminService'
import { cn } from '@/utils/cn'

function scoreColor(v) {
  if (v >= 0.85) return 'text-green-600'
  if (v >= 0.6) return 'text-amber-600'
  return 'text-red-600'
}
function scoreBar(v) {
  if (v >= 0.85) return 'bg-green-500'
  if (v >= 0.6) return 'bg-amber-400'
  return 'bg-red-400'
}

export default function AdminKnowledgePage() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      setError('')
      try {
        const res = await adminService.getModelMetrics()
        setData(res.data.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load model metrics')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) return <div className="py-24 flex justify-center"><Spinner size="lg" /></div>
  if (error) return <Alert variant="error">{error}</Alert>

  const { metrics, intents } = data
  const filtered = intents.filter((i) =>
    !search || i.tag.toLowerCase().includes(search.toLowerCase()) || i.source.toLowerCase().includes(search.toLowerCase())
  )

  const sourceGroups = new Map()
  for (const i of intents) {
    sourceGroups.set(i.source, (sourceGroups.get(i.source) || 0) + 1)
  }

  const perClass = metrics?.testEvaluation?.perClass || []
  const perClassByTag = new Map(perClass.map((c) => [c.intent, c]))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-gray-900">Knowledge Base &amp; Model Performance</h1>
        <p className="text-sm text-gray-500 mt-1">Intent classifier training data and real held-out test results</p>
      </div>

      {!metrics ? (
        <Alert variant="warning">
          No trained model found. Run <code className="font-mono">npm run train-model</code> in the backend to generate metrics.
        </Alert>
      ) : (
        <>
          {/* KPI cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Intents', value: intents.length, sub: `${metrics.trainExamples + metrics.testExamples} total patterns`, icon: Layers, color: 'text-rose-600 bg-rose-100' },
              { label: 'Vocabulary Size', value: metrics.vocabularySize, sub: 'Bag-of-Words features', icon: Database, color: 'text-sage-600 bg-sage-100' },
              { label: 'Test Accuracy', value: `${Math.round(metrics.testEvaluation.accuracy * 100)}%`, sub: `On ${metrics.testExamples} held-out examples`, icon: Target, color: 'text-blue-600 bg-blue-100' },
              { label: 'Macro F1', value: `${Math.round(metrics.testEvaluation.macroAvg.f1 * 100)}%`, sub: 'Held-out test split', icon: CheckCircle, color: 'text-green-600 bg-green-100' },
            ].map(kpi => (
              <div key={kpi.label} className="bg-white rounded-2xl border border-gray-200 p-4">
                <div className="flex items-center gap-2.5 mb-3">
                  <span className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', kpi.color)}>
                    <kpi.icon className="w-4.5 h-4.5" aria-hidden />
                  </span>
                </div>
                <p className="font-display font-extrabold text-2xl text-gray-900">{kpi.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{kpi.label}</p>
                <p className="text-xs text-gray-400">{kpi.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-5">
            {/* Per-intent test performance */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-900 mb-4">Per-Intent Test F1 Score</h2>
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {perClass.length === 0 ? (
                  <p className="text-sm text-gray-400">No test-split evaluation available.</p>
                ) : perClass.map(item => (
                  <div key={item.intent}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <div className="flex items-center gap-2">
                        {item.f1 >= 0.6
                          ? <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />
                          : <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        }
                        <span className="text-gray-700 font-medium">{item.intent.replace(/_/g, ' ')}</span>
                      </div>
                      <span className={cn('font-bold ml-2 shrink-0', scoreColor(item.f1))}>
                        {Math.round(item.f1 * 100)}%
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={cn('h-full rounded-full', scoreBar(item.f1))} style={{ width: `${item.f1 * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Training run summary */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-900 mb-4">Training Run Summary</h2>
              <div className="space-y-2.5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Trained at</span>
                  <span className="text-gray-900 font-medium">{new Date(metrics.trainedAt).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Epochs</span>
                  <span className="text-gray-900 font-medium">{metrics.epochs}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Train / Test examples</span>
                  <span className="text-gray-900 font-medium">{metrics.trainExamples} / {metrics.testExamples}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Final train accuracy</span>
                  <span className="text-gray-900 font-medium">{Math.round(metrics.finalTrainAccuracy * 100)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Weighted F1 (test)</span>
                  <span className="text-gray-900 font-medium">{Math.round(metrics.testEvaluation.weightedAvg.f1 * 100)}%</span>
                </div>
              </div>

              {metrics.finalTrainAccuracy > 0.98 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-amber-800">Train/test gap detected</p>
                      <p className="text-xs text-amber-700 mt-0.5">
                        Training accuracy ({Math.round(metrics.finalTrainAccuracy * 100)}%) is much higher than test accuracy
                        ({Math.round(metrics.testEvaluation.accuracy * 100)}%) — expected on this small dataset, and the
                        reason dropout (0.5) is used. More patterns per intent would narrow this gap further.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4">
                <p className="text-xs font-semibold text-gray-700 mb-2">Sources cited</p>
                <div className="flex flex-wrap gap-1.5">
                  {Array.from(sourceGroups.entries()).map(([source, count]) => (
                    <span key={source} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {source} ({count})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Search intents or sources..."
                icon={<Search className="w-4 h-4" />}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Intent list */}
          <div className="space-y-3">
            {filtered.map(intent => {
              const perf = perClassByTag.get(intent.tag)
              return (
                <div key={intent.tag} className="bg-white rounded-2xl border border-gray-200 p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                        <BookOpen className="w-5 h-5 text-rose-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{intent.tag.replace(/_/g, ' ')}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{intent.source}</p>
                      </div>
                    </div>
                    {perf && (
                      <Badge variant={perf.f1 >= 0.6 ? 'success' : 'warning'} size="sm">
                        F1 {Math.round(perf.f1 * 100)}%
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Database className="w-3 h-3" />{intent.pattern_count} training patterns</span>
                    {perf && <span className="flex items-center gap-1"><Target className="w-3 h-3" />{perf.support} test examples</span>}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
