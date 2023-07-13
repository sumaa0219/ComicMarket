import fs from 'fs';
import path from 'path';

export default function handler(req, res) {

    const type = req.query.type;
    const name = req.query.name;
    const filePath = path.join(process.cwd(), 'ComicMarket/user.json');
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const users = JSON.parse(jsonData);

    if (req.method === 'GET') {
        if (type == "search") {
            if (users[name]) {
                const user = users[name];
                res.status(200).json(user);
            } else {
                res.status(200).json({ error: 'UserNotfound' });
            }

        } if (type == "permission") {
            const permission = users[name]["role"];
            res.status(200).json({ "permission": permission });

        } if (type == "allUser") {
            let userList = Object.keys(users);
            let List = []
            userList.map((v) => {
                List.push(users[v]["name"])
            })
            res.status(200).json(List)

        } if (type == "userInfo") {
            const userInfo = users[name]
            res.status(200).json(userInfo)
        } if (type == "changeUserName") {
            let USER = users
            const editName = req.query.editName
            USER[name]["name"] = editName
            fs.writeFileSync(filePath, JSON.stringify(USER, null, 2));
            res.status(200).end();
        }

    } else {
        res.status(405).end(); // GETリクエスト以外はメソッドが許可されていないことを示す
    }


}
