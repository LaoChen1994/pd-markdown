/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // 关键：在 Monorepo 开发环境下，强制 Next.js 处理 pd-markdown 包
  // 这有助于解决子包之间通过根包 exports 解析路径的问题
  transpilePackages: ['pd-markdown'],
};

export default nextConfig;
