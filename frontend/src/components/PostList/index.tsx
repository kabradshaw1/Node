import SinglePost from "../SinglePost";
import { usePostsQuery } from "../../generated/graphql";
import Row from 'react-bootstrap/Row';

const PostList: React.FC = () => {
  const { loading, error, data } = usePostsQuery();

  if (loading) return <h4>Loading...</h4>
  if(error) return <h4>Error...</h4>

  const posts = data?.posts;
  if (!posts) return <h4>No Posts Found</h4>

  return (
    <>
      {posts && posts.map((post, index) => {
        return (
          <Row className="mb-1" key={index}>
            <SinglePost  data={post}/>
          </Row>
        )
      })}
    </>
  )
}

export default PostList;
