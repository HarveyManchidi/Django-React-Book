import { useContext } from "react";
import { Link } from "react-router-dom"
import { AuthContext } from "../context/AuthContext";
import { Container, Nav, Navbar} from "react-bootstrap";

export const Header = () =>{
    const {user,logoutUser} = useContext(AuthContext);
    
    return(
    <>
    <Navbar expand="lg" className="bg-body-tertiary shadow-sm mb-4">
        <Container style={{maxWidth:"935px"}}>

            <Navbar.Brand>
                <Link to='/' 
                    className="text-decoration-none text-dark">
                    Django React 
                </Link>
            </Navbar.Brand>

            <Navbar.Toggle aria-controls="basic-navbar-nav" />

            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="ms-auto">

                    <Nav.Item> 
                        <Link to='/' 
                            className="text-decoration-none text-dark btn">
                            Home 
                        </Link>
                    </Nav.Item>
    
                    <Nav.Item>          
                        {user?(
                        <button onClick={logoutUser}             
                            className="btn">
                            Logout
                        </button>
                        ):(
                        <Link to='/login/' 
                        className="btn">Login
                        </Link>
                        )}
                    </Nav.Item>

                    {user&&
                    <Nav.Item>
                        <Link to={`/users/${user.user_id}/profile/`}>
                            <span className="btn">{user.username}</span>   
                        </Link>
                    </Nav.Item>}
                </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>
    </>
    )
}

export default Header;
