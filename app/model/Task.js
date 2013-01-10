Ext.define('ABLV.model.Task', {
	extend: 'Ext.data.Model',
	alias: 'model.Task',
	
	config: {
		
		fields: [
		{name: 'id'},
		{name: 'IzpilditajaID'},
		{name: 'DokumentaNumurs'},
		{name: 'ProcesaNosaukums'},
		{name: 'UzdevumaTips'},
		{name: 'uzdevumaApraksts'},
		{name: 'Izveidots', type: 'date', dateFormat: 'Y-m-d'},
		{name: 'ProcesaStatuss'},
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