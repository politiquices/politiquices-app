import { Component } from 'react'
import { withTranslation } from 'react-i18next'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error(error, info)
  }

  render() {
    const { t } = this.props
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>{t('errors.generic')}</h2>
          <p>{t('errors.reload')}</p>
        </div>
      )
    }
    return this.props.children
  }
}

export default withTranslation()(ErrorBoundary)
