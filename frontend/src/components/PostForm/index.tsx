import { useState } from 'react';
import { useMutation } from "@apollo/client";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Logo from '../Logo';
import { useAddPostMutation, AddPostMutationVariables } from '../../generated/graphql';

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
    await addPostMutation({
      variables: {postText: data.postText}
    });
    if(error) {
      setMessage('Create post failed.')
    }
  };

  return (
    <h4>Post form placeholder</h4>
  )
}

export default PostForm;