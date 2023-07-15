import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import { Header } from "../../materials/Header"
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { fetchData, addData, addDataHash } from "../../../firebase/function"
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [json, setJsonData] = useState();
  const [date, setDate] = useState();
  const [NSWE, setNSWE] = useState();
  const [place, setPlace] = useState();
  const [session, setSession] = useState();



  const handleFileChange = (newFile) => {
    setFile(newFile);
  };

  const handleDateChange = (event) => {
    setDate(event.target.value);
  };

  const handleNSWEChange = (event) => {
    setNSWE(event.target.value);
  };




  useEffect(() => {

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // ログイン済みの場合の処理
        setSession(user);
      } else {
        // ログアウト済みの場合の処理
      }
    });

    fetchData(`/item`).then((result) => {
      setJsonData(result);
    })

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

    const randomHash = Math.random().toString(32).substring(2);
    const newItem = {
      date: date,
      NSWE: NSWE,
      place: place,
      circleName: circleName,
      editer: session.displayName,
      previewPath: previewPath + "",
      price: 0,
      maxRank: 0,
      buyer: "",
      id: randomHash,
    };

    const checkData = {
      date: date,
      NSWE: NSWE,
      place: place,
      type: "duplicationCheck",
    }


    const checkDatafromDB = async () => {
      let data = false;
      const jsonList = Object.keys(json);

      for (const v of jsonList) {
        const result = await fetchData(`/item/${v}/circle`);
        console.log(result);
        if (result == null) {
          console.log("No Data")
        } else {
          if (
            result.date === checkData.date &&
            result.NSWE === checkData.NSWE &&
            result.place === checkData.place
          ) {
            console.log("match");
            data = true;
            break;
          }
        }


      }

      return data;
    };

    const processData = async () => {
      if (json != null) {
        const isDataFromDB = await checkDatafromDB();
        console.log(isDataFromDB);
        console.log("aaaaaaaa");

        if (isDataFromDB === true) {
          alert(
            "すでに登録済みのサークルです。\n情報を確認の上もう一度登録お願いします。\nそれでも登録できない場合はDiscordサーバーで連絡をお願いします"
          );
          location.reload();
        } else {
          addData(`/item/${randomHash}/circle`, newItem);
          location.reload();
        }
      } else {
        // 新しいデータを作成


        addData(`/item/${randomHash}/circle`, newItem);

        // ファイルをアップロードするリクエストを送信
        const formData = new FormData();
        formData.append('file', file);
        const response = fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        setFile(null);
        location.reload();
      }
    };

    processData();
    // location.reload();
  }





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
            <input type="file" value={file} onChange={handleFileChange} variant="outlined" /><br></br><br></br><br></br>
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
