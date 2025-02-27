import express from 'express';
import multer from 'multer'; // Uncommented to enable file uploads

import { createAuction, showAuction, auctionById, updateAuctionById } from '../controllers/auction.controller.js';
import { handleSignup } from '../controllers/user.controller.js'; // Import the signup handler

import upload from '../middleware/multer.js';

const auctionRouter = express.Router(); // Router for auction-related routes

auctionRouter.post('/create', upload.single('itemPhoto'), createAuction);
auctionRouter.get('/show', showAuction);
auctionRouter.get('/:id', auctionById);
auctionRouter.post('/:id', updateAuctionById);
auctionRouter.post('/signup', handleSignup); // Add signup route without auth middleware

export default auctionRouter;
