import classNames from "classnames";
import { ListItem as ListItemType } from "mdast";
import { FC, PropsWithChildren } from "react";
import { IMetaComponentBase } from ".";

const ListItem: FC<PropsWithChildren<IMetaComponentBase<ListItemType>>> = (
  props
) => {
  const { node, children } = props;
  const { order, index } = node;

  if (order) {
    return (
      <li className="flex items-start mt-2 leading-tight">
        <i className="mr-2 text-blue-600 text-base" aria-hidden>
          {index}.
        </i>
        {children}
      </li>
    );
  }

  return (
    <li
      className={classNames(
        "mt-2 leading-tight relative pl-4",
        "before:text-base before:contents before:w-1 before:h-1 before:bg-blue-600 before:rounded-full",
        "before:!inline-block before:absolute before:left-1 before:top-2.5"
      )}
    >
      {children}
    </li>
  );
};

export default ListItem;
