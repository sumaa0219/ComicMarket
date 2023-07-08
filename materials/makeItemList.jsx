import { Button, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Rating from '@mui/material/Rating';
import React, { useState, useEffect } from 'react';

const imageBasePath = "/api/getData?type=image&path=";

export const makeItemList = (jsonData, No, userList) => {

    function createData(productName, count, rank, remarks) {
        return { productName, count, rank, remarks };
    };

    if (jsonData == null) {
        return <></>
    } else {
        if (userList) {
            let buyer = "";
            const lengthKey = Object.keys(userList).length;
            let userListNum = [...Array(lengthKey)].map((_, i) => i)

            const mainData = jsonData[No][0];
            const SubData = jsonData[No];
            let subDatalength = Object.keys(jsonData[No]).length;
            let subDataNum = [...Array(subDatalength - 1)].map((_, i) => i + 1);
            let path = imageBasePath + mainData["previewPath"]
            if (mainData["buyer"]) {
                buyer = mainData["buyer"];
            } else {
                buyer = "";
            }




            const handleChange = (event) => {
                // setBuyer(event.target.value);
                buyer = userList[event.target.value];

                const newItem = {
                    key: No,
                    index: 0,
                    name: "buyer",
                    value: buyer,
                };

                fetch('/api/editOneData', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newItem), // newItemをJSON文字列に変換する
                })
                    .then(response => {
                        if (response.ok) {
                            console.log('JSONファイルの書き込みが成功しました');
                            location.reload();
                        } else {
                            console.error('JSONファイルの書き込みエラー:', response.status);
                        }
                    })
                    .catch(error => {
                        console.error('JSONファイルの書き込みエラー:', error);
                    });
            };

            let rows = [];
            subDataNum.map((v) => {
                let nameList = []
                const nameListnum = Object.keys(SubData[v]["user"])
                nameListnum.map((y) => {
                    const string = SubData[v]["user"][y]["name"] + ","
                    nameList.push(string)
                })
                rows.push(createData(SubData[v]["productName"], SubData[v]["count"], nameList, SubData[v]["remarks"]))
            })




            const handleImageDisplay = () => {

            };

            return (
                <>
                    <Grid container justifyContent="center">
                        <Grid item xs={5}>
                            <Card sx={{ maxWidth: 375 }}>
                                <CardMedia
                                    sx={{ height: 300 }}
                                    image={path}
                                    title="preview"
                                />
                                <CardContent>
                                    <Typography variant="body3" color="text.secondary">
                                        サークル名
                                    </Typography>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {mainData.circleName}
                                    </Typography>
                                    <Typography variant="body3" color="text.secondary">
                                        出店日:
                                        <a href={`./itemList?searchWord=${mainData["date"]}`}>{mainData["date"]}</a><br></br>
                                    </Typography>
                                    <Typography variant="body3" color="text.secondary">
                                        配置棟:
                                        <a href={`./itemList?searchWord=${mainData["NSWE"]}`}>{mainData["NSWE"]}</a><br></br>
                                    </Typography>
                                    <Typography variant="body3" color="text.secondary">
                                        場所:
                                        <a href={`./itemList?searchWord=${mainData["place"]}`}>{mainData["place"]}</a><br></br>
                                    </Typography>
                                    <Typography variant="body3" color="text.secondary">
                                        優先度:
                                        <Rating
                                            id="rank"
                                            name="simple-controlled"
                                            value={mainData["maxRank"]}
                                        /><br></br>
                                    </Typography>
                                    <Typography variant="body3" color="text.secondary">
                                        合計金額:
                                        <a href={`./itemList?searchWord=${mainData["price"]}`}>{mainData["price"]}円</a><br></br>
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        購入者:
                                        <a href={`./itemList?searchWord=${mainData["buyer"]}`}>{mainData["buyer"]}</a><br></br>
                                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                                            <InputLabel id="demo-select-small-label">edit Buyer</InputLabel>
                                            <Select
                                                labelId="demo-select-small-label"
                                                id="demo-select-small"
                                                value={buyer}
                                                label="Buyer"
                                                onChange={handleChange}
                                            >
                                                {userListNum.map((v) => (
                                                    <MenuItem key={v} value={v}>{userList[v]}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <form action={`addBuyList/${No}`} method="get">
                                        <Button variant="outlined" type="submit">購入登録</Button>
                                    </form>
                                    <form action={`editInfo/${No}`} method="get">
                                        <Button variant="outlined" type="submit">編集</Button>
                                    </form>
                                    <form>
                                        <Button variant="outlined" type="submit" onClick={handleImageDisplay}>画像表示</Button>
                                    </form>

                                </CardActions>
                            </Card>
                        </Grid>
                        <Grid item xs={7}>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 200 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>購入物名</TableCell>
                                            <TableCell align="left">個数</TableCell>
                                            <TableCell align="left">欲しい人</TableCell>
                                            <TableCell align="left">備考</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.map((row) => (
                                            <TableRow
                                                key={row.name}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {row.productName}
                                                </TableCell>
                                                <TableCell align="left">{row.count}</TableCell>
                                                <TableCell align="left">{row.rank}</TableCell>
                                                <TableCell align="left">{row.remarks}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>

                    </Grid>


                </>

            );

        }
    }



};