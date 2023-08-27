import type { Node } from 'unist'
import { Parent, Literal } from "mdast";
import type { FC, PropsWithChildren } from "react";

import Heading from "./heading";
import MdxJsxFlowElement from "./mdxJSXFlowElement";
import Text from "./text";
import Paragraph from "./paragraph";
import Strong from "./strong";
import Blockquote from "./blockquote";
import Image from './image';

import List from './list';
import ListItem from './list-item'

import Table from './table'
import TableCell from "./cell";
import TableRow from "./row";
import TableHead from './thead';
import TableBody from './tbody';
import TableHeadCell from './theadCell'

export interface IMetaComponentBase<T extends Parent | Literal | Node> {
  node: T;
}

export type Component = Record<
  string,
  FC<IMetaComponentBase<any> | PropsWithChildren<IMetaComponentBase<any>>>
>;

const ComponentMap: Component = {
  heading: Heading,
  mdxJsxFlowElement: MdxJsxFlowElement,
  text: Text,
  paragraph: Paragraph,
  strong: Strong,
  table: Table,
  tableRow: TableRow,
  tableCell: TableCell,
  tableHead: TableHead,
  tableBody: TableBody,
  tableHeadCell: TableHeadCell,
  list: List,
  listItem: ListItem,
  blockquote: Blockquote,
  image: Image
};

export default ComponentMap;
