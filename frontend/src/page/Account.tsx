import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import { useState } from 'react';
import { RootState } from '../store';
import { useSelector } from 'react-redux';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { useUpdateUserMutation, MutationUpdateUserArgs } from '../generated/graphql';
import authSlice from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

type FormFields = MutationUpdateUserArgs & {
  confirmPassword?: string
}

const Account: React.FC = () => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [updateUserMutation, { error }] = useUpdateUserMutation();
  const user = useSelector((state: RootState) => state.auth);

  const [editMode, setEditMode] = useState({username: false, email: false, password: false})

  const usernameSchema = Yup.object().shape({
    username: Yup.string()
      .required('Username is required.')
      .min(1, 'Username must have at least 1 character.')
      .max(15, 'Username must not exceed 40 characters.'),
  });

  const emailSchema = Yup.object().shape({
    email: Yup.string()
      .required('Email is required')
      .email('Email is invalid'),
  });

  const passwordSchema = Yup.object().shape({
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(40, 'Password must not exceed 40 characters'),
    confirmPassword: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('password')], 'Confirm Password does not match'),
  });

  const usernameForm = useForm<{username: string}>({
    resolver: yupResolver(usernameSchema),
    defaultValues: { username: user.user?.username || ''}
  });

  const emailForm = useForm<{email: string}>({
    resolver: yupResolver(emailSchema),
    defaultValues: { email: user.user?.email || ''}
  });

  const passwordForm = useForm<{password: string, confirmPassword: string}>({
    resolver: yupResolver(passwordSchema),
    defaultValues: { password: '', confirmPassword: '' }
  });

  const onUsernameSubmit: SubmitHandler<FormFields> = async data => {
    setLoading(true);
    try {
      const mutationResponse = await updateUserMutation({variables: {username: data.username}});
      if(error) {
        console.log(error);
        setMessage("Update failed");
      };
      if(mutationResponse && mutationResponse.data?.updateUser?.token && mutationResponse.data?.updateUser.user) {
        const { token, user } = mutationResponse.data.updateUser;
        if(user._id && user.username) {
          dispatch(authSlice.actions.setAuth({ token: token, user: { _id: user._id, username: user.username, isAdmin: user.isAdmin, email: user.email } }));
          setMessage("Update Complete");
          setEditMode({...editMode, username: false})
        }
      };
    } catch (error) {
      console.log(error);
      setMessage("Update failed");
    } finally {
      setLoading(false);
    }
  }

  const onEmailSubmit: SubmitHandler<FormFields> = async data => {
    setLoading(true);
    try {
      const mutationResponse = await updateUserMutation({variables: {email: data.email}});
      if(mutationResponse && mutationResponse.data?.updateUser?.token && mutationResponse.data?.updateUser.user) {
        const { token, user } = mutationResponse.data.updateUser;
        if(user._id && user.username) {
          dispatch(authSlice.actions.setAuth({ token: token, user: { _id: user._id, username: user.username, isAdmin: user.isAdmin, email: user.email } }));
          setMessage("Update Complete");
          setEditMode({...editMode, email: false})
        }
      };
    } catch (error) {
      console.log(error);
      setMessage("Update failed");
    } finally {
      setLoading(false);
    }
  }

  const onPasswordSubmit: SubmitHandler<FormFields> = async data => {
    setLoading(true);
    try {
      const mutationResponse = await updateUserMutation({variables: {password: data.password}});
      if(mutationResponse && mutationResponse.data?.updateUser?.token && mutationResponse.data?.updateUser.user) {
        const { token, user } = mutationResponse.data.updateUser;
        if(user._id && user.username) {
          dispatch(authSlice.actions.setAuth({ token: token, user: { _id: user._id, username: user.username, isAdmin: user.isAdmin, email: user.email } }));
          setMessage("Update Complete");
          setEditMode({...editMode, password: false})
        }
      };
    } catch (error) {
      console.log(error);
      setMessage("Update failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container>
      <Row>
        <Col>
          <Card>
            <Card.Header>Account Information</Card.Header>
            <Card.Body>
              <Card>
                <Card.Header>User Name</Card.Header>
                <Card.Body>
                  {editMode.username ?
                    <Form onSubmit={usernameForm.handleSubmit(onUsernameSubmit)}>
                      <Form.Control type="text" placeholder="Enter username" {...usernameForm.register("username")}/>
                      <Form.Control.Feedback className="invalid-feedback">{usernameForm.formState.errors.username?.message}</Form.Control.Feedback>
                      <Button type="submit">{loading ? "Updating..." : "Submit Update Name"}</Button>
                      <Button onClick={() => setEditMode({...editMode, username: false})}>Cancel</Button>
                      <Form.Label>{message}</Form.Label>
                    </Form>
                    :
                    <>
                      <Card.Text>{user.user?.username}</Card.Text>
                      <Button onClick={() => setEditMode({...editMode, username: true})}>Update Name</Button>
                    </>
                  }
                </Card.Body>
              </Card>
              <Card>
                <Card.Header>Email</Card.Header>
                <Card.Body>
                  {editMode.email ?
                    <Form onSubmit={emailForm.handleSubmit(onEmailSubmit)}>
                      <Form.Control type="text" placeholder="Enter email" {...emailForm.register("email")}/>
                      <Form.Control.Feedback className="invalid-feedback">{emailForm.formState.errors.email?.message}</Form.Control.Feedback>
                      <Button type="submit">{loading ? "Updating..." : "Submit Update Email"}</Button>
                      <Button onClick={() => setEditMode({...editMode, email: false})}>Cancel</Button>
                      <Form.Label>{message}</Form.Label>
                    </Form>
                    :
                    <>
                      <Card.Text>{user.user?.email}</Card.Text>
                      <Button onClick={() => setEditMode({...editMode, email: true})}>Update Email</Button>
                    </>
                  }
                </Card.Body>
              </Card>
              <Card>
                <Card.Header>Password</Card.Header>
                <Card.Body>
                  {editMode.password ?
                    <Form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
                      <Form.Control type="password" placeholder="Enter password" {...passwordForm.register("password")}/>
                      <Form.Control.Feedback className="invalid-feedback">{passwordForm.formState.errors.password?.message}</Form.Control.Feedback>
                      <Form.Control type="password" placeholder="Confirm password" {...passwordForm.register("confirmPassword")}/>
                      <Form.Control.Feedback className="invalid-feedback">{passwordForm.formState.errors.confirmPassword?.message}</Form.Control.Feedback>
                      <Button type="submit">{loading ? "Updating..." : "Submit Update Password"}</Button>
                      <Button onClick={() => setEditMode({...editMode, password: false})}>Cancel</Button>
                      <Form.Label>{message}</Form.Label>
                    </Form>
                    :
                    <>
                    <Button onClick={() => setEditMode({...editMode, password: true})}>Update Password</Button>
                  </>
                  }
                </Card.Body>
              </Card>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Logo/>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Account;
