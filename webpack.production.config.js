const webpack = require('webpack');
const path = require('path');
const srcPath = path.resolve(__dirname, 'src');
//用来清除文件的插件 ，每次编译前都会执行
const CleanWebpackPlugin = require('clean-webpack-plugin');

//用来将css单独提取出来的插件
const ExtractTextPlugin = require("extract-text-webpack-plugin");
module.exports = {
	//入口文件
	entry: {
		'common/main': [srcPath + '/common/main.js'],
		'common/admin-lib':['bootstrap','BOOTSTRAP_CSS'],
		'common/lib':['jquery','APP_CSS']
	},
	//出口文件
	output: {
		path: __dirname + '/public',
		filename: '[name].js',
		publicPath: 'http://localhost:8080/public'
	},
	resolve: {
		modules:[srcPath,'node_modules'],//指定webpack查找规则
		alias: {
			SRC: srcPath,
			BOOTSTRAP_CSS:'bootstrap/dist/css/bootstrap.css',
			BOOTSTRAP_TABLE_CSS:'bootstrap-table/dist/bootstrap-table.css',
			APP_CSS:'SRC/common/app.less'
		}
	},
	//加载器
	module: {
		rules: [{
				test: /\.(png|jpg)$/,
				//limit=8192byte 如果图片小于8k显示base64编码成字符串
				use: 'url-loader?limit=8192&context=client&name=/img/[name].[ext]',
			},
			{
				test: /\.(css|less)$/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: ['css-loader','less-loader']
				})
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
				use: [
					'file-loader?limit=8192&name=/fonts/[name].[ext]'
				]
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['env'],
						plugins: ['transform-runtime','syntax-dynamic-import']
					}
				}
			}
		]
	},
	//插件
	plugins: [
		new CleanWebpackPlugin(['public'],{
			exclude:['ueditor']
		}),
		//用来独立css文件和路径的
		new ExtractTextPlugin({
			filename: function(getPath) {
				console.log(getPath('css/[name].css'));
				return getPath('css/[name].css').replace('css/common', 'css');
			},
			allChunks: true
		}),
		//把jquery的全局变量提取出来的插件(jQuery not undefined)
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery'
		}),
		//混淆压缩
		new webpack.optimize.UglifyJsPlugin(),//不支持压缩混淆es6
	]
}