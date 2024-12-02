import { Navigate, Outlet } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { useContext } from "react"

const ProtectedRoutes = () =>{
    const {user} = useContext(AuthContext)
    return user ? <Outlet/>:<Navigate to='/login'/>
}
export default ProtectedRoutes;