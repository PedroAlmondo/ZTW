import { Typography, Stack, Modal, Button, Avatar, ToggleButton, ToggleButtonGroup, IconButton, Tooltip, Snackbar, Alert } from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import React, { useState, useEffect } from 'react'
import Service from '../Service/Service'
import { plPL } from '@mui/x-date-pickers';
import 'dayjs/locale/pl';
import dayjs, { Dayjs } from 'dayjs';

interface ServiceData {
    id: number,
    name: string,
    durationMins: number,
    price: number,
    description: string,
}

interface Worker {
    id: number,
    firstName: string,
    lastName: string,
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
    const [workers, setWorkers] = useState<null | Array<Worker>>(null);
    const [selectedWorker, setSelectedWorker] = useState<null | number>(null);

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [errorOpen, setErrorOpen] = useState(false);

    const handleClose = () => {
        setModalOpen(false)
        setSelectedTimeSlot(null)
        setSelectedWorker(null)
        setAvailableWorkers(null)
    };

    const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setSnackbarOpen(false);
    };

    const handleErrorClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setErrorOpen(false);
    };

    const appointmentOnClick = (id: number) => {
        if (localStorage.getItem('userRole') === 'USER') {
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

            fetch(`http://localhost:8080/api/v1/users/workers`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(
                            `This is an HTTP error: The status is ${response.status}`
                        );
                    }
                    return response.json();
                })
                .then((actualData) => {
                    setWorkers(actualData);
                    console.log(actualData)
                })
                .catch((err) => {

                })
                .finally(() => {

                });
        } else {
            fetch(`http://localhost:8080/api/v1/services/${id}`, {
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
                    setServicesData(servicesData?.filter(service => service.id !== id) ?? []);
                    setSnackbarOpen(true);
                })
                .catch((err) => {
                    setErrorOpen(true);
                })
                .finally(() => {

                });
        }
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
        setSelectedWorker(null);
        setSelectedTimeSlot(newTimeSlot);
        for (const [key, value] of Object.entries(workersAvailability ?? {})) {
            if (value.includes(newTimeSlot)) {
                availableWorkers.push(key);
            }
        }
        setAvailableWorkers(availableWorkers);
    }

    const workerChoiceHandler = (workerId: number | null) => {
        setSelectedWorker(workerId);
    }

    const submitHandler = () => {
        fetch(`http://localhost:8080/api/v1/visits`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                client: { id: localStorage.getItem('userId') },
                employee: { id: selectedWorker },
                service: { id: currentServiceId },
                startTime: `${currentDate?.format('YYYY-MM-DD')}T${selectedTimeSlot}`,
            })
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        `This is an HTTP error: The status is ${response.status}`
                    );
                }
                setSnackbarOpen(true);
                return response.json();
            })
            .then((actualData) => {

            })
            .catch((err) => {
                setErrorOpen(true);
            })
            .finally(() => {

            });

        handleClose();
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
            <Stack sx={{ maxWidth: '1024px', margin: 'auto', minHeight: '100vh', padding: '40px' }}>
                <Modal open={modalOpen} onClose={handleClose}>
                    <Stack direction='column'
                        justifyContent='space-between'
                        sx={{
                            position: 'absolute' as 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '700px',
                            height: '97%',
                            outline: 'none',
                            bgcolor: 'background.paper',
                            borderRadius: '10px',
                            overflow: 'auto'
                        }}>
                        <Stack alignItems='center' justifyContent='center'>
                            <Typography sx={{ fontSize: '24px', color: 'rgb(23, 23, 23)', fontWeight: 700, padding: '24px' }}>Umów wizytę</Typography>
                            <LocalizationProvider localeText={plPL.components.MuiLocalizationProvider.defaultProps.localeText} dateAdapter={AdapterDayjs} adapterLocale='pl'>
                                <DateCalendar disablePast views={['day']} defaultValue={dayjs()} value={currentDate} onChange={dateChangeHandler} />
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
                            {timeOfDaySelection === 'morning' && <Stack direction='row' flexWrap='wrap' alignContent={'start'} justifyContent={'center'} sx={{ padding: '10px', maxWidth: '600px', height: '120px' }}>{timeSlotsData?.filter(time => Number(time.split(':')[0]) > 0 && Number(time.split(':')[0]) < 12).map((timeSlot) => <Button variant={selectedTimeSlot === timeSlot ? 'contained' : 'outlined'} onClick={() => timeSlotChangeHandler(timeSlot)} key={timeSlot} sx={{ marginTop: '4px', marginRight: '4px', width: '40px' }}>{timeSlot}</Button>)}</Stack>}
                            {timeOfDaySelection === 'afternoon' && <Stack direction='row' flexWrap='wrap' alignContent={'start'} justifyContent={'center'} sx={{ padding: '10px', maxWidth: '600px', height: '120px' }}>{timeSlotsData?.filter(time => Number(time.split(':')[0]) >= 12 && Number(time.split(':')[0]) < 16).map((timeSlot) => <Button variant={selectedTimeSlot === timeSlot ? 'contained' : 'outlined'} onClick={() => timeSlotChangeHandler(timeSlot)} key={timeSlot} sx={{ marginTop: '4px', marginRight: '4px', width: '40px' }}>{timeSlot}</Button>)}</Stack>}
                            {timeOfDaySelection === 'evening' && <Stack direction='row' flexWrap='wrap' alignContent={'start'} justifyContent={'center'} sx={{ padding: '10px', maxWidth: '600px', height: '120px' }}>{timeSlotsData?.filter(time => Number(time.split(':')[0]) >= 16 && Number(time.split(':')[0]) < 24).map((timeSlot) => <Button variant={selectedTimeSlot === timeSlot ? 'contained' : 'outlined'} onClick={() => timeSlotChangeHandler(timeSlot)} key={timeSlot} sx={{ marginTop: '4px', marginRight: '4px', width: '40px' }}>{timeSlot}</Button>)}</Stack>}
                            <Stack direction='row' spacing={2} flexWrap='wrap' justifyContent={'center'} sx={{ maxWidth: '400px', marginBottom: '20px' }}>{availableWorkers && availableWorkers.map(availableWorker => {
                                const currentWorker = workers?.find(worker => worker.id === Number(availableWorker))
                                return <Tooltip key={currentWorker?.id} title={`${currentWorker?.firstName} ${currentWorker?.lastName}`} arrow><IconButton onClick={() => workerChoiceHandler(currentWorker ? currentWorker.id : null)} ><Avatar sx={{ backgroundColor: selectedWorker === currentWorker?.id ? '#1565C0' : '#94c1f3' }}>{currentWorker?.firstName[0].toUpperCase()}{currentWorker?.lastName[0].toUpperCase()}</Avatar></IconButton></Tooltip>
                            })}</Stack>
                        </Stack>
                        <Stack justifyContent='center' direction='row' spacing={2}><Button variant='contained' onClick={() => handleClose()} sx={{ marginBottom: '24px', height: '40px' }}>Anuluj</Button><Button variant='contained' onClick={() => submitHandler()} sx={{ marginBottom: '24px', height: '40px' }}>Umów</Button></Stack>

                    </Stack>
                </Modal>
                <Typography sx={{ marginLeft: 'auto', marginRight: 'auto', fontSize: '40px', fontWeight: 700 }}>Nasze usługi</Typography>
                {servicesData && servicesData.map(({ id, name, durationMins, price, description }) => <Service key={id} name={name} price={price} duration={durationMins} description={description} onClick={() => appointmentOnClick(id)}></Service>)}
            </Stack>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    {localStorage.getItem('userRole') === 'USER' ? 'Pomyślnie umówiono wizytę!' : 'Pomyślnie usunięto usługę!'}
                </Alert>
            </Snackbar>
            <Snackbar open={errorOpen} autoHideDuration={6000} onClose={handleErrorClose}>
                <Alert onClose={handleErrorClose} severity="error" sx={{ width: '100%' }}>
                    {localStorage.getItem('userRole') === 'USER' ? 'Wystąpił błąd podczas umawiania wizyty!' : 'Wystąpił błąd podczas usuwania usługi!'}
                </Alert>
            </Snackbar>
        </>
    )
}

export default Booking