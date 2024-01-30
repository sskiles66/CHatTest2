import RegisterAndLogin from "./RegisterAndLogin";
import { useContext } from "react";
import { UserContext } from "./UserContext";
import { Link } from 'react-router-dom'


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