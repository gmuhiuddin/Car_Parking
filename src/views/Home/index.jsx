import React, { useEffect, useState } from 'react';
import './style.css';
import { useSelector } from 'react-redux';
import { cancelAppointment, getUserAppointmentFromDb } from '../../config/firebase.jsx';
import { useNavigate } from 'react-router-dom';

function Home() {
    const res = useSelector(res => res.userInfo.user);
    const [userAppointments, setUserAppoinments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getUserAppointment();
    }, []);

    const getUserAppointment = async () => {

        const date = new Date();
        const todayDate = `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? "0" + String(date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate() < 10 ? "0" + String(date.getDate()) : date.getDate()}`;

        const userApointment = await getUserAppointmentFromDb(res.uid, todayDate);
        
        const appointmentArr = [];

        userApointment.docs.forEach(element => {
            appointmentArr.push({ ...element.data(), id: element.id });
        });

        setUserAppoinments(appointmentArr);
    };
    
    const handleCancelReserv = async (id) => {
        const isConfirm = confirm("Are you sure cancel the reservation");
        if (isConfirm) {
            await cancelAppointment(res.email, id);
            getUserAppointment();
        };
    };

    return (
        <div className='home-main-contianer'>
            <div className='appointment-container'>

                <div>
                    <h2>Your Appointment</h2>

                    {userAppointments.length ?
                        <table>
                            <tr>
                                <th>Time</th>
                                <th>Location</th>
                                <th>Date</th>
                                <th>Ticket Number</th>
                            </tr>
                            {userAppointments.map(element => {
                                return (
                                    <tr>
                                        <td>{element.time}</td>
                                        <td>{element.location}</td>
                                        <td>{element.date}</td>
                                        <td>P-{element.id}</td>
                                        <button onClick={() => handleCancelReserv(element.id)}>Cancel reserv</button>
                                    </tr>
                                )
                            })}
                        </table>
                        :
                        <h1>No appointment</h1>
                    }

                </div>
                <button onClick={() => navigate("selectparkinfo")}>Make reservation</button>
            </div>
            <div>

            </div>
        </div>
    );
};

export default Home;