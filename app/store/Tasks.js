Ext.define('ABLV.store.Tasks', {
	extend: 'Ext.data.Store',
	
	requires: [
		'ABLV.model.Task'
		],

	config: {
		autoLoad: true,
		storeid: 'Tasks',
		model: 'ABLV.model.Task',
		grouper: function(record) {
			return record.get('uzdevumaTips');
			},

		/*!!šobrīd nestrādā!!*/
		sorter: ('izpildesTermins'),
	/*	data:[
				//Canadian Provinces
				{id:1, lietotajs: 'Sandis', uzdevumaTips:'Atskaites sagatavošana', uzdevumaID:111, uzdevumaApraksts: 'Un šeit ir apraksts', izpildesTermins: '02/02/2013', uzdevumaStatuss: 'Procesā', komentars: 'Un šeit mēs rakstām komentāru', FaktiskaisIzpildesDatums: '2013.02.02'},
				{id:2, lietotajs: 'Sandis', uzdevumaTips:'Atskaites sagatavošana', uzdevumaID:222, uzdevumaApraksts: '2Un šeit ir apraksts', izpildesTermins: '03.03.2013', uzdevumaStatuss: 'Procesā', komentars: '2Un šeit mēs rakstām komentāru', FaktiskaisIzpildesDatums: '2013.03.03'},
				{id:3, lietotajs: 'Sandis', uzdevumaTips:'Rīkojuma nosūtīšana', uzdevumaID:333, uzdevumaApraksts: '3Un šeit ir apraksts', izpildesTermins: '2013.04.04', uzdevumaStatuss: 'Procesā', komentars: '3Un šeit mēs rakstām komentāru', FaktiskaisIzpildesDatums: '2013.04.04'},
				{id:4, lietotajs: 'Sandis', uzdevumaTips:'Rīkojuma nosūtīšana', uzdevumaID:444, uzdevumaApraksts: '4Un šeit ir apraksts', izpildesTermins: '2013.05.05', uzdevumaStatuss: 'Procesā', komentars: '4Un šeit mēs rakstām komentāru', FaktiskaisIzpildesDatums: '2013.05.05'},
				{id:5, lietotajs: 'Uldis', uzdevumaTips:'Lēmuma pieņemšana', uzdevumaID:555, uzdevumaApraksts: '5Un šeit ir apraksts', izpildesTermins: '2013.06.06', uzdevumaStatuss: 'Procesā', komentars: '5Un šeit mēs rakstām komentāru', FaktiskaisIzpildesDatums: '2013.06.06'},
				{id:6, lietotajs: 'Uldis', uzdevumaTips:'Lēmuma pieņemšana', uzdevumaID:666, uzdevumaApraksts: '6Un šeit ir apraksts', izpildesTermins: '2013.07.07', uzdevumaStatuss: 'Procesā', komentars: '6Un šeit mēs rakstām komentāru', FaktiskaisIzpildesDatums: '2013.07.07'},

		],*/

		/*proxy: {
            type: 'ajax',
            url : 'http://localhost/www/MySenchaApps/uzdevumi.json',
            reader: {
                type: 'json',
                rootProperty: 'uzdevumi'
                

            }
        }*/

		proxy: {
            type: 'jsonp',
            url : 'http://62.85.27.32/abdemo/index.php/welcome/getFullDemoDataJSONp',
            reader: {
                type: 'json',
                callbackKey: 'callback'

            }
        }
	}
	
});