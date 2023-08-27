import type { Content } from 'mdast'
import { Node } from 'unist'
import { MdxJsxFlowElement, MdxJsxTextElement } from "mdast-util-mdx";
import { ReactNode } from 'react';

declare type ITree = Content | MdxJsxFlowElement | MdxJsxTextElement

declare interface IRoot extends Node {
  children: ITree[]
}

declare type IHandler<T extends ITree, Options extends Record<string, any> = Record<string, any>> = (node: T, options?: Options) => ReactNode
