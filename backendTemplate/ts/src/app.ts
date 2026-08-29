import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import ENV_CONFIG from './config/env.config';
import { notFound, errorHandler } from './middleware/error.middleware';

import authRoutes from './routes/auth.routes';
import _entities_Routes from './routes/_entity_.routes'; // PLACEHOLDER: rename import + path once _entity_ is renamed

const app = express();

app.use(cors({ origin: ENV_CONFIG.CLIENT_URL, credentials: true }));
app.use(express.json());
if (ENV_CONFIG.NODE_ENV !== 'production') app.use(morgan('dev'));

app.get('/api/health', (req: Request, res: Response) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/_entities_', _entities_Routes); // PLACEHOLDER: rename path, e.g. '/api/products'

// PLACEHOLDER: as you add more resources, mount them the same way:
// import orderRoutes from './routes/order.routes';
// app.use('/api/orders', orderRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
