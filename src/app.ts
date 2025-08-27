import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import authRoutes from './routes/authRoutes';
import eventRoutes from './routes/eventRoutes';
import giftRoutes from './routes/giftRoutes';
import userRoutes from './routes/userRoutes';
import publicRoutes from './routes/publicRoutes';
import { setupSwagger } from './config/swagger';
import compression from 'compression';
const app = express();

const eventStaticDir = path.join(__dirname, '../Uploads/events');
const giftStaticDir = path.join(__dirname, '../Uploads/gifts');

if (!fs.existsSync(eventStaticDir)) {
  fs.mkdirSync(eventStaticDir, { recursive: true });
}
if (!fs.existsSync(giftStaticDir)) {
  fs.mkdirSync(giftStaticDir, { recursive: true });
}

app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(
  '/uploads/events',
  express.static(eventStaticDir, {
    setHeaders: (res, filePath) => {
      res.setHeader('Content-Type', `image/${path.extname(filePath).slice(1)}`);
    },
    fallthrough: true,
  })
);

app.use(
  '/uploads/gifts',
  express.static(giftStaticDir, {
    setHeaders: (res, filePath) => {
      console.log('Serving gift file:', filePath);
      res.setHeader('Content-Type', `image/${path.extname(filePath).slice(1)}`);
    },
    fallthrough: true,
  })
);

app.use(
  '/uploads/gifts',
  express.static(path.join(__dirname, '../Uploads/gifts'))
);

app.use('/uploads/events', (req, res, next) => {
  console.log('Event file not found:', req.path);
  res.status(404).send('Event file not found');
});

app.use('/uploads/gifts', (req, res, next) => {
  console.log('Gift file not found:', req.path);
  res.status(404).send('Gift file not found');
});

app.use('/auth', authRoutes);
app.use('/events', eventRoutes);
app.use('/gifts', giftRoutes);
app.use('/users', userRoutes);
app.use('/public', publicRoutes);

setupSwagger(app);

export default app;
