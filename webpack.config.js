const path = require('path');
const HtmlWebpackPlugin  = require("html-webpack-plugin");

//配置
module.exports = {
    entry: './entry',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'y-md-webpack.bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: ['babel-loader'],
                exclude: /node_modules/,
            },
            {
                test: /\.(sa|sc|c)ss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.md$/,
                use: [
                    {
                        loader: "raw-loader"
                    }
                ]
            }
        ]
    },
    devServer:{
        contentBase:"./dist",
        // host:'127.0.0.1',
        host:'0.0.0.0',
        port:3031,
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "y-md-work",
            template: './entry/index.html'
        }),
    ]
};