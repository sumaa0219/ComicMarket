import { useEffect, useRef, useState } from 'react';
import React from 'react';
import Button from '@mui/material/Button';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [filejson, setfilejson] = useState()
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    const selectedFile = event.target.files[0];
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    // ファイルをアップロードするリクエストを送信
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload?type=webserver', {
      method: 'POST',
      body: formData,
    })

    setFile(null);
    location.reload();
  };

  const handleDeleteFile = async (e, path) => {
    e.preventDefault();
    console.log("push")
    const Path = '/api/deleteFile?type=fileServer&fileName=' + encodeURIComponent(path);

    try {
      await fetch(Path, { method: 'get' });
      console.log("sccese delete file")
      // 削除が成功した場合の処理をここに追加する
      location.reload();

    } catch (error) {
      console.error('ファイルの削除中にエラーが発生しました:', error);
      // エラーが発生した場合の処理をここに追加する
    }

  };



  useEffect(() => {
    fetch("api/getFile")
      .then((response) => response.json())
      .then((data) => {
        // 取得したデータを処理する
        console.log(data);
        setfilejson(data);
      })
      .catch((error) => {
        // エラーハンドリング
        console.error(error);
      });

  }, [])

  function makeFileList(json) {
    if (filejson == null) {
      return <></>
    } else {
      const lengthKey = Object.keys(json).length;
      const lengthNum = [...Array(lengthKey)].map((_, i) => i);
      console.log(lengthNum)
      return (
        <>
          {lengthNum.map((v) => {
            let filepath = "api/getData?type=file&path=" + encodeURIComponent(json[v]);
            return <><a href={filepath}>{json[v]}</a>
              <Button variant="contained" type="submit" onClick={(e) => handleDeleteFile(e, json[v])}>削除</Button>
              <br></br></>
          })}
          <br></br>
        </>
      )
    }
  }


  return (
    <>
      <form onSubmit={handleSubmit}>
        <p>ファイル:</p><input type="file" onChange={handleFileChange} />
        <button type="submit">アップロード</button><br></br><br></br><br></br><br></br><br></br>
      </form>
      <h1>ファイル一覧 </h1>
      {makeFileList(filejson)}
    </>
  );
}
