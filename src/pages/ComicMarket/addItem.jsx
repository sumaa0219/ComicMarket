import { useRef, useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { MuiFileInput } from 'mui-file-input';
import { Header } from "../../materials/Header"
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [json, setJsonData] = useState();
  const [date, setDate] = useState();
  const [NSWE, setNSWE] = useState();
  const [place, setPlace] = useState();
  const { data: session } = useSession();
  const router = useRouter();



  const handleFileChange = (newFile) => {
    setFile(newFile);
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleNSWEChange = (event) => {
    setNSWE(event.target.value);
  };


  const ref = useRef()
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
        setJsonData(data);
      })
      .catch(error => {
        console.error('データの取得エラー:', error);
      });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const circleName = document.getElementById("circleName").value;
    const place = document.getElementById("place").value;
    let previewPath = "";
    try {
      previewPath = file.name;
    }
    catch (e) {
      previewPath = "sample.png";
    }

    const checkData = {
      date: date,
      NSWE: NSWE,
      place: place,
      type: "duplicationCheck",
    }


    fetch('/api/getItemInfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(checkData),
    })
      .then(response => response.json())
      .then(data => {

        // レスポンスの処理を記述
        if (data.result == "Duplication") {
          alert("すでに登録済みのサークルです。\n情報を確認の上もう一度登録お願いします。\nそれでも登録できない場合はDiscordサーバーで連絡をお願いします")
          location.reload();
        } else {
          // JSONファイルを読み込む

          const keyCount = Object.keys(json).length;
          const data = Array.isArray(json) ? json : [];

          // 新しいデータを作成
          const newItem = {
            date: date,
            NSWE: NSWE,
            place: place,
            circleName: circleName,
            editer: session.user.name,
            previewPath: previewPath + "",
            price: 0,
            maxRank: 0,
            buyer: "",
            id: Math.random().toString(32).substring(2)
          };

          // データを追加
          data.push(newItem);

          // 更新されたデータをJSONフォーマットに変換
          const updatedJsonData = JSON.stringify(data);

          // JSONデータをファイルに書き込む
          fetch('/api/writeJson', {
            method: 'POST',
            body: updatedJsonData,
          })
            .then(response => {
              if (response.ok) {
                console.log('JSONファイルの書き込みが成功しました');
                alert("アイテムが追加されました");
              } else {
                console.error('JSONファイルの書き込みエラー:', response.status);
              }
            })
            .catch(error => {
              console.error('JSONファイルの書き込みエラー:', error);
            });



          ファイルをアップロードするリクエストを送信
          const formData = new FormData();
          formData.append('file', file);
          const response = fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          setFile(null);
          location.reload();
        }
      })
      .catch(error => {
        console.error('エラー:', error);
      });
    location.reload();

  };

  return (
    <>
      {session ? (
        <>
          {Header()}
          <form onSubmit={handleSubmit}>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <InputLabel id="demo-select-small-label">日付</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="date"
                value={date}
                label="date"
                onChange={handleDateChange}
              >
                <MenuItem key="土" value="土">土</MenuItem>
                <MenuItem key="日" value="日">日</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
              <InputLabel id="demo-select-small-label">配置棟</InputLabel>
              <Select
                labelId="demo-select-small-label"
                id="NSWE"
                value={NSWE}
                label="NSWE"
                onChange={handleNSWEChange}
              >
                <MenuItem key="西" value="西">西</MenuItem>
                <MenuItem key="東" value="東">東</MenuItem>
                <MenuItem key="南" value="南">南</MenuItem>
              </Select>
            </FormControl>
            <TextField variant="standard" label="場所" id="place" placeholder="ま42b" /><br></br>
            <TextField variant="standard" label="サークル名" id="circleName" placeholder="上海アリス幻樂団" />
            <br></br><br></br><br></br>
            <MuiFileInput type="file" value={file} onChange={handleFileChange} variant="outlined" /><br></br><br></br><br></br>
            <Button type="submit" variant="contained" endIcon={<SendIcon />}>アップロード</Button>
          </form>
        </>
      ) : (
        <>
          {Header()}
          Please Relod page
        </>
      )}

    </>
  );
}
