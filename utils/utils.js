module.exports = {
	exchangeDate: (moment) => {
		let momentDate = moment,
            year = momentDate.getFullYear(),
            month = momentDate.getMonth() + 1,
            day = momentDate.getDate(),
            hours = momentDate.getHours(),
            minutes = momentDate.getMinutes();
            hours = hours < 10?'0'+ hours: hours;
            minutes = minutes < 10?'0'+ minutes: minutes;
        return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes;
	}
} 