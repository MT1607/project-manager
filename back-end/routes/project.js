import express from "express";
import authMiddleware from "../middleware/auth-middleware.js";
import {validateRequest} from "zod-express-middleware";
import createProject from "../controllers/project-controller.js";
import {projectSchema} from "../libs/validate-schema.js";
import {string, z} from "zod";

const router = express.Router();

router.post("/:workspaceId/create-project", authMiddleware, validateRequest({
    params: z.object({workspaceId: z.string()}),
    body: projectSchema
}), createProject);

export default router;