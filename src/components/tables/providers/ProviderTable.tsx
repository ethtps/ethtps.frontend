import { ProviderResponseModel } from '@/api-client';
import { darkenColorIfNecessary } from '@/components';
import { Table, Image } from '@mantine/core'
import { useState } from 'react';

type ExtraColumns = Partial<{
  currentValue: number,
  maxRecorded: number
}>

type ExtendedProviderResponseModel = ProviderResponseModel & ExtraColumns;

type SortState = {
  column: keyof ExtendedProviderResponseModel | null;
  ascending: boolean;
};

const arrowUp = <span>&#9650;</span>;
const arrowDown = <span>&#9660;</span>;

const getArrowForColumn = (column: keyof ExtendedProviderResponseModel, sortState: SortState) => {
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

  const [data, setData] = useState<(ExtendedProviderResponseModel)[]>(props.providers);
  const [sortState, setSortState] = useState<SortState>({
    column: null,
    ascending: true,
  });

  const handleSort = (columnName: keyof ExtendedProviderResponseModel) => {
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

  const arrowForColumn = (column: keyof ExtendedProviderResponseModel) => getArrowForColumn(column, sortState)

  return (
    <Table className="my-table" horizontalSpacing="sm" verticalSpacing="md">
      <thead>
        <tr>
          <th>#</th>
          <th onClick={() => handleSort("name")} className="sortable">
            Name {arrowForColumn("name")}
          </th>
          <th onClick={() => handleSort("currentValue")} className="sortable">
            Current {arrowForColumn("currentValue")}
          </th>
          <th onClick={() => handleSort("maxRecorded")} className="sortable">
            Max recorded {arrowForColumn("maxRecorded")}
          </th>
          <th onClick={() => handleSort("type")} className="sortable">
            Type {arrowForColumn("type")}
          </th>
          <th onClick={() => handleSort("isGeneralPurpose")} className="sortable">
            General Purpose {arrowForColumn("isGeneralPurpose")}
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((provider, i) => (
          <tr
            key={provider.name}
            className={i % 2 === 0 ? "even-row" : "odd-row"}
            style={{ color: darkenColorIfNecessary(provider.color ?? "black") }}
          >
            <td>{i + 1}</td>
            <td className="name-cell" style={{ fontWeight: 'bold' }}>
              <Image src={`/provider-icons/${provider.name}.png`} alt={provider.name ?? "provider name here"} width={24} height={24} />
              <span className="name-text">{provider.name}</span>
            </td>
            <td>{provider.currentValue ?? 0}</td>
            <td>{provider.maxRecorded ?? 0}</td>
            <td>{provider.type}</td>
            <td>{provider.isGeneralPurpose ? "Yes" : "No"}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}
