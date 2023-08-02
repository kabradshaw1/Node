import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import { RootState } from '../store';
import { useSelector } from 'react-redux';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { useUpdateUserMutation } from '../generated/graphql';

const Account: React.FC = () => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [updateUserMutation, { error }] = useUpdateUserMutation();
  const user = useSelector((state: RootState) => state.auth);
  console.log(user)

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Username is required.').min(1, 'Username must have at least 1 character.').max(15, 'Username must not exceed 40 characters.'),
    email: Yup.string().required('Email is required').email('Email is invalid'),
    password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters').max(40, 'Password must not exceed 40 characters'),
    confirmPassword: Yup.string().required('Confirm Password is required').oneOf([Yup.ref('password')], 'Confirm Password does not match'),
  });

  const { register, handleSubmit, formState:{errors} } = useForm(
    {resolver: yupResolver(validationSchema)}
  );

  return (
    <Card>
      <Card.Header>Account Information</Card.Header>
      <Card.Body>
        <Card>
          <Card.Header>
            User Name
          </Card.Header>
          <Card.Body>
            <Card.Text>{user.user?.username}</Card.Text>
            <Button>Update Name</Button>
          </Card.Body>
        </Card>
        <Card>
          <Card.Header>
            Email
          </Card.Header>
          <Card.Body>
            <Card.Text>{user.user?.email}</Card.Text>
            <Button>Update Email</Button>
          </Card.Body>
        </Card>
        <Card>
          <Card.Header>Password</Card.Header>
          <Card.Body>
            <Button>Update Password</Button>
          </Card.Body>
        </Card>
      </Card.Body>

    </Card>
  )
}

export default Account;