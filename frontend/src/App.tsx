import Header from "./components/Header";
import Home from './page/Home';
import Login from './page/Login';
import Register from "./page/Register";
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
        </Routes>
      </Container>
    </>
  )
}

export default App;
