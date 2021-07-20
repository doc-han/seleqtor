const getSelector = require("./index");
const getIdFromOne = getSelector.getIdFromOne;
const jsdom = require("jsdom");

const ids = {
    elementOne: "element1",
    elementTwo: "element2",
    elementThree: "element3",
    elementFour: "element4",
    elementFive: "element5",
    elementFiveChild: "element5child",
    elementSix: "element6"
}

const classes = {
    elementTwoInnerOne: "element2-inner-1",
    elementTwoInnerTwo: "element2-inner-2"
}

const rawHTML = `
<div id="${ids.elementOne}"></div>
<div id="${ids.elementTwo}">
    <div class="element2-inner-1">
        <div class="element2-inner-2"></div>
    </div>
</div>
<div id="${ids.elementThree}">
    <p>
        <span></span>
    </p>
</div>
<div id="${ids.elementFour}">
    <p></p>
    <p></p>
</div>
<div id="${ids.elementFive}">
    <p id="${ids.elementFiveChild}"></p>
    <span>
        <p></p>
    </span>
</div>
<div id="${ids.elementSix}">
    <span>
    </span>
    <span>
        <p></p>
        <p></p>
    </span>
</div>
`

const { window } = new jsdom.JSDOM(rawHTML);

test("Return element ID if available", () => {
    let el = window.document.querySelector(`#${ids.elementOne}`);
    expect(getSelector(el)).toBe(`#${ids.elementOne}`);
})

test("Return parent element ID and child class", () => {
    let el1 = window.document.querySelector(`.${classes.elementTwoInnerOne}`);
    expect(getSelector(el1)).toBe(`#${ids.elementTwo} .${classes.elementTwoInnerOne}`);

    let el2 = window.document.querySelector(`.${classes.elementTwoInnerTwo}`);
    expect(getSelector(el2)).toBe(`#${ids.elementTwo} .${classes.elementTwoInnerOne} .${classes.elementTwoInnerTwo}`)
})

test("Return parent element ID and tagName", () => {
    let el1 = window.document.querySelector(`#${ids.elementThree} p`);
    expect(getSelector(el1)).toBe(`#${ids.elementThree} p`);

    let el2 = window.document.querySelector(`#${ids.elementThree} span`);
    expect(getSelector(el2)).toBe(`#${ids.elementThree} p span`);
})

test("Return tagName[index] with parent ID", () => {
    let el = window.document.querySelector(`#${ids.elementFour} p:nth-child(2)`);
    expect(getSelector(el)).toBe(`#${ids.elementFour} p:nth-child(2)`);
})

test("Return sibling ID with tagName", () => {
    let el1 = window.document.querySelector(`#${ids.elementFive} span`);
    expect(getSelector(el1)).toBe(`#${ids.elementFiveChild} + span`);

    let el2 = window.document.querySelector(`#${ids.elementFive} span p`);
    expect(getSelector(el2)).toBe(`#${ids.elementFiveChild} + span p`)
})

test("path from html to tag[index]", () => {
    let el = window.document.querySelector(`#${ids.elementSix} p:nth-child(2)`);
    expect(getSelector(el, false)).toBe(`html > body > #${ids.elementSix} > span:nth-child(2) > p:nth-child(2)`)
})

test("get id from one", () => {
    let el = window.document.querySelectorAll(`body > div`);
    expect(getIdFromOne(el)).toBe(`#${ids.elementOne}`);
})

test("element not found", ()=> {
    expect(getSelector(window.document.querySelector("#no-element"))).toBe(false);
})