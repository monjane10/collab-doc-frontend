// DocumentHistoryTable.jsx
import React, { useState, useEffect } from "react";
import "./tabela.css";

export default function DocumentHistoryTable({ columns, data, itemsPerPage = 5 }) {
  const [currentPage, setCurrentPage] = useState(1);

  // Resetar página sempre que os dados mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = data.slice(indexOfFirstItem, indexOfLastItem);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="document-history">
      <table className="documents-table">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key}>{col.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentData.map((row, rowIndex) => (
            <tr key={row.id || rowIndex}>
              {columns.map(col => (
                <td key={col.key}>
                  {typeof col.render === "function"
                    ? col.render(row)
                    : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
          ◀ Anterior
        </button>
        <span>Página {currentPage} de {totalPages}</span>
        <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
          Próximo ▶
        </button>
      </div>
    </div>
  );
}
