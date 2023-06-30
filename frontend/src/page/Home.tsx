import React from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Logo from '../components/Logo';

const Home: React.FC = () => {
  console.log(process.env.REACT_APP_BASE_URL)
  return (
    <Container>
      <Row>
        <Col xs={12} md={8} lg={6}>
          <Card>
            <Card.Header><h2>Welcome to TRICPYAA's homepage!</h2></Card.Header>
            <Logo/>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Header>
              <h3>TRICYPAA's Mission.</h3>
            </Card.Header>
            <Card.Text>
              Someone please write me a statement to stick here!
            </Card.Text>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Header>
              <h3>This Site</h3>
            </Card.Header>
            <Card.Text>
              This site is currently under development.  Please checkout our forum for suggestions and discussion of features and design.
            </Card.Text>
          </Card>
        </Col>
      </Row>
      <Row>

      </Row>
    </Container>
  )
};

export default Home;
