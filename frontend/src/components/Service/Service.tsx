import React from 'react'
import { Stack, Typography, Button } from '@mui/material'


interface ServiceProps {
    name: string,
    price: number,
    duration: number,
    description: string,
    onClick: () => void,
}

function Service(props: ServiceProps) {
    return (
        <Stack direction='row' justifyContent='space-between' sx={{ padding: '14px 0px 14px 0px', borderBottom: '1px solid #EBEBEB' }}>
            <Stack direction='column'>
                <Typography sx={{ color: '#383734', lineHeight: '20px', marginBottom: '5px', fontWeight: 700 }}>{props.name}</Typography>
                <Typography sx={{ color: 'hsla(0,0%,9%,.7)', marginBottom: '4px', fontSize: '14px' }}>{props.description}</Typography>
            </Stack>
            <Stack direction='row' alignItems='center' justifyContent='space-between' spacing='4px' sx={{ width: '150px' }}>
                <Stack direction='column' sx={{ width: '80px' }} >
                    <Typography sx={{ fontSize: '14px', color: '#383734' }}>{props.price} zł</Typography>
                    <Typography sx={{ fontSize: '12px', color: '#a9a9a9' }}>{props.duration} min</Typography>
                </Stack>
                <Button variant='contained' onClick={props.onClick} sx={{ backgroundColor: 'rgb(33, 140, 172)', width: '100px', ':hover': { backgroundColor: 'rgb(33, 140, 172)' } }}>Umów</Button>
            </Stack>
        </Stack>
    )
}

export default Service