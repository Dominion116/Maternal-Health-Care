import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BookMarked, Search, MessageCircle, Trash2, Clock } from 'lucide-react'
import { useConversationHistory } from '@/hooks/useConversationHistory'
import { ROUTES } from '@/utils/constants'
import { formatRelativeTime } from '@/utils/formatters'
import { Input } from '@/components/atoms/Input'
import { Button } from '@/components/atoms/Button'
import { Spinner } from '@/components/atoms/Spinner'
import { Alert } from '@/components/atoms/Alert'

export default function ChatSavedPage() {
  const { conversations: saved, loading, error, openConversation, removeConversation, toggleSaved } =
    useConversationHistory({ savedOnly: true })
  const [search, setSearch] = useState('')

  const filtered = saved.filter(c => (c.title || '').toLowerCase().includes(search.toLowerCase()))

  if (loading) {
    return <div className="py-16 flex justify-center"><Spinner size="lg" /></div>
  }

  if (saved.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="font-display font-bold text-xl text-text-primary">Saved Chats</h1>
            <p className="text-sm text-text-secondary mt-0.5">Your bookmarked conversations</p>
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

        {/* Empty state */}
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-100 flex items-center justify-center mb-4">
            <BookMarked className="w-8 h-8 text-rose-500" aria-hidden />
          </div>
          <h2 className="font-semibold text-text-primary mb-2">No saved chats yet</h2>
          <p className="text-sm text-text-secondary max-w-xs leading-relaxed mb-6">
            Save important conversations by tapping the bookmark icon in Chat History. They will appear here for easy access.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to={ROUTES.CHAT}
              className="inline-flex items-center gap-2 bg-rose-700 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-rose-800 transition-colors text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              Start a New Chat
            </Link>
            <Link
              to={ROUTES.CHAT_HISTORY}
              className="inline-flex items-center gap-2 bg-white text-rose-700 border border-rose-200 font-semibold px-5 py-2.5 rounded-xl hover:bg-rose-50 transition-colors text-sm"
            >
              View Chat History
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-display font-bold text-xl text-text-primary">Saved Chats</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            {saved.length} saved conversation{saved.length !== 1 ? 's' : ''}
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
        placeholder="Search saved chats..."
        icon={<Search className="w-4 h-4" />}
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-4"
      />

      {filtered.length === 0 ? (
        <div className="text-center py-12">
          <BookMarked className="w-10 h-10 text-border mx-auto mb-3" aria-hidden />
          <p className="text-text-secondary text-sm">No saved chats match your search.</p>
        </div>
      ) : (
        <ul className="space-y-2" role="list" aria-label="Saved conversations">
          {filtered.map(conv => (
            <li key={conv.id}>
              <div className="bg-white rounded-2xl border border-rose-200 p-4 hover:shadow-sm transition-shadow group">
                <div className="flex items-start gap-3">
                  <span className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center shrink-0 mt-0.5">
                    <BookMarked className="w-4.5 h-4.5 text-rose-600" aria-hidden />
                  </span>

                  <button
                    onClick={() => openConversation(conv.id)}
                    className="flex-1 text-left min-w-0"
                    aria-label={`Open saved conversation: ${conv.title}`}
                  >
                    <p className="text-sm font-semibold text-text-primary truncate group-hover:text-rose-700 transition-colors">
                      {conv.title || 'Untitled conversation'}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" aria-hidden />
                      {formatRelativeTime(conv.updated_at)} · {conv.message_count} message{conv.message_count !== 1 ? 's' : ''}
                    </p>
                  </button>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => toggleSaved(conv.id, conv.is_saved)}
                      className="p-1.5 rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
                      aria-label="Unsave conversation"
                    >
                      <BookMarked className="w-4 h-4 fill-rose-200" />
                    </button>
                    <button
                      onClick={() => removeConversation(conv.id)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-error hover:bg-red-50 transition-colors"
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
