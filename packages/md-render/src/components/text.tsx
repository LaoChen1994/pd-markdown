import { IMetaComponentBase } from ".";
import { Text as TextType } from "mdast";
import { PropsWithChildren } from "react";

export const Text: React.FC<PropsWithChildren<IMetaComponentBase<TextType>>> = (
  props
) => {
  const { node } = props;

  return <>{node.value}</>;
};

export default Text;
