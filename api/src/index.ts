import express from 'express';
import logRoutes from './routes/log.route';

const app = express();
app.use(express.json());

app.use('/api', logRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Analytics API running on http://localhost:${PORT}/api`);
});