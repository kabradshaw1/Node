import EventCard from "./EventCard";
import {useEventsQuery} from '../../generated/graphql';

const EventList: React.FC = () => {
  const { loading, error, data } = useEventsQuery()
  console.log(data)
  if (loading) return <h4>Loading...</h4>
  if(error) return <h4>Error...</h4>

  const events = data?.events
  if(!events) return <h4>No events</h4>

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