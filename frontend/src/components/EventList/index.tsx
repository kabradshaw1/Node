import EventCard from "./EventCard";
import {useEventsQuery} from '../../generated/graphql';
import Card from 'react-bootstrap/Card'

const EventList: React.FC = () => {
  const { loading, error, data } = useEventsQuery()
  if (loading) return <h4>Loading...</h4>
  if(error) return <h4>Error...</h4>
  console.log(data?.events)
  const events = data?.events
  if (!events || events.length === 0) return <h4>No events are currently scheduled.</h4>;

  return (
    <>
    <Card>
      <Card.Header>Upcoming Events</Card.Header>
      <Card.Body>
      {events && events.map((event) => {
        return(
          <EventCard data={event}/>
        )
      })}
      </Card.Body>
    </Card>
    </>
  )
}

export default EventList;