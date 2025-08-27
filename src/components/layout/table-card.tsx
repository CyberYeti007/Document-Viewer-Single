import React from 'react'
import { Card, CardHeader, CardDescription, CardTitle, CardContent } from '@/components/ui/card'
import { Filter, Search } from 'lucide-react';
import { Button } from '../ui/button';


type TableColumn<T extends object = Record<string, unknown>> = {
    key: keyof T & string;
    header: React.ReactNode;
    className?: string;
    render?: (value: T[keyof T], row: T) => React.ReactNode;
};

type TableAction<T extends object = Record<string, unknown>> = {
    icon: React.ReactNode;
    onClick: (row: T) => void;
};

type TableCardProps<T extends object = Record<string, unknown>> = {
    title: string;
    description?: string;
    data?: T[];
    columns?: TableColumn<T>[];
    actions?: TableAction<T>[];
    showSearch?: boolean;
    showFilter?: boolean;
    emptyMessage?: string;
    className?: string;
};

const TableCard = <T extends object = Record<string, unknown>>({
    title,
    description,
    data = [],
    columns = [],
    actions = [],
    showSearch = true,
    showFilter = true,
    emptyMessage = "No data available",
    className = "",
}: TableCardProps<T>) => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [filteredData, setFilteredData] = React.useState<T[]>(data);

    React.useEffect(() => {
        if (!searchTerm) {
            setFilteredData(data);
        } else {
            const filtered = data.filter(row => 
                Object.values(row).some(value =>
                    value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
            setFilteredData(filtered);
        }
    }, [searchTerm, data]);
    return (
        <Card className={`w-full ${className}`}>
            <CardHeader>
                <div className='flex items-center justify-between'>
                    <div>
                        <CardTitle>{title}</CardTitle>
                        {description && <CardDescription>{description}</CardDescription>}
                    </div>
                    <div className='flex items-center space-x-2'>
                        {showSearch && (
                            <div className='relative'>
                                <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                                <input
                                    type='text'
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className='pl-8 pr-4 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring'
                                    />
                            </div>
                        )}
                        {showFilter && (
                            <Button variant="outline" size="sm">
                                <Filter className="h-4 w-4 mr-2" />
                                Filter
                            </Button>
                            )}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {filteredData.length === 0 ? (
                    <div className='text-center py-8 text-muted-foreground'>
                        {emptyMessage}
                    </div>
                ) : (
                    <div className="relative w-full overflow-auto">
            <table className="w-full caption-bottom text-sm">
              <thead className="[&_tr]:border-b">
                <tr className="border-b transition-colors hover:bg-muted/50">
                  {columns.map((column, index) => (
                    <th key={index} className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground ${column.className || ''}`}>
                      {column.header}
                    </th>
                  ))}
                  {actions.length > 0 && <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[100px]">Actions</th>}
                </tr>
              </thead>
              <tbody className="[&_tr:last-child]:border-0">
                {filteredData.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b transition-colors hover:bg-muted/50">
                    {columns.map((column, colIndex) => (
                      <td key={colIndex} className={`p-4 align-middle ${column.className || ''}`}>
                        {column.render ? column.render(row[column.key], row) : (row[column.key] as React.ReactNode)}
                      </td>
                    ))}
                    {actions.length > 0 && (
                      <td className="p-4 align-middle">
                        <div className="flex items-center space-x-2">
                          {actions.map((action, actionIndex) => (
                            <Button
                              key={actionIndex}
                              variant="ghost"
                              size="sm"
                              onClick={() => action.onClick(row)}
                              className="h-8 w-8 p-0"
                            >
                              {action.icon}
                            </Button>
                          ))}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </CardContent>
    </Card>
    )
}
export default TableCard;