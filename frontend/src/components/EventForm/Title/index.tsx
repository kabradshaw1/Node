import Form from 'react-bootstrap/Form';

interface TitleProps {
  register: any;
  error?: string | undefined;
}

const Title: React.FC<TitleProps> = ({ register, error }) => {
  return (
    <Form.Group>
      <Form.Label>Event Title (Required)</Form.Label>
      <Form.Control type='string' defaultValue='Input Title' {...register('title')} className={`form-control ${error? 'is-invalid' : ''}`}/>
      <Form.Control.Feedback className='invalid-feedback'>{error ? error: ''}</Form.Control.Feedback>
      {error && <Form.Control.Feedback className='invalid-feedback'>{error}</Form.Control.Feedback>}
    </Form.Group>
  )
};

export default Title;