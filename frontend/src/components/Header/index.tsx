import { useSelector, useDispatch } from "react-redux";
import { RootState } from '../../store';
import { useNavigate } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Col from 'react-bootstrap/Col'
import authSlice from '../../store/slices/authSlice';

export default function Header() {

  const isLoggedIn = useSelector((state: RootState) => state.auth._id);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(authSlice.actions.logout());
    navigate('/login');
  };

  return (
        <Container fluid className='sticky-top header' as='header'>
        <Col>
          <Navbar bg="light" expand="lg" >
            <Container>
              <LinkContainer to=''>
                <Navbar.Brand>TRICYPAA</Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                  {isLoggedIn
                    ? <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                    : <LinkContainer to='/login'>
                        <Nav.Link>Login</Nav.Link>
                      </LinkContainer>
                  }
                  <LinkContainer to='register'>
                    <Nav.Link>Register</Nav.Link>
                  </LinkContainer>
                  <NavDropdown title="Dropdown" id="basic-nav-dropdown">

                      <NavDropdown.Item>Free space 1</NavDropdown.Item>

                    <NavDropdown.Item href="#action/3.2">
                      Free Space
                    </NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.3">Free space 2</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item href="#action/3.4">
                      Fill Me!
                    </NavDropdown.Item>
                  </NavDropdown>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </Col>
    </Container>
  )
};

