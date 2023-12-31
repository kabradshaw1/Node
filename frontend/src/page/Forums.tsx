import PostForm from "../components/PostForm";
import Col from 'react-bootstrap/Col';
import PostList from "../components/PostList";

const Forums: React.FC = () => {
  return (
    <Col>
      <PostForm/>
      <h2>Posts</h2>
      <PostList/>
    </Col>
  )
}

export default Forums;