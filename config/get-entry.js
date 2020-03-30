/* eslint-env node */
/**
 * @project: 获取entry文件入口
 */
const getPath = require("./get-path");
const fs = require('fs')

/**
 * 【获取entry文件入口】
 *
 * @param {String} path 引入根路径
 * @returns {Object} 返回的entry { "about/aoubt":"./src/about/about.js",...}
 */
const extensions = [".ts", ".tsx", ".js"]

module.exports = function getEnty(path) {
	return getPath(path).reduce((entry, item) => {
		/**
		 * 下面输出格式为{"about/about":".src/aobout/index.js"}
		 * 这样目的是为了将js打包到对应的文件夹下
		 */
		const ext = extensions.find(el => fs.existsSync(`${path}/${item}/index${el}`))
		entry[`${item}`] = `${path}/${item}/index${ext}`;
		return entry
	}, {});
};