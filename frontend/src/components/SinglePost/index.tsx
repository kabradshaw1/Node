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
    <Card bg='secondary'>
      <Card className='mt-2'>
        <Card.Header><h4>Posted by {post.username}</h4></Card.Header>
        <Card.Body>
          <Card.Text>{post.postText}</Card.Text>
          <Card.Text>{post.createdAt}</Card.Text>
          {post._id && <CommentForm PostId={post._id}/>}
        </Card.Body>
      </Card>
      <Card className='mb-2 mt-1'>
        <Card.Header>Comments</Card.Header>
        {post.comments && post.comments.map((comment) => (
          <Comment key={comment?._id} data={comment}/>
        ))}
      </Card>
    </Card>
  )
}

export default SinglePost;
