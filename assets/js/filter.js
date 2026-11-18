(function () {
  var grid = document.getElementById("grid");
  if (!grid) return;

  var cards = Array.prototype.slice.call(grid.querySelectorAll(".card"));
  var empty = document.getElementById("empty");
  var state = { category: "all", tag: "all" };

  function apply() {
    var shown = 0;
    cards.forEach(function (card) {
      var tags = (card.dataset.tags || "").split("|");
      var okCategory = state.category === "all" || card.dataset.category === state.category;
      var okTag = state.tag === "all" || tags.indexOf(state.tag) !== -1;
      var show = okCategory && okTag;
      card.hidden = !show;
      if (show) shown++;
    });
    if (empty) empty.hidden = shown > 0;
  }

  Array.prototype.slice.call(document.querySelectorAll(".chip[data-filter]")).forEach(function (btn) {
    btn.addEventListener("click", function () {
      var group = btn.dataset.filter;
      state[group] = btn.dataset.value;
      Array.prototype.slice.call(document.querySelectorAll('.chip[data-filter="' + group + '"]')).forEach(function (other) {
        other.setAttribute("aria-pressed", other === btn ? "true" : "false");
      });
      apply();
    });
  });
})();
