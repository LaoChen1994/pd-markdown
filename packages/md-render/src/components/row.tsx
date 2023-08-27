import { TableRow as TableRowType } from 'mdast'
import { PropsWithChildren, FC } from 'react'
import { IMetaComponentBase } from '.'


const TableRow: FC<PropsWithChildren<IMetaComponentBase<TableRowType>>> = (props) => {
  const { children } = props

  return (
    <tr className="table-row">
      {children}
    </tr>
  )
}


export default TableRow