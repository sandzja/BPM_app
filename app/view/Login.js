Ext.define('ABLV.view.Login', {
    extend: 'Ext.form.Panel',
    alias: "widget.loginview",
    requires: ['Ext.form.FieldSet', 'Ext.form.Password', 'Ext.Label', 'Ext.Img', 'Ext.util.DelayedTask'],

    config: {

        title: 'Login',

        items: [

            {

                xtype: 'image',
                src: 'img/login.png',
                height: 124,
                width: '100%',
                position: 'center',

            },

            {
                xtype: 'label',
                html: 'Login neizdevās. Ievadiet korektus datus.',
                itemId: 'signInFailedLabel',
                hidden: true,
                hideAnimation: 'fadeOut',
                showAnimation: 'fadeIn',
                style: 'color:#990000;margin:5px 0px;'
            },

            {
                xtype: 'fieldset',
                title: '',
                items: [
                    {
                        xtype: 'textfield',
                        placeHolder: 'Lietotāja vārds',
                        itemId: 'userNameTextField',
                        name: 'userNameTextField',
                        required: true
                    },

                    {
                        xtype: 'passwordfield',
                        placeHolder: 'Parole',
                        itemId: 'passwordTextField',
                        name: 'passwordTextField',
                        required: true
                    }
                ]
            },

            {
                xtype: 'button',
                itemId: 'logInButton',
                ui: 'action',
                padding: '10px',
                text: 'Log In'
            }
         ],

        listeners: [{
            delegate: '#logInButton',
            event: 'tap',
            fn: 'onLogInButtonTap'
        }]

    },

    onLogInButtonTap: function () {
        var me = this,
            usernameField = me.down('#userNameTextField'),
            passwordField = me.down('#passwordTextField'),
            label = me.down('#signInFailedLabel'),
            username = usernameField.getValue(),
            password = passwordField.getValue();
            //Ext.getCmp('#passwordTextField').blur();
            passwordField.blur();
            usernameField.blur();
        label.hide();
        // Using a delayed task in order to give the hide animation above
        // time to finish before executing the next steps.

        var task = Ext.create('Ext.util.DelayedTask', function () {
            label.setHtml('');
            me.fireEvent('signInCommand', me, username, password);
        //    usernameField.setValue('');
       //     passwordField.setValue('');
            passwordField.blur();
            usernameField.blur();
        });

        task.delay(500);
    },

    showSignInFailedMessage: function (message) {
        var label = this.down('#signInFailedLabel');
        label.setHtml(message);
        label.show();
    },
});
