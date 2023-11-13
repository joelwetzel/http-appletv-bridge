# http-appletv-bridge

## UNDER DEVELOPMENT: A bridge server that can run on a Raspberry Pi.  It will connect to your Apple TV, and expose its power state via a simple HTTP interface.

-----

## Get Started:

1. >git clone https://github.com/joelwetzel/http-appletv-bridge.git
2. >cd http-appletv-bridge
3. >npm install
4. >npm run build

-----

## Run from Command Line:

>npm run start

_____

## Install as a Service:

>sudo npm run installService

It should now start automatically, but there are other commands too:

>sudo npm run startService

>sudo npm run stopService

>sudo npm run uninstallService

-----

## If you have trouble:

**Did atvremote install?**

>atvremote -scan

>npm run check-pyatv

**Having trouble running the service on Mac?**
- Check in /Library/LaunchDaemons for the plist file
- Check console.app for any logs being written
- Are the files cloned into somewhere accessible to the system at launch?  It probably can't access them in ~/Documents, for example.
