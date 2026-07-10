import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, MessageCircle, Trash2, Star, Clock } from 'lucide-react'
import { useConversationHistory } from '@/hooks/useConversationHistory'
import { ROUTES } from '@/utils/constants'
import { formatRelativeTime } from '@/utils/formatters'
import { cn } from '@/utils/cn'
import { Input } from '@/components/atoms/Input'
import { Button } from '@/components/atoms/Button'
import { Spinner } from '@/components/atoms/Spinner'
import { Alert } from '@/components/atoms/Alert'

export default function ChatHistoryPage() {
  const { conversations, loading, error, openConversation, removeConversation, toggleSaved } = useConversationHistory()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all') // 'all' | 'saved'

  const savedCount = conversations.filter(c => c.is_saved).length

  const filtered = conversations.filter(c =>
    (filter === 'all' || c.is_saved) &&
    (c.title || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-display font-bold text-xl text-text-primary">Chat History</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
            {savedCount > 0 && ` · ${savedCount} saved`}
          </p>
        </div>
        <Button
          as={Link}
          to={ROUTES.CHAT}
          size="sm"
          icon={<MessageCircle className="w-4 h-4" />}
        >
          New Chat
        </Button>
      </div>

      {error && <Alert variant="error" className="mb-4">{error}</Alert>}

      <Input
        placeholder="Search conversations..."
        icon={<Search className="w-4 h-4" />}
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-3"
      />

      {/* All / Saved filter */}
      <div className="flex gap-2 mb-4" role="group" aria-label="Filter conversations">
        {[
          { id: 'all', label: `All (${conversations.length})` },
          { id: 'saved', label: `Saved (${savedCount})` },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              'px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all',
              filter === f.id
                ? 'bg-rose-50 border-rose-300 text-rose-700'
                : 'bg-white border-border text-text-secondary hover:border-rose-200'
            )}
            aria-pressed={filter === f.id}
          >
            {f.id === 'saved' && <Star className="w-3 h-3 inline mr-1 -mt-0.5 fill-current" aria-hidden />}
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-16 flex justify-center"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          {filter === 'saved' && !search ? (
            <>
              <Star className="w-12 h-12 text-border mx-auto mb-3" aria-hidden />
              <p className="text-text-secondary text-sm">
                No saved conversations yet. Tap the star icon on a conversation to save it.
              </p>
            </>
          ) : (
            <>
              <MessageCircle className="w-12 h-12 text-border mx-auto mb-3" aria-hidden />
              <p className="text-text-secondary text-sm">
                {search ? 'No conversations match your search.' : 'No conversations yet. Start chatting!'}
              </p>
            </>
          )}
        </div>
      ) : (
        <ul className="space-y-2" role="list" aria-label="Conversation history">
          {filtered.map(conv => (
            <li key={conv.id}>
              <div className="bg-white rounded-2xl border border-border p-4 hover:shadow-sm transition-shadow group">
                <div className="flex items-start gap-3">
                  <span className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center shrink-0 mt-0.5">
                    <MessageCircle className="w-4.5 h-4.5 text-rose-600" aria-hidden />
                  </span>

                  <button
                    onClick={() => openConversation(conv.id)}
                    className="flex-1 text-left min-w-0"
                    aria-label={`Open conversation: ${conv.title}`}
                  >
                    <p className="text-sm font-semibold text-text-primary truncate group-hover:text-rose-700 transition-colors">
                      {conv.title || 'Untitled conversation'}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" aria-hidden />
                      {formatRelativeTime(conv.updated_at)} · {conv.message_count} message{conv.message_count !== 1 ? 's' : ''}
                    </p>
                  </button>

                  <div className="flex items-center gap-1">
                    {/* Saved star stays visible; unsaved star appears on hover/focus */}
                    <button
                      onClick={() => toggleSaved(conv.id, conv.is_saved)}
                      className={cn(
                        'p-1.5 rounded-lg transition-all',
                        conv.is_saved
                          ? 'text-amber-500 hover:bg-amber-50'
                          : 'text-text-muted hover:text-amber-500 hover:bg-amber-50 opacity-0 group-hover:opacity-100 focus-visible:opacity-100'
                      )}
                      aria-label={conv.is_saved ? 'Unsave conversation' : 'Save conversation'}
                    >
                      <Star className={cn('w-4 h-4', conv.is_saved && 'fill-amber-400')} />
                    </button>
                    <button
                      onClick={() => removeConversation(conv.id)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-error hover:bg-error-light transition-all opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
                      aria-label="Delete conversation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
