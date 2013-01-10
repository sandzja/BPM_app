Ext.define('ABLV.model.Task', {
	extend: 'Ext.data.Model',
	alias: 'model.Task',
	
	config: {
		
		fields: [
		{name: 'id'},
		{name: 'Izpilditaja ID (lietotajs)'},
		{name: 'Dokumenta numurs'},
		{name: 'Procesa nosaukums'},
		{name: 'Uzdevuma tips'},
		{name: 'Uzdevuma apraksts'},
		{name: 'Izveidots', type: 'date', dateFormat: 'Y-m-d'},
		{name: 'Procesa statuss'},
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