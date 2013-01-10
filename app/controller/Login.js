Ext.define('ABLV.controller.Login', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            loginView: 'loginview',
            //mainMenuView: 'mainmenuview',
            galvenais: 'galvenais',
            labaisLists: 'labaislists'
          //  slideNav:                   'slidenavigationview'
        },

        control: {
            loginView: {
                signInCommand: 'onSignInCommand'
            },
            mainMenuView: {
                onSignOffCommand: 'onSignOffCommand'
            }
        }
    },
 
    // Session token
    sessionToken: null,

    // Transitions
    getSlideLeftTransition: function () {
        return { type: 'slide', direction: 'left' };
    },

    getSlideRightTransition: function () {
        return { type: 'slide', direction: 'right' };
    },

    onSignInCommand: function (view, username, password) {
        
        console.log('Username: ' + username + '\n' + 'Password: ' + password + '\n' + " view "+ view.id);

        var me = this,
            loginView = me.getLoginView();

        if (username.length === 0 || password.length === 0) {
            loginView.showSignInFailedMessage('Ievadiet lietotāja vārdu un paroli.');
            return;
        }

        loginView.setMasked({
            xtype: 'loadmask',
            message: 'Ielogojos...'
        });

        Ext.data.JsonP.request({
            type: 'jsonp',
                url: 'http://62.85.27.32/abdemo/index.php/welcome/login',
                
                params: {
                username: username,
                password: password
                },
                callbackKey: 'callback',
                scriptTag: true, // Use script tag transport
                callback: function(success, result) {
                    //console.log(success);
                   // console.log(result);

                   if (result.sessionToken == "slepenaisLogin") {
                    result = result.sessionToken;
                    console.log(result);
                    console.log('Veiksmīgs logins');
                    me.sessionToken = result;
                    me.signInSuccess();     //Just simulating success.

                    } else {
                        me.singInFailure('Neizdevās. Mēģiniet vēlreiz.');
                    }
                },

  

        });


        /*Ext.data.JsonP.request({
            url: 'http://10.20.30.69:8080/abdemo/index.php/welcome/login',
            method: 'get',
            params: {
                user: username,
                pwd: password
            },

            success: function (response) {
                var loginResponse = Ext.JSON.decode(response.responseText);

                if (loginResponse.success === "true") {
                    // The server will send a token that can be used throughout the app to confirm that the user is authenticated.
                    me.sessionToken = loginResponse.sessionToken;
                    me.signInSuccess();     //Just simulating success.

                } else {
                    me.singInFailure(loginResponse.message);
                }
            },

            failure: function (response) {
                me.sessionToken = null;
                me.singInFailure('Login failed. Please try again later.');
            }
        });*/
    },

    signInSuccess: function () {
        console.log('Signed in.');
        var loginView = this.getLoginView();
        mainView = this.getGalvenais();
        loginView.setMasked(true);
       // this.fireEvent("newNoteCommand", this);
      // Ext.Viewport.getComponent("main").fireAction( "open");
     //  console.log(Ext.Viewport.getComponent('galvenais'));

        Ext.Viewport.animateActiveItem(mainView, this.getSlideLeftTransition());

    },


    /*signInSuccess: function () {
        console.log('Signed in.');
        var loginView = this.getLoginView();
        mainMenuView = this.getMainMenuView();
        //mainMenuView = Ext.Viewport.getComponent('mainmenuview');
        loginView.setMasked(false);
         console.log(mainMenuView);
        // console.log(loginView);
        

        Ext.Viewport.animateActiveItem(mainMenuView, this.getSlideLeftTransition());

    },*/

    singInFailure: function (message) {
        var loginView = this.getLoginView();

        loginView.showSignInFailedMessage(message);
        loginView.setMasked(false);

    },

    onSignOffCommand: function () {
        var me = this;

        Ext.Ajax.request({
            url: '../../services/logoff.ashx',
            method: 'post',
            params: {
                sessionToken: me.sessionToken
            },

            success: function (response) {
                // TODO: You need to handle this condition.
            },

            failure: function (response) {
                // TODO: You need to handle this condition.
            }

        });

        Ext.Viewport.animateActiveItem(this.getLoginView(), this.getSlideRightTransition());

    }
});
