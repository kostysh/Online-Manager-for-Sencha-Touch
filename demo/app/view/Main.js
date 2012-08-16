Ext.define('Online.view.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'main',
    
    requires: [
        'Ext.TitleBar'
    ],
    
    config: {
        tabBarPosition: 'bottom',
        
        tabBar: {
            layout: {
                pack : 'center',
                align: 'center'
            }
        },

        items: [
            {
                title: 'Welcome',
                iconCls: 'home',
                
                layout: {
                    type: 'vbox'
                },

                items: [
                    {
                        docked: 'top',
                        xtype: 'titlebar',
                        title: 'OnlineManager for Sencha Touch'
                    },
                    
                    {
                        id: 'indicator',
                        xtype: 'button',
                        padding: 50,
                        centered: true
                    }
                ]
            },
            
            {
                title: 'About',
                iconCls: 'info',
                layout: 'fit',
                styleHtmlContent: true,
                html: '<p><strong>Online-Manager-for-Sencha-Touch demo</strong></p>' +
                      '<p>Version: 1.0</p>' +
                      '<p>Author: Constantine Smirnov, ' + 
                      '<a href="http://mindsaur.com">http://mindsaur.com</a></p>' +
                      '<p>License: GNU GPL v3.0</p>' +
                      '<p>GitHub: <a href="https://github.com/kostysh/Online-Manager-for-Sencha-Touch ">Online-Manager-for-Sencha-Touch </a></p>',
                scrollable: 'vertical'
            }
        ]
    }
});
