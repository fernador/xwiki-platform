// Make sure the XWiki 'namespace' exists.
if(typeof(XWiki) == 'undefined') {
  XWiki = new Object();
}

// Make sure the widgets 'namespace' exists.
if(typeof(XWiki.widgets) == 'undefined') {
  XWiki.widgets = new Object();
}

/**
 * A general purpose notification class, displaying a simple message for the user, at the bottom of the screen.
 * Features:
 * <ul>
 * <li>Several default aspects: <tt>plain</tt>, <tt>info</tt>, <tt>warning</tt>, <tt>error</tt>, <tt>inprogress</tt>,
 *  <tt>done</tt>.</li>
 * <li>Stacking of multiple notifications on the screen.</li>
 * <li>Possibility to replace a notification with another one, preserving the position.</li>
 * <li>Automatic hide after a configurable period of time.</li>
 * <li>Configurable icon, background and text color.</li>
 * </ul>
 * To display a notification, it suffices to create a new XWiki.widgets.Notification object. Constructor parameters:
 * <dl>
 *   <dt>text</dt>
 *   <dd>The notification text</dd>
 *   <dt>type (optional)</dt>
 *   <dd>The notification type, one of <tt>plain</tt>, <tt>info</tt>, <tt>warning</tt>, <tt>error</tt>, <tt>inprogress</tt>,
 *    <tt>done</tt>. If an unknown or no type is passed, <tt>plain</tt> is used by default.</dd>
 *   <dt>options (optional)</dt>
 *   <dd>Additional configuration; supported options:
 *   <ul>
 *     <li><tt>timeout</tt>: number of seconds to keep the notification on the screen. Use 0 or false to keep it until manually removed.</li>
 *     <li><tt>inactive</tt>: don't show the notification when the object is created, manually call {@link #show} later</li>
 *     <li><tt>icon</tt>: a custom image to use</li>
 *     <li><tt>color</tt>: a custom color for the text</li>
 *     <li><tt>backgroundColor</tt>: a custom color for the background</li>
 *   </ul>
 *   </dd>
 * </dl>
 * Default parameters for the predefined notification types:
 * <dl>
 *   <dt>plain</dt>
 *   <dd>timeout: 5</dd>
 *   <dd>icon: none</dd>
 *   <dd>color: black</dd>
 *   <dd>background: #EEE</dd>
 *   <dt>info</dt>
 *   <dd>timeout: 5</dd>
 *   <dd>icon: (i)</dd>
 *   <dd>color: #28C</dd>
 *   <dd>background: #DDF</dd>
 *   <dt>warning</dt>
 *   <dd>timeout: 5</dd>
 *   <dd>icon: /!\</dd>
 *   <dd>color: 000</dd>
 *   <dd>background: #FFD</dd>
 *   <dt>error</dt>
 *   <dd>timeout: 10</dd>
 *   <dd>icon: (!)</dd>
 *   <dd>color: #900</dd>
 *   <dd>background: #EDD</dd>
 *   <dt>inprogress</dt>
 *   <dd>timeout: false</dd>
 *   <dd>icon: spinning</dd>
 *   <dd>color: #268</dd>
 *   <dd>background: #EEE</dd>
 *   <dt>done</dt>
 *   <dd>timeout: 2</dd>
 *   <dd>icon: (v)</dd>
 *   <dd>color: #090</dd>
 *   <dd>background: #EFD</dd>
 * </dl>
 */
XWiki.widgets.Notification = Class.create({
  text : "Hello world!",
  defaultOptions : {
    /** supported types: plain, info, warning, error, inprogress, done */
    "plain"      : {timeout : 5},
    "info"       : {timeout : 5},
    "warning"    : {timeout : 5},
    "error"      : {timeout : 10},
    "inprogress" : {timeout : false},
    "done"       : {timeout : 2}
  },
  initialize : function(text, type, options) {
    this.text = text || this.text;
    this.type = (typeof this.defaultOptions[type] != "undefined") ? type : "plain";
    this.options = Object.extend(Object.clone(this.defaultOptions[this.type]), options || { });
    this.createElement();
    if (!this.options.inactive) {
      this.show();
    }
  },
  /** Creates the HTML structure for the notification. */
  createElement : function() {
    if (!this.element) {
      this.element = new Element("div", {"class" : "xnotification xnotification-" + this.type}).update(this.text);
      if (this.options.icon) {
        this.element.setStyle({backgroundImage : this.options.icon, paddingLeft : "22px"});
      }
      if (this.options.backgroundColor) {
        this.element.setStyle({backgroundColor : this.options.backgroundColor});
      }
      if (this.options.color) {
        this.element.setStyle({color : this.options.color});
      }
      this.element = this.element.wrap(new Element("div", {"class" : "xnotification-wrapper"}));
      Event.observe(this.element, "click", this.hide.bindAsEventListener(this));
    }
  },
  /** Display the notification and schedule an automatic hide after the configured period of time, if any. */
  show : function() {
    if (!this.element.descendantOf(XWiki.widgets.Notification.container)) {
      XWiki.widgets.Notification.container.insert({top: this.element});
    }
    this.element.show();
    if (this.options.timeout) {
      this.timer = window.setTimeout(this.hide.bind(this), this.options.timeout * 1000);
    }
  },
  /** Hide the notification. */
  hide : function() {
    this.element.hide();
    if (this.element.parentNode) {
      this.element.remove();
    }
    if (this.timer) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
  },
  /** Silently replace this notification with another one, keeping the same place. */
  replace : function(notification) {
    if (this.element.parentNode) {
      this.element.replace(notification.element);
    }
    if (this.timer) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
    notification.show();
  }
});

/** The container for all the notifications. */
XWiki.widgets.Notification.container = new Element('div', {"class" : "xnotification-container"});

// On startup, insert the container in the document body, and register a scroll listener to reposition the notifications
// at the bottom of the screen in IE.
document.observe("xwiki:dom:loaded", function() {
  document.body.insert(XWiki.widgets.Notification.container);
  if (Prototype.Browser.IE) {
    XWiki.widgets.Notification.container.setStyle({position : 'absolute', 'bottom': '0px'});
    Event.observe(window, "scroll", function() {
      var span = new Element("div");
      XWiki.widgets.Notification.container.insert({top: span});
      setTimeout(span.remove.bind(span), 1);
    });
  }
});