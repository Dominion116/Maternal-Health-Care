import { useState } from 'react'
import { Database, BookOpen, CheckCircle, AlertCircle, Clock, Search, RefreshCw, FileText, Globe, Stethoscope } from 'lucide-react'
import { Badge } from '@/components/atoms/Badge'
import { Input } from '@/components/atoms/Input'
import { cn } from '@/utils/cn'

const knowledgeSources = [
  {
    id: 'ks1',
    name: 'MOTHER Dataset',
    type: 'dataset',
    description: 'Maternal and obstetric training corpus for NLP model fine-tuning',
    entries: 4820,
    status: 'active',
    lastUpdated: '2026-04-15',
    coverage: ['danger signs', 'labour', 'ANC visits', 'postpartum'],
    confidence: 94,
  },
  {
    id: 'ks2',
    name: 'WHO ANC Guidelines 2016',
    type: 'guideline',
    description: 'World Health Organization antenatal care recommendations for a positive pregnancy experience',
    entries: 312,
    status: 'active',
    lastUpdated: '2026-01-10',
    coverage: ['ANC schedule', 'nutrition', 'supplements', 'mental health'],
    confidence: 98,
  },
  {
    id: 'ks3',
    name: 'FMOH Nigeria Protocols',
    type: 'guideline',
    description: 'Federal Ministry of Health Nigeria maternal health clinical guidelines',
    entries: 198,
    status: 'active',
    lastUpdated: '2026-02-20',
    coverage: ['referral criteria', 'vaccines', 'pre-eclampsia', 'nutrition'],
    confidence: 96,
  },
  {
    id: 'ks4',
    name: 'Breastfeeding Knowledge Base',
    type: 'dataset',
    description: 'Curated Q&A pairs covering breastfeeding techniques, concerns, and support',
    entries: 256,
    status: 'active',
    lastUpdated: '2026-03-08',
    coverage: ['latch', 'frequency', 'problems', 'weaning'],
    confidence: 91,
  },
  {
    id: 'ks5',
    name: 'Mental Health Corpus',
    type: 'dataset',
    description: 'Perinatal mental health support responses and safety protocols',
    entries: 134,
    status: 'review',
    lastUpdated: '2026-05-01',
    coverage: ['depression', 'anxiety', 'crisis support', 'coping strategies'],
    confidence: 82,
  },
  {
    id: 'ks6',
    name: 'Drug Safety in Pregnancy',
    type: 'reference',
    description: 'Medication safety classifications and common pregnancy drug interactions',
    entries: 89,
    status: 'draft',
    lastUpdated: '2026-05-12',
    coverage: ['paracetamol', 'antibiotics', 'supplements', 'herbal remedies'],
    confidence: 75,
  },
]

const intentCoverage = [
  { intent: 'Danger signs / emergency', covered: true, sourceCount: 3, confidence: 96 },
  { intent: 'ANC schedule & visits', covered: true, sourceCount: 2, confidence: 95 },
  { intent: 'Nutrition guidance', covered: true, sourceCount: 3, confidence: 93 },
  { intent: 'Breastfeeding support', covered: true, sourceCount: 2, confidence: 91 },
  { intent: 'Labour & birth signs', covered: true, sourceCount: 2, confidence: 89 },
  { intent: 'Postpartum care', covered: true, sourceCount: 2, confidence: 87 },
  { intent: 'Mental health support', covered: true, sourceCount: 1, confidence: 82 },
  { intent: 'Medication safety', covered: false, sourceCount: 1, confidence: 71 },
  { intent: 'Partner & family guidance', covered: false, sourceCount: 0, confidence: 45 },
]

const typeConfig = {
  dataset: { label: 'Dataset', variant: 'rose', icon: Database },
  guideline: { label: 'Guideline', variant: 'sage', icon: Globe },
  reference: { label: 'Reference', variant: 'info', icon: FileText },
}

const statusConfig = {
  active: { label: 'Active', variant: 'success' },
  review: { label: 'In Review', variant: 'warning' },
  draft: { label: 'Draft', variant: 'neutral' },
}

