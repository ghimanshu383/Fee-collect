const reactRecommended = require('eslint-plugin-react/configs/recommended');

module.exports = [
  reactRecommended, // This is not a plugin object, but a shareable config object
    {  "no-restricted-imports": [
        "error",
        {
          "patterns": ["@mui/*/*/*", "!@mui/material/test-utils/*"]
        }
      ]

    }
];