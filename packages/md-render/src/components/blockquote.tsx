import classNames from "classnames";
import { Blockquote as BlockquoteType } from "mdast";
import { FC, PropsWithChildren } from "react";
import { IMetaComponentBase } from ".";

const Blockquote: FC<PropsWithChildren<IMetaComponentBase<BlockquoteType>>> = (
  props
) => {
  const { children } = props;

  return (
    <blockquote
      className={classNames(
        "bg-slate-300 p-6 w-[calc(100%-24px)] mx-auto rounded-lg",
        "[&>*]:italic [&>*]:text-gray-500 [&>*]:font-semibold"
      )}
    >
      {children}
    </blockquote>
  );
};

export default Blockquote;
