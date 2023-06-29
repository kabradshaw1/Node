import React from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Home: React.FC = () => {
  return (
    <Container>
      <Row>
        <Col xs={12} md={8} lg={6}>
          <Card>
            <Card.Header><h2>Welcome to TRICPYAA's homepage!</h2></Card.Header>
            <div style={{
              backgroundImage: `url(/images/TRICYPAA_LOGO.png)`,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'contain',
              width: '100%',
              height: '400px'
            }}/>
          </Card>

        </Col>
      </Row>
      <Row>
        <Card>
          <Card.Header>
            <h3>Our Mission.</h3>
          </Card.Header>
        </Card>
      </Row>
    </Container>
  )
};

export default Home;
