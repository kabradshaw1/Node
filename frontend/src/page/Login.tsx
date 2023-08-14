import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import authSlice from '../store/slices/authSlice';
import { useLoginMutation, LoginMutationVariables } from '../generated/graphql';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Logo from '../components/Logo';


function Login() {
  const navigate = useNavigate();
  const [loginMutation, { data, loading: mutationLoading, error }] = useLoginMutation();
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string().required('Email is required.').email('Email is invalid.'),
    password: Yup.string().required('Password is required.').min(6, 'Password must be at least 6 characters.').max(40, 'Password must not exceed 40 characters.'),
  });

  const { register, handleSubmit, formState:{errors} } = useForm<LoginMutationVariables>(
    {resolver: yupResolver(validationSchema)}
  );

  const formSubmit: SubmitHandler<LoginMutationVariables> = async data => {
    setLoading(true);
    try {
      const mutationResponse = await loginMutation({
        variables: {email: data.email, password: data.password},
      });
      if(error) {
        setMessage("Login failed. Please check your email and password.")
      };
      if(mutationResponse && mutationResponse.data?.login?.token && mutationResponse.data?.login?.user) {
        const { token, user } = mutationResponse.data.login;
        if(user._id && user.username) {
          dispatch(authSlice.actions.setAuth({ token: token, user: { _id: user._id, username: user.username, isAdmin: user.isAdmin, email: user.email } }));
          navigate('/')
        }
      };
    } catch (e) {
      console.log(e);
      if (error?.message) {
        setMessage(error.message);
      };
      setLoading(false);
    };

  };

  return (
    <Row>
      <Col>
        <Form noValidate onSubmit={handleSubmit(formSubmit)}>
          <Form.Label><h3>Login</h3></Form.Label>
          <Col className="mb-3">
            <Form.Group as={Row} md="3">
              <Form.Label>Email</Form.Label>
              <Form.Control type='email' placeholder='Enter email' {...register('email')} className={`form-control ${errors.email ? 'is-invalid' : ''}`}/>
              <Form.Control.Feedback className="invalid-feedback">{errors.email?.message}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Row} md="3">
              <Form.Label>Password</Form.Label>
              <Form.Control type='password' placeholder='Enter password' {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`}/>
              <Form.Control.Feedback className="invalid-feedback">{errors.password?.message}</Form.Control.Feedback>
            </Form.Group>
            <Button className='mt-3' type="submit" disabled={loading || mutationLoading}>Submit Form</Button>
            <Form.Label className='mr-3'>{message}</Form.Label>
          </Col>
        </Form>
      </Col>
      <Col>
        <Card>
          <Logo/>
        </Card>
      </Col>
    </Row>
  )
};

export default Login;
