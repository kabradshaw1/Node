import Header from "./components/Header";
import Home from './page/Home';
import Login from './page/Login';
import Forums from './page/Forums';
import Account from './page/Account';
import Register from './page/Register';
import EventForm from "./page/EventForm";
import { Routes, Route } from 'react-router-dom';
import Container  from 'react-bootstrap/Container';

function App() {
  return (
    <>
      <Header/>
      <Container as='main'>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/forums' element={<Forums/>}/>
          <Route path='/account' element={<Account/>}/>
          <Route path='event_form' element={<EventForm/>}/>
        </Routes>
      </Container>
    </>
  )
};

export default App;
