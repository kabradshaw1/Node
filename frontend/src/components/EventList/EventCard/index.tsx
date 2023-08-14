import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import { RootState } from '../../../store';
import { useSelector } from "react-redux";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useUpdateEventMutation, Event, useEventsQuery } from '../../../generated/graphql';
import { Description, Title, Image, Address, EventDate } from '../../../components/EventForm';

interface SingleEventProp {
  data: Event | null
};

interface FormSubmit {
  date?: Date,
  file?: any,
  title?: string,
  description?: string,
  address?: string,
};

const EventCard: React.FC<SingleEventProp> = ({ data: event }) => {

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [updateEventMutation, { error, loading: mutationLoading }] = useUpdateEventMutation();
  const Events = useEventsQuery()

  const isAdmin = useSelector((state: RootState) => state.auth.user?.isAdmin);

  const addressLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event?.address || '')}`;

  const [editMode, setEditMode] = useState({title: false, description: false, address: false, image: false, date: false})

  const titleSchema = Yup.object().shape({
    title: Yup.string().required('You must fill in new title')
  });

  const imageScehma = Yup.object().shape({
    file: Yup.mixed()
      .test('fileSize', 'The file is too large', value => {
        const file = value as File;
        return !file || file.size <= 5000000;
      })
      .test('fileType', 'Unsupported File Format. Supported formats are .jpg, .jpeg, .png, .gif, .webp', value => {
        const file = value as File;
        return !file || ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type);
      }),
  });

  const descriptionSchema = Yup.object().shape({
    description: Yup.string().required('You must fill in new description')
  });


  const dateSchema = Yup.object().shape({
    date: Yup.date().nullable().transform((curr, orig) => orig === '' ? null : curr).required('You must choose a date'),
  });

  const addressSchema = Yup.object().shape({
    address: Yup.string().required('You must fill in a new address')
  });

  const titleForm = useForm({
    resolver: yupResolver(titleSchema)
  });


  const imageForm = useForm({
    resolver: yupResolver(imageScehma)
  });


  const descriptionForm = useForm({
    resolver: yupResolver(descriptionSchema)
  });


  const dateForm = useForm({
    resolver: yupResolver(dateSchema)
  });

  const addressForm = useForm({
    resolver: yupResolver(addressSchema)
  });

  const onTitleSubmit: SubmitHandler<FormSubmit> = async data => {
    setLoading(true);
    try {
      const mutationRespose = await updateEventMutation({
        variables: {title: data.title}
      });
      if (mutationRespose) {

      } else {
        setMessage('An error has occured.');
        setLoading(false);
        throw new Error('Failed ')
      }
    } catch (error) {
      console.log(error);
      setMessage("Update failed");
    }
  };

  const onImageSubmit: SubmitHandler<FormSubmit> = async (data) => {
    setLoading(true);
    try {
      const response = await updateEventMutation({
        variables: {
          fileName: data.file?.name,
          fileType: data.file?.type
        }
      })
    } finally {
      setLoading(false);
    }
  };

  const onDateSubmit: SubmitHandler<FormSubmit> = (data) => {

  };

  const onAddressSubmit: SubmitHandler<FormSubmit> = (data) => {

  };

  const onDescriptionSubmit: SubmitHandler<FormSubmit> = async (data) => {
    setLoading(true);
    try {
      const responce = await updateEventMutation({
        variables: {description: data.description}
      })
    } catch (e) {
      console.log(e)
      if (error?.message) {
        setMessage(error.message);
      }
      setLoading(false);
    }
  };

  return (
    <Card>
      <Card.Header>
        {editMode.title ?
          <Form onSubmit={titleForm.handleSubmit(onTitleSubmit)}>
            <Title register={titleForm.register} error={titleForm.formState.errors.title?.message}/>
            <Button type='submit' disabled={loading || mutationLoading}>Submit New Title</Button>
            <Button onClick={() => setEditMode({...editMode, title: false})}>Cancel</Button>
            <Form.Label>{message}</Form.Label>
          </Form>
          :
          <Card.Text>{event?.title}</Card.Text>
        }
        {isAdmin
          ? <Button>Edit Title</Button>
          : null
        }
      </Card.Header>
      <Card.Body>
        {editMode.image ?
          <Form onSubmit={imageForm.handleSubmit(onImageSubmit)}>
            <Image setValue={imageForm.setValue} error={imageForm.formState.errors.file?.message} control={imageForm.control}/>
            <Button type='submit' disabled={loading || mutationLoading}>Submit New Image</Button>
            <Button onClick={() => setEditMode({...editMode, image: false})}>Cancel</Button>
            <Form.Label>{message}</Form.Label>
          </Form>
          :
          <Card.Text>{event?.signedURL ? <Card.Img src={event.signedURL}/> : null}</Card.Text>
        }
        {isAdmin
          ? <Button onClick={() => {setEditMode({...editMode, image: true})}}>Edit Picture</Button>
          : null
        }
        {editMode.description ?
          <Form onSubmit={descriptionForm.handleSubmit(onDescriptionSubmit)}>
            <Description register={descriptionForm.register} error={descriptionForm.formState.errors.description?.message}/>
            <Button type='submit' disabled={loading || mutationLoading}>Submit New Description</Button>
            <Button onClick={() => setEditMode({...editMode, description: false})}>Cancel</Button>
            <Form.Label>{message}</Form.Label>
          </Form>
          :
          <Card.Text>{event?.description ? <Card.Text>{event.description}</Card.Text> : null}</Card.Text>
        }
        {isAdmin
          ? <Button onClick={() => {setEditMode({...editMode, description: true})}}>Edit Description</Button>
          : null
        }
        {
          editMode.date ?
            <Form onSubmit={dateForm.handleSubmit(onDateSubmit)}>
              <EventDate control={dateForm.control} register={dateForm.register} error={dateForm.formState.errors.date?.message}/>
              <Button type='submit' disabled={loading || mutationLoading}>Submit New Date</Button>
              <Button onClick={() => setEditMode({...editMode, date: false})}>Cancel</Button>
              <Form.Label>{message}</Form.Label>
            </Form>
          : editMode.address ?
            <Form onSubmit={addressForm.handleSubmit(onAddressSubmit)}>
              <Address register={addressForm.register} error={addressForm.formState.errors.address?.message}/>
              <Button type='submit' disabled={loading || mutationLoading}>Submit New Address</Button>
              <Button onClick={() => setEditMode({...editMode, address: false})}>Cancel</Button>
              <Form.Label>{message}</Form.Label>
            </Form>
          : <Card.Text>{event?.address ? <Card.Text>This event will be held at <a href={addressLink} target="_blank" rel="noopener noreferrer">{event.address}</a> on {event?.date}</Card.Text> : null}</Card.Text>
        }
        {isAdmin
          ? <>
              <Button onClick={() => {setEditMode({...editMode, address: true})}}>Edit Address</Button>
              <Button onClick={() => {setEditMode({...editMode, date: true})}}>Edit Date</Button>
            </>
          : null
        }
      </Card.Body>
    </Card>
  )
};

export default EventCard;
