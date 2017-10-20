const  webpack=require('webpack');
const  path=require('path');
const srcPath=path.resolve(__dirname,'src');
module.exports={
	//入口文件
    entry:{
        'common/main':[srcPath+'/common/main.js','webpack-hot-middleware/client?reload=true']
    },
    //出口文件
    output:{
        path:__dirname+'/public',
        filename:'[name].js',
        publicPath:'http://localhost:8080/public'
    },
    //除去编译后会产生很无用的多代码
    devtool:'eval-source-map',
    //加载器
    module:{
        rules:[
        {
        	test:/\.(png|jpg)$/,
        	//limit=8192byte 如果图片小于8k显示base64编码成字符串
        	use:'url-loader?limit=8192&context=client&name=[name].[ext]',
        },
        {
            test:/\.css$/,
            use:['style-loader','css-loader?sourceMap']
        }
        ]
    },
    //插件
    plugins:[
      new webpack.optimize.OccurrenceOrderPlugin(),//根据模块调用次数，给模块分配id,降低文件大小
      new webpack.HotModuleReplacementPlugin(),//启用HMR
      new webpack.NoEmitOnErrorsPlugin()//报错但不对出wenpack进程（如果报错服务器不会关掉）
    ]
}