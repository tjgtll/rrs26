import React, { useState } from 'react';

export const TestErrorButton: React.FC = () => {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error('Error Boundary');
  }

  const handleThrow = () => {
    setShouldThrow(true);
  };

  return (
    <button onClick={handleThrow} className="error-test-btn">
      error
    </button>
  );
};