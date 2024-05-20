import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, orderBy, query, setDoc, updateDoc, where } from "firebase/firestore";

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
    const appointmentCollection = collection(db, "appointment");

    const q = reservationLocation ? query(
        appointmentCollection,
        where("location", "==", reservationLocation)
    ) : appointmentCollection;

    let appointments = await getDocs(q);

    appointments = appointments.docs.filter(element => {
        const dateObj = new Date(element.data().date);

        const date = dateObjToDateInString(dateObj);
        
        return date == reservationDate;
    });
    
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
        time, uid, date: appointmentDate.getTime(), location
    });

    await fetch("https://carparkingnode-production.up.railway.app/sendmail/confirmemail", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email, ticketNum, location, parkingSlotNum, date, time
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

    const appointmentDate = new Date(date);

    const appointmentCollection = collection(db, "appointment");

    const q = query(
        appointmentCollection,
        orderBy("date", "asc"),
        where("date", ">=", appointmentDate.getTime()),
        where("uid", "==", uid),
    );

    const appointments = await getDocs(q);

    return appointments;
};

export { getBookedTime, auth, login, signup, getUserData, logout, makeAppointment, cancelAppointment, getUserAppointmentFromDb, dateObjToDateInString };