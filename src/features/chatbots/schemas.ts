import { z } from 'zod'

export const createChatbotSchema = z.object({
  name: z
    .string()
    .min(2, 'O nome deve ter pelo menos 2 caracteres.')
    .max(120, 'O nome deve ter no máximo 120 caracteres.'),
  description: z
    .string()
    .max(500, 'A descrição deve ter no máximo 500 caracteres.')
    .optional()
    .or(z.literal('')),
})

export const updateChatbotSchema = createChatbotSchema.extend({
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).optional(),
})

export type CreateChatbotFormValues = z.infer<typeof createChatbotSchema>
export type UpdateChatbotFormValues = z.infer<typeof updateChatbotSchema>
