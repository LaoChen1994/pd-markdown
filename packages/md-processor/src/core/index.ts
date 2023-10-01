import { Processor, unified } from "unified";
import { Content } from "mdast";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMDX from "remark-mdx";
import formatTable from "../plugins/formatTable";
import formatParagraph from "../plugins/formatParagraph";
import formatListItem from "../plugins/formatListItem";

const PLUGINS = [
  [remarkParse, true],
  [formatTable, true],
  [formatParagraph, true],
  [formatListItem, true],
  [remarkMDX, true],
  [remarkGfm, true],
];

class MDProcessor {
  private processor: Processor;
  constructor() {
    this.initProcessor();
  }

  private initProcessor() {
    let processor = unified();

    for (const [plugin, enable] of PLUGINS) {
      if (!enable) continue;
      processor = processor.use(plugin);
    }

    this.processor = processor;
  }

  public async parse(content: string) {
    const data = await this.processor.parse(content);
    return this.processor.run(data) as Promise<Content>;
  }

  public async getContentTree(content: string) {
    await this.processor.process(content);
  }
}

export default MDProcessor;
