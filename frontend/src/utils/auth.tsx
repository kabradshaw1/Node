import decode from 'jwt-decode';
import store from '../store';
import { setAuth, State } from '../store/slices/authSlice';

class AuthService {
  login(user: State) {
    // const decoded = decode(user);

  }
}