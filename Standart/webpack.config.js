'use strict'

const webpack = require('webpack')
const UglifyJs = require('uglifyjs-webpack-plugin')
const path = require('path')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')

const paths = {
	src: path.resolve(__dirname, 'src/assets/scripts/'),
	dist: path.resolve(__dirname, 'dist/assets/js')
}

const NODE_ENV = process.env.NODE_ENV || 'development'

if (NODE_ENV === 'production') {
	module.exports.optimization = {
		minimizer: [new UglifyJs()]
	}
}

module.exports = {
	context: paths.src,
	entry: {
		app: 'app.js',
		pollifils: 'pollifils.js'
	},
	output: {
		path: paths.dist,
		filename: '[name].js'
	},
	devtool: NODE_ENV === 'development' ? 'source-map' : false,


	plugins: [
		new webpack.DefinePlugin({
			NODE_ENV: JSON.stringify(NODE_ENV),
			LANG: JSON.stringify('ru')
		}),

		new webpack.ProvidePlugin({
		  'window.jQuery': 'jquery',
		  $: 'jquery',
		  jQuery: 'jquery'
		}),

		new HardSourceWebpackPlugin()
	],

	module: {
		rules: [{
			test: /\.js$/,
			exclude: '/node_modules',
			use: [
				{
					loader: 'babel-loader'
				}
			]
		}]
	},

	resolve: {
		modules: ["node_modules", paths.src],
		extensions: ['.js', '.min.js']
	},

	watch: NODE_ENV === 'development',

	watchOptions: {
		aggregateTimeout: 100
	},

}
