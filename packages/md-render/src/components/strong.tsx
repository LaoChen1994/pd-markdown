import { IMetaComponentBase } from ".";
import { Strong } from "mdast";
import React, { PropsWithChildren } from "react";


const Component: React.FC<PropsWithChildren<IMetaComponentBase<Strong>>> = (props) => {
  return (
    <strong className="font-semibold text-base">
      {props.children}
    </strong>
  )
}

export default Component;
