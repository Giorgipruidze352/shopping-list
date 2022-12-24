let state = {
	items: []
};

let listItemTemplate = (
  '<li>' +
    '<span class="shopping-item js-shopping-item"></span>' +
    '<div class="shopping-item-controls">' +
      '<button class="js-shopping-item-toggle item-toggle-btn">' +
        '<span class="button-label">Check</span>' +
      '</button>' +
      '<button class="js-shopping-item-delete item-delete-btn">' +
        '<span class="button-label">Delete</span>' +
      '</button>' +
    '</div>' +
  '</li>'
);

// State management
function addItem(state, item){
	state.items.push({
		displayName: item,
		checkedOff: false
	});
}

function removeItem(state, itemIndex){
	state.items.splice(itemIndex, 1);
}

function getItem(state, itemIndex){
	return state.items[itemIndex];
}

function updateItem(state, itemIndex, newItemState){
	state.items[itemIndex] = newItemState;
}

// DOM Manipulation
function renderItem(item, itemId, listItemTemplate, dataAttr){
	let element = $(listItemTemplate);
	element.find(".js-shopping-item").text(item.displayName);
	if(item.checkedOff){
		element.find(".js-shopping-item").addClass("shopping-item-checked");
	}
	element.find(".js-shopping-item-toggle")
	element.attr(dataAttr, itemId);
	return element;
}

function renderList(state, element, dataAttr){
	let itemsHTML = state.items.map(function(item, index){
		return renderItem(item, index, listItemTemplate, dataAttr);
	});
	element.html(itemsHTML);
}

// Event Listeners
function handleItemAdds(
	formElement, newItem, dataAttr, listElement, state){

	formElement.submit(function(event){
		event.preventDefault();

		let input = formElement.find(newItem).val();
		addItem(state, input);
		renderList(state, listElement, dataAttr);
		this.reset();
	});
}

function handleItemDeletes(
	formElement, deleteItem, dataAttr, listElement, state){

	listElement.on("click", deleteItem, function(event){

		let itemIndex = parseInt($(this).closest("li").attr(dataAttr));
		removeItem(state, itemIndex);
		renderList(state, listElement, dataAttr);
	});
}

function handleItemToggles(
	listElement, toggleClass, dataAttr, state){

	listElement.on("click", toggleClass, function(event){
		let itemId = $(event.currentTarget.closest("li")).attr(dataAttr);
		let oldItem = getItem(state, itemId);

		updateItem(state, itemId, {
			displayName: oldItem.displayName,
			checkedOff: !oldItem.checkedOff
		});
		renderList(state, listElement, dataAttr);
	});
}

$(function(){

	let formElement = $("#js-shopping-list-form");
	let listElement = $(".js-shopping-list");

	// Input ID 
	let newItem = "#shopping-list-entry";
	// Delete-button Class
	let deleteItem = ".js-shopping-item-delete";

	// Attribute to store id of the list item to identify it
	let dataAttr = "item-id";

	let toggleClass = ".js-shopping-item-toggle";

	// Calling functions 
	handleItemAdds(formElement, newItem, dataAttr, listElement, state);
	handleItemDeletes(formElement, deleteItem, dataAttr, listElement, state);
	handleItemToggles(listElement, toggleClass, dataAttr, state);

});
