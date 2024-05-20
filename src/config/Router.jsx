import { Outlet, RouterProvider, createBrowserRouter, useLocation, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, getUserData } from "./firebase";
import Home from "../views/Home";
import Login from "../views/Login";
import SelecedParkingInfo from "../views/SelectParkingInfo";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { removeUser, setUser } from "../store/userSlice";

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
                element: <Home />,
            },
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/selectparkinfo",
                element: <SelecedParkingInfo />,
            }
        ]
    }
]);

function Layout() {

    const res = useSelector(res => res.userInfo.user);
    
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    useEffect(() => {
        onAuthStateChanged(auth, async user => {
            if (user) {

                if(!res.uid){
                    
                    const userInfo = await getUserData(user.uid);
                    
                    dispatch(setUser({...userInfo.data(), uid: userInfo.id}));
                };
            } else {
                res.uid && dispatch(removeUser());
            };
        });
    }, []);

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