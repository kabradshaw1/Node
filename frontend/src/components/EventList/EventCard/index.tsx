import { Event } from "../../../generated/graphql";
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



interface SingleEventProp {
  data: Event | null
}

const EventCard: React.FC<SingleEventProp> = ({ data: event }) => {

  const isAdmin = useSelector((state: RootState) => state.auth.user?.isAdmin);

  const addressLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event?.address || '')}`;

  const titleSchema = Yup.object().shape({

  })

  const [editMode, setEditMode] = useState({title: false, description: false, address: false, image: false, date: false})
  return (
    <Card>
      <Card.Header>
        {event?.title}
        {isAdmin
          ? <a>Edit Title</a>
          : null
        }
      </Card.Header>
      <Card.Body>
        {event?.signedURL ? <Card.Img src={event.signedURL}/> : null}
        {isAdmin
          ? <a onClick={() => {setEditMode({...editMode, image: true})}}>Edit Picture</a>
          : null
        }
        {event?.description ? <Card.Text>{event.description}</Card.Text> : null}
        {isAdmin
          ? <a>Edit Description</a>
          : null
        }
        {event?.address ? <Card.Text>This event will be held at <a href={addressLink} target="_blank" rel="noopener noreferrer">{event.address}</a> on {event?.date}</Card.Text> : null}
        {isAdmin
          ? <a>Edit Address</a>
          : null
        }
      </Card.Body>
    </Card>
  )
};

export default EventCard;
