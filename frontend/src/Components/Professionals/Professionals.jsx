import { React, useState, useEffect } from 'react'
import './Professionals.css'
//import candidate_data from '../Assets/data.js'
import Profile from '../Profile/Profile'
import Chatbot from '../ChatBot/ChatBot'

const Professionals = () => {
   
     const [topProfessional,setTopProfessional]=useState([]);
    useEffect(()=>{
        fetch('http://localhost:4000/topprofessional')
        .then((resp)=>resp.json())
        .then((data)=>setTopProfessional(data))
        .catch((error) => {
            console.error("Failed to load professionals:", error);
            setTopProfessional([]);
        });
    },[])


  return (
    <div className="Professionals-pg">
        <h1>Meet Our Top Rated Professionals</h1>
    <div className="prof-profile">
        {topProfessional.map((item,i)=>{
            return <Profile key={i} id={item.id} name={item.name} image={item.image} experience={item.experience} certificate={item.certificate} skills={item.skills} category={item.category} rating={item.rating} location={item.location} phone={item.phone} owner={item.owner} />
        })}
    </div>
    <Chatbot />
    </div>
    )
}

export default Professionals
