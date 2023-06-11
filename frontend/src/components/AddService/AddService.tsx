import React from 'react'
import { Stack, Typography, TextField, Button } from '@mui/material'

function AddService() {
    const [serviceName, setServiceName] = React.useState('');
    const [serviceDescription, setServiceDescription] = React.useState('');
    const [servicePrice, setServicePrice] = React.useState<String | Number>(0);
    const [serviceDuration, setServiceDuration] = React.useState<String | Number>(15);



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
                label="Długość trwania usługi"
                type='number'
                value={serviceDuration}
                InputProps={{ inputProps: { min: 15, step: 15 } }}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setServiceDuration(event.target.value === '' ? '' : Number(event.target.value));
                    console.log(typeof (event.target.value));
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
            <Button variant="contained" onClick={() => handleAddService()} sx={{ width: '180px', margin: '10px auto 10px auto' }}>Zarejestruj się</Button>
        </Stack>)
}

export default AddService