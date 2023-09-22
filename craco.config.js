const path = require("path");
module.exports = {
  jest: {
    configure: {
      moduleNameMapper: {
        "^@assets/(.*)": "<rootDir>/src/assets/$1",
        "^@components/(.*)": "<rootDir>/src/components/$1",
        "^@contexts/(.*)": "<rootDir>/src/contexts/$1",
        "^@hooks/(.*)": "<rootDir>/src/hooks/$1",
        "^@pages/(.*)": "<rootDir>/src/pages/$1",
        "^@services/(.*)": "<rootDir>/src/services/$1",
        "^@model/(.*)": "<rootDir>/src/model/$1",
      },
    },
  },
  webpack: {
    alias: {
      "@assets": path.resolve(__dirname, "src/assets"),
      "@components": path.resolve(__dirname, "src/components"),
      "@contexts": path.resolve(__dirname, "src/contexts"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@services": path.resolve(__dirname, "src/services"),
      "@model": path.resolve(__dirname, "src/model"),
    },
  },
};
