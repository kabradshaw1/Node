import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import {
  useAddPostMutation,
  AddPostMutationVariables,
  AddPostMutation,
  useMeQuery,
  MeDocument,
  PostsDocument,
  MeQuery,
  PostsQuery } from '../../generated/graphql';
import { ApolloCache } from '@apollo/client';

const PostForm: React.FC = () => {
  const { data: meData, error: meError } = useMeQuery();

  const [addPost, { data, loading: mutationLoading, error }] = useAddPostMutation({
    update(cache: ApolloCache<AddPostMutation>,  { data }) {
      if (data?.addPost) {
        try {
          const meData = cache.readQuery<MeQuery>({ query: MeDocument });
          if (meData && meData.me && meData.me.posts) {
            cache.writeQuery({
              query: MeDocument,
              data: { me: { ...meData.me, posts: [...meData.me.posts, data.addPost] } },
            });
          }
        } catch (e) {
          console.warn("First post insertion by user!")
        }

        const postData = cache.readQuery<PostsQuery>({ query: PostsDocument });
        if (postData && postData.posts) {
          cache.writeQuery({
            query: PostsDocument,
            data: { posts: [data.addPost, ...postData.posts] },
          });
        }
      }
    },
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    postText: Yup.string().required('You must put text for a post').min(1, 'Text must have at least 1 character').max(300, 'Post are limited to 300 characters')
  });

  const { register, handleSubmit, formState:{errors} } = useForm<AddPostMutationVariables>(
    {resolver: yupResolver(validationSchema)}
  );

  const formSubmit: SubmitHandler<AddPostMutationVariables> = async data => {
    setLoading(true);
    try {
      await addPost({
        variables: {postText: data.postText}
      });
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
      setMessage('Create post failed.');
    }
  };

  return (
    <Card>
      <Form noValidate onSubmit={handleSubmit(formSubmit)}>
        <Card.Header><h4>Create Post</h4></Card.Header>
        <Card.Body>
          <Form.Group>
            <Form.Control as="textarea" rows={1} {...register('postText')} className={`form-control ${errors.postText ? 'is-invalid' : ''}`}/>
            <Form.Control.Feedback className='invalid-feedback'>{errors.postText?.message}</Form.Control.Feedback>
          </Form.Group>
          <Button type='submit' disabled={loading || mutationLoading}>Submit Post</Button>
          <Form.Label>{message}</Form.Label>
        </Card.Body>
      </Form>
    </Card>
  )
}

export default PostForm;
