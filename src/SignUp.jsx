import { useState } from 'react'

function SignUp(){
    return(
        <div>
            <form>
                <label name="Email">Email: </label>
                <input type="text" placeholder="Enter your email"></input>
                <br></br>
                <label name="UserName">Username: </label>
                <input type="text" placeholder="Enter your username"></input>
                <br></br>
                <label name="Password">Password:  </label>
                <input type="password" placeholder="Enter your password"></input>
                <br></br>
                <label name="Confirmpassword">Confirm Password:  </label>
                <input type="Confirmpassword" placeholder="Confirm your password"></input>
                <br></br>
                <button>Sign Up</button>
            </form>
        </div>
    )
}
export default SignUp;