import { Comment as CommentType } from '../../../generated/graphql';

interface CommentProps {
  data: CommentType | null;
}

const Comment: React.FC<CommentProps> = ({ data: comment })  => {
  if (!comment) {
    return <p>No comment data</p>;
  }

  return (
    <p>{comment.commentBody}</p> // display comment body as an example
  )
}

export default Comment;