export default function AdminKnowledgePage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  const filtered = knowledgeSources.filter(ks => {
    const matchSearch = ks.name.toLowerCase().includes(search.toLowerCase()) || ks.description.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'all' || ks.type === typeFilter
    return matchSearch && matchType
  })

  const totalEntries = knowledgeSources.reduce((s, ks) => s + ks.entries, 0)
  const activeCount = knowledgeSources.filter(ks => ks.status === 'active').length
  const avgConfidence = Math.round(knowledgeSources.filter(ks => ks.status === 'active').reduce((s, ks) => s + ks.confidence, 0) / activeCount)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-gray-900">Knowledge Base</h1>
        <p className="text-sm text-gray-500 mt-1">Training data and guidelines powering the MamaGuide AI</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Entries', value: totalEntries.toLocaleString(), sub: 'Across all sources', icon: Database, color: 'text-rose-600 bg-rose-100' },
          { label: 'Active Sources', value: activeCount, sub: `of ${knowledgeSources.length} total`, icon: CheckCircle, color: 'text-green-600 bg-green-100' },
          { label: 'Avg Confidence', value: `${avgConfidence}%`, sub: 'Active sources only', icon: Stethoscope, color: 'text-sage-600 bg-sage-100' },
          { label: 'Intents Covered', value: `${intentCoverage.filter(i => i.covered).length}/${intentCoverage.length}`, sub: 'Query types supported', icon: BookOpen, color: 'text-blue-600 bg-blue-100' },
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
        {/* Intent coverage */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Intent Coverage</h2>
          <div className="space-y-3">
            {intentCoverage.map(item => (
              <div key={item.intent}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-2">
                    {item.covered
                      ? <CheckCircle className="w-3.5 h-3.5 text-green-500 shrink-0" />
                      : <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    }
                    <span className="text-gray-700 font-medium">{item.intent}</span>
                  </div>
                  <span className={cn('font-bold ml-2 shrink-0', item.confidence >= 85 ? 'text-green-600' : item.confidence >= 70 ? 'text-amber-600' : 'text-red-600')}>
                    {item.confidence}%
                  </span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full', item.confidence >= 85 ? 'bg-green-500' : item.confidence >= 70 ? 'bg-amber-400' : 'bg-red-400')}
                    style={{ width: `${item.confidence}%` }}
                  />
                </div>
                {!item.covered && (
                  <p className="text-xs text-amber-600 mt-0.5">Gap identified — additional training data needed</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick stats */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Source Status Overview</h2>
          <div className="space-y-3 mb-6">
            {['active', 'review', 'draft'].map(status => {
              const count = knowledgeSources.filter(ks => ks.status === status).length
              const pct = Math.round((count / knowledgeSources.length) * 100)
              return (
                <div key={status}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-700 capitalize font-medium">{statusConfig[status].label}</span>
                    <span className="text-gray-500">{count} sources ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full', status === 'active' ? 'bg-green-500' : status === 'review' ? 'bg-amber-400' : 'bg-gray-400')}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-amber-800">2 gaps detected</p>
                <p className="text-xs text-amber-700 mt-0.5">Medication safety and partner guidance need additional training data to reach the 85% confidence threshold.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search knowledge sources..."
            icon={<Search className="w-4 h-4" />}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="h-11 px-4 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-2 focus:outline-rose-500"
        >
          <option value="all">All types</option>
          <option value="dataset">Datasets</option>
          <option value="guideline">Guidelines</option>
          <option value="reference">References</option>
        </select>
      </div>

      {/* Knowledge source cards */}
      <div className="space-y-3">
        {filtered.map(ks => {
          const TypeIcon = typeConfig[ks.type]?.icon || Database
          return (
            <div key={ks.id} className="bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                    <TypeIcon className="w-5 h-5 text-rose-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{ks.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{ks.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant={typeConfig[ks.type]?.variant || 'neutral'} size="sm">{typeConfig[ks.type]?.label}</Badge>
                  <Badge variant={statusConfig[ks.status]?.variant || 'neutral'} size="sm">{statusConfig[ks.status]?.label}</Badge>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-3">
                <span className="flex items-center gap-1"><Database className="w-3 h-3" />{ks.entries.toLocaleString()} entries</span>
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Updated {new Date(ks.lastUpdated).toLocaleDateString()}</span>
                <span className={cn('flex items-center gap-1 font-semibold', ks.confidence >= 90 ? 'text-green-600' : ks.confidence >= 75 ? 'text-amber-600' : 'text-red-600')}>
                  {ks.confidence}% confidence
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {ks.coverage.map(tag => (
                  <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{tag}</span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
