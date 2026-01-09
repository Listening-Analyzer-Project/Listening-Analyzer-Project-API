import express from 'express';
import triggerJobs from '@/controllers/other/trigger-jobs-controller';

const router = express.Router();

router.post('/post-import-jobs', triggerJobs.triggerPostImportJobs);

export default router;
