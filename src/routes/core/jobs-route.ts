import express from 'express';
import JobController from '@/controllers/core/jobs-controller';
import { wrapRoutes } from '@/utils';
import { validateRequest } from '@/middleware';
import { createJobSchema, updateJobSchema, getDeleteJobSchema } from '@/validators/core/jobs-validator';

const router = express.Router();

router.get('/', JobController.getAllJobs);
router.get('/byId', validateRequest(getDeleteJobSchema), JobController.getJobById);
router.post('/', validateRequest(createJobSchema), JobController.createJob);
router.put('/', validateRequest(updateJobSchema), JobController.updateJob);
router.delete('/', validateRequest(getDeleteJobSchema), JobController.deleteJob);

export default wrapRoutes(router);
