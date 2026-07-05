import { useState, useEffect, useCallback } from 'react'
import { Search, MessageSquare, AlertTriangle, Clock, Eye, ChevronDown, ChevronUp } from 'lucide-react'
import { Badge } from '@/components/atoms/Badge'
import { Input } from '@/components/atoms/Input'
import { Spinner } from '@/components/atoms/Spinner'
import { Alert } from '@/components/atoms/Alert'
import { adminService } from '@/services/adminService'
import { cn } from '@/utils/cn'

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export default function AdminConversationsPage() {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [emergencyOnly, setEmergencyOnly] = useState(false)
  const [expandedId, setExpandedId] = useState(null)
  const [messagesById, setMessagesById] = useState({})
  const [messagesLoading, setMessagesLoading] = useState(false)

  const fetchConversations = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = { limit: 50 }
      if (emergencyOnly) params.flagged = true
      const res = await adminService.getConversations(params)
      setConversations(res.data.data || [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load conversations')
    } finally {
      setLoading(false)
    }
  }, [emergencyOnly])

  useEffect(() => { fetchConversations() }, [fetchConversations])

  async function toggleExpand(id) {
    if (expandedId === id) {
      setExpandedId(null)
      return
    }
    setExpandedId(id)
    if (!messagesById[id]) {
      setMessagesLoading(true)
      try {
        const res = await adminService.getConversationMessages(id)
        setMessagesById((prev) => ({ ...prev, [id]: res.data.data || [] }))
      } catch {
        setMessagesById((prev) => ({ ...prev, [id]: [] }))
      } finally {
        setMessagesLoading(false)
      }
    }
  }

  const filtered = conversations.filter((c) => {
    const q = search.toLowerCase()
    return !q || c.title?.toLowerCase().includes(q) || c.user_id?.toLowerCase().includes(q)
  })

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display font-bold text-2xl text-gray-900">Conversations Monitor</h1>
        <p className="text-sm text-gray-500 mt-1">{conversations.length} conversations loaded</p>
      </div>

      {error && <Alert variant="error" onDismiss={() => setError('')}>{error}</Alert>}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search by title or user ID..."
            icon={<Search className="w-4 h-4" />}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => setEmergencyOnly(v => !v)}
          className={cn(
            'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all',
            emergencyOnly ? 'border-red-400 bg-red-50 text-red-700' : 'border-gray-200 bg-white text-gray-600 hover:border-red-200'
          )}
        >
          <AlertTriangle className="w-4 h-4" aria-hidden />
          Emergency Only
        </button>
      </div>

      {/* Conversations list */}
      {loading ? (
        <div className="py-16 flex justify-center"><Spinner /></div>
      ) : (
        <div className="space-y-2">
          {filtered.map(conv => (
            <div key={conv.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2 flex-wrap min-w-0">
                    <span className="text-sm font-semibold text-gray-900 truncate">
                      {conv.title || 'Untitled conversation'}
                    </span>
                    <Badge variant="neutral" size="sm">{conv.message_count} msgs</Badge>
                  </div>
                  <span className="text-xs text-gray-400 flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3" />
                    {timeAgo(conv.updated_at)}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-2">User: {conv.user_id?.slice(0, 8)}…</p>

                <button
                  onClick={() => toggleExpand(conv.id)}
                  className="flex items-center gap-1 text-xs text-rose-700 hover:underline font-medium"
                >
                  <Eye className="w-3.5 h-3.5" aria-hidden />
                  {expandedId === conv.id ? 'Hide messages' : 'View messages'}
                  {expandedId === conv.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>

                {expandedId === conv.id && (
                  <div className="mt-3 space-y-2">
                    {messagesLoading && !messagesById[conv.id] ? (
                      <div className="py-4 flex justify-center"><Spinner size="sm" /></div>
                    ) : (
                      (messagesById[conv.id] || []).map((msg) => (
                        <div
                          key={msg.id}
                          className={cn(
                            'rounded-xl p-3',
                            msg.flagged ? 'bg-red-50 border border-red-200' : msg.role === 'assistant' ? 'bg-rose-50' : 'bg-gray-50'
                          )}
                        >
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <p className="text-xs font-medium text-gray-500">
                              {msg.role === 'user' ? 'User said:' : 'MamaGuide responded:'}
                            </p>
                            {msg.flagged && <Badge variant="error" size="sm">Emergency</Badge>}
                            {msg.intent && (
                              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                {msg.intent.replace(/_/g, ' ')}
                                {msg.intent_confidence != null && ` · ${Math.round(msg.intent_confidence * 100)}%`}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <MessageSquare className="w-10 h-10 text-gray-200 mx-auto mb-2" />
              <p className="text-sm text-gray-400">No conversations match your filters.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
