import MDProcessor from "./core";

(async () => {
  if (!global.window) {
    const { JSDOM } = await import("jsdom");
    global.document = new JSDOM().window.document;
  }
})();

export default MDProcessor;
