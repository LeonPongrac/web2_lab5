module.exports = {
	globDirectory: 'public/',
	globPatterns: [
		'**/*.{js,png,html,json,css}'
	],
	swDest: 'public/sw.js',
	ignoreURLParametersMatching: [
		/^utm_/,
		/^fbclid$/
	]
};