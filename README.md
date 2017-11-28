# Frontend, multiplatform mobile application
Contributors: 
Johan Berndtsson, Pontus Stjernström, Nicole Ascard

## Current issues
* Haven't found a nice way to debug
* Can't search (filter) port calls when not scrolled down
* Operations change place after update

## Future updates
* Update error message on invalid login*
* Respond to TTA with RTA
* Subscribe on locations
* Update notifications
* Enable drag and drop on favorite states
* Maybe show current location of vessel (by MarineTraffic)

## Feedback
* Use timezones from instances
* Show current timezone (somewhere)
* Mirror start and endtime with latest reported statement
* Show dates in swedish-style

## Suggested updates
* Summary of sent message (instead of current verification) as popup

### Important links
* https://www.bis.doc.gov/index.php/policy-guidance/encryption
* https://support.google.com/googleplay/android-developer/answer/113770

# Developer info
## Build version
### iOS
0. Change Expo account in .plist
1. Targets->Build Settings->Packaging->Product Bundle Idenfifier = SET
2. Targets->Build Settings->Packaging->Product Name = SET
3. Targets->Info->Bundle name = SET
4. Targets->Info->Bundle Identifier = SET
5. Targets->Info->Bundle display name
6. Archive
### For ad hoc
7. Export->Select Ad-Hoc->Manual sign->Select correct provisioning profile->Export

### Android
0. Change Expo account in MainActivity
1. Change applicationId to choice in build.gradle

## Expo info
* Production username: avajadi
* Staging username: pontusstjerna

## Deployment checklist
* Check config/version.js
* Check components/about-view/index.js and append Changelog
* ALWAYS publish on staging (pontusstjerna) before production (avajadi)
* Push to git :)