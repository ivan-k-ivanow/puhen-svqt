import express from 'express';
import dotenv from 'dotenv';
import path from 'node:path';
import cors from 'cors';
import routes from './routes/routes.js';
import { authMiddleware } from './middlewares/auth-middleware.js';
import cookieParser from 'cookie-parser';


dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

// Create an instance of the Express application
const app = express();

//Add JSON parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Parse incoming JSON data
app.use(cookieParser());

// Add the authMiddleware to all routes
app.use(authMiddleware);

// Add cors middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Import routes
app.use(routes);

// Start the server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}...`);
});


