Ext.define('ABLV.view.Galvenais', {
    extend: 'Ext.Container',
    xtype: 'galvenais',
    alias: 'widget.galvenais',

    requires: [
        'ABLV.view.Main', 'ABLV.store.Tasks'
    ],

    config: {
        id: 'viewport',
        layout: {
            animation: 'slide',
            type: 'card'
        },
        items: [
            {
                
                xtype: 'mainview'
            }
        ]
    }


});