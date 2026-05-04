import React from 'react';
import type { SearchProps } from '../types';

interface SearchState {
  inputValue: string;
}

export class Search extends React.Component<SearchProps, SearchState> {
  constructor(props: SearchProps) {
    super(props);
    this.state = { inputValue: props.initialSearchTerm || '' };
  }

  componentDidUpdate(prevProps: SearchProps) {
    if (prevProps.initialSearchTerm !== this.props.initialSearchTerm) {
      this.setState({ inputValue: this.props.initialSearchTerm || '' });
    }
  }

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputValue: e.target.value });
  };

  handleSearchClick = () => {
    const trimmed = this.state.inputValue.trim();
    this.props.onSearch(trimmed);
  };

  render() {
    const { inputValue } = this.state;
    const { isLoading } = this.props;
    return (
      <div className="search-form">
        <input
          type="text"
          value={inputValue}
          onChange={this.handleInputChange}
          placeholder="(Toyota)"
          className="search-input"
          disabled={isLoading}
        />
        <button
          onClick={this.handleSearchClick}
          disabled={isLoading}
          className="search-button"
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
    );
  }
}