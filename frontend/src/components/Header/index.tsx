import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { RootState } from '../../store';
import { useNavigate } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import authSlice from '../../store/slices/authSlice';
import decode from 'jwt-decode';

interface DecodedToken {
  exp: number;
  data: {
    username: string;
    email: string;
    _id: string;
    isAdmin: boolean;
  };
}

export default function Header() {

  const isLoggedIn = useSelector((state: RootState) => state.auth);

  const logoutTimerRef = useRef<NodeJS.Timeout | null>(null); // create a ref to hold the timer

  useEffect(() => {
    const token = isLoggedIn.token;
    if (token) {
      const decoded = decode(token) as DecodedToken;
      const timeout = (decoded.exp * 1000) - Date.now();

      logoutTimerRef.current = setTimeout(handleLogout, timeout); // set the timer
    }

    return () => {
      // clear the timer when the component unmounts or the user logs out
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    };
  }, [isLoggedIn.token]);

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
              <NavDropdown title={isLoggedIn ? `${isLoggedIn?.user?.username}`: 'Welcome'} id="basic-nav-dropdown" className='align-end'>
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
                {isLoggedIn?.user?.isAdmin
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

