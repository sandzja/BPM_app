Ext.define('ABLV.view.TaskList', {
	extend: 'Ext.dataview.List',
	alias: 'widget.labaislists',
	xtype: 'labaislists',
	requires: ['ABLV.store.Tasks'],
	
	config: {
		cls: 'custom-list-center',
		animation: 'slide', 
		title: 'Uzdevumu saraksts', 
		itemId: 'labaislists',
		grouped: true,
		itemTpl: 
			[
			'<div class="task-list-item" style="background-image: url(img/check.png); background-size: 19px 18px; background-repeat:no-repeat;"><span style="margin-left:30px;">',
			'{uzdevumaApraksts}</span></div>'
            ],


/*
			'<div class="avatar" style="background-image: url(http://www.dhl.lv/content/dam/General%20DHL%20pictures/Icons/Small%20teasers_50x50/dhl_open_account_icon_42x40.jpg)"></div>',
			'<div class="apraksts"> {uzdevumaApraksts}</div>',
			'<div class="id"> {id}</div>'*/
			
			
			/*[
            '<div class="committee">{name}</div>'
        	]*/

		//<div class="avatar"<tpl if="photo"> style="background-image: url({photo})"</tpl>></div><span class="name">{name}<tpl if="position || affiliation"><br /><span class="tertiary">{position}<tpl if="affiliation">, {affiliation}</tpl></span></tpl></span>',
		store: 'Tasks',
		disableSelection: true,
		refs: {
			taskdetails: {
                autoCreate: true,
                selector: 'taskdetails',
                xtype: 'taskdetails'
            },
		},
	},

});