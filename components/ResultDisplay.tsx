// components/ResultDisplay.tsx
import React from 'react';

interface ResultDisplayProps {
  result: string;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  return (
    <div className="mt-6 w-full max-w-3xl bg-white p-4 rounded shadow">
      <h3 className="text-xl font-semibold mb-2">API Response</h3>
      <p className="bg-gray-100 p-4 rounded whitespace-pre-wrap">
        {result}
      </p>
    </div>
  );
};

export default ResultDisplay;