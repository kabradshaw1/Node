import SinglePost from "../SinglePost";
import useSWR from 'swr';
import { usePostsQuery } from "../../generated/graphql";
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Post } from '../../../../backend/models/Post'

const PostList: React.FC = () => {
  
  return (
    <h3>Post list placeholder</h3>
  )
}

export default PostList;
