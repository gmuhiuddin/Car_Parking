import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, onSnapshot, orderBy, query, setDoc, updateDoc, where } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCYZ7jrySsTMZtSDI3cMNK1Vqk8kcvXswk",
    authDomain: "car-parking-lot-9a802.firebaseapp.com",
    projectId: "car-parking-lot-9a802",
    storageBucket: "car-parking-lot-9a802.appspot.com",
    messagingSenderId: "892918611033",
    appId: "1:892918611033:web:d3cc172ccd701f4f194548",
    measurementId: "G-67FW8XVQJQ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const dateObjToDateInString = (dateObj) => {
    return `${dateObj.getFullYear()}-${dateObj.getMonth() + 1 < 10 ? 0 + String(dateObj.getMonth() + 1) : dateObj.getMonth() + 1}-${dateObj.getDate() < 10 ? 0 + String(dateObj.getDate()) : dateObj.getDate()}`;
};

const signup = async (username, email, password) => {
    const { user: { uid } } = await createUserWithEmailAndPassword(auth, email, password);

    const userDataCollection = doc(db, "users", uid);

    await setDoc(userDataCollection, {
        username, email, userImg: ""
    });
};

const login = async (email, password) => {
    const user = await signInWithEmailAndPassword(auth, email, password);
};

const logout = async () => {
    await signOut(auth);
};

const getUserData = async (uid) => {
    const userDataCollection = doc(db, "users", uid);

    return await getDoc(userDataCollection);
};

const getBookedTime = async (reservationDate, reservationLocation) => {

    const date = new Date(reservationDate);

    const appointmentCollection = collection(db, "appointment");

    const q = reservationLocation ? query(
        appointmentCollection,
        where("location", "==", reservationLocation),
        where("date", ">=", date.getTime()),
    ) : appointmentCollection;

    const appointments = await getDocs(q);

    const selectedTimes = [];

    appointments.forEach(element => {
        selectedTimes.push(element.data().time);
    });

    return selectedTimes;
};

const makeAppointment = async (uid, email, date, time, location, parkingSlotNum) => {
    
    const appointmentIdCollection = doc(db, "appointmentId", "7STXCXe6yHLvM5zR73Ld");

    const appointmentIdData = await getDoc(appointmentIdCollection);
    const ticketNum = appointmentIdData.data().id + 1;

    const appointmentDoc = doc(db, "appointment", String(ticketNum));
    
    await setDoc(appointmentDoc, {
        time, uid, dateTime: date.getTime(), location, date: dateObjToDateInString(date)
    });

    await fetch("https://carparkingnode-production.up.railway.app/sendmail/confirmemail", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email, ticketNum: "89", location, parkingSlotNum, date, time
        })
    });

    await updateDoc(appointmentIdCollection, {
        id: ticketNum
    });

    return ticketNum;
};

const cancelAppointment = async (email, ticketNum) => {
    const appointmentCollection = doc(db, "appointment", String(ticketNum));

    await deleteDoc(appointmentCollection);

    await fetch("https://carparkingnode-production.up.railway.app/sendmail/cancelemail", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email
        })
    });
};

const getUserAppointmentFromDb = async (uid, date) => {
    
    const appointmentCollection = collection(db, "appointment");
    
    const q = query(
        appointmentCollection,
        orderBy("dateTime", "asc"),
        where("dateTime", ">=", date.getTime()),
        where("uid", "==", uid),
    );

    const appointments = await getDocs(q);
    
    return appointments;
};

const sendResetEmail = async (email) => {
    await sendPasswordResetEmail(auth, email);
};

const getRealTimeBookedTime = async (reservationDate, reservationLocation, dateObj, setTimes) => {

    const arr = [{ time: "00-00 01-00" }, { time: "01-00 02-00" }, { time: "02-00 03-00" }, { time: "03-00 04-00" }, { time: "04-00 05-00" }, { time: "05-00 06-00" }, { time: "06-00 07-00" }, { time: "07-00 08-00" }, { time: "08-00 09-00" }, { time: "09-00 10-00" }, { time: "10-00 11-00" }, { time: "11-00 12-00" }, { time: "12-00 13-00" }, { time: "13-00 14-00" }, { time: "14-00 15-00" }, { time: "15-00 16-00" }, { time: "16-00 17-00" }, { time: "17-00 18-00" }, { time: "18-00 19-00" }, { time: "19-00 20-00" }, { time: "20-00 21-00" }, { time: "21-00 22-00" }, { time: "22-00 23-00" }, { time: "23-00 24-00" }];

    const appointmentCollection = collection(db, "appointment");

    const q = reservationLocation ? query(
        appointmentCollection,
        where("date", "==", reservationDate),
        where("location", "==", reservationLocation)
    ) :
        query(
            appointmentCollection,
            where("date", "==", reservationDate),
        );

    onSnapshot(q, res => {
        
        const timeArr = arr.slice(dateObj.getHours());

        timeArr.forEach(timeElement => {
            timeElement.booked = 0;
        });

        if (res.docs.length) {
            res.docs.forEach(element => {
                timeArr.forEach(timeElement => {
                    if (element.data().time == timeElement.time) {
                        timeElement.booked = timeElement.booked + 1;
                    };
                });
            });
            setTimes(timeArr);
        } else {
            setTimes(timeArr);
        };
    }, (error) => {
        const timeArr = arr.slice(dateObj.getHours());

        timeArr.forEach(timeElement => {
            timeElement.booked = 0;
        });

        setTimes(timeArr);
        console.error('Error fetching documents:', error);
    });

};

export { getBookedTime, auth, login, signup, getUserData, logout, makeAppointment, cancelAppointment, getUserAppointmentFromDb, dateObjToDateInString, getRealTimeBookedTime, sendResetEmail };