(function () {
    let getConfig = () => {
        let check = document.querySelectorAll(".rule");
        let split = document.getElementById("split");
        let type = document.getElementById("output-type");
        check[2].disabled = true;
        let config = {
            line: check[0].checked,
            inline: check[1].checked,
            toRow: check[2].checked,
            blank: check[3].checked,
            split: split.value != "" ? split.value : " ",
            type: type.value,
        };
        if (config.inline) check[2].disabled = false;
        return config;
    }

    let textFormatByInLine = (v, s) => {
        let list = v.split("\n");
        let rowlist = [];
        for (const i in list) {
            if (s != " ") {
                let line = list[i].split(s);
                rowlist.push([...new Set(line)].join(s));
            } else {
                let line = list[i].split(" ");
                let newline = [];
                for (const j in line) {
                    if ((!newline.includes(line[j])) || line[j] == "") {
                        newline.push(line[j]);
                    }
                }
                rowlist.push(newline.join(" "));
            }
        }
        return rowlist.join("\n");
    }

    let textFormatToAllRow = (v, s) => {
        let list = v.split("\n");
        let rowlist = [];
        let unique_list = [];
        for (const i in list) {
            let line = list[i].split(s);
            let newline = [];
            for (const j in line) {
                if (((!newline.includes(line[j])) || line[j] == "") && !(unique_list.includes(line[j]))) {
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

    let textFormatByLine = (v) => {
        return [...new Set(v.split("\n"))].join("\n");
    }

    let textRemoveMutiBlank = (v, s) => {
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

    let modelSetting = (v, c) => {
        if (c.inline) v = textFormatByInLine(v, c.split);
        if (c.line) v = textFormatByLine(v);
        if (c.toRow && c.inline) v = textFormatToAllRow(v, c.split);
        if (c.blank) v = textRemoveMutiBlank(v, c.split);
        if (c.type == 1) {
            v = v.replaceAll("\n", c.split).replaceAll(/(\x20)+/g, " ");
            if (c.inline) v = textFormatByInLine(v, c.split);
        }
        if (c.type == 2) {
            v = v.replaceAll("\n", c.split).replaceAll(/(\x20)+/g, " ");
            v = v.replaceAll(" ", "\n");
            if (c.line) v = textFormatByLine(v);
        }
        return v;
    }

    let setText = () => {
        var inText = document.getElementById("input");
        var outText = document.getElementById("output");
        let v = inText.value == null ? "" : inText.value;
        let config = getConfig();
        if (!(config.line || config.inline)) {
            return window.alert("请至少选中一种去重方式");
        }
        outText.innerHTML = modelSetting(v, config);
    }
    let timer;
    let input = document.getElementById("input");
    input.addEventListener("keydown", () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            setText();
        }, 100)
    });
    let check = document.querySelectorAll(".rule,.select");
    check[2].disabled = true;
    check.forEach(e => {
        e.addEventListener("click", () => {
            setText();
        });
    });
    let insplit = document.getElementById("split");
    insplit.addEventListener("keydown", () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            setText();
        }, 100)
    });
}());