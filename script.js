document.addEventListener("DOMContentLoaded", function () {
  const options = document.querySelectorAll(".plan-container");
  options.forEach((option) => {
    option.addEventListener("click", function () {
      options.forEach((opt) => opt.classList.remove("active"));
      this.classList.add("active");
    });
  });
});

let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides((slideIndex += n));
}
function currentSlide(n) {
  showSlides((slideIndex = n));
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("slides-container");
  let numbers = document.getElementsByClassName("number");

  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < numbers.length; i++) {
    numbers[i].className = numbers[i].className.replace("chosen", "");
  }
  slides[slideIndex - 1].style.display = "flex";
  numbers[slideIndex - 1].className += " chosen";
}

function infoSubmit() {
  const fields = [
    { input: document.querySelector('input[name="name"]'), warning: document.getElementById("name") },
    { input: document.querySelector('input[name="email"]'), warning: document.getElementById("email") },
    { input: document.querySelector('input[name="phone"]'), warning: document.getElementById("phone") },
  ];
  let hasEmpty = false;

  fields.forEach(({ input, warning }) => {
    if (input.value.trim() === "") {
      warning.classList.remove(hidden);
      input.style.borderColor = "var(--red-500)";
      hasEmpty = true;
    } else {
      warning.classList.add("hidden");
      input.style.borderColor = "var(--purple-200)";
    }
  });

  if (!hasEmpty) {
    // reset values
    fields.forEach(({ input }) => {
      input.value = "";
      input.style.borderColor = "var(--purple-200)";
    });
    // proceed to next slide
    plusSlides(1);
  }
}

function onSlidering() {
  const slider = document.getElementById("sliding");
  const months = document.querySelectorAll(".month-price");
  const years = document.querySelectorAll(".year-price");
  const freeText = document.querySelectorAll(".free");
  const chosenPlan = document.getElementById("chosen-plan");
  const chosenPeriod = document.getElementById("chosen-period");
  const arcadePickPrice = document.getElementById("arcade-pick-price");
  const planTitle = document.querySelector(".plan-container.active .plan-title");
  const monthPrice = document.querySelector(".plan-container.active .month-price");
  const yearPrice = document.querySelector(".plan-container.active .year-price");
  const boxes = document.querySelectorAll("input[name='addons']:checked");
  const existingAddOns = document.querySelectorAll(".addOns-picked-card");

  // Helper to toggle visibility
  const toggleVisibility = (elements, hidden) => {
    elements.forEach((el) => el.classList.toggle("hidden", hidden));
  };

  // Reset add-ons
  const resetAddOns = () => {
    boxes.forEach((box) => (box.checked = false));
    existingAddOns.forEach((addOn) => addOn.remove());
  };

  // Always update chosen plan text
  if (planTitle) chosenPlan.textContent = planTitle.innerHTML;

  if (slider.checked) {
    toggleVisibility(months, true);
    toggleVisibility(years, false);
    toggleVisibility(freeText, false);
    chosenPeriod.textContent = "(yearly)";
    if (yearPrice) arcadePickPrice.textContent = yearPrice.innerHTML;
  } else {
    toggleVisibility(months, false);
    toggleVisibility(years, true);
    toggleVisibility(freeText, true);
    chosenPeriod.textContent = "(monthly)";
    if (monthPrice) arcadePickPrice.textContent = monthPrice.innerHTML;
  }
  resetAddOns();
}

function planSubmit() {
  const slider = document.getElementById("sliding");
  const planTitle = document.querySelector(".plan-container.active .plan-title");
  const monthPrice = document.querySelector(".plan-container.active .month-price");
  const yearPrice = document.querySelector(".plan-container.active .year-price");
  const chosenPeriod = document.getElementById("chosen-period");
  const chosenPlan = document.getElementById("chosen-plan");
  const arcadePickPrice = document.getElementById("arcade-pick-price");

  if (!planTitle || !monthPrice || !yearPrice) return; //safety check

  chosenPlan.textContent = planTitle.textContent;

  if (slider.checked) {
    chosenPeriod.textContent = "(yearly)";
    arcadePickPrice.textContent = yearPrice.textContent;
  } else {
    chosenPeriod.textContent = "(monthly)";
    arcadePickPrice.textContent = monthPrice.textContent;
  }
  plusSlides(1);
}

const checkboxes = document.querySelectorAll("input[name='addons']");
const container = document.getElementById("addOns-pick-container");
const slider = document.getElementById("sliding");

// Helper: create a card element
function createAddOnCard(value, monthPrice, yearPrice, isYearly) {
  const card = document.createElement("div");
  card.className = "addOns-picked-card";
  card.dataset.value = value;

  const label = document.createElement("div");
  label.className = "addOns-picked";
  label.textContent = value;

  const price = document.createElement("div");
  price.className = "addOns-pick-price";
  price.textContent = isYearly ? `+$${yearPrice}/yr` : `++$${monthPrice}/mo`;

  card.append(label, price);
  return card;
}

