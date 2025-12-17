import { Request, Response } from 'express';
import TrackTag from '@/models/relation/track-tag-model';
import { ITrackTag } from '@/type';

const getAllTrackTags = async (req: Request, res: Response) => {
  const data = await TrackTag.getAll();
  res.json(data);
};

const getByTrackId = async (req: Request, res: Response) => {
  const track_id = Number(req.query.track_id);
  const data = await TrackTag.getByTrackId(track_id);
  if (!data) throw new Error('TrackTag non trouvé');
  res.json(data);
};

const getByTagId = async (req: Request, res: Response) => {
  const tag_id = Number(req.query.tag_id);
  const data = await TrackTag.getByTagId(tag_id);
  if (!data) throw new Error('TrackTag non trouvé');
  res.json(data);
};

const createTrackTag = async (req: Request, res: Response) => {
  const data: ITrackTag = req.body;
  const result = await TrackTag.create(data);
  if (!result) throw new Error('TrackTag non trouvé');
  res.status(201).json(result);
};

const deleteTrackTag = async (req: Request, res: Response) => {
  const track_id = Number(req.query.track_id);
  const tag_id = Number(req.query.tag_id);
  const result = await TrackTag.delete(track_id, tag_id);
  if (!result) throw new Error('TrackTag non trouvé');
  res.json(result);
};

export default {
  getAllTrackTags,
  getByTrackId,
  getByTagId,
  createTrackTag,
  deleteTrackTag,
};
