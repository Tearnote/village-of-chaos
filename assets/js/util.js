// util.js
// Random useful utility functions

"use strict";

class Util {
	// Convert strings with uppercase letters to kebab case
	// eg. FooBar => -foo-bar
	// https://stackoverflow.com/a/47836484
	static kebabCase(str) {
		return str.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
	}
}
