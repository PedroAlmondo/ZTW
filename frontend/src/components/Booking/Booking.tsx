import { Typography, Stack, Modal, Button, Avatar, ToggleButton, ToggleButtonGroup, ButtonBase, IconButton } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import React, { useState, useEffect } from 'react'
import Service from '../Service/Service'
import { plPL } from '@mui/x-date-pickers';
import 'dayjs/locale/pl';
import dayjs, { Dayjs } from 'dayjs';
import Hero from '../Hero/Hero';

interface ServiceData {
    id: number,
    name: string,
    durationMins: number,
    price: number,
}

function Booking() {
    const [servicesData, setServicesData] = useState<null | Array<ServiceData>>(null);
    const [servicesLoading, setServicesLoading] = useState(true);
    const [servicesError, setServicesError] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const [currentDate, setCurrentDate] = useState<null | Dayjs>(dayjs());
    const [timeSlotsData, setTimeSlotsData] = useState<null | Array<string>>(null);
    const [workersAvailability, setWorkersAvailability] = useState<null | Object>(null);
    const [currentServiceId, setCurrentServiceId] = useState<null | number>(null);
    const [timeOfDaySelection, setTimeOfDaySelection] = useState<null | string>('morning');
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<null | string>(null);
    const [availableWorkers, setAvailableWorkers] = useState<null | Array<string>>(null);

    const handleOpen = () => setModalOpen(true);
    const handleClose = () => setModalOpen(false);

    const appointmentOnClick = (id: number) => {
        setModalOpen(true);
        setCurrentServiceId(id);
        setCurrentDate(dayjs());
        fetch(`http://localhost:8080/api/v1/services/${id}/${currentDate?.format('YYYY-MM-DD')}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        `This is an HTTP error: The status is ${response.status}`
                    );
                }
                return response.json();
            })
            .then((actualData) => {
                setTimeSlotsData(actualData.freeHours);
                setWorkersAvailability(actualData.userFreeHours);
            })
            .catch((err) => {

            })
            .finally(() => {

            });
    }

    const dateChangeHandler = (newDate: null | Dayjs) => {
        setCurrentDate(newDate);
        setAvailableWorkers(null);
        fetch(`http://localhost:8080/api/v1/services/${currentServiceId}/${newDate?.format('YYYY-MM-DD')}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        `This is an HTTP error: The status is ${response.status}`
                    );
                }
                return response.json();
            })
            .then((actualData) => {
                setTimeSlotsData(actualData.freeHours);
            })
            .catch((err) => {

            })
            .finally(() => {

            });
    }

    const timeSlotChangeHandler = (newTimeSlot: string) => {
        const availableWorkers = [];
        setSelectedTimeSlot(newTimeSlot);
        for (const [key, value] of Object.entries(workersAvailability ?? {})) {
            if (value.includes(newTimeSlot)) {
                availableWorkers.push(key);
            }
        }
        setAvailableWorkers(availableWorkers);
    }

    useEffect(() => {
        fetch(`http://localhost:8080/api/v1/services`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        `This is an HTTP error: The status is ${response.status}`
                    );
                }
                return response.json();
            })
            .then((actualData) => {
                setServicesData(actualData);
                setServicesError(null);
            })
            .catch((err) => {
                setServicesError(err.message);
                setServicesData(null);
            })
            .finally(() => {
                setServicesLoading(false);
            });
    }, []);

    return (
        <>
            <Hero></Hero>
            <Stack sx={{ maxWidth: '1024px', margin: 'auto', minHeight: '100vh', padding: '40px 0px 40px 0px' }}>
                <Modal open={modalOpen} onClose={handleClose}>
                    <Stack direction='column' alignItems='center' sx={{
                        position: 'absolute' as 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '700px',
                        height: '97%',
                        outline: 'none',
                        bgcolor: 'background.paper',
                        borderRadius: '10px',
                    }}>
                        <Typography sx={{ fontSize: '24px', color: 'rgb(23, 23, 23)', fontWeight: 700, padding: '24px' }}>Umów wizytę</Typography>
                        <LocalizationProvider localeText={plPL.components.MuiLocalizationProvider.defaultProps.localeText} dateAdapter={AdapterDayjs} adapterLocale='pl'>
                            <DateCalendar views={['day']} defaultValue={dayjs()} value={currentDate} onChange={dateChangeHandler} />
                        </LocalizationProvider>
                        <ToggleButtonGroup
                            size='medium'
                            color="primary"
                            value={timeOfDaySelection}
                            exclusive
                            onChange={(event, timeOfDay) => setTimeOfDaySelection(timeOfDay)}
                            sx={{ marginBottom: '10px' }}
                        >
                            <ToggleButton value="morning">Rano</ToggleButton>
                            <ToggleButton value="afternoon">Popołudniu</ToggleButton>
                            <ToggleButton value="evening">Wieczorem</ToggleButton>
                        </ToggleButtonGroup>
                        {timeOfDaySelection == 'morning' && <Stack direction='row' flexWrap='wrap' alignContent={'start'} justifyContent={'center'} sx={{ padding: '10px', maxWidth: '600px', height: '150px' }}>{timeSlotsData?.filter(time => Number(time.split(':')[0]) > 0 && Number(time.split(':')[0]) < 12).map((timeSlot) => <Button variant='contained' onClick={() => timeSlotChangeHandler(timeSlot)} key={timeSlot} sx={{ marginTop: '4px', marginRight: '4px', width: '40px' }}>{timeSlot}</Button>)}</Stack>}
                        {timeOfDaySelection == 'afternoon' && <Stack direction='row' flexWrap='wrap' alignContent={'start'} justifyContent={'center'} sx={{ padding: '10px', maxWidth: '600px', height: '150px' }}>{timeSlotsData?.filter(time => Number(time.split(':')[0]) >= 12 && Number(time.split(':')[0]) < 16).map((timeSlot) => <Button variant='contained' onClick={() => timeSlotChangeHandler(timeSlot)} key={timeSlot} sx={{ marginTop: '4px', marginRight: '4px', width: '40px' }}>{timeSlot}</Button>)}</Stack>}
                        {timeOfDaySelection == 'evening' && <Stack direction='row' flexWrap='wrap' alignContent={'start'} justifyContent={'center'} sx={{ padding: '10px', maxWidth: '600px', height: '150px' }}>{timeSlotsData?.filter(time => Number(time.split(':')[0]) >= 16 && Number(time.split(':')[0]) < 24).map((timeSlot) => <Button variant='contained' onClick={() => timeSlotChangeHandler(timeSlot)} key={timeSlot} sx={{ marginTop: '4px', marginRight: '4px', width: '40px' }}>{timeSlot}</Button>)}</Stack>}
                        <Stack direction='row' spacing={2} flexWrap='wrap' justifyContent={'center'} sx={{ padding: '20px', maxWidth: '400px' }}>{availableWorkers && availableWorkers.map(worker => <IconButton><Avatar>{worker}</Avatar></IconButton>)}</Stack>
                        <Stack direction='row' spacing={2}><Button variant='contained' sx={{ marginBottom: '24px', height: '40px' }}>Anuluj</Button><Button variant='contained' sx={{ marginBottom: '24px', height: '40px' }}>Umów</Button></Stack>

                    </Stack>
                </Modal>
                <Typography sx={{ marginLeft: 'auto', marginRight: 'auto', fontSize: '40px', fontWeight: 700 }}>Nasze Usługi</Typography>
                {servicesData && servicesData.map(({ id, name, durationMins, price }) => <Service key={id} name={name} price={price} duration={durationMins} description='Description' onClick={() => appointmentOnClick(id)}></Service>)}
            </Stack>
        </>
    )
}

export default Booking