import { z } from 'zod'
import { objectIdSchema } from './id.schema.js'

export const serviceParamsSchema = z.object({
    sid: objectIdSchema
})

export const createServiceSchema = z.object({
    name: z.string().min(3).max(30),
    description: z.string().min(3),
    duration: z.coerce.number().int().min(1),
    price: z.coerce.number().min(0),
    category: z.enum([
        'musculacion',
        'cardio',
        'funcional',
        'crossfit',
        'yoga',
        'pilates',
        'spinning',
        'entrenamiento_personal',
        'clases_grupales',
        'otros'
    ]),
    available: z.boolean(),
    capacity: z.coerce.number().int().min(1)
}).strict()

export const updateServiceSchema = createServiceSchema
    .partial()
    .strict()
    .refine( (data)=> Object.keys(data).length > 0, "Debe enviar al menos un campo para actualizar" )
