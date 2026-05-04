import React from 'react';
import type { ResultsProps } from '../types';
import { CardList } from './CardList';

export class Results extends React.Component<ResultsProps> {
  render() {
    const { items, error } = this.props;

    if (error) {
      return <div className="error-message">{error}</div>;
    }

    if (items.length === 0) {
      return (
        <div className="empty-state">
          <p>Error description</p>
        </div>
      );
    }

    return <CardList vehicles={items} />;
  }
}