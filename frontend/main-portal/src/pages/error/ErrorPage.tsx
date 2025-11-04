
import { Component, type ErrorInfo, type PropsWithChildren } from 'react'
// eslint-disable-next-line import/no-unresolved
import ambulance from '../../assets/images/ambulance.svg';
import './style.scss'

interface State {
  hasError: boolean
  error: Error | null
}


class ErrorBoundary extends Component<PropsWithChildren, State> {
  state: State = {
    hasError: false,
    error: null,
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  componentDidUpdate(_prevProps: PropsWithChildren, prevState: State) {
    if (this.state.hasError && !prevState.hasError) {
      console.log('ErrorBoundary: ', this.state.error)
    }
  }

  render() {

    if (this.state.hasError) {
      return (
        <div 
          style={{
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100vh', 
            textAlign: 'center',
            gap: '20px',
            textTransform: 'uppercase',
            color: 'red',
            fontWeight: 'bold', 
            fontSize: '24px',
          }}>
      <h1 >Something went wrong. Please try again later.</h1>

      <img 
        src={ambulance}
        alt="Error Illustration" 
        width="300" 
        height="200" 
        className="ambulance"
        />
      </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
