import { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css'
import SignUp from './SignUp';

function App() {
  const navigate = useNavigate();
  const[formData, setFormData] = useState({
    userName: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
     ...formData,                    
      [e.target.name]: e.target.value 
    });
  };

  
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post('/api/submit', formData);
    console.log(response.data);
  } catch (error) {
    console.error('Login request failed:', error);
  }
}

const goToSignUp = () => {
  navigate('/signup')
}


  return (
    
    <div>
      
        
      <div>
           
        <h1>Kalshi AI weather predictor </h1>
        <h2>Login</h2>
      </div>
      <Routes>
      <Route
        path="/"
        element={
          <>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="userName"
                placeholder="enter username"
                value={formData.userName}
                onChange={handleChange}
              />
              <br />
              <input
                type="password"
                name="password"
                placeholder="enter Password"
                value={formData.password}
                onChange={handleChange}
              />
              <br />
              <button type="submit">Login</button>
            </form>
            <div>
              <button onClick={goToSignUp}>Sign up</button>
            </div>
          </>
        }
      />
      
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </div>
  )
} 

export default App
