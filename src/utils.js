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

export function seeAlso(post) {
	let also = post.seeAlso.map(u => getNotionIdFromUrl(u));
	also.concat(post.alsoAlso.map(u => getNotionIdFromUrl(u)));
}

export function parseStyleSection(section) {
	let htmlStr = section[0];
	const styles = section[1];
	for (let i in styles) {
		const style = styles[i];
		if (style.length == 1) {
			htmlStr = `<${style}> ${htmlStr} </${style}>`;
		} else if (style.length == 2) {
			const tag = style[0];
			const url = style[1];

			if (tag !== "a") {
				console.error("Parsing for this tag not yet implemented");
				console.error(style);
			} else {
				htmlStr = `<${tag} href="${url}"> ${htmlStr} </${tag}>`;
			}
		}
	}
	return htmlStr;
}
export function styleBlock(block) {
	let htmlStr = "<p>";
	for (let i in block) {
		const section = block[i];
		if (section.length === 1) {
			htmlStr += section[0];
		} else if (section.length === 2) {
			htmlStr += parseStyleSection(section);
		} else {
			console.error("weird section");
			console.error(section);
		}
	}
	htmlStr += "</p>";
	return htmlStr;
}
export function blockToHtml(blocks) {
	let htmlStr = "";
	for (let i in blocks) {
		const block = blocks[i];
		if (block.length === 1) {
			htmlStr += `<p>${block[0]}</p>`;
		} else {
			htmlStr += styleBlock(block);
		}
	}
	return htmlStr;
}
export function getTextBlocks(post) {
	const blocks = [];
	for (let block_id in post.textData.block) {
		const block = post.textData.block[block_id];
		if (block.value.type !== "text") {
			continue;
		}

		if (
			!block.value.hasOwnProperty("properties") ||
			!block.value.properties.title
		) {
			continue;
		}
		blocks.push(block.value.properties.title);
	}
	return blocks;
}

export function notionPostParser(post) {
	return {
		title: post.name,
		notionId: post.notionId,
		eventDate: post.date,
		seeAlso: seeAlso(post),
		addedOn: post.addedOn,
		updatedOn: post.updatedOn,
		narrative: post.narrative,
		textBlocks: getTextBlocks(post)
	};
}

export function getNarratives(posts) {
	const narratives = new Set();
	posts.map(p => p.narrative.map(n => narratives.add(n)));
	return [...narratives];
}
export function getNotionIdFromUrl(url) {
	return url.split("/").pop();
}

export function getPostsWithNarrative(posts, narrative) {
	return posts.filter(p => p.narrative.indexOf(narrative) > -1);
}