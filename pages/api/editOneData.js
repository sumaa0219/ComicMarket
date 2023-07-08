import fs from "fs";

export default function handler(req, res) {

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method Not Allowed' });
        return;
    }


    const filePath = "./ComicMarket/item.json";
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const body = req.body;

    // 新しいデータを連番のキーで追加します
    jsonData[body.key][body.index][body.name] = body.value;

    try {
        // 更新されたJSONデータをファイルに保存します
        fs.writeFileSync(filePath, JSON.stringify(jsonData), 'utf8');

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('ファイルの書き込みエラー:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
