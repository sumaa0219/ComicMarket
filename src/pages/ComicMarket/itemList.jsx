import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'
import { Header } from "../../materials/Header"
import { makeItemList } from "../../materials/makeItemList";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import styles from '../style/itemList.module.css';
import { fetchData, addData } from "../../../firebase/function"

export default function Handler(req, res) {
    const router = useRouter();
    const imageBasePath = "/api/getData?type=image&path=";
    const [foundedItemNum, setFoundedItemNum] = useState([]);
    const [jsonData, setJsonData] = useState();
    const [userList, setUserList] = useState();
    const [userJson, setUserJson] = useState();
    const [session, setSession] = useState();

    useEffect(() => {
        // Function to load JSON data
        fetchData(`/user`).then((result) => {
            setUserJson(result);
            setUserList(Object.keys(result))
        })
        fetchData(`/item`).then((result) => {
            setJsonData(result);
        })


    }, []);


    useEffect(() => {
        let SW = router.query.searchWord;
        if (SW) {
            if (jsonData) {
                let flag = "unmatch";
                let matchItemNum = [];
                const keyWords = [
                    "date",
                    "NSWE",
                    "place",
                    "circleName",
                    "editer",
                    "previewPath",
                    "maxRank",
                    "buyer",
                    "id"
                ];

                function singleSearch(word) {
                    Object.keys(jsonData).map((v) => {
                        let jsonString = JSON.stringify(jsonData[v])
                        if (jsonString.includes(word) == true) {
                            flag = "match"
                            matchItemNum.push(v);
                        }
                    })
                };

                function multSearch(wordList, length) {      //かえろおぽおおお
                    for (let i = 0; i < length; i++) {
                        Object.keys(jsonData).map((v) => {
                            let jsonString = JSON.stringify(jsonData[v])

                            if (jsonString.includes(wordList[i]) == true) {
                                flag = "ListMatch"
                                matchItemNum.push(v);
                            }
                        })
                    }
                    matchItemNum = matchItemNum.filter(function (x, i, self) {
                        return self.indexOf(x) === i && i !== self.lastIndexOf(x);
                    });
                };

                let wordList = [];
                if (SW.includes(" ") == true) {
                    wordList = SW.split(" ")
                    let wordListLength = wordList.length;
                    multSearch(wordList, wordListLength)

                } if (SW.includes("　") == true) {
                    wordList = SW.split("　")
                    let wordListLength = wordList.length;
                    multSearch(wordList, wordListLength)

                } if (SW.includes("　") == false && SW.includes(" ") == false) {
                    singleSearch(SW)
                }

                if (flag == 'unmatch') {
                    setFoundedItemNum()
                    alert("検索されたものにマッチするものはありませんでした。");
                    location.href = "./itemList";
                } if (flag == "match") {
                    setFoundedItemNum(matchItemNum)
                } if (flag == "ListMatch") {
                    setFoundedItemNum(matchItemNum)
                }


            }
        } else {
            if (jsonData) {

                setFoundedItemNum(Object.keys(jsonData));
            }
        }
    }, [jsonData]);

    const searchSubmit = (e) => {
        e.preventDefault();
        const searchWord = e.target.searchWords.value;
        // 検索処理
        if (searchWord === "") {
            location.href = `./itemList`;
        } else {
            location.href = `./itemList?searchWord=${searchWord}`;
        }
    };


    return (
        <>
            {Header()}
            <div className={styles.divBody}>
                <form onSubmit={searchSubmit}>
                    <Box
                        sx={{
                            width: 500,
                            maxWidth: '100%',
                        }}
                    >
                        <TextField fullWidth label="情報の検索" id="searchWords" placeholder="複数のワード検索は空白で入力すること" />
                    </Box>

                    {/* <button type="submit" className={styles.search}>
                        検索
                    </button> */}
                </form><br /><br />
                {foundedItemNum ? (
                    <>
                        {foundedItemNum.map((v) => {
                            return (
                                <React.Fragment key={v}>
                                    {makeItemList(jsonData, v, userList, userJson)}
                                    <br />
                                </React.Fragment>
                            );
                        })}
                    </>
                ) : (
                    <>
                        not Item
                    </>
                )}

            </div>
        </>
    );

}
