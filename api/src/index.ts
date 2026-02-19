import express from 'express';
import cors from 'cors';
import logRoutes from './routes/log.route';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use(express.json());

app.use('/api', logRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Analytics API running on http://localhost:${PORT}`);
});