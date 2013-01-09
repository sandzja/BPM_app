/**
 *  {@link Ext.ux.slidenavigation.View} is a subclass of {@link Ext.Container}
 *  that provides a sliding main view with an underlying navigation list.  The
 *  concept was inspired by Facebook's mobile app.
 *
 *  @version 0.2.0
 *  @author Weston Nielson <wnielson@github>
 */
Ext.define('Ext.ux.slidenavigation.View', {
    extend: 'Ext.Container',
    
    requires: [
        'Ext.Button',
        'Ext.Container',
        'Ext.Function',
        'Ext.Toolbar',
        'Ext.data.Model',
        'Ext.data.ModelManager',
        'Ext.data.Store',
        'Ext.dataview.List'
    ],
    
    xtype: 'slidenavigationview',

    /**
     * @event close
     * @preventable moveContainer
     * Fires whenever the container is closed
     * @param {Ext.ux.slidenavigation.View} this The navigation View instance
     * @param {Number} position The x-coordinate to which the container will be moved to
     * @param {Number} duration The duration of the slide event
     */

    /**
     * @event open
     * @preventable moveContainer
     * Fires whenever the container is opened
     * @param {Ext.ux.slidenavigation.View} this The navigation View instance
     * @param {Number} position The x-coordinate to which the container will be moved to
     * @param {Number} duration The duration of the slide event
     */

    /**
     * @event select
     * @preventable setContainerItem
     * Fires whenever an item in the menu is selected
     * @param {Ext.ux.slidenavigation.View} this The navigation View instance
     * @param {Ext.Component} item The selected item
     * @param {Integer} index The index of the selected item
     */

    /**
     * @event slideend
     * Fires whenever the user has finished sliding the container.  This is fired once the
     * animation is complete.
     * @param {Ext.ux.slidenavigation.View} this The navigation View instance
     */

    /**
     * @event slidestart
     * Fires whenever the user has started sliding the container.  This is fired once the
     * animation is complete.
     * @param {Ext.ux.slidenavigation.View} this The navigation View instance
     */

    /**
     * @event opened
     * Fires after the container is fully opened.
     * @param {Ext.ux.slidenavigation.View} this The navigation View instance
     */

    /**
     * @event closed
     * Fires after the container is fully closed.
     * @param {Ext.ux.slidenavigation.View} this The navigation View instance
     */
    
    config: {
        /**
         * @cfg {Object} list Configuration for the navigation list
         */
        list: {
            width: 250,
            maxDrag: null,
            itemTpl: '{title}',
            grouped: true,
            items: [{
                xtype: 'toolbar',
                docked: 'top',
                ui: 'light'
            }]
        },
        
        /**
         * @cfg {Object} container Configuration for the container
         */
        container: {},

        /**
         * @cfg {Object/Boolean} itemMask Configuration for the mask used to mask
         * items when the container is opened.  Set to false to disable masking of
         * items.
         */
        itemMask: false,

        /**
         * @cfg {Array} items An array of items to put into the navigation list.
         * The items can either be Ext components or special objects with a "handler"
         * key, which should be a function to execute when selected.  Additionally, you
         * can define the order of the items by defining an 'order' parameter.
         */        
        items: [],
        
        /**
         * @cfg {Object} groups Mapping of group name to order.  For example,
         * say you have defined two groups; "Group 1" and "Group 2".  By default
         * these will be presented in the list in that order, since
         * 'Group 1' > 'Group 2'.  This option allows you to change the ordering,
         * like so:
         *
         *  groups: {
         *    'Group 1': 2
         *    'Group 2': 1
         *  }
         *
         *  You should use integers, starting with 1, as the ordering value.
         *  By default groups are ordered by their name.
         */
        groups: {},
        
        /**
         * @cfg {Object} defaults An object of default values to apply to any Ext
         * components created from those listed in ``items``.
         */
        defaults: {
            layout: 'card'
        },
        
        /**
         * @cfg {String} slideSelector Class selector of object (or parent)
         * of which dragging should be allowed.  Defaults to the entire container.
         * For example, this could be set to something like 'x-toolbar' to restrict
         * dragging only to a toolbar.
         */
        slideSelector: '',
        
        /**
         * @cfg {Integer} slideDuration Number of miliseconds to animate the sliding
         * of the container when "flicked".  By default the animation is disable on
         * Android.
         */
        slideDuration: Ext.os.is('Android') ? 0 : 200,
        
        /**
         * @cfg {Integer} selectSlideDuration Number of miliseconds to animate the sliding
         * of the container when list item is selected (if closeOnSelect = true). The default
         * value here of 300 gives a much nicer feel.  By default the animation is disable on
         * Android.
         */
        selectSlideDuration: Ext.os.is('Android') ? 0 : 300,
        
        /**
         * @cfg {Boolean} closeOnSelect Whether or not to automatically close the container
         * when an item in the list is selected.  Default is true.
         */
        closeOnSelect: true,

        /**
         * @cfg {String} shadowStyle CSS to use for styling the shadow when the container is
         * open.  This should be a valid CSS 'box-shadow' argument.  Set to false to disable
         * it.
         */
        shadowStyle: '0 0 4px 1px #999',


        slideButtonDefaults: {}
    },
        
    initConfig: function() {
        var me = this;
        
        me._indexCount = 0;
        
        // Create the store.
        me.store = Ext.create('Ext.data.Store', {
            model: me.getModel(),
            sorters: 'order',
            grouper: {
                property: 'group',
                sortProperty: 'groupOrder'
            }
        });
        
        // Add the items into the list.
        me.addItems(me.config.items || []);
        delete me.config.items;
        
        me.callParent(arguments);
        
        /**
         *  @private
         *
         *  This stores the instances of the components created.
         *  TODO: Support 'autoDestroy'.  
         */
        me._cache = {};
        

        // Default config values used for creating a slideButton.
        me._slideButtonConfig = {
            xtype: 'button',
            iconMask: true,
            iconCls: 'more',
            name: 'slidebutton',
            listeners: {
                release: me.toggleContainer,
                tap: function(button, e) {
                    // Need this to stop auto-selecting any component
                    // hidden beneath the container.
                    e.preventDefault();
                },
                scope: me
            }

            /**
             *  To add the button into a toolbar, you can add the following
             *  to any item in your navigation list.
             */
            //selector: ['toolbar']
        };

        /**
         *  Default config for masked items.
         */
        me.itemMaskDefaults = {
            xtype: 'mask',
            transparent: true
        };
    },
            
    initialize: function() {
        this.__init = false;

        this.callParent();
        
        this.addCls('x-slidenavigation');
        
        this.list = this.createNavigationList();
        this.container = this.createContainer();
        
        this.add([
            this.list,
            this.container
        ]);

        this.createContainerCSS();
        
        // TODO: Make this optional, perhaps by defining
        // "selected: true" in the items list
        this.list.select(0);

        this.__init = true;
    },
    
    /**
     *  @private
     *
     *  Adds an array of items (or a single item) into the list.
     */
    addItems: function(items) {
        var me = this,
            items = Ext.isArray(items) ? items : [items],
            groups = me.config.groups;
        
        Ext.each(items, function(item, index) {
            if (!Ext.isDefined(item.index)) {
                item.index = me._indexCount;
                me._indexCount++;
            }
            me.store.add(item);
        });
    },

    /**
     *  @private
     *
     *  Construct style element for container shadow and insert into the DOM.
     */
    createContainerCSS: function() {
        var shadowStyle = this.getShadowStyle(),
            id          = this.getId();

        if (shadowStyle) {
            if (!document.getElementById(id)) {
                style           = document.createElement('style');
                style.type      = 'text/css';
                style.id        = id;
                style.innerHTML = '.x-slidenavigation-container.x-dragging, '+
                                  '.x-slidenavigation-container.open { '+
                                  'box-shadow: '+shadowStyle+';'+
                                  '-webkit-box-shadow:'+shadowStyle+';';
                document.getElementsByTagName('head')[0].appendChild(style);
            }
        }
    },
    
    /**
     *  @private
     *
     *  Creates a button that can toggle the navigation menu.  For an example
     *  config, see ``slideButtonDefaults``.
     */
    createSlideButton: function(el, config) {
        var me      = this,
            config  = Ext.merge(me.getSlideButtonDefaults(),
                                Ext.isObject(config) ? config : {}),
            parent  = el.down(config.selector);
        
        if (parent) {
            return parent.add(Ext.merge(me._slideButtonConfig, config));
        }
        
        return false;
    },

    /**
     *  @private
     *
     *  Gets the configuration for masking items.  If masking items is disabled
     *  this returns false.
     */
    getMask: function() {
        var mask = this.getItemMask();
        if (mask != false) {
            if (Ext.isBoolean(mask)) {
                mask = this.itemMaskDefaults;
            }
        }
        return mask;
    },

    /**
     *  @private
     *
     *  If item masking is enabled, this method will mask any containers that have
     *  a ``maskOnOpen`` configuration variable set to ``true``.  If masking is
     *  disabled, this method does nothing.
     */
    doMaskItem: function(item, mask) {
        var maskConfig  = this.getMask(),
            mask        = Ext.isDefined(mask) ? mask : true;

        Ext.each(item.query('component[maskOnOpen=true]'), function(el) {
            if (mask) {
                el.setMasked(maskConfig);
            } else {
                el.setMasked(false);
            }
        });
    },
    
    /**
     *  @private
     *
     *  Called when an item in the list is tapped.
     */
    onSelect: function(list, item, eOpts) {
        var me = this,
            store = list.getStore(),
            index = item.raw.index,
            container = me.container,
            func      = Ext.emptyFn;
        
        if (me._cache[index] == undefined) {            
            // If the object has a handler defined, then we don't need to
            // create an Ext object
            if (Ext.isFunction(item.raw.handler)) {
                me._cache[index] = item.raw.handler;
            } else {
                me._cache[index] = container.add(Ext.merge({}, me.config.defaults, item.raw));

                me.doMaskItem(me._cache[index], true);

                // Wait until the component is painted before closing the container.  This makes
                // the initial animation much smoother.
                if (me.config.closeOnSelect) {
                    me._cache[index].addListener('painted', function() {
                        // The slight delay here gives the component enough time to update before
                        // the close animation starts.
                        Ext.defer(me.closeContainer, 200, me, [me.config.selectSlideDuration]);
                    });
                }
                

                // Add a button for controlling the slide, if desired
                if ((item.raw.slideButton || false)) {
                    me.createSlideButton(me._cache[index], item.raw.slideButton);
                }
            }
        }        

        if (Ext.isFunction(me._cache[index])) {
            func = me._cache[index];
        } else {
            func = me.setContainerItem;
        }

        if (me.__init) {
            me.fireAction('select', [me , me._cache[index], index], func, me);
        }
    },

    /**
     *  @private
     *
     *  Set the active item in the container.
     */
    setContainerItem: function(nav, item) {
        var container = nav.container;
        container.setActiveItem(item);
    },
    
    /**
     *  @private
     *
     *  Callback function for when the container has started being dragged.
     */
    onContainerDragstart: function(draggable, e, offset, eOpts) {
        if (this.config.slideSelector == false) {
            return false;
        }
        
        if (this.config.slideSelector) {
            node = e.target;
            while (node = node.parentNode) {
                if (node.className && node.className.indexOf(this.config.slideSelector) > -1) {
                    this.fireEvent('dragstart', this);
                    return true;
                }
            }
            return false;
        }
        return false;
    },
    
    /**
     *  @private
     *
     *  Callback function for when the container has finished being dragged.  This determines
     *  which direction to finish moving the container based on its current position and velocity.
     */
    onContainerDragend: function(draggable, e, eOpts) {
        var velocity  = Math.abs(e.deltaX / e.deltaTime),
            direction = (e.deltaX > 0) ? "right" : "left",
            offset    = Ext.clone(draggable.offset),
            threshold = parseInt(this.config.list.minWidth * .70);
        
        switch (direction) {
            case "right":
                offset.x = (velocity > 0.75 || offset.x > threshold) ? this.config.list.minWidth : 0;
                break;
            case "left":
                offset.x = (velocity > 0.75 || offset.x < threshold) ? 0 : this.config.list.minWidth;
                break;
        }

        this.fireEvent('dragend', this);
        
        this.moveContainer(this, offset.x);
    },
    
    /**
     *  @private
     *
     *  Registers the model with Ext.ModelManager, if it hasn't been
     *  already, and returns the name of the model for use in the store.
     */
    getModel: function() {
        var model = 'SlideNavigationPanelItem',
            groups = this.config.groups;
        
        if (!Ext.ModelManager.get(model)) {
            Ext.define(model, {
                extend: 'Ext.data.Model',
                config: {
                    idProperty: 'index',
                    fields: [
                        'index', 'title', 'group',
                        {
                            name: 'order',
                            defaultValue: 1
                        },{
                            name: 'groupOrder',
                            convert: function(value, record) {
                                // By default we group and order by group name.
                                group = record.get('group');
                                return groups[group] || group;
                            }
                        }
                    ]
                }
            });
        }
        
        return model;
    },
    
    /**
     *  Closes the container.  See {@link #moveContainer} for more details.
     */
    closeContainer: function(duration) {
        var me       = this,
            duration = duration || this.config.slideDuration;
        
        if (me.__init) {
            me.fireAction('close', [me, 0, duration], 'moveContainer', me);
        }
    },
    
    /**
     *  Opens the container.  See {@link #moveContainer} for more details.
     */
    openContainer: function(duration) {
        var me       = this,
            duration = duration || this.config.slideDuration,
            offsetX  = this.config.list.minWidth;

        if (me.__init) {
            me.fireAction('open', [me, offsetX, duration], 'moveContainer', me);
        }
    },
    
    /**
     *  Toggles the container open or close.
     */
    toggleContainer: function(duration) {
        var duration = Ext.isNumber(duration) ? duration : this.config.slideDuration;
        if (this.isClosed()) {
            this.openContainer(duration);
        } else {
            this.closeContainer(duration);
        }
    },
    
    /**
     *  @private
     *
     *  Moves the container to a specified ``offsetX`` pixels.  Positive
     *  integer values move the container that many pixels from the left edge
     *  of the window.  If ``duration`` is provided, it should be an integer
     *  number of milliseconds to animate the slide effect.  If no duration is
     *  provided, the default in ``config.slideDuration`` is used.
     */
    moveContainer: function(nav, offsetX, duration) {
        var duration  = duration || this.config.slideDuration,
            draggable = this.container.draggableBehavior.draggable;
        
        this.container.addCls('open');

        draggable.setOffset(offsetX, 0, {
            duration: duration
        });
    },
    
    /**
     *  Returns true if the container is closed, false otherwise.  This is a
     *  computed value based off the current offset position of the container.
     *
     *  @return {Boolean} Whether or not the container is fully closed.
     */
    isClosed: function() {
        return (this.container.draggableBehavior.draggable.offset.x == 0);
    },


    /**
     *  Returns true if the container is closed, false otherwise.  This is a
     *  computed value based off the current offset position of the container.
     *
     *  @return {Boolean} Whether or not the container is fully open.
     */
    isOpened: function() {
        return (this.container.draggableBehavior.draggable.offset.x == this.config.list.minWidth);
    },
    
    /**
     *  @private
     *
     *  Sets the container as being closed.  This shouldn't ever be called
     *  directly as it is automatically called by the ``translatable``
     *  "animationend" event after the container has stopped moving.  All this
     *  really does is set the CSS class for the container.
     */
    setClosed: function(closed) {         
        if (closed) {
            this.container.removeCls('open');
        } else {
            this.container.addCls('open');
        }
    },
    
    /**
     *  @private
     *
     *  Generates a new Ext.dataview.List object to be used for displaying
     *  the navigation items.
     */
    createNavigationList: function(store) {
        var listConfig = this.getList();

        // The width of the list needs to be set to 100%, so we copy
        // the width value (if set) to minWidth and then delete it.
        if (listConfig.width) {
            if (!listConfig.minWidth) {
                listConfig.minWidth = listConfig.width;
            }
            delete listConfig.width;
        }

        return Ext.create('Ext.dataview.List', Ext.merge({}, listConfig, {
            store: this.store,
            docked: 'left',
            cls: 'x-slidenavigation-list',
            style: 'position: absolute; top: 0; left: 0; height: 100%;' +
                   'z-index: 2',
            width: '100%',
            listeners: {
                select: this.onSelect,
                scope: this
            }
        }));
    },
    
    /**
     *  @private
     *
     *  Generates and returns the Ext.Container to be used for displaying
     *  content.  This is the "slideable" container that is positioned above
     *  the navigation list.
     */
    createContainer: function() {
        var me = this;

        return Ext.create('Ext.Container', Ext.merge({}, me.config.container, {
            docked: 'left',
            cls: 'x-slidenavigation-container',
            style: 'width: 100%; height: 100%; position: absolute; opacity: 1; z-index: 5',
            layout: 'card',
            draggable: {
                direction: 'horizontal',
                constraint: {
                    min: { x: 0, y: 0 },
                    max: { x: me.config.list.maxDrag || Math.max(screen.width, screen.height), y: 0 }
                },
                listeners: {
                    dragstart: {
                        fn:    me.onContainerDragstart,
                        order: 'before',
                        scope: me
                    },
                    dragend: me.onContainerDragend,
                    scope:   me
                },
                translatable: {
                    listeners: {
                        animationstart: function() {
                            me.fireEvent('slidestart', me);
                        },
                        animationend: function(translatable, b, c) {
                            // Fire the event now that the animation is done.
                            if (me.__init) {
                                me.fireEvent('slideend', me);
                            }

                            if (me.isOpened()) {
                                me.fireEvent('opened', me);

                                me.doMaskItem(me.container.getActiveItem(), true);
                            }

                            else if (me.isClosed()) {
                                me.fireEvent('closed', me);

                                me.doMaskItem(me.container.getActiveItem(), false);
                            }

                            // Remove the class when the animation is finished, but only
                            // if we're "closed"
                            me.setClosed(me.isClosed());
                        },
                        scope: me // The "x-slidenavigation" container
                    }
                }
            }
        }));
    },
    
    /**
     *  Override the default method so that we actually return the active item in the list,
     *  otherwise this will always return the same thing (the main container, not the
     *  selected item).
     *
     *  @return {Ext.Component/null} The currently active component.
     */
    getActiveItem: function() {
        var selection = this.list.getSelection();
        if (selection) {
            return selection[0];
        }
    }
});



