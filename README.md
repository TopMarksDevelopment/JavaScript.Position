# Position (A JavaScript package)

A small package to help position a floating element. This can be positioned relative to another elements' current screen position, or to a mouse event.

### Links

-   [Options](#options)
-   [Change log](./CHANGELOG.md)
-   [License (MIT)](./LICENSE)

## Usage

If you want to position an element to another fixed element then you can use the sample below

```TS
return position(
    {
        anchor: document.getElementById("Anchor"),
        target: document.getElementById("Target"),
        my: "top center",
        at: "bottom center",
    }
);
```

If you'd rather position the element to the mouse's movement then you can use the sample below

> ⚠ It is recommended to debounce the below sample, just to prevent performance issues

```TS
document.addEventListener("mousemove", function(mouse){
    const target = document.getElementById("Target"),
        pos = position(
            {
                anchor: mouse,
                target: target,
                my: "top center",
                at: "bottom center",
            }
        );

    target.style.top = pos.top;
    target.style.left = pos.left;
});
```

## Options

### my: [`Alignment`][alignment]

The location on the `target` to position from

### at: [`Alignment`][alignment]

The location on the `anchor` to position against

### anchor: `HTMLElement` OR `MouseEvent`

The element or mouse event to anchor our target to

### target: `HTMLElement`

The target that we're going to be positioning

### collision?: [`CollisionHandler`][cH]

How to handle collisions with the window edge  
**Default:** `bestFit`

### bestFitPreference?: `horizontal` OR `vertical`

This is the preferred "best" direction when `collision = bestFit` and there is a "best fit" horizontally and vertically  
**Default:** `horizontal`

### defaults?: `{ my: `[`alignment`][alignment]`, at: `[`alignment`][alignment]` }`

The fallback values when only one property is supplied, or the property supplied is invalid  
**Default:** `{ my: "top center", at: "bottom center" }`

## Types

### The `Alignment` type

The `Alignment` will allow any of the below, plus a combination in the form `vertical horizontal` (e.g. `top center`, `bottom right` or `center left`)

-   `top`
-   `bottom`
-   `center`
-   `left`
-   `right`

Using a single value will default the other to `center` so `left` == `center left`

### The `CollisionHandler` type

-   `bestFit`
    -   This will find the closest fit before trying to flip the element
-   `flipFit`
    -   This will flip the element completely vertically and horizontally
-   `ignore`
    -   This will just ignore any collisions and place the element exactly where you wanted it

[alignment]: #the-alignment-type
[cH]: #the-collisionhandler-type
