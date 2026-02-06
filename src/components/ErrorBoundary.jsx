import { Component } from 'react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="text-center px-6">
            <h1 className="text-2xl font-bold text-gray-dark mb-4">
              Что-то пошло не так
            </h1>
            <p className="text-gray-medium mb-6">
              Попробуйте перезагрузить страницу
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gray-dark text-white rounded-lg hover:bg-black transition-colors font-medium"
            >
              Перезагрузить
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
