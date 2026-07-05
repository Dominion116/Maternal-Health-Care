import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, MessageCircle, Trash2, BookMarked, Clock } from 'lucide-react'
import { useChat } from '@/hooks/useChat'
import { ROUTES } from '@/utils/constants'
import { formatRelativeTime, truncate } from '@/utils/formatters'
import { cn } from '@/utils/cn'
import { Input } from '@/components/atoms/Input'
import { Button } from '@/components/atoms/Button'

export default function ChatHistoryPage() {
  const { conversations, setActiveConversation, deleteConversation, toggleSaveConversation } = useChat()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const filtered = conversations.filter(
    c => c.title.toLowerCase().includes(search.toLowerCase())
  )

  function openConversation(id) {
    setActiveConversation(id)
    navigate(ROUTES.CHAT)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-display font-bold text-xl text-text-primary">Chat History</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
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

      <Input
        placeholder="Search conversations..."
        icon={<Search className="w-4 h-4" />}
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-4"
      />

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <MessageCircle className="w-12 h-12 text-border mx-auto mb-3" aria-hidden />
          <p className="text-text-secondary text-sm">
            {search ? 'No conversations match your search.' : 'No conversations yet. Start chatting!'}
          </p>
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
                      {conv.title}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" aria-hidden />
                      {formatRelativeTime(conv.updatedAt)} · {conv.messages.length} message{conv.messages.length !== 1 ? 's' : ''}
                    </p>
                    {conv.messages.length > 0 && (
                      <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">
                        {truncate(conv.messages[conv.messages.length - 1]?.content, 80)}
                      </p>
                    )}
                  </button>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => toggleSaveConversation(conv.id)}
                      className={cn(
                        'p-1.5 rounded-lg transition-colors',
                        conv.isSaved
                          ? 'text-rose-600 bg-rose-50'
                          : 'text-text-muted hover:text-rose-600 hover:bg-rose-50'
                      )}
                      aria-label={conv.isSaved ? 'Unsave conversation' : 'Save conversation'}
                    >
                      <BookMarked className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteConversation(conv.id)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-error hover:bg-error-light transition-colors"
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
