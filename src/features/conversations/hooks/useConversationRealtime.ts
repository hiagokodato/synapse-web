import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Socket } from 'socket.io-client'

import {
  createRealtimeSocket,
  joinConversation,
  sendMessageViaSocket,
} from '@/services/realtime.service'
import { useAuthStore } from '@/stores/auth.store'
import type { ConversationDetail, Message } from '@/types/conversation'
import { queryKeys } from '@/utils/query-keys'

type UseConversationRealtimeOptions = {
  chatbotId: string
  conversationId: string
  enabled?: boolean
}

export function useConversationRealtime({
  chatbotId,
  conversationId,
  enabled = true,
}: UseConversationRealtimeOptions) {
  const accessToken = useAuthStore((s) => s.accessToken)
  const queryClient = useQueryClient()
  const socketRef = useRef<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isJoined, setIsJoined] = useState(false)

  const appendMessage = useCallback(
    (message: Message) => {
      queryClient.setQueryData<ConversationDetail>(
        queryKeys.conversations.detail(chatbotId, conversationId),
        (current) => {
          if (!current) return current

          const exists = current.messages.some((item) => item.id === message.id)
          if (exists) return current

          return {
            ...current,
            messages: [...current.messages, message],
            _count: { messages: current._count.messages + 1 },
          }
        },
      )

      queryClient.invalidateQueries({ queryKey: queryKeys.conversations.list(chatbotId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.overview })
    },
    [chatbotId, conversationId, queryClient],
  )

  useEffect(() => {
    if (!enabled || !accessToken || !chatbotId || !conversationId) {
      return
    }

    const socket = createRealtimeSocket(accessToken)
    socketRef.current = socket

    const handleConnect = () => {
      setIsConnected(true)
      void joinConversation(socket, { chatbotId, conversationId })
        .then(() => setIsJoined(true))
        .catch(() => setIsJoined(false))
    }

    const handleDisconnect = () => {
      setIsConnected(false)
      setIsJoined(false)
    }

    const handleNewMessage = (message: Message) => {
      appendMessage(message)
    }

    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)
    socket.on('message:new', handleNewMessage)

    if (socket.connected) {
      handleConnect()
    }

    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
      socket.off('message:new', handleNewMessage)
      socket.disconnect()
      socketRef.current = null
      setIsConnected(false)
      setIsJoined(false)
    }
  }, [accessToken, appendMessage, chatbotId, conversationId, enabled])

  const sendMessage = useCallback(
    async (content: string) => {
      const socket = socketRef.current
      if (!socket || !isJoined) {
        throw new Error('Conexão realtime indisponível.')
      }

      await sendMessageViaSocket(socket, { chatbotId, conversationId, content })
    },
    [chatbotId, conversationId, isJoined],
  )

  return {
    isConnected,
    isJoined,
    sendMessage,
  }
}
