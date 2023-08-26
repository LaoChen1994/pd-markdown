import { Paragraph, Parent } from "mdast";
import { type Plugin } from "unified";
import { visit } from "unist-util-visit";

const plugin: Plugin = () => tree => {
  if (!tree) return;

  visit(tree, "paragraph", (node: Paragraph, index, parent: Parent) => {
    const len = node.children.length;
    let left = 0,
      right = left;

    const { children, ...res } = node;
    const insertNode = [];

    while (right < len) {
      if (children[right].type !== "image") {
        right++;
        continue;
      }

      left !== right &&
        insertNode.push({
          ...res,
          children: children.slice(left, right),
        });

      insertNode.push(children[right]);

      left = right;
      right++;
    }

    if (insertNode.length) {
      parent.children.splice(index!, 1, ...insertNode);
    }
  });
};

export default plugin;
