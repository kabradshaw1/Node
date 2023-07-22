import { useSelector, useDispatch } from "react-redux";
import { RootState } from '../../store';
import { useNavigate } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import authSlice from '../../store/slices/authSlice';

export default function Header() {

  const isLoggedIn = useSelector((state: RootState) => state.auth.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(authSlice.actions.logout());
    navigate('/login');
  };

  return (
        <Container fluid className='sticky-top header' as='header'>
          <Navbar bg="light" expand="lg" >
            <Container>
              <LinkContainer to=''>
                <Navbar.Brand>TRICYPAA</Navbar.Brand>
              </LinkContainer>
              <LinkContainer to='/forums'>
                <Nav.Link>
                  Suggestion Forum
                </Nav.Link>
              </LinkContainer>
              <NavDropdown title={isLoggedIn ? `${isLoggedIn.username}`: 'Welcome'} id="basic-nav-dropdown">
                {isLoggedIn
                  ? <LinkContainer to='/'>
                      <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                    </LinkContainer>
                  : <>
                      <LinkContainer to='/login'>
                        <NavDropdown.Item>Login</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to='/register'>
                        <NavDropdown.Item>Register</NavDropdown.Item>
                      </LinkContainer>
                    </>
                }
                <LinkContainer to='/profile'>
                  <NavDropdown.Item>Profile</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Divider />
                {isLoggedIn?.isAdmin
                  ? <LinkContainer to='/event_form'>
                      <NavDropdown.Item>Event Form</NavDropdown.Item>
                    </LinkContainer>
                  : null
                }
              </NavDropdown>
            </Container>
          </Navbar>

    </Container>
  )
};

