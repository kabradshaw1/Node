import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { useAddCommentMutation, AddCommentMutationVariables } from '../../../generated/graphql';
import '../../../components/PostForm/index.css';

interface PostId {
  PostId: string;
}

interface FormFields extends Omit<AddCommentMutationVariables, 'PostId'> {}

const CommentForm: React.FC<PostId> = ({ PostId }) => {
  const [addCommentMutation, { data, loading: mutationLoading, error }] = useAddCommentMutation();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    commentBody: Yup.string().required('You must put text for a post').min(1, 'Text must have at least 1 character').max(300, 'Posts are limited to 300 characters')
  });

  const { register, handleSubmit, formState:{errors} } = useForm<FormFields>(
    {resolver: yupResolver(validationSchema)}
  );

  const formSubmit: SubmitHandler<AddCommentMutationVariables> = async data => {
    setLoading(true);
    try {
      await addCommentMutation({variables: {commentBody: data.commentBody, PostId: PostId}});
      setLoading(false);
    } catch (e) {
      setLoading(false);
      setMessage('Comment submit failure.')
      console.log(e)
    }
  };

  return (
    <p>Comment form placeholder</p>
  )
};

export default CommentForm;
