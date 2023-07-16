import { Event } from "../../../generated/graphql";
import Card from 'react-bootstrap/Card';

interface SingleEventProp {
  data: Event | null
}
const EventCard: React.FC<SingleEventProp> = ({ data: event }) => {
  if (event?.date) {
    const date = event?.date.toString
  }
  return (
    <Card>
      <Card.Header>{event?.title}</Card.Header>
      <Card.Body>
        {event?.signedURL ? <Card.Img src={event.signedURL}/> : null}
        {event?.description ? <Card.Text>{event.description}</Card.Text> : null}
        <Card.Text>{event?.date}</Card.Text>
      </Card.Body>
    </Card>
  )
};

export default EventCard;