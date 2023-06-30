import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Post } from '../../generated/graphql';

interface SinglePostProp {
  data: Post | null
}

const SinglePost: React.FC<SinglePostProp> = (prop)  => {
  return (
    <h3>Single post placeholder</h3>
  )
}

export default SinglePost;