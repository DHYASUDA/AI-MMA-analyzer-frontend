import { useState } from 'react'
function Home({user}){
    const name = user;

    return(
    
        <div>
        <h1>Hello</h1>
         <h1>Hello, {user?.userName|| user?.email}</h1>
         </div>
    )

} 
export default Home;