import React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { Header } from "../materials/Header"

const Login = () => {
    const { data: session } = useSession();

    return (
        <>
            {Header}
        </>
    );
};

export default Login;
