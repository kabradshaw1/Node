import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Logo from '../components/Logo';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import authSlice from '../store/slices/authSlice';
import { useAddUserMutation, AddUserMutationVariables } from '../generated/graphql';

type FormFields = AddUserMutationVariables & {
  confirmPassword: string;
};

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [message, setMessage] = useState("");
  const [AddUserMutation, { error }] = useAddUserMutation();

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required.').min(1, 'Username must have at least 1 character.').max(15, 'Username must not exceed 40 characters.'),
    email: Yup.string().required('Email is required').email('Email is invalid'),
    password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters').max(40, 'Password must not exceed 40 characters'),
    confirmPassword: Yup.string().required('Confirm Password is required').oneOf([Yup.ref('password')], 'Confirm Password does not match'),
  });

  const { register, handleSubmit, formState:{errors} } = useForm<FormFields>(
    {resolver: yupResolver(validationSchema)}
  );

  const formSubmit: SubmitHandler<FormFields> = async data => {
    try {
      const mutationResponse = await AddUserMutation({
        variables: {email: data.email, password: data.password, username: data.username}
      });
      if(error) {
        console.log(error);
        setMessage("Registration failed, please try again.")
      }
      if(mutationResponse && mutationResponse.data?.addUser?.token && mutationResponse.data?.addUser.user) {
        const { token, user } = mutationResponse.data.addUser;
        if(user._id && user.username) {
          dispatch(authSlice.actions.setAuth({ token: token, user: { _id: user._id, username: user.username, isAdmin: user.isAdmin } }));
          navigate('/')
        }
      };
    } catch (e) {
      console.log(e)
    };
  }

  return (
    <Row>
      <Col>
        <Form noValidate onSubmit={handleSubmit(formSubmit)}>
          <Form.Label><h3>Register</h3></Form.Label>
          <Col className="mb-3">
            <Form.Group as={Row} md="3">
              <Form.Label>Email</Form.Label>
              <Form.Control type='email' {...register('email')} className={`form-control ${errors.email ? 'is-invalid' : ''}`}/>
              <Form.Control.Feedback className="invalid-feedback">{errors.email?.message}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Row} md="3">
              <Form.Label>username</Form.Label>
              <Form.Control type='username' {...register('username')} className={`form-control ${errors.username ? 'is-invalid' : ''}`}/>
              <Form.Control.Feedback className="invalid-feedback">{errors.username?.message}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Row} md="3">
              <Form.Label>Password</Form.Label>
              <Form.Control type='password' {...register('password')} className={`form-control ${errors.password ? 'is-invalid' : ''}`}/>
              <Form.Control.Feedback className="invalid-feedback">{errors.password?.message}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Row} md="3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control type='password' {...register('confirmPassword')} className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}/>
              <Form.Control.Feedback className="invalid-feedback">{errors.confirmPassword?.message}</Form.Control.Feedback>
            </Form.Group>
            <Form.Label>{message}</Form.Label>
            <Button className='mt-3' type="submit">Submit Form</Button>
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
}