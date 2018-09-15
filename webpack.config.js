const path = require("path")
const webpack = require('webpack')
const { CheckerPlugin } = require('awesome-typescript-loader')
const TsconfigPathsPlugin  = require("tsconfig-paths-webpack-plugin")

function fromRoot(...paths) {
	return path.resolve(__dirname, ...paths)
}

module.exports = {
	mode: "development",
	entry: "./src/index.ts",
	output: {
		path: path.resolve(__dirname),
		filename: "index.js"
	},
	resolve: {
		// Add '.ts' and '.tsx' as resolvable extensions.
		extensions: [".ts", ".tsx", ".js", ".json"]
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				include: [fromRoot("src/")],
				exclude: [fromRoot("node_modules/")],
				loader: "awesome-typescript-loader"
			}
		]
	},
	// externals: {
	// 	react: "React",
	// 	"react-dom": "ReactDOM"
	// },
  plugins: [
		new CheckerPlugin(),
		new TsconfigPathsPlugin({configFile: "./tsconfig.json"})
  ]
}
