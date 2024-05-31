import { Outlet, RouterProvider, createBrowserRouter, useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, getUserData } from "./firebase";
import Home from "../views/Home";
import Login from "../views/Login";
import SelecedParkingInfo from "../views/SelectParkingInfo";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { removeUser, setUser } from "../store/userSlice";
import Navbar from "../components/Navbar";
import PassResetPage from "../views/PassResetPage";
import Loader from "../views/Loader";

const router = createBrowserRouter([
    {
        path: "*",
        element: <h1>404 page not found</h1>,
    },
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <LayoutForNavabrComp />,
                children: [
                    {
                        path: "/",
                        element: <Home />,
                    }
                ]
            },
            {
                path: "/selectparkinfo",
                element: <SelecedParkingInfo />,
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/forgotpasspage",
                element: <PassResetPage />,
            },
        ]
    }
]);

function LayoutForNavabrComp() {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    )
};

function Layout() {

    const res = useSelector(res => res.userInfo.user);

    const [ loader, setLoader ] = useState(true);
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        onAuthStateChanged(auth, async user => {
            if (user) {
                if (!res.uid) {
    
                    const userInfo = await getUserData(user.uid);
    
                    dispatch(setUser({ ...userInfo.data(), uid: userInfo.id }));
                };
                setLoader(false);
            } else {
                res.uid && dispatch(removeUser());
                setLoader(false);
            };
        });
    }, [])

    useEffect(() => {
        if (res.uid) {

            if (pathname == "/login" || pathname == "/forgotpasspage") {
                navigate("/");
            };
        } else {
            if (pathname == "/selectparkinfo" || pathname == "/") {
                navigate("/login");
            };
        };
    }, [res, pathname]);


    if(loader) return <Loader />;

    return (
        <Outlet />
    )
};

const Router = () => {
    return (
        <RouterProvider router={router} />
    )
};

export default Router;