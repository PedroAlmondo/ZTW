import React from 'react'
import { useEffect, useState } from 'react';
import { Stack, Typography, Button, Snackbar, Alert } from '@mui/material'

interface Employee {
    firstName: string,
    lastName: string,
}

interface Client {
    firstName: string,
    lastName: string,
}

interface Service {
    name: string,
    price: number,
    durationMins: number,
    description: string,
}

interface Visit {
    id: number,
    startTime: string,
    employee: Employee,
    service: Service,
    client: Client,
}

function Visits() {
    const [visits, setVisits] = useState<Array<Visit>>([]);

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

    const handleCancel = (id: number) => {
        fetch(`http://localhost:8080/api/v1/visits/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        `This is an HTTP error: The status is ${response.status}`
                    );
                }
                setVisits(visits.filter(visit => visit.id !== id));
                setOpen(true);
            })
            .catch((err) => {
                console.log(err.message);
                setErrorOpen(true);
            })
            .finally(() => {

            });


    }

    useEffect(() => {
        fetch(`http://localhost:8080/api/v1/visits/${localStorage.getItem('userRole') === 'USER' ? 'clients' : 'employees'}/${localStorage.getItem('userId')}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        `This is an HTTP error: The status is ${response.status}`
                    );
                }
                return response.json();
            })
            .then((actualData) => {
                setVisits(actualData);
            })
            .catch((err) => {

            })
            .finally(() => {

            });
    }, []);

    return (
        <Stack sx={{ maxWidth: '1024px', margin: 'auto', minHeight: '100vh', padding: '40px' }}>
            <Typography sx={{ marginLeft: 'auto', marginRight: 'auto', fontSize: '40px', fontWeight: 700 }}>Twoje wizyty</Typography>
            {visits.map(visit => <Stack key={visit.id} direction='row' justifyContent='space-between' sx={{ padding: '14px 0px 14px 0px', borderBottom: '1px solid #EBEBEB' }}>
                <Stack direction='column'>
                    <Typography sx={{ color: '#383734', lineHeight: '20px', marginBottom: '5px', fontWeight: 700 }}>{visit.service.name} - {localStorage.getItem('userRole') === 'USER' ? visit.employee.firstName : visit.client.firstName} {localStorage.getItem('userRole') === 'USER' ? visit.employee.lastName : visit.client.lastName}</Typography>
                    <Typography sx={{ color: 'hsla(0,0%,9%,.7)', marginBottom: '4px', fontSize: '14px' }}>{visit.startTime.split('T')[0]} {visit.startTime.split('T')[1].split(':')[0]}:{visit.startTime.split('T')[1].split(':')[1]}</Typography>
                </Stack>
                <Stack direction='row' alignItems='center' justifyContent='space-between' spacing='4px' sx={{ width: '150px' }}>
                    <Stack direction='column' sx={{ width: '80px' }} >
                        <Typography sx={{ fontSize: '14px', color: '#383734' }}>{visit.service.price} zł</Typography>
                        <Typography sx={{ fontSize: '12px', color: '#a9a9a9' }}>{visit.service.durationMins} min</Typography>
                    </Stack>
                    <Button variant='contained' onClick={() => handleCancel(visit.id)} sx={{ width: '100px' }}>Odwołaj</Button>
                </Stack>
            </Stack>)}
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    Pomyślnie odwołano wizytę!
                </Alert>
            </Snackbar>
            <Snackbar open={errorOpen} autoHideDuration={6000} onClose={handleErrorClose}>
                <Alert onClose={handleErrorClose} severity="error" sx={{ width: '100%' }}>
                    Wystąpił błąd podczas odwoływania wizyty!
                </Alert>
            </Snackbar>
        </Stack>
    )
}

export default Visits