import '@ant-design/v5-patch-for-react-19';
import { ApolloProvider } from '@apollo/client';
import { getApolloClient } from '@services/apollo-client.ts';
import { store } from '@store/index.ts';
import '@styles/global.scss';
import { ConfigProvider } from 'antd';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './app.tsx';
import { ToastContainer } from 'react-toastify';
import { SocketProvider } from './contexts/SocketContext.tsx';
import 'react-toastify/dist/ReactToastify.css'
import { ApiProvider } from './contexts/api-provider.context.tsx';


const client = await getApolloClient();
const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <Provider store={store}>
    <ApolloProvider client={client}>
      <ConfigProvider
        theme={{
          cssVar: true,
          token: {
            fontFamily: 'Inter, sans-serif',
            colorPrimary: '#2F54EB',
          },
          components: {
            Button: {
            },
          },
        }}
      >
        <ApiProvider>
          <SocketProvider>
            <App />
            <ToastContainer
              autoClose={1000}
              position="top-right"
              hideProgressBar
              newestOnTop
              pauseOnFocusLoss
              draggable
            />
          </SocketProvider>
        </ApiProvider>
      </ConfigProvider>
    </ApolloProvider>
  </Provider>,
);