// run webpack-dev-server --content-base dist
// https://webpack.github.io/docs/configuration.html
const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: {
        index_backup: './src/index_backup.js',
        index: './src/index.js',
        singleNode: './src/singleNode.js',
        theme: './src/theme.js'
    },
    output: {
        path: path.join(__dirname, '/dist/assets'),
        filename: '[name].bundle.js',
        publicPath: '/assets/'
    },
    devtool: '#source-map',
    devServer: {
        contentBase: './dist'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react']
                },
                include: path.join(__dirname, '/src')
            },
            { test: /\.json$/, loader: 'json-loader' },
            { test: /\.css$/, loader: 'style-loader!css-loader' },
            { test: /\.woff(\d+)?$/, loader: 'url?prefix=font/&limit=5000&mimetype=application/font-woff' },
            { test: /\.ttf$/, loader: 'file?prefix=font/' },
            { test: /\.eot$/, loader: 'file?prefix=font/' },
            { test: /\.svg$/, loader: 'file?prefix=font/' },
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'url-loader?limit=10000&minetype=application/font-woff' },
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader' },
            { test: require.resolve('jquery'), loader: 'expose?jQuery!expose?$' }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            'jquery': 'jquery'
        })
    ]
};
