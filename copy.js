(function () {
	let btn = document.getElementById("copy");

	btn.addEventListener("mousedown", (e) => {
		btn.setAttribute("id", "copy-ok");
		let output = document.getElementById("output");
		let v = output.innerHTML;
		if (v != "" && v != null) {
			navigator.clipboard.writeText(v);
		}
	});
	btn.addEventListener("mouseup", (e) => {
		btn.setAttribute("id", "copy");
	});
})();
