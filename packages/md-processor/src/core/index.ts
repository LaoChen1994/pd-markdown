import { Processor, unified, type Plugin } from "unified";
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
    if (typeof window !== "undefined") {
      console.log("global window is existed =>", window);
      return;
    }

    const { JSDOM } = await import("jsdom");

    (global.document as any) = new JSDOM().window.document;
    console.log("server dom init done");
  }

  private async initProcessor() {
    await this.initServerDOM();

    let processor = unified();

    console.log("load default plugins");

    const DEFAULT_PLUGINS = await Promise.all([
      import("remark-parse").then(res => res.default),
      import("remark-mdx").then(res => res.default),
      import("remark-gfm").then(res => res.default),
    ]);

    const CUSTOM_PLUGINS = PLUGINS.reduce((plugins, [plugin, enable]) => {
      if (enable) {
        plugins.push(plugin);
      }

      return plugins;
    }, []);

    for (const plugin of [...DEFAULT_PLUGINS, ...CUSTOM_PLUGINS]) {
      processor = processor.use(plugin as Plugin);
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
