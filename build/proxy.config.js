module.exports = {
	'/': {
		target: 'http://localhost:8080', // mock 时切换这个
		// target: 'http://121.15.158.213:36606',
		changeOrigin: true,
		secure: false
	}
};
