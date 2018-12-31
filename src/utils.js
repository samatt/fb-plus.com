export function qs(params) {
	return Object.keys(params)
		.map(key => key + "=" + params[key])
		.join("&");
}

export function groupBy(list, keyGetter) {
	const map = {};
	list.forEach(item => {
		const key = keyGetter(item);
		const collection = map[key];
		if (!collection) {
			map[key] = [item];
		} else {
			collection.push(item);
		}
	});
	return map;
}
