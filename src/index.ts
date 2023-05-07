import express from "express";
import multer from "multer";
import imgprcService from "./imgprc/imgprc.svc";
import stream from "stream";

const app = express();
const port = 3000;

const upload = multer({ storage: multer.memoryStorage() });

app.post("/imgprc", upload.single("file"), async (req, res) => {
  const width = parseInt(req.body.width ?? 100);
  const reesizedImg = await imgprcService.resize(req.file?.buffer, width);

  const readStream = new stream.PassThrough();
  readStream.end(reesizedImg);

  res.set("Content-disposition", "attachment; filename=" + req.file?.filename);
  res.set("Content-Type", req.file?.mimetype);

  readStream.pipe(res);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
