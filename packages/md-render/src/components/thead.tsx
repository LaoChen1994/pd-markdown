import classNames from 'classnames';
import { FC, PropsWithChildren } from 'react';
import { IMetaComponentBase } from '.';
import { TableHead as TableHeadType } from '@pdchen/markdown-typings';

const TableHead: FC<PropsWithChildren<IMetaComponentBase<TableHeadType>>> = (props) => {
  const { children } = props

  return (
    <thead
      className={classNames(
        "font-semibold text-xl text-center [&>tr]:bg-gray-50",
        "rounded-lg overflow-hidden border-separate"
      )}
    >
      {children}
    </thead>
  )
}

export default TableHead


