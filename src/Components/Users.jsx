import { useState,useEffect } from "react";

const Users =()=>{
    const [users, setUsers] = useState;

   return(
     <article>
        <h2>
            Users list
        </h2>
        {users?.length?(
                    <ul>
                        {users.map((user,i)=><li key={i}>{user?.username}</li>)}
                    </ul>
        ) : <p>No Users to display</p>
    }
     </article>
   ) 
}


export default Users