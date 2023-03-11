(function () {
	let timer;
	let DOM = {
		row: document.querySelectorAll(".row-rule"),
		inline: document.querySelectorAll(".inline-rule"),
		split: document.getElementById("split"),
		type: document.getElementById("output-type"),
		input: document.querySelectorAll("#input,.split"),
		inline: document.getElementsByClassName("inline-rule"),
		container: document.getElementById("center"),
		inText: document.getElementById("input"),
		outText: document.getElementById("output"),
	};
	DOM.inline[1].disabled = true;
	DOM.inline[3].disabled = true;
	DOM.container.addEventListener("click", (e) => {
		let tag = e.target.tagName.toLowerCase();
		if (tag == "input" || tag == "select") setText();
	});
	DOM.input.forEach((e) => {
		e.addEventListener("keydown", () => {
			clearTimeout(timer);
			timer = setTimeout(() => {
				setText();
			}, 100);
		});
	});

	function setText() {
		let v = DOM.inText.value == null ? "" : DOM.inText.value;
		let config = getConfig(DOM);
		if (!(config.line || config.inline)) {
			return window.alert("请至少选中一种去重方式");
		}
		DOM.outText.innerHTML = modelSetting(v, config);
	}

	/******************************************************************
	 * format setting
	 */
	function getConfig() {
		DOM.inline[1].disabled = true;
		let config = {
			line: DOM.row[0].checked,
			remove_blank_row: DOM.row[1].checked,
			inline: DOM.inline[0].checked,
			toRow: DOM.inline[1].checked,
			remove_blank: DOM.inline[2].checked,
			remove_pre_suf_blank: DOM.inline[3].checked,
			split: DOM.split.value != "" ? DOM.split.value : " ",
			type: DOM.type.value,
		};
		if (config.inline) DOM.inline[1].disabled = false;
		if (config.type == 2) DOM.inline[3].disabled = false;
		else DOM.inline[3].disabled = true;
		return config;
	}

	function modelSetting(v, c) {
		/*
		 * v: text value
		 * c: format config
		 */
		if (c.inline) v = formatToUniqueWord(v, c.split);
		if (c.line) v = formatToUniqueRow(v, c);
		if (c.toRow && c.inline) v = formatToAllRow(v, c.split);
		if (c.remove_blank) v = textRemoveMutiBlank(v, c.split);
		if (c.type == 1) {
			v = v.replaceAll("\n", c.split).replaceAll(/(\x20)+/g, " ");
			if (c.inline) v = formatToUniqueWord(v, c.split);
		}
		if (c.type == 2) {
			v = v.replaceAll("\n", c.split).replaceAll(/(\x20)+/g, " ");
			v = v.replaceAll(c.split, "\n");
			if (c.line) v = formatToUniqueRow(v, c);
		}
		if (c.remove_blank_row) v = removeBlankRow(v);
		return v;
	}

	/******************************************************************
	 * text dedeuplicate format method
	 */

	function formatToUniqueRow(v, c) {
		let rowlist = [];
		let list = v.split("\n");
		list.forEach((row) => {
			row = c.remove_pre_suf_blank ? row.trim() : row;
			rowlist.push(row);
		});
		v = rowlist.join("\n");
		return [...new Set(v.split("\n"))].join("\n");
	}

	function formatToUniqueWord(v, s) {
		let list = v.split("\n");
		let rowlist = [];
		list.forEach((row) => {
			if (s != " ") {
				row = row.split(s);
				rowlist.push([...new Set(row)].join(s));
			} else {
				words = row.split(" ");
				let newline = [];
				words.forEach((word) => {
					if (!newline.includes(word) || word == "") {
						newline.push(word);
					}
				});
				rowlist.push(newline.join(" "));
			}
		});
		return rowlist.join("\n");
	}

	function formatToAllRow(v, s) {
		let list = v.split("\n");
		let rowlist = [];
		let unique_list = [];
		for (const row of list) {
			let words = row.split(s);
			let newline = [];
			for (const word of words) {
				if ((!newline.includes(word) || word == "") && !unique_list.includes(word)) {
					newline.push(word);
				}
			}
			let sets = new Set(words);
			sets.delete("");
			let temp = Array.from(sets);
			unique_list.push.apply(unique_list, temp);
			unique_list = Array.from(new Set(unique_list));
			rowlist.push(newline.join(s));
		}
		return rowlist.join("\n");
	}

	/******************************************************************
	 * text blank format method
	 */
	function removeBlankRow(v) {
		let list = v.split("\n");
		return list.filter((row) => row != "").join("\n");
	}

	function textRemoveMutiBlank(v, s) {
		if (s == " ") {
			v = v.replaceAll(/(\x20)+/g, " ");
			let rowlist = [];
			let list = v.split("\n");
			for (const row of list) {
				if (row.indexOf(" ") == 0) row = row.substring(1, temp.length);
				rowlist.push(row);
			}
			v = rowlist.join("\n");
		} else {
			v = v.replaceAll(/(\x20)+/g, "").replaceAll("  ", "");
		}
		return v;
	}
})();
