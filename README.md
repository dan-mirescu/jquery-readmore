# jquery-readmore
A "read more" implementation on top of jQuery with verbose comments. Supports animation on expanding and the optional use of jquery-dotdotdot for smart text trimming.

NOTE: This readme files as well as the repository will be updated shortly. All script parameters will be documented and more use cases and examples will follow.

First you should know...
------
This script expects the toggling link to already exist in the DOM. The link can be any tag type. The text inside the link will change according to the current state (expanded or collapsed). The link is identified by a selector.


Usage
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
