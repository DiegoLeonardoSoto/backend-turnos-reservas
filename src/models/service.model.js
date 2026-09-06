import mongoose from 'mongoose'
import paginate from 'mongoose-paginate-v2'

const serviceSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        lowercase: true
    },
    available: {
        type: Boolean,
        required: true
    }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

//indices
serviceSchema.index({ name: 1 }, { unique: true })
serviceSchema.index({ price: 1 })
serviceSchema.index({ available: 1 })

//indices compuestos
serviceSchema.index({ category: 1, price: 1 })

//plugins
serviceSchema.plugin(paginate)

export const serviceModel = mongoose.model('Service', serviceSchema)
