import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { Button, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import Rating from '@mui/material/Rating';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Select from 'react-select';
import { signOut, useSession } from 'next-auth/react';
import { Header } from "../../../materials/Header";
import { makeItemList } from "../../../materials/makeItemList";

export default function ItemList() {
  const imageBasePath = "/api/getData?type=image&path=";
  const [jsonData, setJsonData] = useState();
  const [rank, setRank] = useState();
  const [count, setCount] = useState();
  const [userName, setUserName] = useState();
  const { data: session } = useSession();
  const [productList, setProductList] = useState([]);
  const [productName, setProductName] = useState();
  const [productPrice, setProductPrice] = useState();
  const [optionListNum, setOptionListNum] = useState([]);
  const [optionList, setOptionList] = useState([]);

  const router = useRouter();
  const { No } = router.query;

  const fetchJsonData = async () => {
    try {
      const response = await fetch('/api/getData?type=json&path=item.json');
      const data = await response.json();
      setJsonData(data);
    } catch (error) {
      console.error('データの取得エラー:', error);
      return null;
    }
  };

  useEffect(() => {
    fetchJsonData();
  }, []);

  useEffect(() => {
    if (jsonData) {
      const listOption = Object.keys(jsonData[No]);
      listOption.shift();
      setOptionListNum(listOption);
    }
  }, [jsonData, No]);

  useEffect(() => {
    if (optionListNum.length > 0) {
      const newOptionList = optionListNum.map((v) => {
        const productName = jsonData[No][v]["productName"];
        return {
          value: productName,
          label: productName,
          price: jsonData[No][v]["price"]
        };
      });
      setOptionList(newOptionList);
    }
  }, [optionListNum, jsonData, No]);

  useEffect(() => {
    if (optionList) {
    }
  }, [optionList]);

  const customStyles = {
    container: (provided) => ({
      ...provided,
      maxWidth: '400px',
    }),
  };

  useEffect(() => {
    if (session) {
      fetch(`/api/getUserInfo?type=userInfo&name=${session.user.name}`)
        .then((response) => response.json())
        .then((data) => {
          setUserName(data.name);
        });
    }
  }, [session]);

  const handleSelectChange = (selectedOption) => {
    setProductName(selectedOption?.value);
    setProductPrice(selectedOption?.price)
  };

  const handleInputChange = (event) => {
    setProductName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const remarks = document.getElementById("remarks").value;
    const price = document.getElementById("price").value;

    const newItem = {
      productName: productName,
      editer: name,
      rank: rank,
      remarks: remarks,
      price: price,
      user: {
        name: name,
        count: count,
      },
    };

    const updatedJsonData = JSON.stringify(newItem);

    fetch('/api/regiItem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        key: No,
        data: updatedJsonData,
      }),
    })
      .then((response) => {
        if (response.ok) {
          console.log('JSONファイルの書き込みが成功しました');
          alert('登録完了');
          location.reload();
        } else {
          console.error('JSONファイルの書き込みエラー:', response.status);
        }
      })
      .catch((error) => {
        console.error('JSONファイルの書き込みエラー:', error);
      });
  };

  return (
    <>
      {session ? (
        <div>
          {Header()}
          <form onSubmit={handleSubmit}>
            <TextField variant="outlined" type="text" id="name" placeholder={session.user.name} value={userName} defaultValue={userName} /><br /><br /><br />
            <Select
              inputId='productName'
              options={optionList}
              placeholder="登録済みなら選んでください"
              onChange={handleSelectChange}
              styles={customStyles}
              isClearable={true}
            /><br />
            <TextField variant="outlined" type="text" placeholder="購入物の新規登録" defaultValue={productName} onChange={handleInputChange} />
            <br /><br /><br />
            <Box sx={{ width: 300 }}>個数<br /><br /><br />
              <Slider
                onChange={(event, newValue) => {
                  setCount(newValue);
                }}
                aria-label="Always visible"
                max={10}
                min={1}
                defaultValue={1}
                step={1}
                valueLabelDisplay="on"
              />
            </Box><br /><br /><br />
            <Typography component="legend">優先度</Typography>
            <Rating
              id="rank"
              name="simple-controlled"
              defaultValue={0}
              onChange={(event, newValue) => {
                setRank(newValue);
              }}
            /><br /><br /><br />
            {productPrice ? (
              <>
                <TextField
                  label="値段"
                  type="number"
                  id="price"
                  value={productPrice}
                  placeholder="購入物の単価"
                  InputLabelProps={{
                    shrink: true,
                  }}
                /><br /><br /><br />
              </>
            ) : (<>
              <TextField
                label="値段"
                type="number"
                id="price"
                placeholder="購入物の単価"
                InputLabelProps={{
                  shrink: true,
                }}
              /><br /><br /><br />
            </>)}

            <TextField variant="standard" label="備考" type="text" id="remarks" placeholder="何かあれば" /><br /><br /><br />

            <Button type="submit" variant="contained" endIcon={<SendIcon />}>登録</Button><br /><br /><br />
          </form>
          {makeItemList(jsonData, No, null)}
        </div>
      ) : (
        <div>
          {Header()}
          ログインしてください
        </div>
      )}
    </>
  );
}
