'use strict'

const webpack 				  = require('webpack')
const autoprefixer 	 	 	  = require('autoprefixer')
const UglifyJs 				  = require('uglifyjs-webpack-plugin')
const path 					  = require('path')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')

const paths = {
	src: path.resolve(__dirname, 'src/assets/app/'),
	dist: path.resolve(__dirname, 'dist/')
}

const NODE_ENV = process.env.NODE_ENV || 'development'

if (NODE_ENV === 'production') {
	module.exports.optimization = {
		minimizer: [new UglifyJs()]
	}
}

module.exports = {
	mode: NODE_ENV,
	context: paths.src,
	entry: {
		app: 'app.js',
		auth: 'auth.js',
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

		new HardSourceWebpackPlugin(),
	],

	module: {
		rules: [
		{
			test: /\.m?jsx?$/,
			exclude: '/node_modules/',
			use: [
				{
					loader: 'babel-loader',
				}
			]
		},
		{
			test: /\.sass$/,
			use: [
				{
					loader: 'style-loader'
				},
				{
					loader: 'css-loader',
					options: {
						sourceMap: true,
						importLoaders: 1, 
						modules: true
					}
				},
				{
 					loader: 'postcss-loader',
 					options: {
 						plugins: [
 							autoprefixer({
 								overrideBrowserslist: ['ie >= 8', 'last 4 version']
 							})
 						],
 						sourceMap: true
 					}
				},
				{
					loader: 'sass-loader',
				}
			]
		}, 
		]
	},

	resolve: {
		modules: ["node_modules", paths.src],
		extensions: ['.js', '.min.js']
	},

	watch: NODE_ENV === 'development',

	watchOptions: {
		aggregateTimeout: 50
	},

	devServer: {
    	contentBase: paths.dist,
    	port: 3000
  }
}
	