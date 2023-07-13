import fs from 'fs';
import path from 'path';

const filePath = path.resolve('./ComicMarket/item.json');

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { key, index, data } = req.body;

    // ファイルからデータを読み込む
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    // 指定したキーの位置にデータを追記する
    if (jsonData.hasOwnProperty(key) && Array.isArray(jsonData[key])) {
        jsonData[key][index] = JSON.parse(data);
    } else {
      return res.status(400).json({ message: '指定したキーが存在しないか、配列ではありません。' });
    }

    // データをファイルに書き込む
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));

    res.status(200).json({ message: 'データが追加されました。' });
  } else {
    res.status(405).json({ message: 'メソッドが許可されていません。' });
  }
}
