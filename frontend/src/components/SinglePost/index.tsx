import Card from 'react-bootstrap/Card';
import { Post } from '../../generated/graphql';
import Comment from './Comments'
import CommentForm from './CommentForm';

interface SinglePostProp {
  data: Post | null
}

const SinglePost: React.FC<SinglePostProp> = ({ data: post })  => {
  if (!post) {
    return <Card><Card.Text>No post data</Card.Text></Card>;
  }

  return (
    <Card >
      <Card>
        <Card.Body>
          <Card.Title>{post.username}</Card.Title>
          <Card.Text>{post.postText}</Card.Text>
          <Card.Text>{post.createdAt}</Card.Text>
        </Card.Body>
      </Card>
        {post._id && <CommentForm PostId={post._id}/>}
        {post.comments && post.comments.map((comment) => (
          <Comment key={comment?._id} data={comment}/>
        ))}
    </Card>
  )
}

export default SinglePost;
