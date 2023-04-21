import { ProviderResponseModel } from '@/api-client';
import { Table } from '@mantine/core'
import { useState } from 'react';

type SortState = {
  column: keyof ProviderResponseModel | null;
  ascending: boolean;
};

const arrowUp = <span>&#9650;</span>;
const arrowDown = <span>&#9660;</span>;

const getArrowForColumn = (column: keyof ProviderResponseModel, sortState: SortState) => {
  if (sortState.column === column) {
    return sortState.ascending ? arrowUp : arrowDown;
  } else {
    return null;
  }
};

interface IProviderTableProps {
  providers: ProviderResponseModel[];
}

export function ProviderTable(props: IProviderTableProps) {

  const [data, setData] = useState<ProviderResponseModel[]>(props.providers);
  const [sortState, setSortState] = useState<SortState>({
    column: null,
    ascending: true,
  });

  const handleSort = (columnName: keyof ProviderResponseModel) => {
    setData(data.slice().sort((a, b) => {
      const valueA = a[columnName];
      const valueB = b[columnName];
      if (valueA === valueB) {
        return 0;
      }
      if (valueA == null) {
        return 1;
      }
      if (valueB == null) {
        return -1;
      }
      return valueA > valueB ? 1 : -1;
    }));
    setSortState({
      column: columnName,
      ascending: !sortState.ascending,
    })
  };

  const arrowForColumn = (column: keyof ProviderResponseModel) => getArrowForColumn(column, sortState)

  return (
    <Table horizontalSpacing='sm' verticalSpacing='md'>
      <thead>
        <tr>
          <th >
            #
          </th>
          <th onClick={() => handleSort('name')}>
            Name {arrowForColumn('name')}
          </th>
          <th onClick={() => handleSort('color')}>
            Color {arrowForColumn('color')}
          </th>
          <th onClick={() => handleSort('theoreticalMaxTPS')}>
            Theoretical Max TPS {arrowForColumn('theoreticalMaxTPS')}
          </th>
          <th onClick={() => handleSort('type')}>
            Type {arrowForColumn('type')}
          </th>
          <th onClick={() => handleSort('isGeneralPurpose')}>
            General Purpose {arrowForColumn('isGeneralPurpose')}
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((provider, i) => (
          <tr key={provider.name}>
            <td>{i + 1}</td>
            <td>{provider.name}</td>
            <td>{provider.color}</td>
            <td>{provider.theoreticalMaxTPS}</td>
            <td>{provider.type}</td>
            <td>{provider.isGeneralPurpose ? 'Yes' : 'No'}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
