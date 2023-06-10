import { Stack, Typography, TextField, Button } from '@mui/material'
import React from 'react'

function Register() {
    const [firstName, setFirstName] = React.useState('');
    const [lastName, setLastName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

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
                return response.json();
            })
            .then((actualData) => {
                console.log(actualData);
            })
            .catch((err) => {

            })
            .finally(() => {

            });
    }

    return (
        <Stack sx={{ maxWidth: '1024px', margin: 'auto', minHeight: '100vh', padding: '40px 0px 40px 0px' }}>
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
        </Stack>
    )
}

export default Register