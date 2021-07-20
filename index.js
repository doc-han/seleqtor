
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
 * 
 * @param {HTMLElement} element 
 * @returns {String} selector
 */
const getId = element => {
    // base case to stop
    let tagName = `${element.tagName}`.toLowerCase();
    if (tagName === "html") return "html";
    // get element ID
    let elementId = element.getAttribute("id");
    if (elementId) return `#${elementId}`;
    // TODO: check if previous siblings have an id
    let siblings = [...element.parentElement.children];
    let siblingsBefore = [];
    for (let i = 0; i < siblings.length; i++) {
        let sibling = siblings[i];
        if (sibling === element) break;
        siblingsBefore.push(sibling);
    }
    let siblingId = getIdFromOne(siblingsBefore);
    // get element ClassList
    let classes = [...element.classList];
    if (classes.length > 0) {
        let classString = `.${classes.join(".")}`;
        if (siblingId) return siblingId + " + " + classString;
        return getId(element.parentElement) + " " + classString;
    }
    // get element TagName
    let similarTags = element.parentElement.querySelectorAll(tagName);
    if (similarTags.length == 1) { // if tag is unique amongst siblings
        if (siblingId) return siblingId + " + " + tagName;
        return getId(element.parentElement) + " " + tagName;
    } else { // if tag is not unique amongst siblings
        let myIndex;
        for (let i = 0; i < similarTags.length; i++) {
            let tagElement = similarTags[i];
            if (tagElement == element) {
                myIndex = i;
                break;
            }
        }
        if (siblingId) return siblingId + " + " + `${tagName}:nth-child(${++myIndex})`;
        return getId(element.parentElement) + " " + `${tagName}:nth-child(${++myIndex})`;
    }
}


/**
 * 
 * @param {HTMLElement} element 
 * @returns {String} selector
 */
const getPath = element => {
    // base case to stop
    let tagName = `${element.tagName}`.toLowerCase();
    if (tagName === "html") return "html";
    // get element ID
    let elementId = element.getAttribute("id");
    if (elementId) return getPath(element.parentElement) + " > " + `#${elementId}`;
    // get element ClassList
    let classes = [...element.classList];
    if (classes.length > 0) {
        let classString = `.${classes.join(".")}`;
        return getPath(element.parentElement) + " > " + classString;
    }
    // get element TagName
    let similarTags = element.parentElement.querySelectorAll(tagName);
    if (similarTags.length == 1) { // if tag is unique amongst siblings
        return getPath(element.parentElement) + " > " + tagName;
    } else { // if tag is not unique amongst siblings
        let myIndex;
        for (let i = 0; i < similarTags.length; i++) {
            let tagElement = similarTags[i];
            if (tagElement == element) {
                myIndex = i;
                break;
            }
        }
        return getPath(element.parentElement) + " > " + `${tagName}:nth-child(${++myIndex})`;
    }
}


/**
 * Get the selector of an HTML Element from the DOM
 * @param {HTMLElement} element - HTML Element
 * @param {Boolean} closestId - should we get the closest id?
 * @returns {String} selector
 */
const getSelector = (element, closestId = true) => {
    if(!element) return false; // element is not set/found
    if (closestId) {
        return getId(element);
    } else {
        return getPath(element);
    }
}

module.exports = getSelector;
module.exports.getPath = getPath;
module.exports.getId = getId;
module.exports.getIdFromOne = getIdFromOne;