# MemChewIonic
An Ionic client for MemChew, primarly targeting iOS. May eventually be replaced by a native iOS client.

Other Parts:
- [MemChewAndroid](https://github.com/rameshvarun/MemChewAndroid) - Native Android Client
- [MemChewServer](https://github.com/rameshvarun/MemChewServer) - Server side code.

# Setup
A large portion of the ionic and cordova toolchain is written in node,
so you will need access to that. If you don't already, install cordova and ionic
with `npm install -g cordova ionic`.

Clone the repository.

In the repository directory, run the following commands to install the plug-ins that the app will use.
```
cordova plugin add org.apache.cordova.camera
cordova plugin add org.apache.cordova.statusbar
```
