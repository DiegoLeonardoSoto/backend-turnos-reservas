import express from 'express'
import servicesRouter from './routes/services.router.js'


export const app = express()

app.use(express.json())

// Logger middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  next()
})

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to the Turnos Reservas API'
  })
})

app.use('/api/services', servicesRouter)
