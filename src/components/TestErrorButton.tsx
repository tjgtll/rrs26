import React from 'react';

interface TestErrorButtonState {
  shouldThrow: boolean;
}

export class TestErrorButton extends React.Component<{}, TestErrorButtonState> {
  constructor(props: {}) {
    super(props);
    this.state = { shouldThrow: false };
  }

  handleThrow = () => {
    this.setState({ shouldThrow: true });
  };

  render() {
    if (this.state.shouldThrow) {
      throw new Error('Error Boundary');
    }
    return (
      <button onClick={this.handleThrow} className="error-test-btn">
        error
      </button>
    );
  }
}