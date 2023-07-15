import { useState, useEffect } from 'react';
import { Header } from "../../../materials/Header"
import { useRouter } from 'next/router';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import { Button, Grid } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { fetchData, addData, updateData, updateOneData } from "../../../../firebase/function"

export default function Profile() {
    const [userInfo, setUserInfo] = useState();
    const [userIcon, setUserIcon] = useState();
    const [session, setSession] = useState();
    const [publicName, setPublicName] = useState();
    const router = useRouter();
    const { name } = router.query;

    const style = {
        width: '100%',
        maxWidth: 360,
        bgcolor: 'background.paper',
    };

    const handleChangeName = (event) => {
        setPublicName(event.target.value);
    };
    const handleSubmitChangeName = (event) => {
        updateOneData(`/user/${name}`, "name", publicName)
        alert("公開する名前を変更しました")
        location.reload()

    }

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // ログイン済みの場合の処理
                setSession(user);
            } else {
                // ログアウト済みの場合の処理
            }
        });
    }, [])

    useEffect(() => {
        if (session) {
            fetchData(`/user/${name}`).then((result) => {
                setUserInfo(result);
            })

        }
    }, [session])

    useEffect(() => {
        // setUserIcon(userInfo["icon"])
        if (session) {
            if (userInfo) {
                setUserIcon(userInfo.photoURL)
            }
        }

    }, [userInfo])


    return (
        <>
            {session ? (<>

                {userInfo ? (
                    <>
                        {Header()}
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Avatar src={userIcon} alt="Avatar" sx={{ width: 100, height: 100 }} />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <h1>ようこそ {userInfo.name} さん</h1>
                        </Box>
                        <Grid container justifyContent="center">
                            <Grid item xs={2}>
                                <List sx={style} component="nav" aria-label="mailbox folders">
                                    <ListItem button>
                                        <ListItemText primary="Inbox" />
                                    </ListItem>
                                    <Divider />
                                    <ListItem button divider>
                                        <ListItemText primary="Drafts" />
                                    </ListItem>
                                    <ListItem button>
                                        <ListItemText primary="Trash" />
                                    </ListItem>
                                    <Divider light />
                                    <ListItem button>
                                        <ListItemText primary="Spam" />
                                    </ListItem>
                                </List>
                            </Grid>
                            <Grid item xs={5}>
                                <TextField
                                    label="固有名"
                                    id="Sname"
                                    value={session.displayName}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={5}>
                                <form onSubmit={handleSubmitChangeName}>
                                    <TextField
                                        label="表示名"
                                        id="Sname"
                                        defaultValue={userInfo.name}
                                        onChange={handleChangeName}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                    <Button type="submit" variant="contained" endIcon={<SendIcon />}>変更</Button>
                                </form>
                            </Grid>

                        </Grid>
                    </>
                ) : (
                    <>
                        {Header()}
                    </>
                )}


            </>
            ) : (
                <>

                    {Header()}
                </>
            )}


        </>
    );
}
