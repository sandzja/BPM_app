Ext.define('ABLV.model.Task', {
	extend: 'Ext.data.Model',
	alias: 'model.Task',
	
	config: {
		
		fields: [
		{name: 'id', type: 'int'},
		{name: 'lietotajs'},
		{name: 'uzdevumaID'},
		//{name: 'uzdevumaNosaukums'},
		{name: 'uzdevumaTips'},
		{name: 'uzdevumaApraksts'},
		{name: 'izpildesTermins', type: 'date', dateFormat: 'Y-m-d'},
		{name: 'uzdevumaStatuss'},
		{name: 'komentars'},
		{name: 'izpildesDatums', type: 'date', dateFormat: 'Y-m-d'}

		]

	},
	/* šis nepieciešams, lai nomainītu augšējo titlu dinamiski*/
	fullName: function() {
		var d = this.data,
		names = [
			d.uzdevumaTips
			/*d.lastName*/
		];
		return names.join(" ");
	}
});