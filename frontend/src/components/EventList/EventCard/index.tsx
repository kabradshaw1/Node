import { Event } from "../../../generated/graphql";
import Card from 'react-bootstrap/Card';

interface SingleEventProp {
  data: Event | null
}

const EventCard: React.FC<SingleEventProp> = ({ data: event }) => {

  const addressLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event?.address || '')}`;

  return (
    <Card>
      <Card.Header>{event?.title}</Card.Header>
      <Card.Body>
        {event?.signedURL ? <Card.Img src={event.signedURL}/> : null}
        {event?.description ? <Card.Text>{event.description}</Card.Text> : null}
        {event?.address ? <Card.Text>This event will be held at <a href={addressLink} target="_blank" rel="noopener noreferrer">{event.address}</a> on {event?.date}</Card.Text> : null}
      </Card.Body>
    </Card>
  )
};

export default EventCard;
