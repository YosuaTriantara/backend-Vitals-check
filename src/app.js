import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import screeningRoutes from './routes/screening.routes.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/screenings', screeningRoutes);
app.use('/api/users', userRoutes);

app.use(errorMiddleware);

export default app;