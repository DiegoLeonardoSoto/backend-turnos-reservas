import { serviceManager } from "../managers/ServiceManager.js"

export const getAllServices = async (req, res) => {
  const { category, available } = req.query

  let availableFilter = undefined

  if( available !== undefined ) {
    availableFilter = available === 'true'
  }

  try {
  const services = await serviceManager.getServices()

  let filteredServices = services

    if (category) {
      filteredServices = filteredServices.filter(s => s.category === category)
    }

    if (availableFilter !== undefined) {
      filteredServices = filteredServices.filter(s => s.available === availableFilter)
    }

  res.status(200).json({
    status: 'success',
    payload: filteredServices
  })

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener los servicios'
    })
  }

}

export const getService =  async (req, res) => {
  const { sid } = req.params

  try {
  const service = await serviceManager.getServiceById(sid)

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

  } catch (error) {
   res.status(500).json({
      status: 'error',
      message: 'Error al obtener el servicio'
    })
  }
}

export const createService = async (req, res) => {

  try {
  const newService = await serviceManager.addService(req.body)

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

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error al agregar el servicio'
    })
  }
}

export const editService = async (req, res) => {
  const { sid } = req.params
  try {
  const updatedService = await serviceManager.updateService(sid, req.body)

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
  } catch (error) {
   res.status(500).json({
      status: 'error',
      message: 'Error al editar el servicio'
    })
  }
}

export const removeService = async (req, res) => {
  const { sid } = req.params

  try {
    const deletedService = await serviceManager.deleteService(sid)

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

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error al eliminar el servicio'
    })
  }
}
