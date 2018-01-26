"use strict";

const fs = require("fs");

module.exports = {
	sync (pathItem) {
		if (fs.statSync(pathItem).isDirectory()) {
			return fs.readdirSync(pathItem)
						.map(item => this.sync(`${pathItem}/${item}`))
						.reduce(((total, current) => total.concat(current)), []);
		} else {
			return [pathItem];
		}
	},
	async (pathItem) {
		return new Promise((resolve, reject) => {
			resolve(this.sync(pathItem));
		});	
	}
};