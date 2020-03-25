$(function() {

    //// GENERAL CONSTANTS
    const imgDirPath = "img/";
    const imgNamePrefix = "d";
    const imgNameSuffix = ".png";

    //// TEMPLATE ELEMENTS

    const templateDieStock = $("#templates > .die-stock").first();
    const templateDie = $("#templates > .die").first();


    //// FUNCTIONS

    const render = function() {
        this.domContainer.empty();
        this.dice.forEach(die => this.domContainer.add(die));
    }

    const add = function(type) {
        this.dice.push(die);
        this.render();
    }

    const remove = function(type) {
        this.dice.pop(crea);
        this.render();
        return die;
    }

    const clear = function() {
        this.dice = [];
        this.render();
    }

    const createContainer = function(domElement) {
        return {
            dice: [],
            domElement: domElement,
            add: add,
            remove: remove,
            render: render,
            clear: clear
        };
    }

    const createDie = function(container, type) {
        return {
            stock: container.isStock,
            type: type,
            value: -1,
            container: container,
            domElement: container.isStock
                ? createStockDieElement(type)
                : createDieElement(type)
        };
    }

    const createDieElement = function(type) {
        let e = templateDie.clone();
        // set image
        e.children(".die-image").first()
            .attr("src", imgDirPath + imgNamePrefix + type + imgNameSuffix)
            .attr("alt", "d" + type);
        // set initial value text
        e.children(".die-value").first()
            .text(" ");
        // button functionality: SELECT
        e.children(".die-buttons > .btn-select").first().click(function() {
            hand.add(table.remove(this));
        });
        // button functionality: ROLL
        e.children(".die-buttons > .btn-roll").first().click(function() {
            this.roll();
        });
        // button functionality: REMOVE
        e.children(".die-buttons > .btn-remove").first().click(function() {
            
        });
    }


    //// INIT CONTAINERS

    const hand  = createContainer($("#hand"));
    const table = createContainer($("#table"));

    
    //// EVENTS



    //// INIT UI

    // init stock dice
    $("#stock > .die-stock").each(function(i){
        // index
        $(this).attr("data-index", i);
        // title
        $(this).attr("title", "Add d" + $(this).attr("data-type") + " to the table");
        // bg image
        $(this).css("background-image", "url(" + imgDirPath + imgNamePrefix + $(this).attr("data-type") + imgNameSuffix + ")");
        // label
        $(this).text($(this).attr("data-type"));
        // click handler
        $(this).click(function(){
            alert("Clicked d" + $(this).attr("data-type"));
        });
    });
    
});