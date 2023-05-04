import express from 'express'
import multer from 'multer'
import imgprcService from '../services/imgprc.svc'
import stream from 'stream';

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

router.post('/', upload.single('file'), async (req, res) => {
    const width = parseInt(req.body.width ?? 100)
    const reesizedImg = await imgprcService.resize(req.file?.buffer, width)

    const readStream = new stream.PassThrough();
    readStream.end(reesizedImg);

    res.set('Content-disposition', 'attachment; filename=' + req.file?.filename);
    res.set('Content-Type', req.file?.mimetype);

    readStream.pipe(res);
})

export default router