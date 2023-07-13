import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    if (req.method === 'GET') {
        const fileName = req.query.fileName; // クエリパラメータからファイル名を取得
        const type = req.query.type;
        if (type != null) {
            if (type == "fileServer") {
                let filePath = "/mnt/webServer/" + fileName
                fs.unlink(filePath, (error) => {
                    if (error) {
                        console.error('ファイルの削除中にエラーが発生しました:', error);
                        res.status(500).json({ error: 'ファイルの削除中にエラーが発生しました' });
                    } else {
                        res.status(200).json({ message: 'ファイルを削除しました' });
                    }
                });
            }
        } else {
            if (fileName == "sample.png") {
                res.status(200).end();
            } else {
                const filePath = path.join(process.cwd(), 'ComicMarket/sampleImage', fileName); // 削除するファイルのパスを作成

                // ファイルの存在を確認して削除
                fs.unlink(filePath, (error) => {
                    if (error) {
                        console.error('ファイルの削除中にエラーが発生しました:', error);
                        res.status(500).json({ error: 'ファイルの削除中にエラーが発生しました' });
                    } else {
                        res.status(200).json({ message: 'ファイルを削除しました' });
                    }
                });
            }
        };
    } else {
        res.status(405).end(); // GETリクエスト以外はメソッドが許可されていないことを示す
    }



}
