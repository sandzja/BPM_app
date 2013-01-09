Ext.define('ABLV.model.Task', {
	extend: 'Ext.data.Model',
	alias: 'model.Task',
	
	config: {
		
		fields: [
		{name: 'id', type: 'int'},
		{name: 'lietotajs'},
		{name: 'uzdevumaID', type: 'int'},
		//{name: 'uzdevumaNosaukums'},
		{name: 'uzdevumaTips'},
		{name: 'uzdevumaApraksts'},
		{name: 'izpildesTermins', type: 'date'},
		{name: 'uzdevumaStatuss'},
		{name: 'komentars'},
		{name: 'FaktiskaisIzpildesDatums'}

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