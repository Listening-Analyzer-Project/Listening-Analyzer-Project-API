import { Request, Response } from 'express';
import TrackTag from '@/models/relation/track-tag-model';
import { ITrackTag } from '@/type';

const getAllTrackTags = async (req: Request, res: Response) => {
  const data = await TrackTag.getAll();
  res.json(data);
};

const getByTrackId = async (req: Request, res: Response) => {
  const track_id = Number(req.query.track_id);
  if (!track_id) throw { status: 400, message: 'track_id manquant' };
  const data = await TrackTag.getByTrackId(track_id);
  res.json(data);
};

const getByTagId = async (req: Request, res: Response) => {
  const tag_id = Number(req.query.tag_id);
  if (!tag_id) throw { status: 400, message: 'tag_id manquant' };
  const data = await TrackTag.getByTagId(tag_id);
  res.json(data);
};

const createTrackTag = async (req: Request, res: Response) => {
  const data: ITrackTag = req.body;
  if (!data.track_id || !data.tag_id)
    throw { status: 400, message: 'track_id et tag_id sont requis' };

  const result = await TrackTag.create(data);
  res.status(201).json(result);
};

const deleteTrackTag = async (req: Request, res: Response) => {
  const track_id = Number(req.query.track_id);
  const tag_id = Number(req.query.tag_id);
  if (!track_id || !tag_id)
    throw { status: 400, message: 'track_id et tag_id sont requis' };

  const result = await TrackTag.delete(track_id, tag_id);
  res.json(result);
};

export default {
  getAllTrackTags,
  getByTrackId,
  getByTagId,
  createTrackTag,
  deleteTrackTag,
};
