import React from 'react';
import type { Vehicle } from '../types';

interface CardProps {
  vehicle: Vehicle;
}

export class Card extends React.Component<CardProps> {
  render() {
    const { make, name } = this.props.vehicle;
    return (
      <tr>
        <td>{make}</td>
        <td>{name}</td>
      </tr>
    );
  }
}