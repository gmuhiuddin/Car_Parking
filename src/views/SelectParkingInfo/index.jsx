import React, { useState, useEffect } from 'react';
import { getBookedTime, makeAppointment } from '../../config/firebase.jsx';
import Map from '../../components/Map/index.jsx';
import './style.css';

function SelecedParkingInfo() {
    const [times, setTimes] = useState([]);
    const [reservationLocation, setreservationLocation] = useState();
    const [reservationDate, setReservationDate] = useState();
    const [reservationTime, setReservationTime] = useState();

    const date = new Date();

    const todayDate = `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? 0 + String(date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate() < 10 ? 0 + String(date.getDate()) : date.getDate()}`;

    useEffect(() => {
        checkBookedTime();
    }, [reservationLocation, reservationDate]);

    async function checkBookedTime() {

        const dateObj = new Date(reservationDate);

        const date = `${dateObj.getFullYear()}-${dateObj.getMonth() + 1 < 10 ? 0 + String(dateObj.getMonth() + 1) : dateObj.getMonth() + 1}-${dateObj.getDate() < 10 ? 0 + String(dateObj.getDate()) : dateObj.getDate()}`;

        date != todayDate && dateObj.setHours(0);

        const arr = [{ time: "00-00 01-00" }, { time: "01-00 02-00" }, { time: "02-00 03-00" }, { time: "03-00 04-00" }, { time: "04-00 05-00" }, { time: "05-00 06-00" }, { time: "06-00 07-00" }, { time: "07-00 08-00" }, { time: "08-00 09-00" }, { time: "9-00 10-00" }, { time: "10-00 11-00" }, { time: "11-00 12-00" }, { time: "12-00 13-00" }, { time: "13-00 14-00" }, { time: "14-00 15-00" }, { time: "15-00 16-00" }, { time: "16-00 17-00" }, { time: "17-00 18-00" }, { time: "18-00 19-00" }, { time: "19-00 20-00" }, { time: "20-00 21-00" }, { time: "21-00 22-00" }, { time: "22-00 23-00" }, { time: "23-00 24-00" }];

        const timeArr = arr.slice(dateObj.getHours());

        const selectedTimeArr = await getBookedTime(date, reservationLocation);

        timeArr.forEach(element => {
            element.booked = 0;
        });

        selectedTimeArr.forEach(SelecedTimeElement => {
            timeArr.forEach(timeElement => {
                if (timeElement.time == SelecedTimeElement) {
                    timeElement.booked = timeElement.booked + 1;
                }
            })
        });

        setTimes(timeArr);
    };

    const handleReservationLocation = (e) => {
        setreservationLocation(e.target.id);
    };

    const handleReservationDate = (e) => {
        setReservationDate(e.target.value);
    };

    const handleReservationTime = (e) => {
        setReservationTime(e.target.value);
    };
    
    const handleBookReservation = async () => {
        if (reservationDate && reservationLocation && reservationTime) {

            const timeObj = times.filter(element => element.time == reservationTime);

            if (timeObj[0].booked < 5) {

                try {
                    await makeAppointment(uid, email, reservationDate, reservationTime, reservationLocation, timeObj[0].booked + 1);
                } catch (err) {
                    alert(err.message);
                    document.location.reload();
                }

            } else {
                alert("Some thing went wrong");
                document.location.reload();
            };
        };
    };

    return (
        <div className='select-park-info-container'>
            <div className="select-location-container">
                <div>
                    <input onChange={handleReservationLocation} required id='gulshan-e-iqbal' name='location' type='radio' />
                    <label htmlFor='gulshan-e-iqbal'><Map longitude={67.106765} latitude={24.9224938} /></label>

                    <a target='_blank' href="https://www.google.com/maps/search/?api=1&query=24.9224938,67.106765 "><button>get direction</button></a>
                </div>
                <div>
                    <input onChange={handleReservationLocation} required type='radio' id='saddar' name='location' />

                    <label htmlFor='saddar'><Map longitude={67.0190137} latitude={24.8587964} /></label>

                    <a target='_blank' href="https://www.google.com/maps/search/?api=1&query=24.8587964,67.0190137"><button>get direction</button></a>
                </div>
                <div>
                    <input onChange={handleReservationLocation} required type='radio' id='gurumandir' name='location' />

                    <label htmlFor='gurumandir'><Map longitude={67.106765} latitude={24.9224938} /></label>
                    <a target='_blank' href="https://www.google.com/maps/search/?api=1&query=24.9224938,67.106765 "><button>get direction</button></a>
                </div>
            </div>
            <div className="select-data-container">
                <input disabled={reservationLocation ? false : true} onChange={handleReservationDate} required type="date" min={todayDate} />
            </div >
            <div className="select-time-contianer">
                {times.map((element, timeIndex) => {
                    return (
                        <span key={`input-${timeIndex}`}>
                            <input onChange={handleReservationTime} value={element.time} required disabled={reservationLocation && reservationDate ? element.booked >= 5 && true : true} id={`input-${timeIndex}`} name='time' type='radio' />
                            <label htmlFor={`input-${timeIndex}`}>{element.time}</label>
                        </span>
                    );
                })}
            </div>
            <button onClick={handleBookReservation}>Book reservation</button>
        </div >
    );
};

export default SelecedParkingInfo;