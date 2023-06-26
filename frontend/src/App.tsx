import Header from "./components/Header";
import Home from './page/Home';
import Login from './page/Login';
import Register from "./page/Register";
import { Routes, Route } from 'react-router-dom';
import Container  from 'react-bootstrap/Container';
const App: React.FC = () => {
  return (
    <>
      <Header/>
      <Container fluid as='main'>
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
