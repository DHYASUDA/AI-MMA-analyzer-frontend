import { useState } from 'react'

function SignUp(){

    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });


    //handle change (being able to edit fields)
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        setFormData(prevState => ({
            ...prevState,        // keep previous values
            [name]: value        // update the changed field
        }));
    };



    const testing = (e) => {
        e.preventDefault();
        console.log("Passwords do not match!");
        const message = "Passwords do not match!"; 
        fetch('http://localhost:8080/api/test', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message)
        })
    };



    const handleSubmit = (e) => {
        e.preventDefault();     // Prevent page refresh

        // Simple validation
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        if (formData.password.length < 6) {
            alert("Password must be at least 6 characters long");
            return;
        }

        

        // ==================== CREATE PAYLOAD ====================
        // This is the data we will send to the backend
        const payload = {
            email: formData.email.trim(),        // remove extra spaces
            username: formData.username.trim(),
            password: formData.password
            // We do NOT send confirmPassword to backend
        };

        // For debugging - see what we are sending
        console.log("Signup Payload:", payload);

        
        fetch('http://localhost:8080/api/signUp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })

        
    };



    return(
        <div>
            <form onSubmit={handleSubmit}>
                <label name="Email">Email: </label>
                <input  type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required></input>
                <br></br>
                <label name="UserName">Username: </label>
                <input  type="text"
                        name="username"                    // Important: Add name
                        value={formData.username}          // Add value
                        onChange={handleChange}            // Add onChange
                        placeholder="Enter your username"
                        required></input>
                <br></br>
                <label name="Password">Password:  </label>
                <input  type="password"
                        name="password"                    // Important: Add name
                        value={formData.password}          // Add value
                        onChange={handleChange}            // Add onChange
                        placeholder="Enter your password"
                        required></input>
                <br></br>
                <label name="Confirmpassword">Confirm Password:  </label>
                <input  type="password"
                        name="confirmPassword"             // Important: Add name
                        value={formData.confirmPassword}   // Add value
                        onChange={handleChange}            // Add onChange
                        placeholder="Confirm your password"
                        required></input>
                <br></br>
                <button type="submit">Sign Up</button>
            </form>
            <button type="submit" onClick={testing}>testing</button>
        </div>
    )
}
export default SignUp;