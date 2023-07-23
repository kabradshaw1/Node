import Card from 'react-bootstrap/Card';
import { RootState } from '../store';
import { useSelector } from 'react-redux';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { } from '../generated/graphql';
const Account: React.FC = () => {
  return (
    <h3>Account place holder.  Coming soon!</h3>

  )
}

export default Account;