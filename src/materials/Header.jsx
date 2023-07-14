import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import { useRouter } from 'next/router';
import style from "../pages/style/header.module.css";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

export const Header = () => {
    const [anchorElUser, setAnchorElUser] = useState();
    const router = useRouter();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [session, setSession] = useState();

    const handleOpenItemList = () => {
        location.href = '/ComicMarket/itemList';
    };



    const handleOpenAddItem = () => {
        location.href = '/ComicMarket/addItem';
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleProfile = () => {
        router.push(`/ComicMarket/profile/${session.displayName}`);
    };

    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const settings = ['Account', 'Dashboard'];

    useEffect(() => {
        // Firebaseを初期化

        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // ログイン済みの場合の処理
                setSession(user);
                const { uid, displayName, email, photoURL } = user;
                console.log('ユーザーID:', uid);
                console.log('表示名:', displayName);
                console.log('メールアドレス:', email);
                console.log("icon", photoURL)
            } else {
                // ログアウト済みの場合の処理
            }
        });
    }, []);
    useEffect(() => {
        if (session) {
            fetch(`/api/getUserInfo?type=search&name=${session.displayName}`)
                .then(response => response.json())
                .then(data => {
                    if (data["error"]) {
                        const newItem = {
                            name: session.displayName,
                            email: session.email,
                            role: "member",
                            icon: session.photoURL
                        };

                        // JSONデータをファイルに書き込む
                        fetch('/api/signup', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(newItem), // newItemをJSON文字列に変換する
                        })
                            .then(response => {
                                if (response.ok) {
                                    console.log('JSONファイルの書き込みが成功しました');
                                    alert("新規登録完了しました。ようこそコミケ管理サーバーへ\n" + session.user.name + "さん");
                                    location.reload();
                                } else {
                                    console.error('JSONファイルの書き込みエラー:', response.status);
                                }
                            })
                            .catch(error => {
                                console.error('JSONファイルの書き込みエラー:', error);
                            });
                    } else {
                    }
                })
                .catch(error => {
                    console.error(error);
                });
        } else {
            console.log("no session")
        }

    }, [session])

    return (
        <>
            <div className={style.divHeader}>
                <Box sx={{ flexGrow: 1 }}>
                    <AppBar position="static">
                        <Toolbar sx={{ justifyContent: 'space-between' }}>
                            <Box>
                                <IconButton
                                    size="large"
                                    edge="start"
                                    color="inherit"
                                    aria-label="menu"
                                    sx={{ mr: 2 }}
                                    onClick={handleMenuToggle}
                                >
                                    <MenuIcon />
                                </IconButton>
                                <Menu
                                    sx={{
                                        mt: '45px',
                                        left: 0,
                                        top: 0,
                                        width: '100%',
                                        maxWidth: '400px',
                                        maxHeight: '100vh',
                                        position: 'absolute',
                                    }}
                                    id="menu-appbar"
                                    anchorEl={isMenuOpen}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                    keepMounted
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'left',
                                    }}
                                    open={Boolean(isMenuOpen)}
                                    onClose={handleMenuToggle}
                                >
                                    {settings.map((setting) => (
                                        <MenuItem key={setting} onClick={handleMenuToggle}>
                                            <Typography textAlign="center">{setting}</Typography>
                                        </MenuItem>
                                    ))}
                                    <MenuItem key="profile" onClick={handleProfile}>
                                        <Typography textAlign="center">Profile</Typography>
                                    </MenuItem>
                                    <MenuItem key="logout" onClick={() => signOut()}>
                                        <Typography textAlign="center">LogOut</Typography>
                                    </MenuItem>
                                </Menu>
                                <Button color="inherit" onClick={handleOpenAddItem}>サークル追加</Button>
                                <Button color="inherit" onClick={handleOpenItemList}>購入物一覧</Button>
                            </Box>
                            {session ? (
                                <Box sx={{ flexGrow: 0 }}>
                                    <Tooltip title="Open settings">
                                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                            <Avatar alt="Remy Sharp" src={session.user.image} />
                                        </IconButton>
                                    </Tooltip>
                                    <Menu
                                        sx={{ mt: '45px' }}
                                        id="menu-appbar"
                                        anchorEl={anchorElUser}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        open={Boolean(anchorElUser)}
                                        onClose={handleCloseUserMenu}
                                    >
                                        {settings.map((setting) => (
                                            <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                                <Typography textAlign="center">{setting}</Typography>
                                            </MenuItem>
                                        ))}
                                        <MenuItem key="profile" onClick={handleProfile}>
                                            <Typography textAlign="center">Profile</Typography>
                                        </MenuItem>
                                        <MenuItem key="logout" onClick={() => signOut()}>
                                            <Typography textAlign="center">LogOut</Typography>
                                        </MenuItem>
                                    </Menu>
                                </Box>
                            ) : (
                                <Button color="inherit" onClick={() => signIn()}>Login</Button>
                            )}
                        </Toolbar>
                    </AppBar>
                </Box><br></br><br></br>
            </div>
        </>
    );
};
