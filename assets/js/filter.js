(function () {
  var grid = document.getElementById("grid");
  if (!grid) return;

  // false = a project needs ANY of the selected tags
  // true  = a project needs ALL of the selected tags
  var MATCH_ALL = false;

  function toArray(list) { return Array.prototype.slice.call(list); }

  var cards = toArray(grid.querySelectorAll(".card"));
  var empty = document.getElementById("empty");
  var tagRow = document.getElementById("tag-row");
  var categoryChips = toArray(document.querySelectorAll('.chip[data-filter="category"]'));
  var tagChips = toArray(document.querySelectorAll('.chip[data-filter="tag"]'));
  var state = { category: "all", tags: [] };

  function cardTags(card) {
    return (card.dataset.tags || "").split("|").filter(function (t) { return t !== ""; });
  }

  function matchesCategory(card) {
    return state.category === "all" || card.dataset.category === state.category;
  }

  function matchesTags(card) {
    if (state.tags.length === 0) return true;
    var tags = cardTags(card);
    function has(t) { return tags.indexOf(t) !== -1; }
    return MATCH_ALL ? state.tags.every(has) : state.tags.some(has);
  }

  // Show only the tag buttons used by projects in the chosen category.
  function updateTagChips() {
    var available = {};
    var anyAvailable = false;
    cards.filter(matchesCategory).forEach(function (card) {
      cardTags(card).forEach(function (t) { available[t] = true; anyAvailable = true; });
    });

    // Un-select any tag that is no longer on offer.
    state.tags = state.tags.filter(function (t) { return available[t]; });

    tagChips.forEach(function (chip) {
      var value = chip.dataset.value;
      if (value === "all") {
        chip.setAttribute("aria-pressed", state.tags.length === 0 ? "true" : "false");
        return;
      }
      chip.hidden = !available[value];
      chip.setAttribute("aria-pressed", state.tags.indexOf(value) !== -1 ? "true" : "false");
    });

    if (tagRow) tagRow.style.display = anyAvailable ? "" : "none";
  }

  function apply() {
    var shown = 0;
    cards.forEach(function (card) {
      var show = matchesCategory(card) && matchesTags(card);
      card.hidden = !show;
      if (show) shown++;
    });
    if (empty) empty.hidden = shown > 0;
  }

  categoryChips.forEach(function (btn) {
    btn.addEventListener("click", function () {
      state.category = btn.dataset.value;
      categoryChips.forEach(function (other) {
        other.setAttribute("aria-pressed", other === btn ? "true" : "false");
      });
      updateTagChips();
      apply();
    });
  });

  tagChips.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var value = btn.dataset.value;
      if (value === "all") {
        state.tags = [];
      } else {
        var i = state.tags.indexOf(value);
        if (i === -1) state.tags.push(value);
        else state.tags.splice(i, 1);
      }
      updateTagChips();
      apply();
    });
  });

  updateTagChips();
  apply();
})();
