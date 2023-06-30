import PostForm from "../components/PostForm";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import PostList from "../components/PostList";

const Forums: React.FC = () => {
  return (
    <Col>
      <Row>
        <PostForm/>
      </Row>
      <PostList/>
    </Col>
  )
}

export default Forums;