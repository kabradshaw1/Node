import Card from 'react-bootstrap/Card'

const Home: React.FC = () => {
  return (
    <Card>
      <Card.Header><h2>Welcome to TRICPYAA's homepage!</h2></Card.Header>
      <Card.Img src={`/images/TRICYPAA_LOGO.jpg`}/>
    </Card>

  )
};

export default Home;