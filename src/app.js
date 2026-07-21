import express from 'express'
import { getServices, getServiceById, addService, updateService, deleteService } from './managers/ServiceManager.js'

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

app.get('/api/services', async (req, res) => {
  const services = await getServices()
  const { category } = req.query

  const filteredServices = category
    ? services.filter(s => s.category === category)
    : services

  res.status(200).json({
    status: 'success',
    payload: filteredServices
  })
})

app.get('/api/services/:id', async (req, res) => {
  const { id } = req.params
  const service = await getServiceById(id)

  if (!service) {
    return res.status(404).json({
      status: 'error',
      message: 'Service not found'
    })
  }

  res.status(200).json({
    status: 'success',
    payload: service
  })
})

app.post('/api/services', async (req, res) => {
  const newService = await addService(req.body)

  if (!newService) {
    return res.status(400).json({
      status: 'error',
      message: 'Missing required fields: name, description, duration, price, category, available'
    })
  }

  res.status(201).json({
    status: 'success',
    payload: newService
  })
})

app.put('/api/services/:id', async (req, res) => {
  const { id } = req.params
  const updatedService = await updateService(id, req.body)

  if (!updatedService) {
    return res.status(404).json({
      status: 'error',
      message: 'Service not found or no valid fields to update'
    })
  }

  res.status(200).json({
    status: 'success',
    payload: updatedService
  })
})

app.delete('/api/services/:id', async (req, res) => {
  const { id } = req.params
  const deletedService = await deleteService(id)

  if (!deletedService) {
    return res.status(404).json({
      status: 'error',
      message: 'Service not found'
    })
  }

  res.status(200).json({
    status: 'success',
    payload: deletedService
  })
})
