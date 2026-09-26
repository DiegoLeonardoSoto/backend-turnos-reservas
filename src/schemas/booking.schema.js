import { z } from 'zod'
import { objectIdSchema } from './id.schema.js'
import { refine } from 'zod/mini'

export const bookingParamsSchema = z.object({
    bid: objectIdSchema
})

export const serviceParamSchema = bookingParamsSchema.extend({
    sid: objectIdSchema
})

export const createBookingSchema = z.object({
    clientName: z.string().min(3),
    clientEmail: z.email(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date debe tener formato YYYY-MM-DD'),
    time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'time debe tener formato HH:mm (24h)'),
    status: z.enum(["pending", "confirmed", "cancelled"]),
    service: z.object({
        sid: objectIdSchema,
        quantity: z.coerce.number().int().min(1).default(1)
    })
}).strict()

export const updateBookingSchema = createBookingSchema
    .omit( {service:true} )
    .partial()
    .strict()
    .refine( (data) => Object.keys(data).length > 0, 'debe proporcionar al menos un campo para actualizar' )

export const addServiceSchema = z.object({
    quantity: z.coerce.number().int().min(1).default(1)
}).strict()

export const removeServiceSchema = z.object({
    quantity: z.coerce.number().int().min(0).default(0)
}).strict()

export const reportQuerySchema = z.object({
    minDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date debe tener formato YYYY-MM-DD').optional(),
    maxDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date debe tener formato YYYY-MM-DD').optional(),
    minTotalSpent: z.coerce.number().min(0).optional(),
})
