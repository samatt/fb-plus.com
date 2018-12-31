import moment from "moment";
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

export function groupArtifactsFromRange(data) {
	const toSort = Object.entries(data);
	const inter = {};
	for (let i in toSort) {
		let [k, v] = toSort[i];
		inter[k] = groupBy(v, d => moment(d.date).year());
	}
	return Object.entries(inter).reduce((a, c) => {
		const [type, dateO] = c;
		for (const [year, artifact] of Object.entries(dateO)) {
			const types = artifact.map(d => {
				return { ...d, type: type };
			});
			const collection = a[year];
			if (collection) {
				a[year] = a[year].concat(types);
			} else {
				a[year] = types;
			}
		}
		return a;
	}, {});
}
export function groupArtifactsByYear(data) {
	const toSort = Object.entries(data);
	const inter = {};
	for (let i in toSort) {
		let [k, v] = toSort[i];
		inter[k] = groupBy(v, d => d.year);
	}
	return Object.entries(inter).reduce((a, c) => {
		const [type, dateO] = c;
		for (const [year, artifact] of Object.entries(dateO)) {
			const types = artifact.map(d => {
				return { ...d, type: type };
			});
			const collection = a[year];
			if (collection) {
				a[year] = a[year].concat(types);
			} else {
				a[year] = types;
			}
		}
		return a;
	}, {});
}
