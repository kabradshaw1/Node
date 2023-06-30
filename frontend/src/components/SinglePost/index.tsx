import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Post } from '../../generated/graphql';
import Comment from './Comment'

interface SinglePostProp {
  data: Post | null
}

const SinglePost: React.FC<SinglePostProp> = ({ data: post })  => {
  if (!post) {
    return <Card><Card.Text>No post data</Card.Text></Card>;
  }

  return (
    <Card>
      <Card.Header>{post.username}</Card.Header>
      <Card.Text>{post.postText}</Card.Text>
      <Card.Text>{post.createdAt}</Card.Text>
      {post.comments && post.comments.map((comment) => (
        <Comment key={comment?._id} data={comment}/>
      ))}
    </Card>
  )
}

export default SinglePost;
