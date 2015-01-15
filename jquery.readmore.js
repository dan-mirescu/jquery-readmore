// Readmore plugin 0.3
// by Dan Mirescu
// requires jquery.dotdotdot plugin

// changes:
// version 0.2: fix: recalculated fullHeight after css overflow property is applied
// version 0.3: Implemented css classes "j-rm-visible" and "j-rm-hidden" for 'shown' and 'hidden' states of the 'read-more' link

jQuery.fn.readmore = function (config) {
    // Check input parameters
    if (typeof (config) == 'undefined') { console.log("jquery.readmore : no parameters given"); return; }
    if (typeof (config.height) == 'undefined') { console.log("jquery.readmore: required parameter 'height' not found"); return; }
    if (typeof (config.link) == 'undefined') { console.log("jquery.readmore: required parameter 'link' not found"); return; }

    // Save a reference to the HTML element on which readmore is applied (the 'div')
    // Please note that this can also be an actual HTML tag other than <div>
    this.div = $(this[0]);
    // Save the height to which to trim the content (the 'height')
    this.height = config.height;
    // Save a reference to the HTML element which triggers the expanding when clicked (the 'link')
    // Please note that this can be any HTML tag. This should be outside the 'div' element.
    this.link = $(config.link);

    // Save the message that is written in the 'link' when the 'div' is in collapsed state (defaults to "Read more")
    this.readMoreMsg = typeof (config.readMoreMsg) != 'undefined' ? config.readMoreMsg : 'Read more';
    // Save the message that is written in the 'link' when the 'div' is in expanded state (defaults to "Read less")
    this.readLessMsg = typeof (config.readLessMsg) != 'undefined' ? config.readLessMsg : 'Read less';

    // Save the tolerance height for which a "Read more" link is not shown
    //  if the difference between the 'full' height and 'small' height is no bigger than this
    this.toleranceHeight = typeof (config.toleranceHeight) != 'undefined' ? config.toleranceHeight : 10;

    // Save the flag which indicates the usage of dotdotdot for generating the collapsed state of the 'div'
    // Dotdotdot smartly handles trimming by wrapping HTML elements, adding an ellipsis to the end, etc.
    //
    // If dotdotdot is not used, the trimming is done simply by setting the CSS 'overflow: hidden' property on the 'div'
    //
    // - You should use this if you are collapsing a block of arbitrary text (e.g. an article).
    // - You shouldn't use this if you are collapsing a block of elements of fixed size
    //  with the intention of keeping a certain number of those elements visible (e.g. a list/menu).
    this.useDotDotDot = typeof (config.useDotDotDot) != 'undefined' ? true : config.useDotDotDot;

    // Save custom additional parameters for dotdotdot. These will be taken into consideration only if
    // useDotDotDot is set tot true. You can, for example, specify a custom ellipsis, define a callback, etc.
    if (this.useDotDotDot) {
        this.paramsDotDotDot = typeof (config.paramsDotDotDot) != 'undefined' ? config.paramsDotDotDot : {};
    }

    // Initialize member for storing the actual full height of the 'div'
    this.fullHeight = null;
    // Initialize member for storing the status
    //   small - collapsed state of the 'div'
    //   big - expanded state of the 'div'
    //   inactive - if 'div's actual height is not big enough to require trimming
    this.status = 'small';

    // Initialize member for storing the trimmed version of the 'div'
    // This HTML element has the same tag type, HTML content and CSS classes as the main 'div'
    //   but it has dotdotdot applied on it, if this option is activated
    this.trimmedDiv = null;

    // Only if use DotDotDot is enabled:
    // Store the difference in height between the original height of the 'div' and the div with css overflow applied
    // CSS overflow establishes a "new block formatting context"
    // http://stackoverflow.com/questions/9943503/why-does-css2-1-define-overflow-values-other-than-visible-to-establish-a-new-b/11854515#11854515
    // which can alter layout and height of the 'div'
    // But dotdotdot doesn't make use of overflow. The 'trimmedDiv' and small 'div' (collapsed 'div') may be trimmed differently.
    // This highly depends on the content of the 'div'. So for the best results the user can specify this gap based on his observations.

    // Please note that readmore still works without this parameter, but the animation wouldn't be that smooth when collapsing or expanding near the collapsed state.
    this.overflowHeightGap = 0;
    if(typeof(config.overflowHeightGap) != 'undefined') {
        var o = config.overflowHeightGap * 1;
        if(o != NaN) this.overflowHeightGap = o;
    }

    this.autorun = function () {
        // Calculate the full height of the 'div'
        //    and determine if there is a significant difference from the trimming height.
        // If the difference is in the toleranceHeight range, then trimming will not be applied,
        //   effectively rendering the plugin inactive.
        this.fullHeight = this.div.height();
        if (this.fullHeight - this.height <= this.toleranceHeight) {
            this.status = 'inactive';
            //this.link.hide();
            this.link.removeClass("j-rm-visible");
            this.link.addClass("j-rm-hidden");
            return;
        }
        else {
            //this.link.show();
            this.link.removeClass("j-rm-hidden");
            this.link.addClass("j-rm-visible");
        }

        // Apply css property to the 'div' to ensure that trimmed out content is not shown
        this.div.css({ overflow: 'hidden' });
        this.fullHeight = this.div.height();

        if (this.useDotDotDot) {
            // Create the 'trimmedDiv'. Make it hidden initially. Also take the CSS class of the big div.
            // Also take the contents of the big div.
            this.trimmedDiv = $('<' + this.div.prop("tagName") + '>');
            this.trimmedDiv.css({ display: 'none' });
            this.trimmedDiv.attr('class', this.div.attr('class'));
            this.trimmedDiv.html(this.div.html()).insertBefore(this.div);
            // The collapsed div needs to be shown for dotdotdot to properly trim it
            this.trimmedDiv.show();

            //this.overflowHeightGap = this.div.height() - this.fullHeight;

            // By default the user only sees the 'trimmedDiv'
            this.div.hide();

            // Apply the dotdotdot plugin on the 'trimmedDiv'.
            // Dotdotdot contains logic for properly wrapping text and HTML elements

            // Initialize default paramaters for dotdotdot 
            var dddParams = { wrap: 'letter', height: this.height - this.overflowHeightGap };
            // Add custom dotdotdot parameters specified by the user
            $.extend(dddParams, this.paramsDotDotDot);
            // Apply dotdotdot plugin
            $(this.trimmedDiv).dotdotdot(dddParams);
        }
        else {
            // If use of dotdotdot is not enabled, the 'div' will be simply trimmed to the specified height
            this.div.height(this.height);
        }

        // Attach click-event listeners to the 'link'
        var self = this;
        this.link.click(function () {
            switch (self.status) {
                case 'small':
                    if (self.useDotDotDot) {
                        // Hide the 'trimmedDiv' and make full 'div' appear temporarily appear as trimmed
                        self.div.height(self.height);
                        self.trimmedDiv.hide();
                        self.div.show();
                    }

                    // TODO: set classes jquery-read-more-expanded and jquery-read-more-collapsed to the div
                    // TODO: add optional parameters for the user to alter the animation style

                    // Expand the 'div' to the full size through an animation
                    //   and change the message inside the 'link'
                    self.div.animate({ height: self.fullHeight }, 600, 'swing', function () {
                        self.status = 'big';
                        self.link.html(self.readLessMsg);
                        self.link.removeClass('jquery-read-more');
                        self.link.addClass('jquery-read-less');
                    });
                    return false;
                case 'big':
                    // Collapse the 'div' to the trimmed size through an animation
                    //   and change the message inside the 'link'
                    self.div.animate({ height: self.height }, 600, 'swing', function () {
                        // If dotdotdot use is enabled, hide the 'div' and show the dotdotdot-trimmed version
                        if (self.useDotDotDot) {
                            self.div.hide();
                            self.trimmedDiv.show();
                        }

                        // Change the message inside the link
                        self.status = 'small';
                        self.link.html(self.readMoreMsg);
                        self.link.removeClass('jquery-read-less');
                        self.link.addClass('jquery-read-more');
                    });
                    return false;
            }
        });
    };

    this.autorun();

}