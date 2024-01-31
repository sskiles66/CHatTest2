import RegisterAndLogin from "./RegisterAndLogin";
import { useContext } from "react";
import { UserContext } from "./UserContext";
import { Link } from 'react-router-dom'

// Register and Login components for buyers and sellers. When logged in, they can access the chatbox.


export default function LandingPage() {
    const {username, id} = useContext(UserContext);


    return (
        <>
            <RegisterAndLogin accountType="buyer" functionType="register" />
            <RegisterAndLogin accountType="buyer" functionType="login" />
            <RegisterAndLogin accountType="seller" functionType="register" />
            <RegisterAndLogin accountType="seller" functionType="login" />
            {username ? <Link to="/chatbox">Go To Chatbox</Link> : null}
        </>
    )
}