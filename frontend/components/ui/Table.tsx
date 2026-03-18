import React from 'react';

interface TableProps {
    columns: string[];
    children: React.ReactNode;
    isLoading?: boolean;
    colSpan?: number;
    emptyMessage?: React.ReactNode;
    isEmpty?: boolean;
}

export const Table: React.FC<TableProps> = ({ 
    columns, 
    children, 
    isLoading = false, 
    emptyMessage = "No records found.", 
    isEmpty = false,
    colSpan 
}) => {
    const span = colSpan || columns.length;

    return (
        <div className="card-no-hover p-0 overflow-hidden">
            <table className="table-w-full w-full">
                <thead style={{ backgroundColor: '#F8FAFC' }}>
                    <tr>
                        {columns.map((col, idx) => (
                            <th key={idx}>{col}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan={span} className="text-center py-8 text-secondary animate-pulse">
                                Loading data...
                            </td>
                        </tr>
                    ) : isEmpty ? (
                        <tr>
                            <td colSpan={span} className="text-center py-12">
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        children
                    )}
                </tbody>
            </table>
        </div>
    );
};
