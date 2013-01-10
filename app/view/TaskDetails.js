Ext.define('ABLV.view.TaskDetails', {
    extend: 'Ext.form.Panel',
    xtype: 'taskdetails',
    alias: 'widget.taskdetails',
     requires: 'Ext.DateExtras',

    
    config: {
        store: 'Tasks',
        padding: '10px',
        scrollable: true,
        items: [
            {
                xtype: 'toolbar',
                docked: 'top',
                title: 'Detalizēts skats',
                items: [
                    {
                        xtype: 'button',
                        itemId: 'infoBackBtn',
                        ui: 'action',
                        text: 'Back'
                    },
                    {
                        xtype: 'spacer'
                    }                    
                ]
            },
            
            {
                xtype: 'fieldset',
                title: 'Eksperta sagatavotā informācija',
                //instructions: 'Please enter the information above.',
                defaults: {
                    labelWidth: '30%'
                },
                items: [
                    {
                        xtype: 'textfield',
                        name: 'id',
                        label: 'ID',
                        itemId: 'id',
                        //disabled: true,
                        clearIcon: false,
                        readOnly: true,
                        hidden: true
                        //labelAlign: 'top'
                    },
                    {
                        xtype: 'textfield',
                        //disabled: true,
                        itemId: 'DokumentaNumurs',
                        clearIcon: false,
                        label: 'Dokumenta numurs',
                        name: 'DokumentaNumurs',
                        readOnly: true,
                        hidden: false
                    },
                    {
                        xtype: 'textfield',
                        //disabled: true,
                        itemId: 'ProcesaNosaukums',
                        clearIcon: false,
                        label: 'Procesa nosaukums:',
                        name: 'ProcesaNosaukums',
                        placeHolder: 'Procesa nosaukums nav norādīts',
                        readOnly: true
                    },
                    {
                        xtype: 'textfield',
                        //disabled: true,
                        itemId: 'UzdevumaTips',
                        clearIcon: false,
                        label: 'Uzdevuma tips:',
                        name: 'UzdevumaTips',
                        placeHolder: 'Uzdevuma tips nav norādīts',
                        readOnly: true
                    },{
                        xtype: 'textfield',
                        //disabled: true,
                        itemId: 'UzdevumaApraksts',
                        clearIcon: false,
                        label: 'Uzdevuma apraksts:',
                        name: 'UzdevumaApraksts',
                        placeHolder: 'Uzdevuma apraksts nav norādīts',
                        readOnly: true
                    },
                    {   
                        xtype: 'textfield',
                        //disabled: true,
                        itemid: 'Izveidots',
                        clearIcon: false,
                        label: 'Uzdevums izveidots:',
                        name: 'Izveidots',
                        id: 'Izveidots',
                        
                        //placeHolder: 'Izpildes termiņš nav norādīts',
                        readOnly: true
                    },
                ],    
            },                
            {
                xtype: 'fieldset',
                title: 'Pievienot komentāru par izpildi',
                defaults: {
                    labelWidth: '30%'
                },
                items: [
                    {//Pietrūkst!!
                        xtype: 'textfield',
                        name: 'komentars',
                        label: 'Komentārs:',
                        itemId: 'komentars',
                        //disabled: true,
                        clearIcon: true,
                        readOnly: false,
                        hidden: false,
                        placeHolder: 'Pievieno savu komentāru par uzdevuma izpildi!',
                        //labelAlign: 'top'
                    },
                    {//Pietrūkst!!

                            xtype: 'datepickerfield',
                            itemid: 'izpildesDatums',
                            id: 'izpildesDatums',
                            clearIcon: false,
                            label: 'Faktiskais izpildes datums:',
                            name: 'izpildesDatums',
                         //  slotOrder: ['day', 'month', 'year'], 
                        // value: new Date(),
                            readOnly: false,
                           dateFormat: 'd/m/Y',
                            picker: {
                                    yearFrom: 2012,
                                    yearTo: 2015
                                    }
                    },
                    {
                            xtype: 'textfield',
                            name: 'lietotajs',
                            label: 'Lietotājs:',
                            itemId: 'lietotajs',
                            //disabled: true,
                            clearIcon: true,
                            readOnly: true,
                            hidden: true,
                            placeHolder: 'Lietotājs',
                            //labelAlign: 'top'
                    },
                    {//Pietrūkst!!
                            xtype: 'textfield',
                            name: 'ProcesaStatuss',
                            label: 'Uzdevuma statuss:',
                            itemId: 'ProcesaStatuss',
                            //disabled: true,
                            clearIcon: true,
                            readOnly: true,
                            hidden: true,
                            placeHolder: 'Statuss',
                            //labelAlign: 'top'
                    },

                ],    
            },       
            
            {
                xtype: 'toolbar',
                docked: 'bottom',
                ui: 'black',
                title: '',
                items: [
                    {
                        xtype: 'spacer'
                    },
                    {
                        xtype: 'button',
                        itemId: 'CancelTaskBtn',
                        ui: 'decline',
                        iconCls: '',
                        iconMask: true,
                        text: 'Atcelt uzdevumu'
                    },
                    {
                        xtype: 'button',
                        itemId: 'CompleteTaskBtn',
                        ui: 'confirm',
                        iconCls: '',
                        iconMask: true,
                        text: 'Pārsūtīt uz pārbaudi'
                    }
                ]
            }, 
        ]
    },

    getValidationErrors: function() {
        var errors = [];
        var reqFields = this.query('field[required=true]');
        var i = 0, ln = reqFields.length, field;
        for (; i < ln; i++) {
            field = reqFields[i];
            if (!field.getValue()) {
                errors.push(field.getLabel() + ' must be completed.');
            }
        }
        console.dir(errors);
        return errors;
    },

    setRecord: function(record) {
        this.callParent(arguments);
    //     var date = record.data.izpildesTermins;
         //console.log(record);
        //console.log(Ext.Date.format(date, 'j/d/Y'));
       // record.data.izpildesTermins = Ext.Date.format(date, 'j/d/Y');
   //     var izpdate = this.down('#izpildesTermins').setValue(Ext.Date.format(date, 'd/m/Y'));
        //console.log(izpdate);
      //  record.set("izpildesTermins", Ext.Date.format(date, 'd/m/Y'));
/*
        var todaydate = new Date();
         var changedTodaydate = this.down('#izpildesDatums').setValue(Ext.Date.format(todaydate, 'd/m/Y'));
       console.log(changedTodaydate);*/
     
    }

});