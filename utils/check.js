const userModel = require('../lib/mysql.js');
module.exports = {
	checkUser: async (ticket) => {
		let isLegal = false;
		await userModel.findUserByTicket(ticket).then((res)=>{
			console.log(res);
			if(res[0].id) {
				isLegal = res[0];
			}
		});
		return isLegal;
	}
}