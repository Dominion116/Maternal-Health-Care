import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { historyService } from '@/services/historyService'
import { useChatStore } from '@/store/useChatStore'
import { ROUTES } from '@/utils/constants'

// Backend-authoritative conversation list for the History/Saved pages —
// distinct from useChat()/useChatStore's local cache, which stays focused on
// the currently-active live chat session. Opening a conversation here
// fetches its real messages and hydrates them into the local store so the
// live chat screen shows the actual backend thread.
export function useConversationHistory({ savedOnly = false } = {}) {
  const navigate = useNavigate()
  const hydrateConversation = useChatStore(s => s.hydrateConversation)

  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchConversations = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await historyService.getConversations(1, 50)
      let list = res.data.data || []
      if (savedOnly) list = list.filter(c => c.is_saved)
      setConversations(list)
    } catch {
      setError('Failed to load conversations. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [savedOnly])

  useEffect(() => { fetchConversations() }, [fetchConversations])

  async function openConversation(id) {
    const conv = conversations.find(c => c.id === id)
    try {
      const res = await historyService.getMessages(id)
      hydrateConversation(id, conv || {}, res.data.data || [])
      navigate(ROUTES.CHAT)
    } catch {
      setError('Failed to open conversation. Please try again.')
    }
  }

  async function removeConversation(id) {
    const prev = conversations
    setConversations(cs => cs.filter(c => c.id !== id))
    try {
      await historyService.deleteConversation(id)
    } catch {
      setConversations(prev)
      setError('Failed to delete conversation. Please try again.')
    }
  }

  async function toggleSaved(id, currentlySaved) {
    setConversations(cs => cs.map(c => (c.id === id ? { ...c, is_saved: !currentlySaved } : c)))
    try {
      await historyService.setSaved(id, !currentlySaved)
    } catch {
      setConversations(cs => cs.map(c => (c.id === id ? { ...c, is_saved: currentlySaved } : c)))
      setError('Failed to update conversation. Please try again.')
    }
  }

  return { conversations, loading, error, openConversation, removeConversation, toggleSaved }
}
