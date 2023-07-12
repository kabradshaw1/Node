import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as Yup from 'yup';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {
  useAddEventMutation,
  AddEventMutationVariables,} from '../generated/graphql';
import { useNavigate } from 'react-router-dom';
import { BsFillCalendarEventFill } from "react-icons/bs";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Logo from '../components/Logo';
import Container from 'react-bootstrap/Container';

const EventForm: React.FC = () => {
  const [ addEvent, { data, loading: mutationLoading, error } ] = useAddEventMutation();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  console.log(loading)
  const validationSchema = Yup.object().shape({
    date: Yup.date().nullable().transform((curr, orig) => orig === '' ? null : curr).required('You must put choose a date'),
    title: Yup.string().required('You must set a title for event'),
    file: Yup.mixed()
      .test('fileSize', 'The file is too large', value => {
        const files = value as FileList;
        return !files || (files[0] && files[0].size <= 5000000);
      })
      .test('fileType', 'Unsupported File Format. Supported formats are .jpg, .jpeg, .png, .gif, .webp', value => {
        const files = value as FileList;
        return !files || (files[0] && ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(files[0].type));
      }),
    description: Yup.string(),
  });

  const { control, register, handleSubmit, formState:{errors}, setValue } = useForm(
    {resolver: yupResolver(validationSchema)}
  );

  const formSubmit: SubmitHandler<AddEventMutationVariables> = async data => {
    setLoading(true);
    const { title, description, date, file } = data;

    const payload: AddEventMutationVariables = {
      title,
      description,
      date: date?.target?.value
    };

    try {
      const response = await addEvent({
        variables: {
          ...payload,
          file: file,
        },
      });

      if (response && response.data) {
        navigate('/')
      } else if (response.errors) {
        console.log(response.errors);
        setMessage('An error has occured.');
        setLoading(false);
      }
    } catch (e) {
      console.log(e)
      setMessage('An error has occured.');
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
              <Form.Group>
                <Form.Label>Event Title (Required)</Form.Label>
                <Form.Control type='string' {...register('title')} className={`form-control ${errors.title ? 'is-invalid' : ''}`}/>
                <Form.Control.Feedback className='invalid-feedback'>{errors.title?.message}</Form.Control.Feedback>
              </Form.Group>
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
                        onChange={(date) => {
                          onChange({ target: { value: date } } as any); // Here's the change
                        }}
                        dateFormat="MM/dd/yyyy"
                        className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                      />
                    )}
                  />
                  <Form.Control.Feedback className='invalid-feedback'>{errors.date?.message}</Form.Control.Feedback>
                </Col>
              </Form.Group>
              <Form.Group>
                <Form.Label>Image Upload (Optional)</Form.Label>
                <Controller
                  control={control}
                  name="file"
                  render={({ field: { onChange, value, ref } }) => (
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
                <Form.Label>Event description (Optional)</Form.Label>
                <Form.Control type='string' {...register('description')} className={`form-control ${errors.description ? 'is-invalid' : ''}`}/>
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