import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import 'react-datepicker/dist/react-datepicker.css';
import * as Yup from 'yup';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useAddEventMutation } from '../generated/graphql';
import { useNavigate } from 'react-router-dom';
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
                <EventDate control={control} register={register} error={errors.date?.message}/>
                <Address register={register} error={errors.address?.message}/>
                <Image setValue={setValue} error={errors.file?.message} control={control}/>
                <Address register={register} error={errors.description?.message}/>
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