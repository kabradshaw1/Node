import { useState } from 'react';
import Card from 'react-bootstrap/Card';
import authSlice from '../../../store/slices/authSlice';
import { RootState } from '../../../store';
import { useSelector, useDispatch } from "react-redux";
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useUpdateEventMutation, MutationUpdateEventArgs, Event } from '../../../generated/graphql';


interface SingleEventProp {
  data: Event | null
}

const EventCard: React.FC<SingleEventProp> = ({ data: event }) => {

  const isAdmin = useSelector((state: RootState) => state.auth.user?.isAdmin);

  const addressLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event?.address || '')}`;

  const titleSchema = Yup.object().shape({
    title: Yup.string().required('You must fill in new title')
  });

  const titleForm = useForm<{title: string}>({
    resolver: yupResolver(titleSchema)
  });

  const onTitleSubmit: SubmitHandler<MutationUpdateEventArgs> = async data => {

  }

  const descriptionSchema = Yup.object().shape({
    description: Yup.string().required('You must fill in new description')
  });

  const imageSchema = Yup.object().shape({
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

  const dateSchema = Yup.object().shape({
    date: Yup.date().nullable().transform((curr, orig) => orig === '' ? null : curr).required('You must choose a date'),
  });

  const addressSchema = Yup.object().shape({
    address: Yup.string().required('You must fill in a new address')
  })

  const [editMode, setEditMode] = useState({title: false, description: false, address: false, image: false, date: false})
  return (
    <Card>
      <Card.Header>
        {editMode.title ?
          <Form onSubmit={titleForm.handleSubmit(onTitleSubmit)}>
            
          </Form>
          :
          <>{event?.title}</>
        }
        {isAdmin
          ? <Button>Edit Title</Button>
          : null
        }
      </Card.Header>
      <Card.Body>
        {event?.signedURL ? <Card.Img src={event.signedURL}/> : null}
        {isAdmin
          ? <Button onClick={() => {setEditMode({...editMode, image: true})}}>Edit Picture</Button>
          : null
        }
        {event?.description ? <Card.Text>{event.description}</Card.Text> : null}
        {isAdmin
          ? <Button>Edit Description</Button>
          : null
        }
        {event?.address ? <Card.Text>This event will be held at <a href={addressLink} target="_blank" rel="noopener noreferrer">{event.address}</a> on {event?.date}</Card.Text> : null}
        {isAdmin
          ? <Button>Edit Address</Button>
          : null
        }
      </Card.Body>
    </Card>
  )
};

export default EventCard;
