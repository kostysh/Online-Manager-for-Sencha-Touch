Online-Manager-for-Sencha-Touch
===============================

Utility for detection of the online status, and something else

Author: Constantine V. Smirnov, kostysh(at)gmail.com, http://mindsaur.com    
License: GNU GPL v3.0    
Current version: 1.1    
ST2 version: 2.1.0 Beta1    
ST2 SDK Tools: 2.0.0 Beta 3

Versions:
=========
- 1.0 Initial release  

Features:
=========
- Detection of the online status (real, not only connection)  
- Events: exception, beforeonline, beforeoffline, onlinechange, online, offline  

Requirements:
=============
- Ext.ux.util.Intervalr https://github.com/kostysh/Intervalr-for-Sencha-Touch   

Installing:
===========
- Place src to your app folder;  
- Place online.php on your app's server (any place accessible from the web);
- Configure custom path for custom components: 
<!-- language: lang-js -->
        
        Ext.Loader.setPath({
            'Ext.ux': '[..path..]src/ux'
        });
- Require Ext.ux.util.OnlineManager class in app.js/controller or view config:  
<!-- language: lang-js -->
        
        requires: ['Ext.ux.util.OnlineManager']

Usage:  
======   
- Configure OnlineManager:  
<!-- language: lang-js -->
        
        OnlineManager.on({
            'onlinechange': function(mode) {
                if (mode) {
                    console.log('We are online');
                } else {
                    console.log('We are offline');
                }
            }
        });
- Start OnlineManager:  
<!-- language: lang-js -->
        
        OnlineManager.start();
- Stop OnlineManager:  
<!-- language: lang-js -->
        
        OnlineManager.stop();

