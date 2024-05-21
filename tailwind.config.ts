import type { Config } from "tailwindcss";

export default {
  // 启用类名切换的暗模式：设置为 "class"，通过在 HTML 元素上添加 "class" 类名来启用暗模式
  darkMode: "class",

  // 核心插件配置：禁用 preflight 样式重置
  corePlugins: {
    preflight: false // 禁用 Tailwind CSS 的默认样式重置
  },

  // 内容配置：指定 Tailwind CSS 应扫描以生成类的文件
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  // 主题配置：扩展默认主题的自定义设置
  theme: {
    extend: {
      // 颜色扩展：定义自定义颜色，使用 CSS 变量来适应主题
      colors: {
        bg_color: "var(--el-bg-color)", // 背景颜色，使用 CSS 变量 --el-bg-color
        primary: "var(--el-color-primary)", // 主要颜色，使用 CSS 变量 --el-color-primary
        text_color_primary: "var(--el-text-color-primary)", // 主要文本颜色，使用 CSS 变量 --el-text-color-primary
        text_color_regular: "var(--el-text-color-regular)" // 常规文本颜色，使用 CSS 变量 --el-text-color-regular
      }
    }
  }
} satisfies Config;
