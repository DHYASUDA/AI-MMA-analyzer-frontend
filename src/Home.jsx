import { useState } from 'react'
function Home({user}){
    const name = user;
    const [updatedUsername, setUserName] = useState('');
    const [error, setError] = useState('');
    const [isEditingUsername, setIsEditingUsername] = useState(false);
    const [formData, setFormData] = useState({
        userName:'',
    });
    const startEditingUsername = () => {
        setUserName(user?.userName || '');
        setError('');
        setIsEditingUsername(true);
    };
    
    const cancelEditing = () => {
        setIsEditingUsername(false);
        setError('');
        setUserName('');
    };

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload ={
            id: user.id,
            userName: updatedUsername
        }
    try{
        const response = await fetch('http://localhost:8080/api/updateUserName', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        alert("work");
    }catch(error){
        setError(error.message || 'Something went wrong');
        console.error(error);
    }
}
    return(
    
        <div>
        <h1>Hello</h1>
        
         <h1>Hello, {user?.userName|| user?.email}</h1>
        {!isEditingUsername ? (
            <div>
                
            <button onClick={startEditingUsername}>Update username</button><br></br>
            </div>


        ) : (
            <div>
            <input
                type="text"
                 value={updatedUsername}
                 onChange={(e) => setUserName(e.target.value)}
                     placeholder="New username"
            />
            <button onClick={handleSubmit}>Submit</button>
            <button onClick={cancelEditing}>Cancel</button>
            </div>
        )
        
        
        }
         
         <h2>ID: {user.id}</h2>
         <h2>EMAIL: {user.email}</h2>
         <h2>Password: {user.password}</h2>
         
         
         <button>Update email</button><br></br>
         <button>Update password</button>

        
         </div>
         
    )

} 
export default Home;