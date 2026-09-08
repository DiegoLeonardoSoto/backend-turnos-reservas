import { Router } from "express";
import { getServices, getServiceById, createService, updateService, deleteService } from "../controllers/services.controller.js";
import { validateBody, validateParams } from "../middlewares/validate.middleware.js";
import { createServiceSchema, serviceParamsSchema, updateServiceSchema } from "../schemas/service.schema.js";

const router = Router()

router.get('/',getServices)
router.get('/:sid', validateParams(serviceParamsSchema), getServiceById)
router.post('/', validateBody(createServiceSchema),createService)
router.put('/:sid', validateParams(serviceParamsSchema) ,validateBody(updateServiceSchema),updateService)
router.delete('/:sid', validateParams(serviceParamsSchema), deleteService)

export default router
