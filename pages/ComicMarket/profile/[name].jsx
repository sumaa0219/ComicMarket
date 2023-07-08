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
import { Button, Grid } from '@mui/material';

export default function Profile() {
    const [userInfo, setUserInfo] = useState();
    const [userIcon, setUserIcon] = useState();
    const { data: session } = useSession();

    const style = {
        width: '100%',
        maxWidth: 360,
        bgcolor: 'background.paper',
    };

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
                                <h1>ようこそ {userInfo.name} さん</h1>
                            </Grid>
                            <Grid item xs={5}>
                                <h1>ようこそ {userInfo.name} さん</h1>
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
