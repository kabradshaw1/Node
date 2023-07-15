import React from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Logo from '../components/Logo';
import EventList from '../components/EventList';

const Home: React.FC = () => {

  return (
    <Container>
      <Row>

        <Col sm={12} md={6}>
          <Card>
            <Card.Header><h2>Welcome to TRICYPYAA's homepage!</h2></Card.Header>
            <Logo/>
          </Card>
        </Col>
        <Col  sm={12} md={6}  lg={3}>
          <Card>
            <Card.Header>
              <h3>TRICYPAA's Mission.</h3>
            </Card.Header>
            <Card.Body>
              <Card.Text>
              Triangle Committee of Young People in Alcoholics Anonymous is committed to
              providing a strong, unified fellowship of young recovering people in the
              Triangle area. In accordance with AA's 12 Traditions and 12 Concepts for
              World Service we host a variety of both recovery related and fellowship focused
              events along with encouraging participation in statewide NCCYPAA functions. In the
              spirit of service, our primary purpose is to share the message of recovery
              to newcomers in an attractive setting for young people.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col  sm={12} md={6} lg={3}>
          <Card>
            <Card.Header>
              <h3>This Site</h3>
            </Card.Header>
            <Card.Body>
              <Card.Text>
                This site is currently under development.  Please checkout our suggestion forum for suggestions and discussion of features and design.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={12} md={6}>
          <EventList/>
        </Col>
      </Row>

    </Container>
  )
};

export default Home;
