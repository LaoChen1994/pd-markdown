import { TableCell as TableCellType } from 'mdast'
import { PropsWithChildren, FC } from 'react'
import { IMetaComponentBase } from '.'


const TableCell: FC<PropsWithChildren<IMetaComponentBase<TableCellType>>> = (props) => {
  const { children } = props

  return (
    <td className="table-cell text-base py-2 px-3">
      {children}
    </td>
  )
}


export default TableCell