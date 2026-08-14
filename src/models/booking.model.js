import mongoose from 'mongoose'

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
        required: true
      },
      services: [
        {
            service: {
            _id: false,
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service',
            required: true
          },
          quantity: {
            type: Number,
            required: true,
            min: 1
          }
        }
      ]
    },
    {
        timestamps: true,
        versionKey: false
    }
)

export const bookingModel = mongoose.model('Booking', bookingsSchema)
