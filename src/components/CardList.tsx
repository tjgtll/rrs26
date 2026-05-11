import React from 'react';
import type { Vehicle } from '../types';
import { Card } from './Card';

interface CardListProps {
  vehicles: Vehicle[];
}

export class CardList extends React.Component<CardListProps> {
  render() {
    const { vehicles } = this.props;

    return (
      <div className="table-container">
        <table className="results-table">
          <thead>
            <tr>
              <th>Make</th>
              <th>Model</th>
            </tr>
          </thead>
            <tbody>
            {vehicles.map(vehicle => (
              <Card key={vehicle.id} vehicle={vehicle} />
            ))}
          </tbody>
         </table>
      </div>
    );
  }
}