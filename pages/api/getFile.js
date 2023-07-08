import fs from 'fs';

export default function handler(req, res) {
  if (req.method === 'GET') {
    fs.promises
      .readdir("/mnt/webServer", { withFileTypes: true })
      .then((files) => {
        const fileNames = files
          .filter((file) => file.isFile())
          .map((file) => file.name);
        res.status(200).json(fileNames);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
      });
  } else {
    res.status(405).end();
  }
}
