import Header from "./components/Header";
import { Routes, Route } from 'react-router-dom';
import Container  from 'react-bootstrap/Container';
const App: React.FC = () => {
  return (
    <>
      <Header/>
      <Container fluid as='main'>
        <Routes>
          
        </Routes>
      </Container>
    </>
  )
}

export default App;
