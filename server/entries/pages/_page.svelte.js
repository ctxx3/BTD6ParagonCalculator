import { d as ensure_array_like, f as attr, h as attr_style, i as attr_class, e as escape_html, j as stringify, c as pop, p as push } from "../../chunks/index.js";
function generateParagonLevels() {
  return Array.from({ length: 100 }, (_, i) => {
    const degree = i + 1;
    if (degree === 1) return 0;
    if (degree === 100) return 2e5;
    const top = 50 * degree ** 3 + 5025 * degree ** 2 + 168324 * degree + 843e3;
    return Math.floor(top / 600);
  });
}
generateParagonLevels();
function _page($$payload, $$props) {
  push();
  const inputFields = [
    {
      key: "tier5Towers",
      label: "Tier 5 Towers",
      min: 0,
      max: 999,
      tooltip: "Tier 5 Towers (excluding initial 3)."
    },
    {
      key: "upgrades",
      label: "Upgrades",
      min: 0,
      max: 999,
      tooltip: "All upgrade tiers spent on towers excluding Tier 5s. Max 100."
    },
    {
      key: "popCount",
      label: "Pop Count",
      min: 0,
      max: 162e5,
      tooltip: "Bloons popped from every tower of the paragon type. Max 16.2M."
    },
    {
      key: "cashSpent",
      label: "Cash Spent",
      min: 0,
      max: 5e6,
      tooltip: "Total spent on towers excluding T5s. Max $5,000,000."
    },
    {
      key: "cashGenerated",
      label: "Cash Generated",
      min: 0,
      max: 405e4,
      tooltip: "Buccaneer & Engineer only. Max $4.05M."
    },
    {
      key: "cashInjections",
      label: "Cash Injections",
      min: 0,
      max: 1e7,
      tooltip: "Allowed cash injection for the paragon. 3.15x base cost."
    },
    {
      key: "powerTotems",
      label: "Power Totems",
      min: 0,
      max: 999,
      tooltip: "No max cap for paragon power."
    }
  ];
  let formData = {
    selectedTower: 1,
    difficulty: "easy",
    tier5Towers: 0,
    upgrades: 0,
    cashSpent: 0,
    cashGenerated: 0,
    cashInjections: 0,
    popCount: 0,
    powerTotems: 0
  };
  let towers = [];
  let results = { level: 0, currDegree: 0, nextDegree: 0 };
  const each_array_1 = ensure_array_like(inputFields);
  $$payload.out += `<div class="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-2 md:p-6 flex items-center justify-center"><div class="flex flex-col w-full max-w-5xl mx-auto gap-4 md:flex-row"><div class="md:w-1/2 bg-white/90 rounded-xl shadow-lg p-3 md:p-5 border border-gray-200 flex flex-col gap-3"><h2 class="text-lg md:text-xl font-semibold mb-2 text-blue-700 flex items-center gap-2">Tower &amp; Parameters</h2> <div><h3 class="text-xs font-medium mb-1 text-gray-700">Select Tower</h3> <div class="flex gap-2 overflow-x-auto py-2">`;
  if (towers.length > 0) {
    $$payload.out += "<!--[-->";
    const each_array = ensure_array_like(towers);
    $$payload.out += `<!--[-->`;
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let tower = each_array[$$index];
      $$payload.out += `<label class="relative cursor-pointer flex flex-col items-center min-w-[60px]"><input type="radio" name="tower"${attr("value", tower.id)}${attr("checked", formData.selectedTower === tower.id, true)} class="sr-only"> <div${attr_style(`background-image: url(${stringify(tower.image)});`)}${attr_class(`w-12 h-12 md:w-14 md:h-14 bg-center bg-contain bg-no-repeat rounded-lg border-2 transition-all duration-150 ${formData.selectedTower === tower.id ? "border-blue-500 ring-2 ring-blue-200 scale-105" : "border-gray-200 hover:border-blue-300"}`)}></div> <span class="text-xs text-center mt-1 text-gray-600 truncate w-14">${escape_html(tower.name)}</span></label>`;
    }
    $$payload.out += `<!--]-->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<div class="text-center text-gray-400 text-xs">Loading towers...</div>`;
  }
  $$payload.out += `<!--]--></div></div> <form class="grid grid-cols-1 md:grid-cols-2 gap-2"><div class="flex flex-col"><label for="difficulty" class="text-xs font-medium text-gray-600 mb-1">Difficulty</label> <select class="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300 text-xs bg-white" id="difficulty" name="difficulty"><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option><option value="impoppable">Impoppable</option></select></div> <!--[-->`;
  for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
    let field = each_array_1[$$index_1];
    $$payload.out += `<div class="flex flex-col"><div class="flex items-center gap-1"><label${attr("for", field.key)} class="text-xs font-medium text-gray-600">${escape_html(field.label)}</label> <span class="group relative"><svg class="w-3 h-3 text-gray-400 cursor-pointer" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4M12 8h.01"></path></svg> <div class="absolute z-10 hidden group-hover:block bg-black text-white text-xs rounded p-2 w-40 left-1/2 -translate-x-1/2 mt-1 shadow-lg">${escape_html(field.tooltip)}</div></span></div> <input type="number"${attr("id", field.key)}${attr("value", formData[field.key])}${attr("min", field.min)}${attr("max", field.max)} class="mt-1 px-2 py-1 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 text-xs bg-gray-50"${attr("placeholder", field.label)}></div>`;
  }
  $$payload.out += `<!--]--></form></div> <div class="md:w-1/2 bg-white/90 rounded-xl shadow-lg p-3 md:p-5 border border-gray-200 flex flex-col gap-3 justify-between"><div><h2 class="text-lg md:text-xl font-semibold mb-2 text-blue-700 flex items-center gap-2">Calculation Results</h2> <div class="p-3 bg-gradient-to-r from-blue-100 to-blue-50 rounded-lg border border-blue-200 mb-2 flex flex-col items-center"><div class="text-base font-medium text-blue-700">Estimated Degree</div> <div class="text-3xl font-extrabold text-blue-600 tracking-tight">${escape_html(results.level)}</div></div> <div class="grid grid-cols-2 gap-2 mb-2"><div class="p-2 bg-gray-50 rounded-lg border border-gray-200 flex flex-col items-center"><div class="text-xs font-medium text-gray-500">Current Power</div> <div class="text-lg font-semibold text-gray-700">${escape_html(results.currDegree.toLocaleString())}</div></div> <div class="p-2 bg-gray-50 rounded-lg border border-gray-200 flex flex-col items-center"><div class="text-xs font-medium text-gray-500">Progress to Next</div> <div class="text-lg font-semibold text-gray-700">${escape_html(results.nextDegree.toLocaleString())}</div></div></div></div></div></div></div>`;
  pop();
}
export {
  _page as default
};
