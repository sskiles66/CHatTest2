import { useContext, useState } from "react";
import axios from "axios";
import {UserContext} from "./UserContext";

function RegisterAndLogin(props){
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {setLoggedInUsername, setId} = useContext(UserContext);

    console.log(props);

    const accountType = props.accountType;
    const functionType = props.functionType;

 
    async function handleSubmit(e){
        e.preventDefault ();
        // const {data} = await axios.post("/register", {username,password});
        // setLoggedInUsername(username);
        // setId(data.id);
        if (functionType == "register" && accountType == "buyer"){
            console.log("register");
            const {data} = await axios.post("/buyer/register", {username,password});
            setLoggedInUsername(username);
            setId(data.id);
        }
        else if (functionType == "login"  && accountType == "buyer"){
            console.log("login")
            const {data} = await axios.post("/buyer/login", {username,password});
            setLoggedInUsername(username);
            setId(data.id);
        }
        else if (functionType == "register" && accountType == "seller"){
            console.log("register");
            const {data} = await axios.post("/seller/register", {username,password});
            setLoggedInUsername(username);
            setId(data.id);
        }
        else if (functionType == "login"  && accountType == "seller"){
            console.log("login")
            const {data} = await axios.post("/seller/login", {username,password});
            setLoggedInUsername(username);
            setId(data.id);
        }
    }


    // if (functionType == "login"){
    //     functionToRun = login;
    // }

    return (
        <div>
            <h1>{accountType}</h1>
            <form onSubmit={handleSubmit}>
                <input value={username} onChange={e => setUsername(e.target.value)} type="text" placeholder="username"></input>
                <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="password"></input>
                <button>{functionType}</button>
            </form>
        </div>
    )
}




export default RegisterAndLogin;