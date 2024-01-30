import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Register from './RegisterAndLogin'
import './App.css'
import axios from "axios";
import { UserContextProvider } from './UserContext';
import LandingPage from "./LandingPage";
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Chatbox from './ChatboxPage/Chatbox'
import Navbar from "./Navbar";

function App() {
  
  axios.defaults.baseURL = "http://localhost:4040";
  axios.defaults.withCredentials = true;

  return (
    <>
    {/* May want to only put context provider around the actual routes and not around the whole thing */}
      <UserContextProvider>
        
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />}/>
            <Route path="/chatbox" element={<Chatbox />}/>
          </Routes>
        </BrowserRouter>

      </UserContextProvider>
        
    </>
  )
}

export default App
