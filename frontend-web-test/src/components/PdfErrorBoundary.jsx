import React from 'react';

class PdfErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    console.error(error);

    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          Failed to render PDF preview.
          {this.state.error?.message ? ` ${this.state.error.message}` : ''}
        </div>
      );
    }
    return this.props.children;
  }
}

export default PdfErrorBoundary;