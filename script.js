const CONVERSION_FACTOR = 3.671;

const fromInput = document.querySelector("#from-value");
const toInput = document.querySelector("#to-value");
const swapButton = document.querySelector("#swap-button");
const fromUnit = document.querySelector("#from-unit");
const toUnit = document.querySelector("#to-unit");
const fromLabel = document.querySelector("#from-label");
const toLabel = document.querySelector("#to-label");
const conversionNote = document.querySelector("#conversion-note");

let direction = "pg-to-pmol";
let activeInput = "from";
let isUpdating = false;

function parseValue(rawValue) {
  const normalized = rawValue.trim().replace(",", ".");

  if (normalized === "" || normalized === ".") {
    return null;
  }

  const value = Number(normalized);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

function formatValue(value) {
  if (!Number.isFinite(value)) {
    return "";
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 3,
    useGrouping: false
  }).format(value);
}

function convert(value, source) {
  if (direction === "pg-to-pmol") {
    return source === "from"
      ? value * CONVERSION_FACTOR
      : value / CONVERSION_FACTOR;
  }

  return source === "from"
    ? value / CONVERSION_FACTOR
    : value * CONVERSION_FACTOR;
}

function updateFrom(source) {
  if (isUpdating) return;

  isUpdating = true;
  activeInput = source;

  const sourceInput = source === "from" ? fromInput : toInput;
  const targetInput = source === "from" ? toInput : fromInput;
  const value = parseValue(sourceInput.value);

  if (sourceInput.value.trim() === "") {
    targetInput.value = "";
  } else if (value === null) {
    targetInput.value = "";
  } else {
    targetInput.value = formatValue(convert(value, source));
  }

  isUpdating = false;
}

function updateLabels() {
  const pgFirst = direction === "pg-to-pmol";

  fromUnit.textContent = pgFirst ? "pg/mL" : "pmol/L";
  toUnit.textContent = pgFirst ? "pmol/L" : "pg/mL";
  fromLabel.textContent = `Estradiol in ${fromUnit.textContent}`;
  toLabel.textContent = `Estradiol in ${toUnit.textContent}`;
  conversionNote.textContent = pgFirst
    ? "1 pg/mL = 3.671 pmol/L"
    : "1 pmol/L ≈ 0.2724 pg/mL";
}

function swapUnits() {
  const currentFrom = fromInput.value;
  const currentTo = toInput.value;

  direction = direction === "pg-to-pmol" ? "pmol-to-pg" : "pg-to-pmol";
  fromInput.value = currentTo;
  toInput.value = currentFrom;

  updateLabels();

  const focusTarget = activeInput === "from" ? fromInput : toInput;
  focusTarget.focus();
  focusTarget.setSelectionRange(focusTarget.value.length, focusTarget.value.length);
}

fromInput.addEventListener("input", () => updateFrom("from"));
toInput.addEventListener("input", () => updateFrom("to"));
fromInput.addEventListener("focus", () => { activeInput = "from"; });
toInput.addEventListener("focus", () => { activeInput = "to"; });
swapButton.addEventListener("click", swapUnits);

updateLabels();
