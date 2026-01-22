// Card.tsx
// Card.tsx
import type { ReactNode } from 'react';

interface CardProps {
  title: string;
  description: string;
  children: ReactNode;
}

export default function Card(
    { title, description, children }: CardProps
) {
  return (
    <div className="bg-white rounded-3xl my-10 shadow-2xl shadow-black/10 px-10 py-8 pb-10">
      <h2 className="text-2xl font-bold m-1 text-gray-900">{title}</h2>
      <p className="text-gray-600 m-1 mb-6">{description}</p>
      <div className="overflow-hidden">
        {children}
      </div>
    </div>
  );
}