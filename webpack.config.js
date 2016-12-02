var config = {
    entry: './main.js',

    output: {
        path: './',
        filename: 'index.js',
    },

    devServer: {
        historyApiFallback: {
            index: '/'
        },
        proxy: {
            '/services/*': {
                target: 'https://sentina.savelsirkku.fi',
                secure: false
            }
        }
    },

    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel',

                query: {
                    presets: ['es2015', 'react']
                }
         	}
      	]
    }

}
module.exports = config;