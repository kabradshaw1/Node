import Form from 'react-bootstrap/Form';

interface AddressProps {
  error?: string | undefined;
  register: any;
}
const Address: React.FC<AddressProps> = ({ register, error }) => {
  return (
    <Form.Group>
      <Form.Label>Event Adress (Required)</Form.Label>
      <Form.Control type='string' {...register('address')} className={`form-control ${error ? 'is-invalid' : ''}`}/>
      {error && <Form.Control.Feedback className='invalid-feedback'>{error}</Form.Control.Feedback>}
    </Form.Group>
  )
};

export default Address;