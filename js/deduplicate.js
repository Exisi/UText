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
		list.forEach((word) => {
			word = c.remove_pre_suf_blank ? word.trim() : word;
			rowlist.push(word);
		});
		v = rowlist.join("\n");
		return [...new Set(v.split("\n"))].join("\n");
	}

	function formatToUniqueWord(v, s) {
		let list = v.split("\n");
		let rowlist = [];
		list.forEach((line) => {
			if (s != " ") {
				line = line.split(s);
				rowlist.push([...new Set(line)].join(s));
			} else {
				line = line.split(" ");
				let newline = [];
				line.forEach((word) => {
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
		for (const i in list) {
			let line = list[i].split(s);
			let newline = [];
			for (const j in line) {
				if ((!newline.includes(line[j]) || line[j] == "") && !unique_list.includes(line[j])) {
					newline.push(line[j]);
				}
			}
			let sets = new Set(line);
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
		return list.filter((item) => item != "").join("\n");
	}

	function textRemoveMutiBlank(v, s) {
		if (s == " ") {
			v = v.replaceAll(/(\x20)+/g, " ");
			let rowlist = [];
			let list = v.split("\n");
			for (const i in list) {
				let temp = list[i];
				if (list[i].indexOf(" ") == 0) temp = temp.substring(1, temp.length);
				rowlist.push(temp);
			}
			v = rowlist.join("\n");
		} else {
			v = v.replaceAll(/(\x20)+/g, "").replaceAll("  ", "");
		}
		return v;
	}
})();
