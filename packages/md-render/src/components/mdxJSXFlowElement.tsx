import { MdxJsxFlowElement as MdxJsxFlowElementType } from "mdast-util-mdx";
import { PropsWithChildren, useMemo } from "react";
import { IMetaComponentBase } from ".";
import { useMDXContext } from "../context";


const MDXJSXFlowElement = (props: PropsWithChildren<IMetaComponentBase<MdxJsxFlowElementType>>) => {
  const { children, node } = props;
  const { components } = useMDXContext();

  const Component = node.name ? components[node.name] : null

  if (!Component) return null;

  const attrs = useMemo(() => {
    if (!node.attributes) return null;

    return node.attributes.reduce((acc, item) => {
      if (item.type === "mdxJsxAttribute") {
        acc[item.name] = item.value;
      }
      return acc;
    }, {} as Record<string, any>);
  }, [])

  return (
    <Component {...attrs}>
      {children}
    </Component>
  );
};

export default MDXJSXFlowElement;
