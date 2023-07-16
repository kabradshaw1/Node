import EventCard from "./EventCard";
import {useEventsQuery} from '../../generated/graphql';

const EventList: React.FC = () => {
  const { loading, error, data } = useEventsQuery()
  if (loading) return <h4>Loading...</h4>
  if(error) return <h4>Error...</h4>

  const events = data?.events
  if (!events || events.length === 0) return <h4>No events are currently scheduled.  Complain to Brook!</h4>;

  return (
    <>
      {events && events.map((event) => {
        return(
          <EventCard data={event}/>
        )
      })}
    </>
  )
}

export default EventList;