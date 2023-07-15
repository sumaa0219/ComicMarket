import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { Button, Grid } from '@mui/material';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import Rating from '@mui/material/Rating';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import Select from 'react-select';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { Header } from "../../../materials/Header";
import { makeItemList } from "../../../materials/makeItemList";
import { fetchData, addData, updateData, updateOneData } from "../../../../firebase/function"


export default function ItemList() {
  const imageBasePath = "/api/getData?type=image&path=";
  const [jsonData, setJsonData] = useState();
  const [rank, setRank] = useState();
  const [count, setCount] = useState();
  const [userName, setUserName] = useState();
  const [session, setSession] = useState();
  const [productList, setProductList] = useState([]);
  const [productName, setProductName] = useState();
  const [productPrice, setProductPrice] = useState();
  const [optionListNum, setOptionListNum] = useState([]);
  const [optionList, setOptionList] = useState([]);

  const router = useRouter();
  const { No } = router.query;



  useEffect(() => {

    fetchData(`/item`).then((result) => {
      setJsonData(result);
    })
    setCount(1);

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // ログイン済みの場合の処理
        setSession(user);
      } else {
        // ログアウト済みの場合の処理
      }
    });
  }, []);

  useEffect(() => {
    if (jsonData) {
      const listOption = Object.keys(jsonData[No]);
      listOption.shift();
      setOptionListNum(listOption);

      //合計金額の計算
      let addPrice = 0;
      let addRank = 0;
      let ItemList = Object.keys(jsonData[No])
      let index = ItemList.indexOf("circle");
      ItemList.splice(index, 1)
      console.log(ItemList)
      ItemList.map((v) => {
        const baseRank = jsonData[No][v]["rank"]
        if (addRank < baseRank) {
          addRank = baseRank
        }
        const base = jsonData[No][v]["price"]
        const ItemListUerList = Object.keys(jsonData[No][v]["user"])
        ItemListUerList.map((y) => {
          addPrice += Number(base) * Number(jsonData[No][v]["user"][y]["count"])

        })
      })
      console.log(addPrice)
      updateOneData(`/item/${No}/circle`, "price", addPrice)
      updateOneData(`/item/${No}/circle`, "maxRank", addRank)

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
      fetchData(`/user/${session.displayName}`).then((result) => {
        setUserName(result.name);
      })
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
    const Name = session.displayName;
    const remarks = document.getElementById("remarks").value;
    const price = document.getElementById("price").value;

    const newItem = {
      productName: productName,
      editer: Name,
      rank: rank,
      remarks: remarks,
      price: price,
    };

    const userItem = {
      name: Name,
      count: count
    };


    const checkDataPN = async () => {
      const result = await fetchData(`/item/${No}/${productName}`);
      if (result == null) {
        return true
      }
      return false
    }
    const checkDataisUser = async () => {
      const result = await fetchData(`/item/${No}/${productName}/user/${Name}`);
      if (result == null) {
        return true
      }
      return false
    }

    const pushData = async () => {
      const chekc = await checkDataPN();
      const checkUser = await checkDataisUser();
      if (chekc === true) {
        addData(`/item/${No}/${productName}`, newItem);
        addData(`/item/${No}/${productName}/user/${Name}`, userItem);
        alert("新規購入物を追加しました")
      } else {
        if (checkUser === true) {
          addData(`/item/${No}/${productName}/user/${Name}`, userItem)
          if (jsonData[No][productName]["rank"] < rank) {
            updateOneData(`/item/${No}/${productName}`, "rank", rank)
          }
          alert("あなたの購入物に追加しました")
        } else {
          updateData(`/item/${No}/${productName}/user/${Name}`, userItem)
          if (jsonData[No][productName]["rank"] < rank) {
            updateOneData(`/item/${No}/${productName}`, "rank", rank)
          }
          alert("あなたの購入物情報を更新しました")
        }
      }


      location.reload()
    }




    pushData()

  };

  return (
    <>
      {session ? (
        <div>
          {Header()}
          <form onSubmit={handleSubmit}>
            <TextField variant="outlined" type="text" id="name" placeholder={session.displayName} value={userName} defaultValue={userName} /><br /><br /><br />
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
          {makeItemList(jsonData, No, null, null)}
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
