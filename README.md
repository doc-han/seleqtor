## Selektor
Selektor is a simple javascript function that generates a perfect selector a DOM element passed to it.

## Function Definitiion
```javascript
selektor(element: HTMLElement, closestId: Boolean);
```

The function takes two arguments,
- element - An HTMLElement that can be retrieved through `document.querySelector(".anything-here")`
- closestId - A Boolean to specify whether the selector should be constructed from the closest ID to the HTMLElement provided. 
This value defaults to `true`


