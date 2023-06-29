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
import { useNavigate } from "react-router-dom";
import {} from '../../generated/graphql';

const PostForm: React.FC = () => {
  return (
    <h4>Post form placeholder</h4>
  )
}

export default PostForm;