import express from 'express';
import usersController from "../controllers/userController.js";

const usersRouter = express.Router();

usersRouter.get('/', usersController.getAll);
usersRouter.get('/:id', usersController.getById);
usersRouter.post('/', usersController.post);
usersRouter.post('/login', usersController.login);
usersRouter.put('/:id', usersController.put);
usersRouter.delete('/:id', usersController.delete);

export default usersRouter;
