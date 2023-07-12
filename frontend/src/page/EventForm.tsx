import { useState, useRef } from 'react';
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
import { IoCalendarOutline } from "react-icons/io5";
import Col from 'react-bootstrap/Col';

const EventForm: React.FC = () => {
  const [ addEvent, { data, loading: mutationLoading, error } ] = useAddEventMutation();
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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
    discription: Yup.string(),
  });

  const { control, register, handleSubmit, formState:{errors}, setValue } = useForm(
    {resolver: yupResolver(validationSchema)}
  );

  const formSubmit: SubmitHandler<AddEventMutationVariables> = async data => {
    setLoading(true);
  };

  return (
    <Form noValidate onSubmit={handleSubmit(formSubmit)}>
      <Form.Label><h3>Event Form</h3></Form.Label>
      <Form.Group>
        <Form.Label>Event Title</Form.Label>
        <Form.Control type='string' {...register('title')} className={`form-control ${errors.title ? 'is-invalid' : ''}`}/>
        <Form.Control.Feedback className='invalid-feedback'>{errors.title?.message}</Form.Control.Feedback>
      </Form.Group>
      <Form.Group>
        <Col>
        <Form.Label>Event Date</Form.Label>
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
        <Form.Label>Image Upload</Form.Label>
        <Form.Control
          type='file'
          {...register('file')}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if(e.target.files) {
              setValue('file', e.target.files[0], { shouldValidate: true });
            }
          }}
        />
      </Form.Group>
      <Button type='submit' disabled={loading || mutationLoading}>Submit Event</Button>
      <Form.Label>{message}</Form.Label>
    </Form>
  )
};

export default EventForm;