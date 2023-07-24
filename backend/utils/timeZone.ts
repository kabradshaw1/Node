import moment from 'moment-timezone';

function timeZone(timestamp: Date, timezone = "UTC"): Date {
  // convert the timestamp to the specified timezone
  const time = moment(timestamp).tz(timezone);

  // format the time as desired
  const formatted = time.format();

  return new Date(formatted);
}

export default timeZone