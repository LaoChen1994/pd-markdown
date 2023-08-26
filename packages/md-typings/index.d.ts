import type {
  TableRow,
  PhrasingContent,
  TableContentMap,
} from "mdast";

export interface TableHeadCell {
  type: "tableHeadCell";
  children: PhrasingContent[];
}

export interface TableBody {
  type: "tableBody";
  children: TableRow[];
}

declare module "mdast" {
  interface TableContentMap {
    tableRow: TableRow;
    tableHead: TableHead;
    tableBody: TableBody;
  }

  interface RowContentMap {
    tableCell: TableCell;
    tableHeadCell: TableHeadCell;
  }

  interface ListItem extends Parent {
    type: "listItem";
    checked?: boolean | null | undefined;
    spread?: boolean | null | undefined;
    children: Array<BlockContent | DefinitionContent>;
    order?: boolean;
    index?: number;
  }
}

export interface TableHead {
  type: "tableHead";
  children: TableContentMap[keyof TableContentMap][];
}
