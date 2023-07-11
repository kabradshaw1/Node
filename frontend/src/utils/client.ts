import { ApolloClient, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { createUploadLink } from 'apollo-upload-client';
import store from '../store';

const uploadLink = createUploadLink({
  uri: `${process.env.REACT_APP_EX_API_URL}/graphql`,
});

const authLink = setContext((_, { headers }) => {
  // Get the token from the Redux store
  const token = store.getState().auth.token;

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(uploadLink),
  cache: new InMemoryCache(),
});

export default client;
