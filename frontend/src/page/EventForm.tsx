import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import {
  useAddEventMutation,
  AddEventMutationVariables,} from '../generated/graphql';
import { useNavigate } from 'react-router-dom';

const EventForm: React.FC = () => {
  const [ addEvent, { data, loading: mutationLoading, error }] = useAddEventMutation();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    date: Yup.date().required(''),
    title: Yup.string().required(''),
  });

  const { register, handleSubmit, formState:{errors} } = useForm<AddEventMutationVariables>(
    {resolver: yupResolver(validationSchema)}
  )

  return (
    <h1>Event form placeholder</h1>
  )
};

export default EventForm