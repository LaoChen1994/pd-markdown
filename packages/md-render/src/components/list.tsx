import { FC, PropsWithChildren } from "react";
import { IMetaComponentBase } from ".";
import { List as ListType } from 'mdast'

const List: FC<PropsWithChildren<IMetaComponentBase<ListType>>> = (props) => {
  const { node, children } = props

  const { ordered } = node

  const Component = ordered ? 'ol' : 'ul';

  return <Component className="mt-3 mb-3">{children}</Component>
}

export default List;