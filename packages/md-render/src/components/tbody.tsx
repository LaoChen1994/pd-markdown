import { FC, PropsWithChildren } from 'react'
import { IMetaComponentBase } from '.'
import type { TableBody } from "@pdchen/markdown-typings";


const TableBodyCell: FC<PropsWithChildren<IMetaComponentBase<TableBody>>> = (props) => {
  const { children } = props

  return <tbody>{children}</tbody>
}


export default TableBodyCell
