export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.ico",".DS_Store","paragons/template.json","paragons/magic/wizard.json","paragons/magic/ninja.json","paragons/military/buccaneer.json","paragons/military/sub.json","paragons/military/ace.json","paragons/support/engineer.json","paragons/primary/dart.json","paragons/primary/tack.json","paragons/primary/boomerangm.json","favicon.png","json/paragons.json","icons/magus.webp","icons/ascended.webp","icons/.DS_Store","icons/master.webp","icons/nautic.webp","icons/cyclone.webp","icons/glaive.webp","icons/goliath.webp","icons/old/magus.webp","icons/old/ascended.webp","icons/old/master.webp","icons/old/nautic.webp","icons/old/cyclone.webp","icons/old/glaive.webp","icons/old/goliath.webp","icons/old/apex.webp","icons/old/navarch.webp","icons/old/mega.webp","icons/apex.webp","icons/navarch.webp","icons/script.py","icons/mega.webp","robots.txt"]),
	mimeTypes: {".json":"application/json",".png":"image/png",".webp":"image/webp",".txt":"text/plain"},
	_: {
		client: {start:"_app/immutable/entry/start.Bk4LpFGF.js",app:"_app/immutable/entry/app.DqEvdeY1.js",imports:["_app/immutable/entry/start.Bk4LpFGF.js","_app/immutable/chunks/CuKj8d2D.js","_app/immutable/chunks/C9xbu8T-.js","_app/immutable/chunks/BAzetmX0.js","_app/immutable/entry/app.DqEvdeY1.js","_app/immutable/chunks/C9xbu8T-.js","_app/immutable/chunks/kqATIUK2.js","_app/immutable/chunks/DUlgh7aH.js","_app/immutable/chunks/Dm1OR7pT.js","_app/immutable/chunks/BAzetmX0.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
