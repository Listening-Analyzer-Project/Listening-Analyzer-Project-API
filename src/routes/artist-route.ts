import express from 'express';
import ArtistController from '../controllers/artist-controller';

const router = express.Router();

router.get('/', ArtistController.getAllArtists);
router.get('/byId', ArtistController.getArtistById);
router.post('/', ArtistController.createArtist);
router.put('/', ArtistController.updateArtist);
router.delete('/', ArtistController.deleteArtist);

export default router;
