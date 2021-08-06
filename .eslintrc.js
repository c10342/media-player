module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  parser: "@typescript-eslint/parser", //定义ESLint的解析器
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended"
  ], //定义文件继承的子规范
  plugins: ["@typescript-eslint"], //定义了该eslint文件所依赖的插件
  rules: {
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/ban-types": "off"
  }
};
