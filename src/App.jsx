import { useState } from 'react'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import './App.css'
import SignUp from './SignUp';
import Login from './Login';
import Home from './Home';

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const[formData, setFormData] = useState({
    userName: '',
    password: ''
  });
  
  const handleLoginSuccess = (userData) => {
    setUser(userData);
};
  const handleChange = (e) => {
    setFormData({
     ...formData,                    
      [e.target.name]: e.target.value 
    });
  };

  
const handleSubmit = async (e) => {
  e.preventDefault();//prevents reload when submit
  

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

const goToLogin = () => {
  navigate('/login')
}


  return (
    
    <div>
      
        
      <div>
           
        <h1>Kalshi AI weather predictor </h1>
        
      </div>
      <Routes>
      <Route
        path="/"
        element={
          <div>
            
              <button onClick={goToLogin}>Login</button>
              <button onClick={goToSignUp}>Sign up</button>
            </div>
          
        }
      />
      
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />}  />
        <Route 
          path="/home" 
          element={
            user ? <Home user={user} /> : <Navigate to="/login" replace />
          } 
        />
      </Routes>
    </div>
  )
} 

export default App
