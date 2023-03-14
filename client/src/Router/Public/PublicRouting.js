import Login from "../../Auth/Login"
import Register from "../../Auth/Register"

const PublicRouting = [
    {
        path: "/",
        Component: Login,
        exact: true,
    },
    {
        path: "/register",
        Component: Register,
    },
];

export default PublicRouting;