import fs from 'fs';
import path from 'path';

const filePath = path.resolve('./ComicMarket/item.json');

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { key, data } = req.body;

    // ファイルからデータを読み込む
    const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

    // 指定したキーの位置にデータを追記する
    const targetArray = jsonData[key];
    const length = Object.keys(targetArray).length;
    const listLength = [...Array(length - 1)].map((_, i) => i + 1)
    const mainData = JSON.parse(data)
    let matchFlag = 0;
    let newItem = {};
    listLength.map((v) => {

      if (mainData["productName"] == targetArray[v]["productName"]) {
        const userLength = Object.keys(targetArray[v]["user"])
        let flagUser = "unmatch"
        let flagNum = 0
        userLength.map((x) => {
          if (targetArray[v]["user"][x]["name"] == mainData.user.name) {
            flagUser = "match"
            flagNum = x
          }
        })
        if (flagUser == "unmatch") {
          matchFlag = 1;

          newItem = {
            name: mainData.user.name,
            count: mainData.user.count,
          }

          targetArray[v]["user"].push(newItem)
        } else {
          matchFlag = 1;
          targetArray[v]["user"][flagNum]["count"] = mainData.user.count
        }


        if (mainData.rank > targetArray[v]["rank"]) {
          targetArray[v]["rank"] = mainData.rank;
          if (targetArray[0]["maxRank"] < targetArray[v]["rank"]) {
            targetArray[0]["maxRank"] = targetArray[v]["rank"]
          }
        }

        targetArray[v]["count"] = Number(mainData.user.count) + Number(targetArray[v]["count"])
      }
    })
    if (matchFlag === 1) {
      newItem = ""

    } else {
      newItem = {
        productName: mainData.productName,
        editer: mainData.editer,
        rank: mainData.rank,
        remarks: mainData.remarks,
        count: mainData.user.count,
        price: mainData.price,
        user:
          [
            {
              name: mainData.user.name,
              count: mainData.user.count,
            }
          ]
      }
      if (targetArray[0]["maxRank"] < mainData.rank) {
        targetArray[0]["maxRank"] = mainData.rank;
      }
      targetArray.push(newItem);
    }





    // // データをファイルに書き込む
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));

    res.status(200).json({ message: 'データが追加されました。' });
  } else {
    res.status(405).json({ message: 'メソッドが許可されていません。' });
  }
}
