import { useContext, type JSX } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

interface Props {
    children: JSX.Element
}

function ProtectorRuta ({ children }: Props) {
    const {user, initialized} = useContext(UserContext);

    if((!initialized)) return null;

    if(!user){
        return <Navigate to="/" replace/>;
    }

    return children;
}

export default ProtectorRuta;