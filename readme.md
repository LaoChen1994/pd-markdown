# Simple React Markdown Render

Render & Parse markdown for react

## Install

### Install by yarn

```bash
# install processor
yarn add @pdchen/markdown-processor

# install render component

yarn add @pdchen/markdown-render
```

### Install by pnpm

```bash
# install processor
pnpm add @pdchen/markdown-processor

# install render component

pnpm add @pdchen/markdown-render
```

### Install by npm

```bash
# install processor
npm install @pdchen/markdown-processor

# install render component

npm install @pdchen/markdown-render
```

## Demo

```typescript jsx
import processor from '@pdchen/markdown-processor'
import Render from '@pdchen/markdown-render';
import "@pdchen/markdown-render/style"
import './App.css'
function App() {
  const [tree, setTree] = useState({})

  const onChange = async (value: string): Promise<void> => {
    const html = await processor.parse(value)
    setTree(html)
  }

  useEffect(() => {
    onChange(`|t1|t2|t3|
        |---|---|---|
        |a|b|c|
        
        - 1
        - 2
        - 3
        - 4
        
        1. For 50 years, WWF has been protecting the future of nature. The world's leading conservation organization, WWF works in 100 countries and is supported by 1.2 million members in the United States and close to 5 million globally.
        2. 2
        3. 3
        4. 4
        
        ![image](https://i.guim.co.uk/img/media/26392d05302e02f7bf4eb143bb84c8097d09144b/446_167_3683_2210/master/3683.jpg?width=465&dpr=1&s=none)`)
  }, [])

  return (
    <>
      <h1>Markdown Render</h1>
      <div>
        <Render node={tree} />
      </div>
    </>
  )
}
```
