import { Processor, unified } from "unified";
import { Content } from "mdast";
import formatTable from "../plugins/formatTable";
import formatParagraph from "../plugins/formatParagraph";
import formatListItem from "../plugins/formatListItem";

const PLUGINS = [
  [formatTable, true],
  [formatParagraph, true],
  [formatListItem, true],
];

class MDProcessor {
  ready: Promise<Processor>;
  constructor() {
    this.ready = this.initProcessor();
  }

  private async initServerDOM() {
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
    await this.initServerDOM();

    let processor = unified();

    const DEFAULT_PLUGINS = await Promise.all([
      import("remark-parse"),
      import("remark-mdx"),
      import("remark-gfm"),
    ]);

    const CUSTOM_PLUGINS = PLUGINS.reduce((plugins, [plugin, enable]) => {
      if (enable) {
        plugins.push(plugin);
      }

      return plugins;
    }, []);

    for (const [plugin, enable] of [...DEFAULT_PLUGINS, ...CUSTOM_PLUGINS]) {
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
