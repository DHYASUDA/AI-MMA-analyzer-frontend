import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import SignUp from './SignUp';
function Login( {onLoginSuccess}){
    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    const [formData, setFormData] = useState({
        userName:'',
        email:'',
        password:''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


    const handleChange =  (e) => {
        const { name, value } = e.target;
        
        setFormData(prevState => ({
            ...prevState,        // keep previous values
            [name]: value        // update the changed field
        }));
    };

     const handleSubmit = async (e) => {
        e.preventDefault();
        const payload ={
            email: formData.email.trim(),
            password: formData.password
        }
        try{
        const response = await fetch('http://localhost:8080/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        const data = await response.json();


        if(!response.ok){
            alert("Failed to login");
            throw new Error('Login failed');
        } else {
            console.log(data);
            alert("login payload created successfully! Check console.");
        onLoginSuccess({
            id: data.id,
            email: data.email,
            password: data.password,
            userName: data.userName
        });
        console.log(payload);
        navigate('/home');
        }
        
        
    } catch(error){
        setError(error.message || 'Something went wrong');
        console.error(error);
    }
    
     }


     const goToSignUp = () => {
        navigate('/signUp')
      }

    return (
        <>
        <div>
            <form onSubmit={handleSubmit}>
                <label>Email</label>
                <input  type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange} placeholder="Email"></input>
                <br></br>
                <label>Password</label>
                <input  name ="password" onChange={handleChange}  value={formData.password} type ="password" placeholder="Password"></input>
                <br></br>
                <button type="submit">Login</button> 
                <h3>Or</h3>
                
            </form>

            <button onClick={goToSignUp}>Sign Up</button>
        </div>
        </>
        
    )

};
export default Login;