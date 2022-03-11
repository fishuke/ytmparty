const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const dotenv = require("dotenv");
const path = require("path");
const webpack = require("webpack");

const env = dotenv.config({
    path: path.resolve(__dirname, ".env.production"),
}).parsed;

module.exports = merge(common, {
    mode: "production",
    plugins: [
        new webpack.DefinePlugin({
            "process.env.REACT_APP_API_URL": JSON.stringify(
                env.REACT_APP_API_URL,
            ),
        }),
    ],
});
