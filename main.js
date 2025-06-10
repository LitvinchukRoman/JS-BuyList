
const input = document.querySelector("input[type='text']");
const addButton = document.querySelector(".add-button");
const listSection = document.querySelector(".shopping-list-section");
const summarySection = document.querySelector(".summary-section");

let items = JSON.parse(localStorage.getItem("items")) || [
  { name: "Помідори", quantity: 2, bought: true },
  { name: "Печиво", quantity: 2, bought: false },
  { name: "Сир", quantity: 1, bought: false }
];

function saveToStorage() {
  localStorage.setItem("items", JSON.stringify(items));
}

function updateSummary() {
  const remainingDiv = summarySection.querySelectorAll(".summary-tags")[1];
  const boughtDiv = summarySection.querySelectorAll(".summary-tags")[3];
  remainingDiv.innerHTML = "";
  boughtDiv.innerHTML = "";

  for (let item of items) {
    const tag = document.createElement("div");
    tag.classList.add(item.bought ? "summary-tag-bought" : "summary-tag");
    tag.innerHTML = `<span>${item.name}</span><span class="quantity-controls">${item.quantity}</span>`;
    item.bought ? boughtDiv.appendChild(tag) : remainingDiv.appendChild(tag);
  }
}

function renderItems() {
  const oldItems = listSection.querySelectorAll(".list-item");
  oldItems.forEach(i => i.remove());
  for (let item of items) {
    const itemDiv = document.createElement("div");
    itemDiv.className = "list-item";

    const nameSpan = document.createElement("span");
    nameSpan.textContent = item.name;
    nameSpan.className = item.bought ? "item-name-deleted" : "item-name";

    if (!item.bought) {
      nameSpan.addEventListener("click", () => {
        const input = document.createElement("input");
        input.type = "text";
        input.value = item.name;
        nameSpan.replaceWith(input);
        input.focus();
        input.addEventListener("blur", () => {
          item.name = input.value;
          saveToStorage();
          renderItems();
          updateSummary();
        });
      });
    }

    // Buttons
    const quantityDiv = document.createElement("div");
    quantityDiv.className = "quantity-controls-first";

    const minus = document.createElement("button");
    minus.textContent = "-";
    minus.disabled = item.quantity === 1;
    if (!item.bought) {
      minus.className = "minus";
      minus.onclick = () => {
        if (item.quantity > 1) item.quantity--;
        saveToStorage();
        renderItems();
        updateSummary();
      };
    } else minus.className = "invisible";

    const plus = document.createElement("button");
    plus.textContent = "+";
    if (!item.bought) {
      plus.className = "plus";
      plus.onclick = () => {
        item.quantity++;
        saveToStorage();
        renderItems();
        updateSummary();
      };
    } else plus.className = "invisible";

    const qty = document.createElement("span");
    qty.className = "quantity";
    qty.textContent = item.quantity;

    quantityDiv.append(minus, qty, plus);
    // Buttons 

    const actions = document.createElement("div");
    actions.className = "action-buttons";

    const toggleBtn = document.createElement("button");
    toggleBtn.className = "status-button";
    toggleBtn.textContent = item.bought ? "Куплено" : "Купити";
    toggleBtn.onclick = () => {
      item.bought = !item.bought;
      saveToStorage();
      renderItems();
      updateSummary();
    };
    actions.appendChild(toggleBtn);

    // Not Bought condition
    if (!item.bought) {
      const delBtn = document.createElement("button");
      delBtn.className = "delete-button";
      delBtn.textContent = "×";
      delBtn.onclick = () => {
        items = items.filter(i => i !== item);
        saveToStorage();
        renderItems();
        updateSummary();
      };
      actions.appendChild(delBtn);
    }
    

    itemDiv.append(nameSpan, quantityDiv, actions);
    listSection.appendChild(itemDiv);
  }
}

addButton.addEventListener("click", addItem);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addItem();
});

function addItem() {
  const name = input.value.trim();
  if (name === "") return;
  items.push({ name, quantity: 1, bought: false });
  input.value = "";
  input.focus();
  saveToStorage();
  renderItems();
  updateSummary();
}

renderItems();
updateSummary();