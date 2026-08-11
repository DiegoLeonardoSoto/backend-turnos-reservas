import { servicesService } from "../dependencies/services.dependency.js"
import { sendError } from "../utils/sendError.js"


export const getServices = async (req, res) => {

  try {
  const services = await servicesService.getServices(req.query)

  return res.status(200).json({
    status: 'success',
    count: services.length,
    payload: services
  })

  } catch (error) {
    return sendError(res, error, 'Error al obtener los servicios')
  }

}

export const getServiceById =  async (req, res) => {
  const sid = Number(req.params.sid)

  try {
  const service = await servicesService.getServiceById(sid)

  if (!service) {
    return sendError(res, { statusCode: 404, message: 'Service not found' }, 'Service not found')
  }

  return res.status(200).json({
    status: 'success',
    payload: service
  })

  } catch (error) {
    return sendError(res, error, 'Error al obtener el servicio')
  }
}

export const createService = async (req, res) => {

  try {
  const newService = await servicesService.createService(req.body)

  if (!newService) {
    return sendError(res, { statusCode: 400, message: 'Missing required fields: name, description, duration, price, category, available' }, 'Error al agregar el servicio')
  }

  return res.status(201).json({
    status: 'success',
    payload: newService
  })

  } catch (error) {
    return sendError(res, error, 'Error al agregar el servicio')
  }
}

export const updateService = async (req, res) => {
  const { sid } = req.params
  try {
  const updatedService = await servicesService.updateService(sid, req.body)

  if (!updatedService) {
    return sendError(res, { statusCode: 404, message: 'Service not found or no valid fields to update' }, 'Error al editar el servicio')
  }

  return res.status(200).json({
    status: 'success',
    payload: updatedService
  })
  } catch (error) {
    return sendError(res, error, 'Error al editar el servicio')
  }
}

export const deleteService = async (req, res) => {
  const { sid } = req.params

  try {
    const deletedService = await servicesService.deleteService(sid)

  if (!deletedService) {
    return sendError(res, { statusCode: 404, message: 'Service not found' }, 'Error al eliminar el servicio')
  }

  return res.status(200).json({
    status: 'success',
    payload: deletedService
  })

  } catch (error) {
    return sendError(res, error, 'Error al eliminar el servicio')
  }
}
