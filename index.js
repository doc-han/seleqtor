/**
 * Returns the first id from an Array of HTML Elements
 * @param {Array<HTMLElement>} elements - Array of HTML Elements
 * @returns {String} An Element id
 */
const getIdFromOne = elements => {
    elements = [...elements];
    for (let i = 0; i < elements.length; i++) {
        let element = elements[i];
        let elementId = element.getAttribute("id");
        if (elementId) return `#${elementId}`;
    }
    return "";
}


/**
 * Get the selector of an HTML Element from the DOM
 * @param {HTMLElement} element - HTML Element
 * @param {Boolean} closestId - should we get the closest id?
 * @returns {String} selector
 */
const getSelector = (element, closestId = true) => {
    if (!element) return false; // element is not set/found
    if (!element.nodeType || element.nodeType !== 1) throw Error(`${element} is not an HTMLElement`);
    // base case to stop
    let tagName = `${element.tagName}`.toLowerCase();
    if (tagName === "html") return "html";
    // get element ID
    let elementId = element.getAttribute("id");
    if (elementId) {
        if (closestId) return `#${elementId}`;
        else return getSelector(element.parentElement, closestId) + " > " + `#${elementId}`;
    }
    // TODO: check if previous siblings have an id
    let siblingId;
    if (closestId) {
        let siblings = [...element.parentElement.children];
        let siblingsBefore = [];
        for (let i = 0; i < siblings.length; i++) {
            let sibling = siblings[i];
            if (sibling === element) break;
            siblingsBefore.push(sibling);
        }
        siblingId = getIdFromOne(siblingsBefore);
    }
    // get element ClassList
    let classes = [...element.classList];
    if (classes.length > 0) {
        let classString = `.${classes.join(".")}`;
        if (closestId) {
            if (siblingId) return siblingId + " + " + classString;
            else return getSelector(element.parentElement, closestId) + " " + classString;
        } else {
            return getSelector(element.parentElement, closestId) + " > " + classString;
        }
    }
    // get element TagName
    let similarTags = element.parentElement.querySelectorAll(tagName);
    if (similarTags.length == 1) { // if tag is unique amongst siblings
        if (closestId) {
            if (siblingId) return siblingId + " + " + tagName;
            else return getSelector(element.parentElement, closestId) + " " + tagName;
        } else {
            return getSelector(element.parentElement, closestId) + " > " + tagName;
        }
    } else { // if tag is not unique amongst siblings
        let myIndex;
        for (let i = 0; i < similarTags.length; i++) {
            let tagElement = similarTags[i];
            if (tagElement == element) {
                myIndex = i;
                break;
            }
        }
        if (closestId) {
            if (siblingId) return siblingId + " + " + `${tagName}:nth-child(${++myIndex})`;
            else return getSelector(element.parentElement, closestId) + " " + `${tagName}:nth-child(${++myIndex})`;
        } else {
            return getSelector(element.parentElement, closestId) + " > " + `${tagName}:nth-child(${++myIndex})`;
        }
    }
}

module.exports = getSelector;
module.exports.getIdFromOne = getIdFromOne;