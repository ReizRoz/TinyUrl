import express from 'express';
import linksController from "../controllers/linksController.js";
import authMiddleware from "../middleware/jwt.js";
const linksRouter = express.Router();

linksRouter.get('/', linksController.getAll);
linksRouter.get('/:id', linksController.getById);
linksRouter.post('/', authMiddleware, linksController.post);
linksRouter.put('/:id', linksController.put);
linksRouter.delete('/:id', linksController.delete);
linksRouter.get('/:id/analytics', linksController.getAnalytics); // ⭐️ הוספת ראוט חדש

export default linksRouter;
