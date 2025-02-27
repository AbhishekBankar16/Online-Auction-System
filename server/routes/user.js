import express from 'express';
import { handleSignup, handleLogin, handleDelete, handleGetUser, handleUser } from '../controllers/user.controller.js';

const userRouter = express.Router();

// User authentication routes
userRouter.post('/signup', handleSignup);  // ✅ POST /api/signup
userRouter.post('/login', handleLogin);    // ✅ POST /api/login

// User-related routes
userRouter.get('/user/:seller', handleGetUser); // ✅ GET /api/user/:seller
userRouter.get('/:userId', handleUser);        // ✅ GET /api/:userId (Must be after /signup and /login)

// Account deletion route
userRouter.delete('/delete', handleDelete);    // ✅ DELETE /api/delete

export default userRouter;