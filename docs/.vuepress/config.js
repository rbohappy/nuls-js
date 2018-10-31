module.exports = {
	base: '/nuls-js/',
		title: 'nuls-js',
		themeConfig: {
		repo: 'CCC-NULS/nuls-js',
			docsDir: 'docs',
			editLinks: true,
			nav: [
			{ text: 'Home', link: '/' },
			{ text: 'Guide', link: '/guide/' },
			{ text: 'Documentation', link: 'https://CCC-NULS.github.io/nuls-js/typedoc/index.html' }
		],
			sidebar: {
			'/guide/': [
				'',
				'account',
				'QRCode'
			]
		}
	}
};
