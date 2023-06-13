import { Stack, Typography, TextField, Button, Snackbar, Alert } from '@mui/material'
import React from 'react'

function Register() {
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const [open, setOpen] = React.useState(false);
    const [errorOpen, setErrorOpen] = React.useState(false);

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const handleErrorClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setErrorOpen(false);
    };

    const handleRegistration = () => {
        fetch(`http://localhost:8080/api/v1/registration`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: password
            })
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        `This is an HTTP error: The status is ${response.status}`
                    );
                }
                setOpen(true);
            })
            .catch((err) => {
                console.log(err.message)
                setErrorOpen(true);
            })
            .finally(() => {

            });
    }

    return (
        <Stack sx={{ maxWidth: '1024px', margin: 'auto', minHeight: '100vh', padding: '40px' }}>
            <Typography sx={{ fontSize: '40px', fontWeight: 700, marginLeft: 'auto', marginRight: 'auto' }}>Zarejestruj się</Typography>
            <TextField
                label="Imię"
                value={firstName}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setFirstName(event.target.value);
                }}
                sx={{ margin: '20px 0px 10px 0px' }}
            />
            <TextField
                label="Nazwisko"
                value={lastName}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setLastName(event.target.value);
                }}
                sx={{ margin: '10px 0px 10px 0px' }}
            />
            <TextField
                label="Email"
                value={email}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setEmail(event.target.value);
                }}
                sx={{ margin: '10px 0px 10px 0px' }}
            />
            <TextField
                label="Hasło"
                type='password'
                value={password}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setPassword(event.target.value);
                }}
                sx={{ margin: '10px 0px 10px 0px' }}
            />
            <Button variant="contained" onClick={() => handleRegistration()} sx={{ width: '180px', margin: '10px auto 10px auto' }}>Zarejestruj się</Button>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Rejestracja przebiegła pomyślnie!
                </Alert>
            </Snackbar>
            <Snackbar open={errorOpen} autoHideDuration={6000} onClose={handleErrorClose}>
                <Alert onClose={handleErrorClose} severity="error" sx={{ width: '100%' }}>
                    Wystąpił błąd podczas rejestracji!
                </Alert>
            </Snackbar>
        </Stack>
    )
}

export default Register