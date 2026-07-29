import { Router } from "express";
import { getAllServices, getService, createService, editService, removeService } from "../controllers/services.controller.js";

const router = Router()

router.get('/',getAllServices)
router.get('/:sid',getService)
router.post('/',createService)
router.put('/:sid',editService)
router.delete('/:sid',removeService)

export default router
