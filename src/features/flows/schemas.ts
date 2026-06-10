import { z } from 'zod'

export const createFlowSchema = z.object({
  name: z
    .string()
    .min(2, 'O nome deve ter pelo menos 2 caracteres.')
    .max(120, 'O nome deve ter no máximo 120 caracteres.'),
})

export type CreateFlowFormValues = z.infer<typeof createFlowSchema>
