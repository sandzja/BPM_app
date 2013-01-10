//<debug>
Ext.Loader.setPath({
    'Ext':      'touch/src',
    'Ext.ux':   './ux'
});
Ext.Loader.setConfig({
    enabled: true
});
//</debug>

Ext.application({
    name: 'ABLV',

    requires: [
        'Ext.MessageBox','Ext.data.Store', 'Ext.data.proxy.JsonP', 'Ext.dataview.List', 'Ext.dataview.NestedList', 'Ext.Img', 'Ext.form.Panel', 'Ext.field.DatePicker', 'Ext.form.FieldSet'
    ],

    views: ['Galvenais', 'Main', 'TaskDetails', 'TaskList', 'Login'],
    controllers: ['Main', 'Login'],
    models:['Task'],
    stores:['Tasks'],

    icon: {
    '57': 'resources/icons/Icon.png',
    '72': 'resources/icons/Icon~ipad.png',
    '114': 'resources/icons/Icon@2x.png',
    '144': 'resources/icons/Icon~ipad@2x.png'
    },

    startupImage: {
    '320x460': 'resources/startup/320x460.jpg',
    '640x920': 'resources/startup/640x920.png',
    '768x1004': 'resources/startup/768x1004.png',
    '748x1024': 'resources/startup/748x1024.png',
    '1536x2008': 'resources/startup/1536x2008.png',
    '1496x2048': 'resources/startup/1496x2048.png'
    },

launch: function() {
        // Destroy the #appLoadingIndicator element
        Ext.fly('appLoadingIndicator').destroy();
	
        // Initialize the main view
        Ext.Viewport.add(Ext.create('ABLV.view.Galvenais'));

/*        Ext.Viewport.add([
            { xtype: 'loginview' },
            { xtype: 'galvenais' }
        ]);*/

    },

    onUpdated: function() {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function() {
                window.location.reload();
            }
        );
    }
});
