import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import authSlice from '../store/slices/authSlice';
import { LOGIN } from '../utils/mutations';
import { useDispatch } from 'react-redux';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

type Inputs = {
  email: string;
  password: string;
}

function Login() {
  const navigate = useNavigate();
  const [login] = useMutation(LOGIN);
  const dispatch = useDispatch();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string().required('Email is required.').email('Email is invalid.'),
    password: Yup.string().required('Password is required.').min(6, 'Password must be at least 6 characters.').max(40, 'Password must not exceed 40 characters.'),
  });

  const { register, handleSubmit, formState:{errors} } = useForm<Inputs>(
    {resolver: yupResolver(validationSchema)}
  );

  const formSubmit: SubmitHandler<Inputs> = async data => {
    setLoading(true);
    console.log(data.email, data.password)
    try {
      const mutationResponse = await login({
        variables: {email: data.email, password: data.password},
      });
      // const token = mutationResponse.data.login.token;
      console.log(mutationResponse);
      setLoading(false);
    } catch (e) {
      console.log(e);
      setLoading(false);
    }

  };

  return (
      <Form noValidate onSubmit={handleSubmit(formSubmit)}>
        <Form.Label><h3>Login</h3></Form.Label>
        <Col className="mb-3">
          <Form.Group as={Row} md="3">
            <Form.Label>Email</Form.Label>
            <Form.Control type='email' {...register('email')} className={`form-control ${errors.email ? 'is-invalid' : ''}`}/>
            <Form.Control.Feedback className="invalid-feedback">{errors.email?.message}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Row} md="3">
            <Form.Label>Password</Form.Label>
            <Form.Control type='password' {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`}/>
            <Form.Control.Feedback className="invalid-feedback">{errors.password?.message}</Form.Control.Feedback>
          </Form.Group>
          <Form.Label>{message}</Form.Label>
        </Col>
        <Button type="submit" disabled={loading}>Submit Form</Button>
      </Form>
  )
};

export default Login;
