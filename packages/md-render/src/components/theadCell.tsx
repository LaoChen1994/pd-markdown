import classNames from 'classnames'
import { FC, PropsWithChildren } from 'react'
import { IMetaComponentBase } from '.'
import { TableHeadCell as TableHeadCellType } from '@pdchen/markdown-typings'


const TableHeadCell: FC<PropsWithChildren<IMetaComponentBase<TableHeadCellType>>> = (props) => {
  const { children } = props

  return (
    <th
      className={classNames(
        "text-base py-2 px-3 border-collapse",
        "border-b text-slate-400 text-left",
      )}
    >
      {children}
    </th>
  )
}

export default TableHeadCell
