import { Heading as HeadingType } from "mdast";
import { PropsWithChildren } from "react";
import { IMetaComponentBase } from ".";

import classNames from "classnames";

export const Heading: React.FC<
  PropsWithChildren<IMetaComponentBase<HeadingType>>
> = (props) => {
  const { children, node } = props;

  const Component = `h${node.depth}` as keyof JSX.IntrinsicElements;

  return (
    <Component className={
      classNames(
        "font-semibold text-black",
        {
          "text-6xl": node.depth === 1,
          "text-5xl": node.depth === 2,
          "text-4xl": node.depth === 3,
          "text-2xl": node.depth === 4,
          "text-xl": node.depth === 5,
          "text-lg": node.depth === 6
        }
      )
    }>
      {children}
    </Component>
  );
};

export default Heading;
