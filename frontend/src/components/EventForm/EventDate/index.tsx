import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Controller } from 'react-hook-form';
import { BsFillCalendarEventFill } from 'react-icons/bs';
import ReactDatePicker from 'react-datepicker';

interface DateProps {
  register: any;
  error?: string | undefined;
  control: any;
};

const EventDate: React.FC<DateProps> = ({control, error, register}) => {
  return (
    <Form.Group>
    <Col>
      <Row>
      <Form.Label>Event Date (Required)</Form.Label>
      </Row>
      <BsFillCalendarEventFill className=''/>
      <Controller
        control={control}
        name="date"
        render={({ field: { onChange, value } }) => (
          <ReactDatePicker
            selected={value}
            onChange={(date: Date) => {
              onChange(date);  // You should pass Date or null to onChange
            }}
            dateFormat="MM/dd/yyyy h:mm aa" // maintains the AM/PM format for time
            showTimeSelect
            timeFormat="h:mm aa" // updated to 12-hour time format
            timeIntervals={15}
            timeCaption="time"
            className={`form-control ${error ? 'is-invalid' : ''}`}
          />
        )}
      />
      {error && <Form.Control.Feedback className='invalid-feedback'>{error}</Form.Control.Feedback>}
    </Col>
  </Form.Group>
  )
};

export default EventDate;