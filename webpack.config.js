const webpack = require('webpack');
const path = require('path');
const srcPath = path.resolve(__dirname, 'src');
module.exports = {
	//入口文件
	entry: {
		'common/main': [srcPath + '/common/main.js', 'webpack-hot-middleware/client?reload=true'],
		'common/admin-lib':['jquery','bootstrap','BOOTSTRAP_CSS'],//public/common/admin-lib.js
		'common/lib':['jquery','APP_CSS']
	},
	//出口文件
	output: {
		path: __dirname + '/public',
		filename: '[name].js',
		publicPath: 'http://localhost:3000/public'
	},
	//除去编译后会产生很无用的多代码
	devtool: 'eval-source-map',
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
				use: 'url-loader',
			},
			{
				test: /\.(css|less)$/,
				use: ['style-loader', 'css-loader?sourceMap','less-loader']
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
				use: [
					'file-loader'
				]
			},
			{
				test: /\.js$/,
				exclude: /(node_modules|bower_components)/,
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
		//把jquery的全局变量提取出来的插件(jQuery not undefined)
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery'
		}),
		new webpack.optimize.OccurrenceOrderPlugin(), //根据模块调用次数，给模块分配id,降低文件大小
		new webpack.HotModuleReplacementPlugin(), //启用HMR
		new webpack.NoEmitOnErrorsPlugin() //报错但不对出wenpack进程（如果报错服务器不会关掉）
	]
}