import React from 'react';

export default function AeternaTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="not-prose my-14 mx-auto max-w-3xl rounded-md border border-[#d4af37]/40 bg-[#fefcf5] shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1),0_0_0_1px_rgba(212,175,55,0.15),inset_0_1px_0_rgba(255,255,240,0.8),inset_0_-1px_0_rgba(0,0,0,0.05)] aeterna-custom-table-container">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left">
          {children}
        </table>
      </div>
      <style>{`
        .aeterna-custom-table-container table {
          border-collapse: collapse;
          width: 100%;
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem;
        }
        .aeterna-custom-table-container th {
          font-family: 'Cinzel', serif;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #8B6914;
          background: linear-gradient(to bottom, rgba(212,175,55,0.08), rgba(212,175,55,0.02));
          padding: 1rem 1.5rem;
          border-bottom: 1px solid rgba(212,175,55,0.5);
          white-space: nowrap;
        }
        .aeterna-custom-table-container td {
          padding: 0.85rem 1.5rem;
          color: #3E2C23;
          border-bottom: 1px solid rgba(212,175,55,0.15);
          vertical-align: top;
        }
        .aeterna-custom-table-container tr:last-child td {
          border-bottom: none;
        }
        .aeterna-custom-table-container tr:nth-child(even) td {
          background-color: rgba(212,175,55,0.03);
        }
        .aeterna-custom-table-container tr:hover td {
          background-color: rgba(212,175,55,0.08);
          transition: background-color 0.3s ease;
        }
        /* Primera columna con un ligero énfasis */
        .aeterna-custom-table-container td:first-child {
          font-weight: 500;
          color: #2E2416;
        }
      `}</style>
    </div>
  );
}
