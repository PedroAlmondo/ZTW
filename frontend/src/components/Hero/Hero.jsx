import { Stack, Typography } from '@mui/material'
import herobg from '../../image/herobg.jpg'
import React from 'react'

function Hero() {
    return (
        <Stack justifyContent='center' alignItems='center' sx={{ height: '100vh', backgroundImage: `url(${herobg})`, backgroundSize: 'cover' }}>
            <Stack alignItems='center'><Typography sx={{ fontSize: '70px', color: 'white', fontWeight: 700 }}>BarberShop</Typography>
                <Typography sx={{ fontSize: '20px', color: 'white' }}>Cut...Shave...Style...</Typography></Stack>
        </Stack>
    )
}

export default Hero