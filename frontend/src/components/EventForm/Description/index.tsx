import Form from 'react-bootstrap/Form';

interface DescriptionProps {
  error?: string | undefined;
  register: any
}

const Description: React.FC<DescriptionProps> = ({ register, error }) => {
  return (
    <Form.Group className='mb-1'>
      <Form.Label>Event Description (Optional)</Form.Label>
      <Form.Control as="textarea" {...register('description')} className={`form-control ${error ? 'is-invalid' : ''}`}/>
      {error && <Form.Control.Feedback className='invalid-feedback'>{error}</Form.Control.Feedback>}
    </Form.Group>
  )
};

export default Description;