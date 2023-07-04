import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useAddPostMutation, AddPostMutationVariables } from '../../generated/graphql';
import './index.css';

const PostForm: React.FC = () => {
  const [addPostMutation, { data, loading: mutationLoading, error }] = useAddPostMutation();

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
      await addPostMutation({
        variables: {postText: data.postText}
      });
      if(error) {
        setMessage('Create post failed.');
        setLoading(false);
      }
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
      setMessage('Create post failed.');
    }
  };

  return (
    <Card>
      <Card.Header><h4>Post</h4></Card.Header>
      <Form noValidate onSubmit={handleSubmit(formSubmit)}>
        <Form.Group className='m-3'>
          <Form.Control as="textarea" rows={1} {...register('postText')} className={`form-control ${errors.postText ? 'is-invalid' : ''}`}/>
          <Form.Control.Feedback className='invalid-feedback'>{errors.postText?.message}</Form.Control.Feedback>
        </Form.Group>
        <Button className='m-3 mt-0' type='submit' disabled={loading || mutationLoading}>Submit Post</Button>
        <Form.Label>{message}</Form.Label>
      </Form>
    </Card>
  )
}

export default PostForm;