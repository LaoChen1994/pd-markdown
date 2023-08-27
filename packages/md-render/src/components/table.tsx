import classNames from "classnames";
import { Table as TableType } from "mdast";
import { PropsWithChildren } from "react";
import { IMetaComponentBase } from ".";

const Table: React.FC<PropsWithChildren<IMetaComponentBase<TableType>>> = (
  props
) => {
  const { children } = props;

  return (
    <table
      className={classNames(
        "table-fixed border-separate border my-4 mx-auto",
        "rounded-lg text-base box-border"
      )}
      cellSpacing={0}
    >
      {children}
    </table>
  );
};

export default Table;
