import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Controller } from 'react-hook-form';

interface ImageProps {
  control: any;
  error: string | undefined;
  setValue: any;
}

const Image: React.FC<ImageProps> = ({control, error, setValue}) => {
  return (
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
          isInvalid={!!error} // add this line to mark the input as invalid if there are errors
        />
      )}
    />
    {error && <Form.Control.Feedback className='invalid-feedback'>{error}</Form.Control.Feedback>}
  </Form.Group>
  )
};

export default Image;