class Util {
	// https://stackoverflow.com/a/47836484
	static kebabCase(str) {
		return str.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase());
	}
}
