import React from 'react'
import { Stack, Typography, TextField, Button, Snackbar, Alert } from '@mui/material'

function AddService() {
    const [serviceName, setServiceName] = React.useState('');
    const [serviceDescription, setServiceDescription] = React.useState('');
    const [servicePrice, setServicePrice] = React.useState<String | Number>(0);
    const [serviceDuration, setServiceDuration] = React.useState<String | Number>(15);

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


    const handleAddService = () => {
        fetch(`http://localhost:8080/api/v1/services`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: serviceName,
                description: serviceDescription,
                price: servicePrice,
                durationMins: serviceDuration
            })
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        `This is an HTTP error: The status is ${response.status}`
                    );
                }
                setOpen(true);
                return response.json();
            })
            .then((actualData) => {

            })
            .catch((err) => {
                setErrorOpen(true);
            })
            .finally(() => {

            });
    }

    return (
        <Stack sx={{ maxWidth: '1024px', margin: 'auto', minHeight: '100vh', padding: '40px' }}>
            <Typography sx={{ fontSize: '40px', fontWeight: 700, marginLeft: 'auto', marginRight: 'auto' }}>Dodaj usługę</Typography>
            <TextField
                label="Nazwa usługi"
                value={serviceName}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setServiceName(event.target.value);
                }}
                sx={{ margin: '20px 0px 10px 0px' }}
            />
            <TextField
                label="Opis usługi"
                value={serviceDescription}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setServiceDescription(event.target.value);
                }}
                sx={{ margin: '10px 0px 10px 0px' }}
            />
            <TextField
                label="Długość trwania usługi (w minutach)"
                type='number'
                value={serviceDuration}
                InputProps={{ inputProps: { min: 15, step: 15 } }}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setServiceDuration(event.target.value === '' ? '' : Number(event.target.value));
                }}
                sx={{ margin: '10px 0px 10px 0px' }}
            />
            <TextField
                label="Cena usługi"
                type='number'
                value={servicePrice}
                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setServicePrice(event.target.value === '' ? '' : Number(event.target.value));
                }}
                sx={{ margin: '10px 0px 10px 0px' }}
            />
            <Button variant="contained" onClick={() => handleAddService()} sx={{ width: '180px', margin: '10px auto 10px auto' }}>Dodaj</Button>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Pomyślnie dodano nową usługę!
                </Alert>
            </Snackbar>
            <Snackbar open={errorOpen} autoHideDuration={6000} onClose={handleErrorClose}>
                <Alert onClose={handleErrorClose} severity="error" sx={{ width: '100%' }}>
                    Wystąpił błąd podczas dodawania usługi!
                </Alert>
            </Snackbar>
        </Stack>)
}

export default AddService