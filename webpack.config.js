const path = require('path');
const HtmlWebpackPlugin  = require("html-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");

const { NODE_ENV } = process.env;

//配置
module.exports = {
    entry: './demo',
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
        host:getIPAddress(),
        port:3032,
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: "y-code-view",
            template: './demo/index.html'
        }),
        new CleanWebpackPlugin(),
    ]
};

//
function getIPAddress(){
    const interfaces = require('os').networkInterfaces();
    for(const devName in interfaces){
        const iface = interfaces[devName];
        for(let i=0;i<iface.length;i++){
            const alias = iface[i];
            if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
                return alias.address;
            }
        }
    }
}
