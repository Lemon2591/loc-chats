

import Home from "../../Home/Home";
import ChatRoom from "../../ChatRoom/ChatRoom";

const PrivateRouting = [
    {
        path: "/dashboard",
        Component: Home,
        exact: true,
    },
    {
        path: "/message/:id",
        Component: ChatRoom,
    }
];

export default PrivateRouting;