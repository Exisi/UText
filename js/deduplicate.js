(function () {
	"use strict";
	let timer;
	let DOM = {
		container: document.getElementById("center"),
		checkebox: {
			multiline: {
				unique: document.querySelector(".row-rule[name='unique-multiline']"),
				notBlank: document.querySelector(".row-rule[name='remove-blank']"),
			},
			inline: {
				unique: document.querySelector(".inline-rule[name='unique-inline']"),
				expandAll: document.querySelector(".inline-rule[name='expand-to-all']"),
				pre_suf_blank: document.querySelector(".inline-rule[name='pre-suf-blank']"),
			},
		},
		rule: {
			split: document.querySelector(".rule[name='split']"),
		},
		textarea: {
			input: document.getElementById("input"),
			output: document.getElementById("output"),
		},
		select: document.getElementsByTagName("select")[0],
	};
	DOM.checkebox.inline.expandAll.disabled = true;
	DOM.container.addEventListener("click", (e) => {
		let tag = e.target.tagName.toLowerCase();
		if (tag == "input" || tag == "select") {
			setText();
		}
	});

	for (const item in DOM.textarea) {
		DOM.textarea[item].addEventListener("keydown", () => {
			clearTimeout(timer);
			timer = setTimeout(() => {
				setText();
			}, 100);
		});
	}

	function setText() {
		let rule = getRule();
		let originList = getOriginRowList();
		let formattedList = textFormatter(originList, rule);
		DOM.textarea.output.innerHTML = restoreListToString(formattedList, rule);
	}

	function getOriginRowList() {
		let text = DOM.textarea.input.value;
		text = text == null ? "" : text;
		return text.split("\n");
	}

	function textFormatter(list, rule) {
		if (rule.unique.inline) {
			let newList = list.map((row) => row.split(rule.split));
			let unique_list = [];
			newList = newList.map((row) => {
				return row.filter((word, index) => {
					if (rule.expandAll && unique_list.includes(word)) {
						return false || word == "";
					}
					unique_list.push(word);
					//unique word, but save the "" word
					return row.indexOf(word) == index || word == "";
				});
			});

			if (rule.notBlank.pre_suf) {
				newList = newList.map((row) => {
					return row.map((words) => words.trim());
				});
			}

			list = newList.map((row) => row.join(rule.split));
		}

		if (rule.unique.multiline) {
			if (rule.notBlank.pre_suf) {
				list = list.map((row) => row.trim());
			}
			list = list.filter((row, index) => {
				//unique row, but save the "" row
				return list.indexOf(row) === index || row == "";
			});
		}

		list = rule.notBlank.row ? list.filter((row) => row != "") : list;
		return list;
	}

	function getRule() {
		DOM.checkebox.inline.expandAll.disabled = true;
		let rule = {
			unique: {
				inline: DOM.checkebox.inline.unique.checked,
				multiline: DOM.checkebox.multiline.unique.checked,
			},
			notBlank: {
				row: DOM.checkebox.multiline.notBlank.checked,
				pre_suf: DOM.checkebox.inline.pre_suf_blank.checked,
			},
			split: DOM.rule.split.value != "" ? DOM.rule.split.value : " ",
			expandAll: DOM.checkebox.inline.expandAll.checked,
			formatType: DOM.select.value,
		};
		if (!(rule.unique.inline || rule.unique.multiline)) {
			return window.alert("请至少选中一种去重方式");
		}
		DOM.checkebox.inline.expandAll.disabled = !rule.unique.inline;
		return rule;
	}

	function restoreListToString(list, rule) {
		let newList = list.map((row) => row.split(rule.split));
		if (rule.formatType == 1) {
			return newList.flat(Infinity).join(rule.split);
		}

		if (rule.formatType == 2) {
			newList = newList.flat(Infinity);

			if (rule.unique.multiline) {
				newList = newList.filter((row, index) => {
					//unique row, but save the "" row
					return newList.indexOf(row) === index || row == "";
				});
			}
			newList = rule.notBlank.row ? newList.filter((row) => row != "") : newList;
			return newList.join("\n");
		}
		return list.join("\n");
	}
})();
