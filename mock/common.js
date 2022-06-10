//用户兴趣爱好
let getMyhobby = mock.mock({
	type: 'get',
	url: '/user/myhobby.php',
	data: {
		code: 200,
		msg: '',
		data: {
            one: 'Sing',
            two: 'Travel',
            three:'Read'
		}
	}
});
module.exports = {
    getMyhobby
};
