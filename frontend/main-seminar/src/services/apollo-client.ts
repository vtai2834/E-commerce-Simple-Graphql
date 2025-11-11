import { ApolloClient, HttpLink, InMemoryCache, from, fromPromise } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import Cookies from 'js-cookie';
import { RESPONSE_CODE, SSOCOOKIES } from '../constants';

let client: ApolloClient<any>;
let refreshingPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const rt = Cookies.get(SSOCOOKIES.refresh);
  if (!rt || !client) return null;

  try {
    const result = await client.mutate({
      mutation: require('./mutations/refreshToken').REFRESH_TOKEN_MUTATION,
      variables: { input: { refreshToken: rt } }
    });

    const newToken = result.data?.refreshToken?.accessToken;
    if (newToken) {
      return newToken;
    }
    return null;
  } catch {
    return null;
  }
}

export const getApolloClient = async (): Promise<ApolloClient<any>> => {
  if (client) {
    return client;
  }

  const httpLink = new HttpLink({
    uri: import.meta.env.VITE_API_URL || 'http://localhost:8000/graphql',
  });

  const authLink = setContext(async (_, { headers }) => {
    const token = Cookies.get(SSOCOOKIES.access);
    return {
      headers: {
        ...headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };
  });

  // Error handling link
  const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    console.log('GraphQL Error received: ', { graphQLErrors, networkError });
    
    if (graphQLErrors && graphQLErrors.length > 0) {
      const err = graphQLErrors[0] as any;
      const { message, locations, path } = err;
      console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);

      // Extract error code
      let parsedCode: number | string | undefined = err?.extensions?.code ?? err?.code;
      if (!parsedCode && typeof message === 'string') {
        try {
          const prefix = 'Context creation failed: ';
          const msg = message.startsWith(prefix) ? message.slice(prefix.length) : message;
          const parsed = JSON.parse(msg);
          parsedCode = parsed?.code;
        } catch {
          // do nothing
        }
      }

      console.log('Error code resolved: ', parsedCode);
      const opName = operation.operationName || '';
      
      if (parsedCode === RESPONSE_CODE.TOKEN_EXPIRED && opName !== 'RefreshToken') {
        console.log("Token expired, refreshing...");

        if (!refreshingPromise) {
          refreshingPromise = refreshAccessToken().finally(() => {
            refreshingPromise = null;
          });
        }

        return fromPromise(refreshingPromise).flatMap((newToken) => {
          if (newToken) {
            console.log("New token received: ", newToken);
            Cookies.set(SSOCOOKIES.access, newToken, { expires: 1, sameSite: 'strict' });
            operation.setContext(({ headers = {} }) => ({
              headers: {
                ...headers,
                Authorization: `Bearer ${newToken}`,
              },
            }));
            return forward(operation);
          } else {
            // Clear tokens and redirect to login
            Cookies.remove(SSOCOOKIES.access);
            Cookies.remove(SSOCOOKIES.refresh);
            window.location.href = '/login';
            return forward(operation);
          }
        });
      }
    }
    
    if (networkError) {
      console.error(`[Network error]: ${networkError}`);
    }
  });

  const defaultOptions = {
    watchQuery: { fetchPolicy: 'no-cache' as const},
    query: { fetchPolicy: 'no-cache' as const},
    mutate: { fetchPolicy: 'no-cache' as const},
  };

  // Create Apollo Client
  const apolloClient = new ApolloClient({
    link: from([
      errorLink,
      authLink.concat(httpLink),
    ]),
    cache: new InMemoryCache(),
    defaultOptions,
  });

  client = apolloClient;
  return client;
};