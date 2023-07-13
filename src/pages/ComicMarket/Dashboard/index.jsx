import { signOut, useSession } from 'next-auth/react';
import { Header } from "../../../materials/Header";
import { makeItemList } from "../../../materials/makeItemList";
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';

export default function dashbord() {


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
