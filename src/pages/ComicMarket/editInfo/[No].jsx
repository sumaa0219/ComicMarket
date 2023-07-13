import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { MuiFileInput } from 'mui-file-input';
import SendIcon from '@mui/icons-material/Send';
import Button from '@mui/material/Button';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Header } from "../../../materials/Header"

export default function ItemList() {
  const imageBasePath = "/api/getData?type=image&path=";
  const [data, setData] = useState(null);
  const [json, setjson] = useState();
  const [preview, setPreview] = useState('');

  const router = useRouter();
  const { No } = router.query;

  let mainDATA = "";

  const Json = async () => {
    try {
      const response = await fetch('/api/getData?type=json&path=item.json');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('データの取得エラー:', error);
      return null;
    }
  };

  useEffect(() => {
    Json()
      .then(data => {
        setjson(data);
      })
      .catch(error => {
        console.error('データの取得エラー:', error);
      });
  }, []);

  function makeItemList(No) {
    if (!json || !No || !json[No]) {
      return ""; // データがない場合は空の文字列を返す
    } else {

      mainDATA = json[No][0];
      const path = imageBasePath + mainDATA["previewPath"];

      return (
        <>

          <TextField variant="standard" label="サークル名" type="text" id="circleName" defaultValue={mainDATA["circleName"]} placeholder={mainDATA["circleName"]} /><br></br>
          <TextField variant="standard" label="出店日" type="text" id="date" defaultValue={mainDATA["date"]} placeholder={mainDATA["date"]} /><br></br>
          <TextField variant="standard" label="配置棟" type="text" id="NSWE" defaultValue={mainDATA["NSWE"]} placeholder={mainDATA["NSWE"]} /><br></br>
          <TextField variant="standard" label="場所" type="text" id="place" defaultValue={mainDATA["place"]} placeholder={mainDATA["place"]} /><br></br>
          <img height="300" src={path} />
        </>
      );
    }
  };

  const [file, setFile] = useState(null);
  const handleFileChange = (newFile) => {
    setFile(newFile);
    if (newFile != null) {
      setPreview(window.URL.createObjectURL(newFile));
    } else {
      setPreview("");
    }
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    const date = document.getElementById("date").value;
    const NSWE = document.getElementById("NSWE").value;
    const place = document.getElementById("place").value;
    const circleName = document.getElementById("circleName").value;
    const productName = document.getElementById("productName").value;
    const price = document.getElementById("price").value;
    let previewPath = "";
    try {
      previewPath = file.name;
    }
    catch (e) {
      previewPath = json[No][0]["previewPath"];
    }

    // 新しいデータを作成
    const newItem = {
      date: date,
      NSWE: NSWE,
      place: place,
      circleName: circleName,
      productName: productName,
      previewPath: previewPath + "",
      price: price
    };

    // 更新されたデータをJSONフォーマットに変換
    const updatedJsonData = JSON.stringify(newItem);

    // JSONデータをファイルに書き込む
    fetch('/api/editItem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        key: No,
        index: 0,
        data: updatedJsonData
      })
    })
      .then(response => {
        if (response.ok) {
          console.log('JSONファイルの書き込みが成功しました');
          alert("登録完了")
        } else {
          console.error('JSONファイルの書き込みエラー:', response.status);
        }
      })
      .catch(error => {
        console.error('JSONファイルの書き込みエラー:', error);
      });

    fetch(`/api/deleteFile?fileName=${previewPath}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('リクエストに失敗しました。');
        }
        return response.json();
      })
      .then((data) => {
      })
      .catch((error) => {
        console.error('リクエスト中にエラーが発生しました:', error);
      });


    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    setFile(null);
    location.href = "/ComicMarket/itemList";
  };

  return (
    <>
      {Header()}
      <form onSubmit={handleSubmit}>
        {makeItemList(No)}<ArrowForwardIcon sx={{ fontSize: 100 }} />
        <img height="300" src={preview} /><br></br><br></br>
        <MuiFileInput type="file" value={file} onChange={handleFileChange} />

        <br></br><br></br>
        <Button type="submit" variant="contained" endIcon={<SendIcon />}>変更</Button>
      </form><br></br><br></br>
      <a href='/ComicMarket/itemList'>戻る</a>
    </>
  );
}
