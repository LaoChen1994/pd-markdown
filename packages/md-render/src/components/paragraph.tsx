import { IMetaComponentBase } from "."
import { Paragraph as ParagraphType } from 'mdast'

import { PropsWithChildren } from "react"

const Paragraph: React.FC<PropsWithChildren<IMetaComponentBase<ParagraphType>>> = (props) => {
  const { children } = props;

  return (
    <p className="text-base text-black">
      {children}
    </p>
  )
}

export default Paragraph