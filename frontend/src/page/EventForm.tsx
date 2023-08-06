import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as Yup from 'yup';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useAddEventMutation } from '../generated/graphql';
import { useNavigate } from 'react-router-dom';
import { BsFillCalendarEventFill } from 'react-icons/bs';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Logo from '../components/Logo';
import Container from 'react-bootstrap/Container';
import { Description, Title, Image, Address, EventDate } from '../components/EventForm';

interface FormSubmit {
  date: Date,
  file?: any,
  title: string,
  description?: string,
  address: string,
}

const EventForm: React.FC = () => {
  const [ addEvent, { data, loading: mutationLoading, error } ] = useAddEventMutation();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    date: Yup.date().nullable().transform((curr, orig) => orig === '' ? null : curr).required('You must choose a date'),
    title: Yup.string().required('You must set a title for event'),
    file: Yup.mixed()
      .test('fileSize', 'The file is too large', value => {
        const file = value as File;
        return !file || file.size <= 5000000;
      })
      .test('fileType', 'Unsupported File Format. Supported formats are .jpg, .jpeg, .png, .gif, .webp', value => {
        const file = value as File;
        return !file || ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type);
      }),
    description: Yup.string(),
    address: Yup.string().required('You must put an address')
  });

  const { control, register, handleSubmit, formState:{errors}, setValue } = useForm(
    {resolver: yupResolver(validationSchema)}
  );

  const uploadFile = async (signedURL: string, file: any) => {

    const results = await fetch(signedURL, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type
      }
    });
    if (results.ok) {
      navigate('/');
    } else {
      setMessage('An error has occured.');
      setLoading(false);
      throw new Error(`Failed to upload file: ${results.statusText}`);
    }
  };

  const formSubmit: SubmitHandler<FormSubmit> = async (data) => {
    setLoading(true);

    try {
      const response = await addEvent({
        variables: {
          title: data.title,
          description: data.description,
          date: new Date(data.date.getTime()).toISOString(),
          fileName: data.file?.name,
          fileType: data.file?.type,
          address: data.address
        },
      });

      if (response.data?.addEvent?.signedURL) {
        uploadFile(response.data?.addEvent?.signedURL, data.file)
      } else {
        navigate('/');
      }
    } catch (e) {
      console.log(e)
      if (error?.message) {
        setMessage(error.message);
      }
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row>
        <Col md={6} sm={12}>
          <Card>
            <Form noValidate onSubmit={handleSubmit(formSubmit)}>
              <Card.Header><h3>Event Form</h3></Card.Header>
              <Card.Body>
                <Title register={register} error={errors.title?.message}/>
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
                        className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                      />
                    )}
                  />
                  <Form.Control.Feedback className='invalid-feedback'>{errors.date?.message}</Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group>
                <Form.Label>Event Adress (Required)</Form.Label>
                <Form.Control type='string' {...register('address')} className={`form-control ${errors.address ? 'is-invalid' : ''}`}/>
                <Form.Control.Feedback className='invalid-feedback'>{errors.address?.message}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label>Image Upload (Optional)</Form.Label>
                <Controller
                  control={control}
                  name="file"
                  render={({ field: { onChange, ref } }) => (
                    <Form.Control
                      type='file'
                      ref={ref}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        onChange(e.target.files?.[0]); // update the form value
                        if (e.target.files) {
                          setValue('file', e.target.files[0], { shouldValidate: true }); // set the file value for validation
                        }
                      }}
                      isInvalid={!!errors.file} // add this line to mark the input as invalid if there are errors
                    />
                  )}
                />
                <Form.Control.Feedback className='invalid-feedback'>{errors.file?.message}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className='mb-1'>
                <Form.Label>Event Description (Optional)</Form.Label>
                <Form.Control as="textarea" {...register('description')} className={`form-control ${errors.description ? 'is-invalid' : ''}`}/>
                <Form.Control.Feedback className='invalid-feedback'>{errors.description?.message}</Form.Control.Feedback>
              </Form.Group>
              <Button type='submit' disabled={loading || mutationLoading}>Submit Event</Button>
              <Form.Label>{message}</Form.Label>
              </Card.Body>
            </Form>
          </Card>
        </Col>
        <Col md={6} sm={12}>
          <Card>
            <Logo/>
          </Card>
        </Col>
      </Row>
    </Container>
  )
};

export default EventForm;