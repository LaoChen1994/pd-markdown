import { Processor, unified } from "unified";
import { Content } from "mdast";
import remarkGfm from "remark-gfm";
import remarkMDX from "remark-mdx";
import formatTable from "../plugins/formatTable";
import formatParagraph from "../plugins/formatParagraph";
import formatListItem from "../plugins/formatListItem";

const PLUGINS = [
  ["remark-parse", true],
  [formatTable, true],
  [formatParagraph, true],
  [formatListItem, true],
  [remarkMDX, true],
  [remarkGfm, true],
];

class MDProcessor {
  ready: Promise<Processor>;
  constructor() {
    this.ready = this.initProcessor();
  }

  private async initServerDOM() {
    console.log("dom init");
    if (global.window) {
      console.log("global window is existed =>", global.window);
      return;
    }

    const { JSDOM } = await import("jsdom");

    console.log("js dom init");

    global.document = new JSDOM().window.document;
    console.log("server dom init done");
  }

  private async initProcessor() {
    console.log("init processor");
    await this.initServerDOM();

    let processor = unified();

    const remarkParse = (await import("remark-parse")).default;

    processor.use(remarkParse);

    for (const [plugin, enable] of PLUGINS) {
      if (!enable) continue;
      processor = processor.use(plugin);
    }

    return processor;
  }

  public async parse(content: string): Promise<Content | null> {
    const processor = await this.ready;

    if (!processor) return null;

    const data = await processor.parse(content);

    const tree = (await processor.run(data)) as Content;

    return tree;
  }
}

export default MDProcessor;
