import DefaultComponent from "./components";
import { MDXContextProvider } from "./context";
import * as React from 'react'
import type { CSSProperties, FunctionComponent, PropsWithChildren } from "react";

import "./index.css";
import { IRoot, ITree } from "../typings";

interface IBaseProps {
  className?: string;
  style?: CSSProperties;
}

interface IRender extends IBaseProps {
  node: ITree | IRoot;
  extraComponents?: Record<string, FunctionComponent<PropsWithChildren<any>>>;
}
const Render: FunctionComponent<IRender> = (props) => {
  const { node, extraComponents = {} } = props;

  const Component = React.useMemo(() => {
    return DefaultComponent[node.type as keyof typeof DefaultComponent];
  }, [node.type]);

  if (!node.type) return null;

  if (node.type === "root") {
    return (
      <>
        {node.children.map((child) => (
          <Render node={child} />
        ))}
      </>
    );
  }

  if (!Component) return null;


  return (
    <MDXContextProvider
      value={{
        components: extraComponents
      }}
    >
      <Component node={node}>
        {("children" in node) && node.children.length
          ? node.children.map((child) => <Render node={child} />)
          : null}
      </Component>
    </MDXContextProvider>
  );
};

export default Render;
