/* eslint-env node */

/**************************
 * @file: webpack配置
 ***************************/

const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); //css分离打包
const UglifyJsPlugin = require("uglifyjs-webpack-plugin"); //js压缩
// const webpack = require("webpack");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin"); //css压缩
const createHtml = require("./config/create-html"); // html配置
const getEntry = require("./config/get-entry");
const entry = getEntry("./src/pages");
const htmlArr = createHtml("./src/pages");
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

//主配置
module.exports = (env, argv) => ({
	entry: entry,
	output: {
		path: path.join(__dirname, "dist"),
		filename: "[name].js"
	},
	module: {
		rules: [{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader"
				},
			},
			{ test: /\.tsx?$/, loader: "awesome-typescript-loader" },
			{ enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
			// {
			// 	test: /\.css$/,
			// 	use: ["style-loader", "css-loader", "postcss-loader"],
			// 	exclude: /node_modules/,
			// },
			{
				test: /\.(less|css)$/, //css打包 路径在plugins里
				use: [
					argv.mode == "development" ? {
						loader: "style-loader"
					} : MiniCssExtractPlugin.loader,
					{
						loader: "css-loader",
						options: {
							url: false,
							sourceMap: true
						}
					},
					"postcss-loader",
					{
						loader: "less-loader",
						options: {
							sourceMap: true
						}
					}
				],
				exclude: /node_modules/,
			},
			{
				test: /\.(png|jpg)$/,
				loader: 'url-loader?limit=8192&name=images/[hash:8].[name].[ext]',
				options: {
					publicPath: '/'
				}
			},

		],
	},
	devServer: {
		port: 3100,
		open: true,
		openPage: 'index'
	},
	resolve: {
		alias: {
			src: path.resolve(__dirname, "src/"),
			component: path.resolve(__dirname, "src/component/")
		},
		extensions: [".ts", ".tsx", ".js", ".json"]
	},
	externals: {
		"react": "React",
		"react-dom": "ReactDOM"
	},
	plugins: [
		new CleanWebpackPlugin(),
		...htmlArr, // html插件数组
		new MiniCssExtractPlugin({ //分离css插件
			filename: "[name].css",
			chunkFilename: "[id].css"
		}),
		new CopyPlugin([
      { from: path.resolve(__dirname, "node_modules/react/umd/react.production.min.js"), to: 'js/react.production.min.js' },
      { from: path.resolve(__dirname, "node_modules/react-dom/umd/react-dom.production.min.js"), to: 'js/react-dom.production.min.js' },
    ]),
	],
	optimization: {
		minimizer: [ //压缩js
			new UglifyJsPlugin({
				cache: true,
				parallel: true,
				sourceMap: false
			}),
			new OptimizeCSSAssetsPlugin({})
		],
		splitChunks: {
			chunks: 'async', 
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
				},
				styles: {
					name: "styles",
					test: /\.css$/,
					chunks: "all",
					enforce: true
				}
      }
		}
	}
});