import { Table, TableRow } from "mdast";
import { type Plugin } from "unified";
import { visit } from "unist-util-visit";

const plugins: Plugin = () => tree => {
  if (!tree) return;

  visit(tree, "table", (node: Table) => {
    const [head, ...body] = node.children;

    head.children.forEach(child => {
      child.type = "tableHeadCell";
    });

    node.children.splice(0, 1, {
      type: "tableHead",
      children: head.type === "tableRow" ? [head] : [],
    });

    node.children.splice(1, body.length, {
      type: "tableBody",
      children: body as TableRow[],
    });
  });
};

export default plugins;
