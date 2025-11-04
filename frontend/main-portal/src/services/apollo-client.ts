import { ApolloClient, HttpLink, InMemoryCache, from, fromPromise } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { removeTypenameFromVariables } from '@apollo/client/link/remove-typename';
import Cookies from 'js-cookie';

import { RefreshTokenApi } from './mutations/refreshToken/refreshToken.svc';
import { IParseDataRefreshToken } from './mutations/refreshToken/refreshToken.type';
import { RESPONSE_CODE, SSOCOOKIES } from '@constants/index';

const removeTypenameLink = removeTypenameFromVariables();

let client: ApolloClient;
let refreshingPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const rt = Cookies.get(SSOCOOKIES.refresh);
  if (!rt || !client) return null;

  try {
    const api = new RefreshTokenApi(client);
    const parsedData: IParseDataRefreshToken = await api.execute({ input: { refreshToken: rt } });

    const newToken = parsedData?.accessToken;
    if (newToken) {
      // Cookies.set('accessToken', newToken, { expires: 1, sameSite: 'strict' });
      return newToken;
    }
    return null;
  } catch {
    return null;
  }
}

export const getApolloClient = async (): Promise<ApolloClient> => {
  if (client) {
    return client;
  }

  const httpLink = new HttpLink({
    uri: import.meta.env.VITE_API_URL || 'http://graphql-gateway:8080',
  });

  const authLink = setContext(async (_, { headers }) => {
    const token = Cookies.get('accessToken');
    return {
      headers: {
        ...headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };
  });

  // Error handling link
  const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    console.log('1 Error received from server: ', { graphQLErrors, networkError });
    if (graphQLErrors && graphQLErrors.length > 0) {
      const err = graphQLErrors[0] as any;
        const { message, locations, path } = err as any;
        console.error(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);

        // Extract code from multiple possible shapes
        let parsedCode: number | string | undefined = (err as any)?.extensions?.code ?? (err as any)?.code;
        if (!parsedCode && typeof message === 'string') {
          try {
            const prefix = 'Context creation failed: ';
            const msg = message.startsWith(prefix) ? message.slice(prefix.length) : message;
            const parsed = JSON.parse(msg);
            parsedCode = parsed?.code;
          } catch {
            //do nothing
          }
        }

        console.log('Error code from server (resolved): ', parsedCode);
        const opName = operation.operationName || '';
        if (parsedCode === RESPONSE_CODE.TOKEN_EXPIRED && opName !== 'RefreshToken') {
          console.log("2. Gửi refreshToken mutation");

          if (!refreshingPromise) {
            refreshingPromise = refreshAccessToken().finally(() => {
              refreshingPromise = null;
            });
          }

          return fromPromise(refreshingPromise).flatMap((newToken) => {
            if (newToken) {
              console.log("new token: ", newToken);
              Cookies.set('accessToken', newToken, { expires: 1, sameSite: 'strict' });
              operation.setContext(({ headers = {} }) => ({
                headers: {
                  ...headers,
                  Authorization: `Bearer ${newToken}`,
                },
              }));
              return forward(operation);
            } else {
              Cookies.remove(SSOCOOKIES.access);
              Cookies.remove(SSOCOOKIES.refresh);
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

  // Create Apollo Client with authLink and httpLink combined
  const apolloClient = new ApolloClient({
    link: from([
      removeTypenameLink,
      errorLink,
      authLink.concat(httpLink),
    ]),
    cache: new InMemoryCache(),
    defaultOptions,
  });

  client = apolloClient;
  return client;
};
