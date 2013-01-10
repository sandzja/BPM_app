Ext.define('ABLV.controller.Main', {
    extend: 'Ext.app.Controller',

    config: {
        stores: [
            'Tasks'
        ],

    requires: [
        'ABLV.view.Galvenais'
    ],

        refs: {
            slideNav:                   'slidenavigationview',
            galvenais: {
                autoCreate: true,
                selector: 'galvenais',
                xtype: 'galvenais'  
            },

            labaislists: {
                autoCreate: true,
                selector: 'labaislists',
                xtype: 'labaislists'
            },
           /* taskdetailsform: {
                autoCreate: true,
                selector: 'taskdetailsform',
                xtype: 'taskdetailsform'
            },*/
            taskdetails: {
                autoCreate: true,
                selector: 'taskdetails',
                xtype: 'taskdetails'
            },
            /*commentlist: {
                autoCreate: true,
                selector: 'commentlist',
                xtype: 'commentlist'
            },
            historylist: {
                autoCreate: true,
                selector: 'historylist',
                xtype: 'historylist'
            },*/
        },

         control: {

            //slaid nav sākums
            slideNav: {
                open: function(nav, position, duration) {
                    //console.log('Container open (position='+position+',duration='+duration+')');
                },

                close: function(nav, position, duration) {
                    //console.log('Container close (position='+position+',duration='+duration+')');
                },

                select: function(nav, item, index) {
                  //  console.log('Selected item (index='+index+')');
                  //  console.log(item.title);
                         if(index == 0){
                            Ext.StoreMgr.get('Tasks').clearFilter();
                          } 
                          else {
                              //  Ext.StoreMgr.get('Tasks').load();
                                Ext.StoreMgr.get('Tasks').clearFilter();
                                Ext.StoreMgr.get('Tasks').filter('UzdevumaTips', item.title);
                                
                          }

/*                           if (index == 1){
                             Ext.StoreMgr.get('Tasks').clearFilter();
                            Ext.StoreMgr.get('Tasks').filter('uzdevumaTips', 'Atskaites sagatavošana');
                          }  else if (index == 2){
                             Ext.StoreMgr.get('Tasks').clearFilter();
                            Ext.StoreMgr.get('Tasks').filter('uzdevumaTips', 'Rīkojuma nosūtīšana');
                          }  else if (index == 3){
                             Ext.StoreMgr.get('Tasks').clearFilter();
                            Ext.StoreMgr.get('Tasks').filter('uzdevumaTips', 'Lēmuma pieņemšana');
                          }*/
                           
                           
                       
                    
                },

                opened: function(nav) {
                  //  console.log('Container opened');
                },

                closed: function(nav) {
                    // console.log('Container closed');
                },

                slideend: function(nav) {
                    // console.log('Container slideend');
                },

                slidestart: function(nav) {
                    // console.log('Container slidestart');
                },

                dragstart: function(nav) {
                    // console.log('Container dragstart');
                },

                dragend: function(nav) {
                    // console.log('Container dragend');
                }
            },
            //slaid nav beigas
            "labaislists": {
                itemtap: 'onContactItemTap',
                activate: 'onListActivate'
            },
            "labaislists222": {
                itemtap: 'onContactItemTap',
                activate: 'onListActivate'
            },
           
            /*"list": {
                activate: 'onListActivate'
            },*/
            "button#infoBackBtn": {
                tap: 'onInfoBackBtnTap'
            },
            "button#editContactBtn": {
                tap: 'onEditContactBtnTap'
            },
            "button#cancelBtn": {
                tap: 'onCancelBtnTap'
            },
            "button#CompleteTaskBtn": {
                tap: 'onCompleteTaskBtnTap'
            },
            "button#CancelTaskBtn": {
                tap: 'onCancelTaskBtnTap'
            },
           
        },
    },
   

    onContactItemTap: function(dataview, index, target, record, e, options) {
        var info = this.getTaskdetails();
        // console.log(info);

        info.setRecord(record);
        //!!Ieliekot divreiz, pasākums strādā, bet bez animācijas!!
        Ext.Viewport.animateActiveItem(info, {type:'slide', direction:'left'});
        Ext.Viewport.animateActiveItem(info, {type:'slide', direction:'left'});
     //   console.log('ContactItemTap funkcija');

    },

    onListActivate: function(container, newActiveItem, oldActiveItem, options) {
        var ds = Ext.StoreManager.lookup('Tasks');
        ds.clearFilter();
        // console.log('ListActivate funkcija');
    },

     onInfoBackBtnTap: function(button, e, options) {
        var main = this.getGalvenais();
        // console.log(main);

        // main.setRecord(record);
        
        Ext.Viewport.animateActiveItem(main, {type:'slide', direction:'left'});
      //  console.log('BackItemTap funkcija');
    },

    onEditContactBtnTap: function(button, e, options) {
        var referrer = Ext.Viewport.getActiveItem();
        var form = this.getTaskdetails();
        var info = this.getTaskdetails();
        form.referrer = referrer;
        Ext.Viewport.setActiveItem(form);
        form.setRecord(info.getRecord());
    },

    onCancelBtnTap: function(button, e, options) {
        var form = this.getTaskdetails();
        Ext.Viewport.setActiveItem(form.referrer);
        delete form.referrer;

    },

    onCompleteTaskBtnTap: function(button, e, options) {
        /*var form = this.getTaskdetails();
        var errors = form.getValidationErrors();
        
        var values = form.getValues();
        var record = form.getRecord();
            if (record) {
                record.setData(values);
                record.commit();
                //if (form.referrer.setRecord) {
                //    form.referrer.setRecord(record);
                //}
            }
        var main = this.getGalvenais();
        var lab = this.getLabaislists();     
            //šeit sākas saglabāšana
        Ext.data.JsonP.request({
             type: 'jsonp',
                url: 'http://62.85.27.32/abdemo/index.php/welcome/confirmTask',
                params: record.data, //+ uzdevumaStatuss='Apstiprināts'
                callbackKey: 'callback',
                scriptTag: true, // Use script tag transport
                callback: function(success, result) {
                    
                    if (result.save == "success") {
                        //console.log('Item saved as confirmed'); 
                            
                            //Atgriežamies uz galveno skatu
                                  // console.log(record.data.uzdevumaTips);

                                    // Ext.StoreMgr.get('Tasks').filter('uzdevumaTips', record.data.uzdevumaTips);
                                     Ext.StoreMgr.get('Tasks').remove(record); 
                                     Ext.StoreMgr.get('Tasks').load();
                                  //   Ext.view.getcomponent('labaislists').refresh();
                          // console.log(Ext.dataview.List(galvenais));
                           // console.log(Ext.dataview.List(lab));
                          Ext.dataview.List(lab).refresh();                                    
                                  //   console.log(Ext.Viewport.getComponent('labaislists'));
                                   //  Ext.Viewport.getComponent('labaislists').refresh();
                                   //Ext.StoreMgr.get('Tasks').clearFilter();       
                                    // Ext.StoreMgr.get('Tasks').sync(); 
                            Ext.Viewport.animateActiveItem(main, {type:'slide', direction:'left'});
                            // console.log('BackItemTap funkcija');
                    }

                }
        });
  
        //Ext.StoreMgr.get('Tasks').removeAt(record.data.id);
        //console.log(record.data.id);
       //Ext.StoreMgr.get('Tasks').remove(record); 
      // Ext.StoreMgr.get('Tasks').sync();

        
    */},

    onCancelTaskBtnTap: function(button, e, options) {
        /*var form = this.getTaskdetails();
        var errors = form.getValidationErrors();
        
        var values = form.getValues();
        var record = form.getRecord();
            if (record) {
                record.setData(values);
                record.commit();
                //if (form.referrer.setRecord) {
                //    form.referrer.setRecord(record);
                //}
            }
        var main = this.getGalvenais();
        var lab = this.getLabaislists();     
            //šeit sākas saglabāšana
        Ext.data.JsonP.request({
             type: 'jsonp',
                url: 'http://62.85.27.32/abdemo/index.php/welcome/cancelTask',
                params: record.data, //+ uzdevumaStatuss='Apstiprināts'
                callbackKey: 'callback',
                scriptTag: true, // Use script tag transport
                callback: function(success, result) {
                    
                    if (result.save == "success") {
                         

                            //Atgriežamies uz galveno skatu
                            Ext.StoreMgr.get('Tasks').remove(record); 
                            Ext.StoreMgr.get('Tasks').load();
                            Ext.dataview.List(lab).refresh();
                            Ext.Viewport.animateActiveItem(main, {type:'slide', direction:'left'});
                         //   console.log('BackItemTap funkcija');
                    }
                },
        });
  
      //  console.log('Item saved as cancelled'); 
        //pāreja atpakaļ uz iepriekšējo skatu 
     //   var tls = Ext.Viewport.getCmp('tasklist');
      //  console.log(tls);
       
       //Atgriežamies uz galveno skatu
        var main = this.getGalvenais();
    //    console.log(main);

        // main.setRecord(record);
        
        Ext.Viewport.animateActiveItem(main, {type:'slide', direction:'left'});
  //      console.log('BackItemTap funkcija');   
        
    */}, 

});                    
