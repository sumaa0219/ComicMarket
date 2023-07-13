import multiparty from 'multiparty';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};




export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }


  const type = req.query.type;
  let newDirectory = "";

  const form = new multiparty.Form();
  if (type != "webserver") {
    form.uploadDir = './ComicMarket/sampleImage';
    newDirectory = './ComicMarket/sampleImage';
  }
  else {
    form.uploadDir = '/mnt/webServer';
    newDirectory = '/mnt/webServer';
  }

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    const file = files.file ? files.file[0] : null;
    if (!file) {
      console.error('No file uploaded');
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }
    const oldPath = file.path;

    const newFileName = file.originalFilename;

    try {
      await fs.promises.mkdir(newDirectory, { recursive: true });
      await fs.promises.rename(oldPath, `${newDirectory}/${newFileName}`);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to save the file' });
      return;
    }
    res.status(200).json({ success: true });
  });
}