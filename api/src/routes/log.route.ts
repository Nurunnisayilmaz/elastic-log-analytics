import { Router } from 'express';
import { LogController } from '../controllers/log.controller';

const router = Router();

// Logs queries
router.get('/search/logs', LogController.searchLogs);
router.get('/search/errors', LogController.getErrors);
router.get('/analytics/top-endpoints', LogController.getTopEndpoints);
router.get('/analytics/slow-requests', LogController.getSlowRequests);
router.get('/analytics/overview', LogController.getOverview);

export default router;