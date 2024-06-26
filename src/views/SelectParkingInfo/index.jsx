import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";
import Swal from "sweetalert2";
import {
    getBookedTime,
    makeAppointment,
    dateObjToDateInString,
    getRealTimeBookedTime,
} from "../../config/firebase.jsx";
import Map from "../../components/Map/index.jsx";
import "./style.css";

function SelecedParkingInfo() {
    const [times, setTimes] = useState([]);
    const [reservationLocation, setreservationLocation] = useState();
    const [reservationDate, setReservationDate] = useState();
    const [reservationTime, setReservationTime] = useState();
    const res = useSelector((res) => res.userInfo.user);

    const btnRef = useRef(null);
    const navigate = useNavigate();

    const todayDateObj = new Date();

    const todayDate = dateObjToDateInString(todayDateObj);

    const maxDateForReserveObj = new Date();

    maxDateForReserveObj.setDate(maxDateForReserveObj.getDate() + 5);

    const maxDateForReserve = dateObjToDateInString(maxDateForReserveObj);

    useEffect(() => {
        checkBookedTime();
    }, [reservationLocation, reservationDate]);

    async function checkBookedTime() {
        const dateObj = new Date(reservationDate || Date.now());

        if (reservationDate) {
            reservationDate == todayDate
                ? dateObj.setHours(todayDateObj.getHours())
                : dateObj.setHours(0);
        }

        const date = dateObjToDateInString(dateObj);

        // const timeArr = arr.slice(dateObj.getHours());

        // const selectedTimeArr = await getBookedTime(date ? date : todayDate, reservationLocation);
        getRealTimeBookedTime(date, reservationLocation, dateObj, setTimes);

        // timeArr.forEach(element => {
        //     element.booked = 0;
        // });

        // selectedTimeArr.forEach(SelecedTimeElement => {
        //     timeArr.forEach(timeElement => {
        //         if (timeElement.time == SelecedTimeElement) {
        //             timeElement.booked = timeElement.booked + 1;
        //         }
        //     })
        // });

        // setTimes(timeArr);
    }

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
        btnRef.current.disabled = true;

        const timeArr = [
            { time: "00-00 01-00" },
            { time: "01-00 02-00" },
            { time: "02-00 03-00" },
            { time: "03-00 04-00" },
            { time: "04-00 05-00" },
            { time: "05-00 06-00" },
            { time: "06-00 07-00" },
            { time: "07-00 08-00" },
            { time: "08-00 09-00" },
            { time: "09-00 10-00" },
            { time: "10-00 11-00" },
            { time: "11-00 12-00" },
            { time: "12-00 13-00" },
            { time: "13-00 14-00" },
            { time: "14-00 15-00" },
            { time: "15-00 16-00" },
            { time: "16-00 17-00" },
            { time: "17-00 18-00" },
            { time: "18-00 19-00" },
            { time: "19-00 20-00" },
            { time: "20-00 21-00" },
            { time: "21-00 22-00" },
            { time: "22-00 23-00" },
            { time: "23-00 24-00" },
        ];

        if (reservationDate && reservationLocation && reservationTime) {
            const dateObj = new Date(reservationDate);
            const timeIndex = timeArr.findIndex((obj) => obj.time == reservationTime);
            dateObj.setHours(timeIndex);
            dateObj.setMinutes(59);

            const timeObj = times.filter(
                (element) => element.time == reservationTime
            );

            if (timeObj[0].booked < 5) {
                try {
                    const ticketNum = await makeAppointment(
                        res.uid,
                        res.email,
                        dateObj,
                        reservationTime,
                        reservationLocation,
                        timeObj[0].booked + 1
                    );

                    btnRef.current.disabled = false;

                    Swal.fire({
                        title: "Parking Ticket",
                        text: `Your parking ticket no: ${ticketNum}`,
                        icon: "success",
                        confirmButtonText: "Ok",
                    }).then((result) => {
                        navigate("/");
                    });
                } catch (err) {
                    alert(err.message);
                    navigate("/selectparkinfo");
                    btnRef.current.disabled = false;
                }
            } else {
                alert("Parking was full");
                btnRef.current.disabled = false;
                navigate("/selectparkinfo");
            }
        } else {
            btnRef.current.disabled = false;
            alert("Please fill al the fields");
            navigate("/selectparkinfo");
        }
    };

    return (
        <div className="select-park-info-container">
            <span onClick={() => navigate("/")}>
                <BsArrowLeft size={29} />
            </span>
            <div className="select-date-time-container">
                <div className="select-data-container">
                    <input
                        disabled={reservationLocation ? false : true}
                        onChange={handleReservationDate}
                        required
                        type="date"
                        min={todayDate}
                        max={maxDateForReserve}
                    />
                </div>
                <div className="select-time-contianer">
                    {times.map((element, timeIndex) => {
                        return (
                            <span key={`input-${timeIndex}`}>
                                <input
                                    onChange={handleReservationTime}
                                    value={element.time}
                                    required
                                    disabled={
                                        reservationLocation && reservationDate
                                            ? element.booked >= 5 && true
                                            : true
                                    }
                                    id={`input-${timeIndex}`}
                                    name="time"
                                    type="radio"
                                />
                                <label htmlFor={`input-${timeIndex}`}>{element.time}</label>
                            </span>
                        );
                    })}
                </div>
                <button onClick={handleBookReservation} ref={btnRef}>
                    Book reservation
                </button>
            </div>
            <div className="select-location-container">
                <div>
                    <input
                        onChange={handleReservationLocation}
                        required
                        id="gulshan-e-iqbal"
                        name="location"
                        type="radio"
                    />
                    <label htmlFor="gulshan-e-iqbal">
                        <Map longitude={67.106765} latitude={24.9224938} />
                    </label>
                    <br />
                    <span>Gulshan e iqbal</span>
                    <a
                        target="_blank"
                        href="https://www.google.com/maps/search/?api=1&query=24.9224938,67.106765 "
                    >
                        <button>get direction</button>
                    </a>
                </div>
                <div>
                    <input
                        onChange={handleReservationLocation}
                        required
                        type="radio"
                        id="saddar"
                        name="location"
                    />

                    <label htmlFor="saddar">
                        <Map longitude={67.0190137} latitude={24.8587964} />
                    </label>
                    <br />
                    <span>Saddar</span>

                    <a
                        target="_blank"
                        href="https://www.google.com/maps/search/?api=1&query=24.8587964,67.0190137"
                    >
                        <button>get direction</button>
                    </a>
                </div>
                <div>
                    <input
                        onChange={handleReservationLocation}
                        required
                        type="radio"
                        id="gurumandir"
                        name="location"
                    />

                    <label htmlFor="gurumandir">
                        <Map longitude={67.0373} latitude={24.88} />
                    </label>
                    <br />
                    <span>Gurumandir</span>
                    <a
                        target="_blank"
                        href="https://www.google.com/maps/search/?api=1&query=24.8800,67.0373 "
                    >
                        <button>get direction</button>
                    </a>
                </div>
            </div>
        </div>
    );
}

export default SelecedParkingInfo;
