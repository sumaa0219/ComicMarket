import { useState, useEffect } from 'react';
import { Header } from "../../../materials/Header"
import { useSession } from 'next-auth/react';
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

export default function Profile() {
    const [userInfo, setUserInfo] = useState();
    const [userIcon, setUserIcon] = useState();
    const { data: session } = useSession();
    const [publicName, setPublicName] = useState();

    const style = {
        width: '100%',
        maxWidth: 360,
        bgcolor: 'background.paper',
    };

    const handleChangeName = (event) => {
        setPublicName(event.target.value);
    };
    const handleSubmitChangeName = (event) => {
        fetch(`/api/getUserInfo?type=changeUserName&name=${session.user.name}&editName=${publicName}`)
        location.reload()

    }

    useEffect(() => {
        if (session) {
            fetch(`/api/getUserInfo?type=userInfo&name=${session.user.name}`)
                .then(response => response.json())
                .then(data => {
                    setUserInfo(data)
                })
        }
    }, [session])

    useEffect(() => {
        // setUserIcon(userInfo["icon"])
        if (session) {
            if (userInfo) {
                setUserIcon(userInfo.icon)
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
                                    value={session.user.name}
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