//Main listener
checkboxes.forEach((box) => {
  box.addEventListener("change", () => {
    const { value, month, year } = box.dataset;
    const existing = container.querySelector(`[data-value="${box.value}]`);

    if (box.checked) {
      const card = createAddOnCard(box.value, month, year, slider.checked);
      container.appendChild(card);
    } else if (existing) {
      existing.remove();
    }
  });
});

function addSubmit() {
  const boxes = document.querySelectorAll("input[name='addons']:checked");
  const period = document.getElementById("period");
  const slider = document.getElementById("sliding");
  const totalPrice = document.getElementById("total-price");

  const monthPriceEl = document.querySelector(".plan-container.active .month-price");
  const yearPriceEl = document.querySelector(".plan-container.active .year-price");

  if (!monthPriceEl || !yearPriceEl) return; // safety check

  const monthlyBase = parseFloat(monthPriceEl.textContent.match(/\d+/));
  const yearlyBase = parseFloat(yearPriceEl.textContent.match(/\d+/));

  // Helper: sum dataset values
  const sumValues = (boxes, key) => [...boxes].reduce((sum, box) => sum + parseFloat(box.dataset[key] || 0), 0);

  const sumMonth = sumValues(boxes, "month");
  const sumYear = sumValues(boxes, "year");

  if (slider.checked) {
    period.textContent = "year";
    totalPrice.textContent = `+$${yearlyBase + sumYear}/yr`;
  } else {
    period.textContent = "month";
    totalPrice.textContent = `+$${monthlyBase + sumMonth}/mo`;
  }

  plusSlides(1);
}

function onChanging() {
  const boxes = document.querySelectorAll("input[name='addons']:checked");
  const chosenPeriodEl = document.getElementById("chosen-period");
  const arcadePickPriceEl = document.getElementById("arcade-pick-price");
  const periodEl = document.getElementById("period");
  const totalPriceEl = document.getElementById("total-price");
  const container = document.getElementById("addOns-pick-container");

  const activePlan = document.querySelector(".plan-container.active");
  if (!activePlan) return; // safety check

  const monthPriceEl = activePlan.querySelector(".month-price");
  const yearPriceEl = activePlan.querySelector(".year-price");

  const monthlyBase = parseFloat(monthPriceEl?.textContent.match(/\d+/));
  const yearlyBase = parseFloat(yearPriceEl?.textContent.match(/\d+/));

  // Helper: sum dataset values
  const sumValues = (key) => [...boxes].reduce((sum, box) => sum + parseFloat(box.dataset[key] || 0), 0);

  const sumMonth = sumValues("month");
  const sumYear = sumValues("year");

  // Clear existing cards
  container.querySelectorAll(".addOns-picked-card").forEach((card) => card.remove());
  totalPriceEl.textContent = "";

  // Helper: create add-on card
  const createCard = (label, priceText) => {
    const card = document.createElement("div");
    card.className = "addOns-picked-card";

    const addPick = document.createElement("div");
    addPick.className = "addOns-picked";
    addPick.textContent = label;

    const pricePick = document.createElement("div");
    pricePick.className = "addOns-pick-price";
    pricePick.textContent = priceText;

    card.append(addPick, pricePick);
    return card;
  };

  // Build cards + update totals
  boxes.forEach((box) => {
    const isMonthly = chosenPeriodEl.textContent === "(monthly)";
    if (isMonthly) {
      chosenPeriodEl.textContent = "(yearly)";
      arcadePickPriceEl.textContent = yearPriceEl.textContent;
      periodEl.textContent = "year";

      const total = yearlyBase + sumYear;
      totalPriceEl.textContent = `+$${total}/yr`;

      container.appendChild(createCard(box.value, `+$${box.dataset.year}/yr`));
    } else {
      chosenPeriodEl.textContent = "(monthly)";
      arcadePickPriceEl.textContent = monthPriceEl.textContent;
      periodEl.textContent = "month";

      const total = monthlyBase + sumMonth;
      totalPriceEl.textContent = `+$${total}/mo`;

      container.appendChild(createCard(box.value, `+$${box.dataset.month}/mo`));
    }
  });
}

function confirm() {
  const slider = document.getElementById("sliding");
  const containerSelectors = {
    options: ".plan-container",
    monthPrices: ".month-price",
    yearPrices: ".year-price",
    fress: ".free",
    existingAddOns: ".addOns-picked-card",
    checkedAddOns: "input[name='addons']:checked",
  };

  // Helper: toggle visibility
  const toggleVisibility = (selector, hidden) => {
    document.querySelectorAll(selector).forEach((el) => el.classList.toggle("hidden", hidden));
  };

  // Reset selections
  document.querySelectorAll(containerSelectors.options).forEach((opt) => opt.classList.remove("active"));

  slider.checked = false;

  document.querySelectorAll(containerSelectors.checkedAddOns).forEach((box) => (box.checked = false));

  toggleVisibility(containerSelectors.monthPrices, false);
  toggleVisibility(containerSelectors.yearPrices, true);
  toggleVisibility(containerSelectors.fress, true);

  document.querySelectorAll(containerSelectors.existingAddOns).forEach((card) => card.remove());

  plusSlides(1);
}
