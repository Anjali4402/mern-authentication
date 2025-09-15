import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router-dom';

function Header() {
    
    const navigate = useNavigate();


  return (
    <Navbar bg="primary" data-bs-theme="dark">
      <Container fluid className='px-4 py-2' >
        <Navbar.Brand href="#">Mern Authentication</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
          </Nav>
          <Form className="d-flex gap-4">
            <Button variant='light' onClick={()=>{navigate("/login")}} >Login</Button>
            <Button variant='light' onClick={()=>{navigate("/register")}} >Sign up</Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;