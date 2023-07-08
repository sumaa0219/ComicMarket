import fs from 'fs';
import path from 'path';

export default function handler(req, res) {

    const type = req.query.type;
    const filePath = path.join(process.cwd(), 'ComicMarket/item.json');
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(jsonData);
    const lengthKey = Object.keys(json).length;
    const jsonDataNum = [...Array(lengthKey)].map((_, i) => i)

    if (req.method === 'GET') {
        if (type == "getIndexList") {
            let list = []
            const index = req.query.index;
            jsonDataNum.map((v) => {
                list.push(json[v]["0"][index])
            })
            res.status(200).json(list)
        }
        if (type == "getOneData") {
            const key = req.query.key;
            const index1 = req.query.index1;
            const index2 = req.query.index2;
            res.status(200).json(json[key][index1][index2])
        }

    } else {
        const Body = req.body;
        const type = Body.type;
        if (type == "duplicationCheck") {
            const lengthKey = Object.keys(json).length;
            const lenghtMap = [...Array(lengthKey)].map((_, i) => i);
            let dupliFlag = 0;

            lenghtMap.map((v) => {
                let jsonData = json[v][0]
                if (jsonData["date"] == Body.date && jsonData["NSWE"] == Body.NSWE && jsonData["place"] == Body.place) {
                    dupliFlag = 1;
                    res.status(200).json({ result: "Duplication" })
                }

            });

            if (dupliFlag === 0) {
                res.status(200).json({ result: "NotDuplication" })
            }
        }


    }


}
