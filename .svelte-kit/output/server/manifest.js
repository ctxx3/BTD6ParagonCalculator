export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.ico",".DS_Store","paragons/template.json","paragons/magic/wizard.json","paragons/magic/ninja.json","paragons/military/buccaneer.json","paragons/military/sub.json","paragons/military/ace.json","paragons/support/engineer.json","paragons/primary/dart.json","paragons/primary/tack.json","paragons/primary/boomerangm.json","favicon.png","json/paragons.json","icons/magus.webp","icons/ascended.webp","icons/.DS_Store","icons/master.webp","icons/nautic.webp","icons/cyclone.webp","icons/glaive.webp","icons/goliath.webp","icons/apex.webp","icons/navarch.webp","icons/mega.webp","icons/paragonicon.webp","robots.txt"]),
	mimeTypes: {".json":"application/json",".png":"image/png",".webp":"image/webp",".txt":"text/plain"},
	_: {
		client: {start:"_app/immutable/entry/start.BzNP4AF3.js",app:"_app/immutable/entry/app.CP6iMmkV.js",imports:["_app/immutable/entry/start.BzNP4AF3.js","_app/immutable/chunks/T-CYbcwb.js","_app/immutable/chunks/B186LnYx.js","_app/immutable/chunks/B340SDio.js","_app/immutable/entry/app.CP6iMmkV.js","_app/immutable/chunks/B186LnYx.js","_app/immutable/chunks/CqhwPZtg.js","_app/immutable/chunks/JX3FnoaB.js","_app/immutable/chunks/DMMo-42K.js","_app/immutable/chunks/B340SDio.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js'))
		],
		routes: [
			
		],
		prerendered_routes: new Set(["/"]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
