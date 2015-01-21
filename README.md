# jquery-readmore
A "read more" implementation on top of jQuery with verbose comments. Supports animation on expanding and the optional use of jquery-dotdotdot for smart text trimming.

NOTE: This readme files as well as the repository will be updated shortly. All script parameters will be documented and more use cases and examples will follow.

First you should know...
------
This script expects the toggling link to already exist in the DOM. The link can be any tag type. The text inside the link will change according to the current state (expanded or collapsed). The link is identified by a selector.

The "read more" link may be hidden if it is not necessary. However, jquery-readmore does not forcefully hide the link (with display: none). It leaves you the possibility to handle the "hiding".. or "showing" :) by implementing these CSS classes:

```css
.j-rm-visible { } /* handles the "shown" state */
.j-rm-hidden { } /* handles the "hidden" state */
```

Also, the link will be set a CSS class depending on the "expanded" or "collapsed" state of the element the script is applied on:

```css
.jquery-read-more { } /* when the link contains "Read more" message and element is collapsed */
.jquery-read-less { } /* when the link contains "Read less" message and element is expanded */
```


Basic usage
------
After including jquery.readmore.js in your page..

```html
<div id="long_text">
  Div with awfully long text [...]
</div>
<span id="link">Read more</span>
```

```js
$("#long_text").readmore({
	link : "#link",
	height: 200
});
```

Parameters
--------
Note: Below, "element" refers to the HTML DOM element onto which jquery-readmore is applied.

**height** : required (number). This is the height to which the element is collapsed

**toleranceHeight** : optional (number), defaults to "10". If the difference between the initial element height and the collapsed height is smaller than this parameter, the "Read more" link is hidden (be sure to implement ".j-rm-hidden"). This is useful for fine tuning in some cases involving CSS margins and paddings on the element.

**link** : required (string). The selector of the HTML DOM element which is the link which will trigger the expand / collapse of the element.

**readMoreMsg** : optional (string), defaults to "Read more". The text that is displayed inside the link when the element is collapsed.

**readLessMsg** : optional (string), defaults to "Read less". The text that is displayed inside the link when the element is expanded.

**useDotDotDot** : optional (boolean), defaults to "false". Whether to use the third-party script jquery.dotdotdot to handle text trimming.

**paramsDotDotDot** : optional (object), defaults to "{}". An object containing parameters that will be sent to jquery.dotdotdot (in case it is enabled).

**overflowHeightGap** : optional (number), defaults to 0 : When "useDotDotDot" is activated, there may be a height difference between the trimmed state of dotdotdot and the default jquery-readmore trimmed state (see source for more details). This parameter can be used to fine tune this difference. This is usually not required.