Ext.define('Ext.navigation.View', {
    extend: 'Ext.Container',
    alternateClassName: 'Ext.NavigationView',
    xtype: 'navigationview',
    requires: ['Ext.navigation.Bar'],

    config: {
        /**
         * @cfg
         * @inheritdoc
         */
        baseCls: Ext.baseCSSPrefix + 'navigationview',

        /**
         * @cfg {Boolean/Object} navigationBar
         * The NavigationBar used in this navigation view. It defaults to be docked to the top.
         *
         * You can just pass in a normal object if you want to customize the NavigationBar. For example:
         *
         *     navigationBar: {
         *         ui: 'dark',
         *         docked: 'bottom'
         *     }
         *
         * You **cannot** specify a *title* property in this configuration. The title of the navigationBar is taken
         * from the configuration of this views children:
         *
         *     view.push({
         *         title: 'This views title which will be shown in the navigation bar',
         *         html: 'Some HTML'
         *     });
         *
         * @accessor
         */
        navigationBar: {
            docked: 'top'
        },

        /**
         * @cfg {String} defaultBackButtonText
         * The text to be displayed on the back button if:
         *
         * - The previous view does not have a title.
         * - The {@link #useTitleForBackButtonText} configuration is `true`.
         * @accessor
         */
        defaultBackButtonText: 'Back',

        /**
         * @cfg {Boolean} useTitleForBackButtonText
         * Set to `false` if you always want to display the {@link #defaultBackButtonText} as the text
         * on the back button. `true` if you want to use the previous views title.
         * @accessor
         */
        useTitleForBackButtonText: false,

        /**
         * @cfg {Array/Object} items The child items to add to this NavigationView. This is usually an array of Component
         * configurations or instances, for example:
         *
         *     Ext.create('Ext.Container', {
         *         items: [
         *             {
         *                 xtype: 'panel',
         *                 title: 'My title',
         *                 html: 'This is an item'
         *             }
         *         ]
         *     });
         *
         * If you want a title to be displayed in the {@link #navigationBar}, you must specify a `title` configuration in your
         * view, like above.
         *
         * __Note:__ Only one view will be visible at a time. If you want to change to another view, use the {@link #method-push} or
         * {@link #setActiveItem} methods.
         * @accessor
         */

        /**
         * @cfg
         * @hide
         */
        layout: {
            type: 'card',
            animation: {
                duration: 300,
                easing: 'ease-out',
                type: 'slide',
                direction: 'left'
            }
        }

        // See https://sencha.jira.com/browse/TOUCH-1568
        // If you do, add to #navigationBar config docs:
        //
        //     If you want to add a button on the right of the NavigationBar,
        //     use the {@link #rightButton} configuration.
    },

    /**
     * @event push
     * Fires when a view is pushed into this navigation view
     * @param {Ext.navigation.View} this The component instance
     * @param {Mixed} view The view that has been pushed
     */

    /**
     * @event pop
     * Fires when a view is popped from this navigation view
     * @param {Ext.navigation.View} this The component instance
     * @param {Mixed} view The view that has been popped
     */

    /**
     * @event back
     * Fires when the back button in the navigation view was tapped.
     * @param {Ext.navigation.View} this The component instance\
     */

    // @private
    initialize: function() {
        var me     = this,
            navBar = me.getNavigationBar();

        //add a listener onto the back button in the navigationbar
        navBar.on({
            back: me.onBackButtonTap,
            scope: me
        });

        me.relayEvents(navBar, 'rightbuttontap');

        me.relayEvents(me, {
            add: 'push',
            remove: 'pop'
        });

        //<debug>
        var layout = me.getLayout();
        if (layout && !layout.isCard) {
            Ext.Logger.error('The base layout for a NavigationView must always be a Card Layout');
        }
        //</debug>
    },

    /**
     * @private
     */
    applyLayout: function(config) {
        config = config || {};

        return config;
    },

    /**
     * @private
     * Called when the user taps on the back button
     */
    onBackButtonTap: function() {
        this.pop();
        this.fireEvent('back', this);
    },

    /**
     * Pushes a new view into this navigation view using the default animation that this view has.
     * @param {Object} view The view to push.
     * @return {Ext.Component} The new item you just pushed.
     */
    push: function(view) {
        return this.add(view);
    },

    /**
     * Removes the current active view from the stack and sets the previous view using the default animation
     * of this view. You can also pass a {@link Ext.ComponentQuery} selector to target what inner item to pop to.
     * @param {Number} count The number of views you want to pop.
     * @return {Ext.Component} The new active item.
     */
    pop: function(count) {
        if (this.beforePop(count)) {
            return this.doPop();
        }
    },

    /**
     * @private
     * Calculates whether it needs to remove any items from the stack when you are popping more than 1
     * item. If it does, it removes those views from the stack and returns `true`.
     * @return {Boolean} `true` if it has removed views.
     */
    beforePop: function(count) {
        var me = this,
            innerItems = me.getInnerItems();

        if (Ext.isString(count) || Ext.isObject(count)) {
            var last = innerItems.length - 1,
                i;

            for (i = last; i >= 0; i--) {
                if ((Ext.isString(count) && Ext.ComponentQuery.is(innerItems[i], count)) || (Ext.isObject(count) && count == innerItems[i])) {
                    count = last - i;
                    break;
                }
            }

            if (!Ext.isNumber(count)) {
                return false;
            }
        }

        var ln = innerItems.length,
            toRemove;

        //default to 1 pop
        if (!Ext.isNumber(count) || count < 1) {
            count = 1;
        }

        //check if we are trying to remove more items than we have
        count = Math.min(count, ln - 1);

        if (count) {
            //we need to reset the backButtonStack in the navigation bar
            me.getNavigationBar().beforePop(count);

            //get the items we need to remove from the view and remove theme
            toRemove = innerItems.splice(-count, count - 1);
            for (i = 0; i < toRemove.length; i++) {
                this.remove(toRemove[i]);
            }

            return true;
        }

        return false;
    },

    /**
     * @private
     */
    doPop: function() {
        var me = this,
            innerItems = this.getInnerItems();

        //set the new active item to be the new last item of the stack
        me.remove(innerItems[innerItems.length - 1]);
        return this.getActiveItem();
    },

    /**
     * Returns the previous item, if one exists.
     * @return {Mixed} The previous view
     */
    getPreviousItem: function() {
        var innerItems = this.getInnerItems();
        return innerItems[innerItems.length - 2];
    },

    /**
     * Updates the backbutton text accordingly in the {@link #navigationBar}
     * @private
     */
    updateUseTitleForBackButtonText: function(useTitleForBackButtonText) {
        var navigationBar = this.getNavigationBar();
        if (navigationBar) {
            navigationBar.setUseTitleForBackButtonText(useTitleForBackButtonText);
        }
    },

    /**
     * Updates the backbutton text accordingly in the {@link #navigationBar}
     * @private
     */
    updateDefaultBackButtonText: function(defaultBackButtonText) {
        var navigationBar = this.getNavigationBar();
        if (navigationBar) {
            navigationBar.setDefaultBackButtonText(defaultBackButtonText);
        }
    },

    // @private
    applyNavigationBar: function(config) {
        if (!config) {
            config = {
                hidden: true,
                docked: 'top'
            };
        }

        if (config.title) {
            delete config.title;
            //<debug>
            Ext.Logger.warn("Ext.navigation.View: The 'navigationBar' configuration does not accept a 'title' property. You " +
                            "set the title of the navigationBar by giving this navigation view's children a 'title' property.");
            //</debug>
        }

        config.view = this;
        config.useTitleForBackButtonText = this.getUseTitleForBackButtonText();

        return Ext.factory(config, Ext.navigation.Bar, this.getNavigationBar());
    },

    // @private
    updateNavigationBar: function(newNavigationBar, oldNavigationBar) {
        if (oldNavigationBar) {
            this.remove(oldNavigationBar, true);
        }

        if (newNavigationBar) {
            this.add(newNavigationBar);
        }
    },

    /**
     * @private
     */
    applyActiveItem: function(activeItem, currentActiveItem) {
        var me = this,
            innerItems = me.getInnerItems();

        // Make sure the items are already initialized
        me.getItems();

        // If we are not initialzed yet, we should set the active item to the last item in the stack
        if (!me.initialized) {
            activeItem = innerItems.length - 1;
        }

        return this.callParent([activeItem, currentActiveItem]);
    },

    doResetActiveItem: function(innerIndex) {
        var me = this,
            innerItems = me.getInnerItems(),
            animation = me.getLayout().getAnimation();

        if (innerIndex > 0) {
            if (animation && animation.isAnimation) {
                animation.setReverse(true);
            }
            me.setActiveItem(innerIndex - 1);
            me.getNavigationBar().onViewRemove(me, innerItems[innerIndex], innerIndex);
        }
    },

    /**
     * @private
     */
    doRemove: function() {
        var animation = this.getLayout().getAnimation();

        if (animation && animation.isAnimation) {
            animation.setReverse(false);
        }

        this.callParent(arguments);
    },

    /**
     * @private
     */
    onItemAdd: function(item, index) {
        this.doItemLayoutAdd(item, index);

        if (!this.isItemsInitializing && item.isInnerItem()) {
            this.setActiveItem(item);
            this.getNavigationBar().onViewAdd(this, item, index);
        }

        if (this.initialized) {
            this.fireEvent('add', this, item, index);
        }
    },

    /**
     * Resets the view by removing all items between the first and last item.
     * @return {Ext.Component} The view that is now active
     */
    reset: function() {
        return this.pop(this.getInnerItems().length);
    }
});
