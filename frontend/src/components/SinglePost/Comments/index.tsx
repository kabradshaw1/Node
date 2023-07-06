import { classicNameResolver } from 'typescript';
import { Comment as CommentType } from '../../../generated/graphql';
import Card from 'react-bootstrap/Card';


interface CommentProps {
  data: CommentType | null;
}

const Comment: React.FC<CommentProps> = ({ data: comment })  => {
  if (!comment) {
    return <p>No comment data</p>;
  }
  return (
    <Card key={comment._id}>
      <Card.Header>{comment.username}</Card.Header>
      <Card.Body>
        <Card.Text>{comment.commentBody}</Card.Text>
      </Card.Body>
    </Card>
  )
}

export default Comment;
