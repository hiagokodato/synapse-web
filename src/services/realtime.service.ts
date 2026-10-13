import { io, type Socket } from 'socket.io-client'

import { env } from '@/config/env'

export type JoinConversationPayload = {
  chatbotId: string
  conversationId: string
}

export type SendMessageSocketPayload = {
  chatbotId: string
  conversationId: string
  content: string
}

export function createRealtimeSocket(accessToken: string): Socket {
  return io(env.wsUrl, {
    auth: { token: accessToken },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
  })
}

export function joinConversation(socket: Socket, payload: JoinConversationPayload) {
  return new Promise<{ ok: boolean; room: string }>((resolve, reject) => {
    socket.emit('conversation:join', payload, (response: { ok: boolean; room: string } | undefined) => {
      if (response?.ok) {
        resolve(response)
        return
      }

      reject(new Error('Failed to join conversation room.'))
    })
  })
}

export function sendMessageViaSocket(socket: Socket, payload: SendMessageSocketPayload) {
  return new Promise<unknown>((resolve, reject) => {
    socket.emit('message:send', payload, (response: unknown) => {
      if (response) {
        resolve(response)
        return
      }

      reject(new Error('Failed to send message.'))
    })
  })
}
