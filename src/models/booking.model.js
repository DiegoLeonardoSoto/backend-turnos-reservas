import mongoose from 'mongoose'

const serviceItemSchema = new mongoose.Schema(
    {
        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    }, {
        _id:false
    }
)

const bookingsSchema = new mongoose.Schema(
    {
      clientName: {
        type: String,
        required: true
      },
      clientEmail: {
        type: String,
          required: true,
          lowercase:true
      },
      date: {
        type: String,
        required: true
      },
      time: {
        type: String,
        required: true
      },
      status: {
        type: String,
        required: true,
        lowercase: false,
        enum: ["pending", "confirmed", "cancelled"],
      },
      services: [serviceItemSchema]
    },
    {
        timestamps: true,
        versionKey: false
    }
)

// indice compuesto
bookingsSchema.index({ date: 1, time: 1, clientEmail: 1 }, { unique: true })


export const bookingModel = mongoose.model('Booking', bookingsSchema)
