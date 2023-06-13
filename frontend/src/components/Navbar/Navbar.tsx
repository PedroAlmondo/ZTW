import React, { Dispatch, SetStateAction, useState } from 'react'
import { AppBar, Box, Button, IconButton, Toolbar, Typography } from '@mui/material'
import { Link } from 'react-router-dom';

interface NavbarProps {
    userId: string | null,
    setUserId: Dispatch<SetStateAction<string | null>>
}

function Navbar(props: NavbarProps) {
    const handleLogout = () => {
        props.setUserId(null);
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userFirstName');
        localStorage.removeItem('userLastName');
        localStorage.removeItem('userRole');
    }

    return (
        <AppBar position="absolute" sx={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
            <Toolbar >
                <Link to='/'>
                    <Typography sx={{ fontSize: '24px', fontWeight: '700' }}>
                        BarberShop
                    </Typography>
                </Link>
                {props.userId && localStorage.getItem('userRole') === 'ADMIN' && <Link to='addservice'><Button variant='contained' sx={{}}>Dodaj usługę</Button></Link>}
                {props.userId && <Link to='visits'><Button variant='contained' sx={{}}>Przeglądaj wizyty</Button></Link>}
                {!props.userId && <Link to='login'><Button variant='contained' sx={{}}>Zaloguj</Button></Link>}
                {!props.userId && <Link to='register'><Button variant='contained' sx={{}}>Zarejestruj</Button></Link>}
                {props.userId && <Link to='login'><Button variant='contained' onClick={handleLogout}>Wyloguj</Button></Link>}
            </Toolbar>
        </AppBar>
    )
}

export default Navbar