import fs from 'fs';
import path from 'path';

export default function handler(req, res) {

  const type = req.query.type;

  if (req.method === 'GET') {
    const Path = req.query.path; // クエリパラメータからファイル名を取得
    if (type == "json") {
      const filePath = path.join(process.cwd(), 'ComicMarket', Path);
      const jsonData = fs.readFileSync(filePath, 'utf-8');
      const data = JSON.parse(jsonData);
      res.status(200).json(data);



    } if (type == "image") {
      const filePath = path.join(process.cwd(), 'ComicMarket/sampleImage', Path); // 削除するファイルのパスを作成

      // ファイルの存在を確認して削除
      fs.readFile(filePath, (err, data) => {
        if (err) {
          console.error('画像ファイルの読み込み中にエラーが発生しました:', err);
          res.status(500).json({ error: '画像ファイルの読み込み中にエラーが発生しました' });
        } else {
          res.setHeader('Content-Type', 'image/jpeg');
          res.status(200).send(data);
        }
      });
    } if (type == "file") {
      const filePath = "/mnt/webServer/" + Path;

      fs.readFile(filePath, (err, data) => {
        if (err) {
          console.error('ファイルの読み込み中にエラーが発生しました:', err);
          res.status(500).json({ error: 'ファイルの読み込み中にエラーが発生しました' });
        } else {
          const ext = path.extname(filePath);
          let contentType = 'application/octet-stream'; // デフォルトのMIMEタイプ

          if (ext === '.pdf') {
            contentType = 'application/pdf';
          } else if (ext === '.jpg' || ext === '.jpeg' || ext == ".JPG" || ext == ".JPEG") {
            contentType = 'image/jpeg';
          } else if (ext === '.png') {
            contentType = 'image/png';
          } else if (ext === '.gif') {
            contentType = 'image/gif';
          } else {
            const encodedFileName = encodeURIComponent(Path);
            res.setHeader('Content-Disposition', `attachment; filename="${encodedFileName}"`);
          }

          // レスポンスヘッダーを設定
          res.setHeader('Content-Type', contentType);
          res.status(200).send(data);
        }
      });
    }
  } else {
    res.status(405).end(); // GETリクエスト以外はメソッドが許可されていないことを示す
  }


}
