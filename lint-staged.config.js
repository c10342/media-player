module.exports = {
  "*.{css,scss}": ["stylelint **/*.{css,scss} --fix"],
  "*.{ts,tsx}": ["prettier --write", "eslint --fix", "git add", "eslint"]
};
