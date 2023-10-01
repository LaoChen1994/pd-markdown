import { Processor, unified } from "unified";
import { Content } from "mdast";
import formatTable from "../plugins/formatTable";
import formatParagraph from "../plugins/formatParagraph";
import formatListItem from "../plugins/formatListItem";

const PLUGINS = [
  ["remark-parse", true],
  [formatTable, true],
  [formatParagraph, true],
  [formatListItem, true],
  ["remarkGfm", true],
  ["remarkMDX", true],
];

class MDProcessor {
  private processor: Processor;
  constructor() {
    this.initProcessor();
  }

  private async initServerDOM() {
    console.log("init dom server");
    if (global.window) {
      console.log("global window is existed =>", global.window);
      return;
    }

    const { JSDOM } = await import("jsdom");
    global.document = new JSDOM().window.document;
    console.log("server dom init done");
  }

  private async initProcessor() {
    await this.initServerDOM();

    let processor = unified();

    for (const [plugin, enable] of PLUGINS) {
      if (!enable) continue;

      if (typeof plugin === "string") {
        const p = (await import(plugin)).default;

        processor.use(p);
        continue;
      }

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
