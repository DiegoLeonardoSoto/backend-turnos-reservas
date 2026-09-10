import { Router } from "express";
import { getServices, getServiceById, createService, updateService, deleteService } from "../controllers/services.controller.js";
import { validateBody, validateParams, validateQuery } from "../middlewares/validate.middleware.js";
import { createServiceSchema, serviceParamsSchema, updateServiceSchema, getServiceQuerySchema } from "../schemas/service.schema.js";

const router = Router()

router.get('/', validateQuery(getServiceQuerySchema), getServices)
router.get('/:sid', validateParams(serviceParamsSchema), getServiceById)
router.post('/', validateBody(createServiceSchema),createService)
router.put('/:sid', validateParams(serviceParamsSchema) ,validateBody(updateServiceSchema),updateService)
router.delete('/:sid', validateParams(serviceParamsSchema), deleteService)

export default router
