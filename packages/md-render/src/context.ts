import { FunctionComponent, createContext, useContext, PropsWithChildren } from "react";

export interface IMDXContext {
  components: Record<string, FunctionComponent<PropsWithChildren<any>>>;
}

export const MDXContext = createContext<IMDXContext>({
  components: {}
})

export const useMDXContext = () => {
  const context = useContext(MDXContext);

  return context
}

export const MDXContextProvider = MDXContext.Provider;
