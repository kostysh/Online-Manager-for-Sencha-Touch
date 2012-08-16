Ext.define('Online.controller.Main', {
    extend: 'Ext.app.Controller',
    
    requires: [
        'Ext.ux.util.OnlineManager'
    ],
    
    config: {
        refs: {
            'indicator': '#indicator'
        },
        
        control: {
            indicator: {
                initialize: 'onIndicatorInit'
            }
        }
    },
    
    onIndicatorInit: function(indicator) {
        OnlineManager.setUrl('online.php');  
        
        OnlineManager.on({
            'onlinechange': function(mode) {
                if (mode) {
                    indicator.setText('Online');
                    indicator.setUi('confirm');
                } else {
                    indicator.setText('Offline');
                    indicator.setUi('normal');
                }
            }
        });
        
        OnlineManager.start();
    }
});
