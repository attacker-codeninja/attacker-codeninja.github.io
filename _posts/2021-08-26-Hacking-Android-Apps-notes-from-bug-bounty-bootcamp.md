---
layout: post
title: My Notes on Hacking Android Apps from Bug Bounty Bootcamp 
subtitle: android hacking Notes
tags: [androing pentesting]
---

# Bug Bounty Bootcamp Notes - Chapter 23 - HACKING ANDROID APPS

---



> Best resource -> https://github.com/OWASP/owasp-mstg/





## 1. Setting Up Your Mobile Proxy



* Same as we set or configure web browser with proxy we setup our testing mobile device to work with a proxy
* This generally involves installing the proxy’s certificate on your device and adjusting your proxy’s settings.
* Good If use a mobile emulator (a program that simulates a mobile device) for testing.
  * Because, Mobile testing is dangerous : We might accidentally damage our device
* First,we will need to configure Burp’s proxy to accept connections from our device 
  *  because by default, Burp’s proxy accepts connections only from the machine Burp is running on
* Navigate to Burp’s **Proxy** -> **Options** tab.
* In the Proxy Listeners section, click Add. 
* In the pop-up window, enter a port number that is not currently in use and select All interfaces as the Bind to address option.
* Now Click **OK**
* Our proxy should now accept connections from any device connected to the same Wi-Fi network
  * Recommendation -> Not doing this on a public Wi-Fi network. 
* Next, configure our Android device to work with the proxy.
  * **Settings** -> **Network**-> **Wi-Fi**, selecting (usually by tapping and holding) the Wi-Fi network you’re currently connected to, and selecting **Modify Network**
  * Then able to select a proxy hostname and port
  * enter your computer’s IP address and the port number you selected earlier.
  * How to know IP Address ?
    * For Linux ->hostname -i
    * For MAC -> ipconfig getifaddr en0
  * Our Burp proxy should now be ready to start intercepting traffic from our mobile device



> The process of setting up a mobile emulator to work with your proxy is similar to this process, except that some emulators require that you add proxy details from the emulator settings menu instead of the network settings on the emulated device itself



* If you want to intercept and decode HTTPS traffic from your mobile device as well, you’ll need to install Burp’s certificate on your device
  * You can do this by visiting http://burp/cert in the browser on your computer that uses Burp as a proxy
  * Save the downloaded certificate, email it to yourself, and download it to your mobile device.
  * Next, install the certificate on your device
  * This process will also depend on the specifics of the system running on your device, but it should be something like choosing
    * **Settings** -> **Security ** -> **Install Certificates from Storage**
    * Click the certificate you just downloaded and select **VPN and apps** for the Certificate use option. 
  * We, now be able to audit HTTPS traffic with Burp.





---



## 2. Bypassing Certificate Pinning



* Certificate pinning is a mechanism that limits an application to **trusting predefined certificates only**.
* Also known as **SSL pinning** or **cert pinning**
  * It provides an additional layer of security against **man-in-the-middle attacks** [MITM]
* MITM ->
  * in which an attacker secretly **intercepts**, **reads**, and **alters** the communications between two parties.
* To intercept and to decode  of an application that uses certificate pinning
  * We need to bypass the certificate pinning first
  * If we didn't bypass this -> then application will not trust our proxy's SSL Certificate and so we will be not able to intercept HTTPS traffic.
* It’s sometimes necessary to bypass certificate pinning to intercept the traffic of better-protected apps
* If we successfully setup our mobile device to work with a proxy but still cannot see the traffic belonging to our target application, that app may have implemented certificate pinning
* `The process of bypassing cert pinning will depend on how the certificate pinning is implemented for each application.`
* For Android -> we  have a few options for bypassing the pinning
  * Use **Frida tool** ->
    * That allow us to inject scripts into the application
    * use the Universal Android SSL Pinning Bypass Frida script
      * https://codeshare.frida.re/@pcipolloni/universal-android-ssl-pinning-bypass-with-frida/
  * Another Tool -> **Objection** [to automate this process of Frida]
    * which uses Frida to bypass pinning for Android or iOS.
    * Run the Objection command `android sslpinning disable` to bypass pinning.
* For most applications, we can bypass the certificate pinning by using these automated tools
* ` But if the application implements pinning with custom code then we might need to manually bypass it`
* We could **overwrite the packaged certificate** with our custom certificate





---



## 3. Anatomy of an APK



* Before targeting Android Target, we must know about Android first
* Android applications are distributed and installed in a file format called **Android Package (APK**)
* APKs are like **ZIP files** that contain everything an Android application needs to operate:
  * the application code
  * the application manifest file
  * and the application’s resources.
* So, We must know these main components of Android APK
* `AndroidManifest.xml file`
  * which contains -> 
    * **application’s package name**, 
    * **version**, 
    * **components**, 
    * **access rights**, and
    *  **referenced libraries**, 
    * as well as **other metadata.**
  * It is a  good starting point for exploring the application.
  * From this file, we can gain insights into the **app’s components and permissions.** 
  * Understanding the components of our target application will provide us with a good overview of how it works
* ` There are four types of app components`
  * **Activities (declared in `<activity>` tags)**
  * **Services (declared in  `<service>` tags)**
  * **BroadcastReceivers (declared `<receiver>` in  tags)**
  * **ContentProviders (declared in  `<provider>` tags)**
* `Activities ` ->
  * are application components that interact with the user
  * The windows of Android applications we see are made up of **Activities**
* `Services` ->
  * are long-running operations that do not directly interact with the user, 
  * such as retrieving or sending data in the background.
* `BroadcastReceivers` ->
  * allow an app to respond to broadcast messages from the Android system and other applications. 
  * Example ->
    * Some applications download large files only when the device is connected to Wi-Fi, 
    * so they need a way to be notified when the device connects to a Wi-Fi network.
* `ContentProvider` ->
  *  provide a way to share data with other applications. 



> `**Remember**` ->
>
> The permissions that the application uses, such as the **ability to send text messages** and **the permissions other apps need to interact with it**, are also declared in this **AndroidManifest.xml**file. 
>
> 
>
> This will give us a good sense  of what the application can do and how it interacts with other applications on the same device



* `classes.dex file`
  * contains the `application source code` compiled in the **DEX** file format.
* `resources.arsc file`
  * contains the application’s `precompiled resources`, such as **strings, colors, and styles**
  *  The **res** folder contains the `application’s resources` **not compiled into `resources.arsc`**.
  * In the **res** folder, the `res/values/strings.xml` file contains **literal strings of the application**.
* `lib folder`
  * contains compiled code that is platform dependent
  * Each subdirectory in **lib** contains the specific source code used for a particular mobile architecture.
  * `Compiled kernel modules are located here and are often a source of vulnerabilities.`
* `assets folder`
  * contains the application’s assets, such as **video, audio, and document templates**
* `META-INF folder`
  * contains the **MANIFEST.MF** file, which `stores metadata about the application`
  *  This folder also contains the `certificate and signature of the APK`.





---



## 4. Tools to Use





> After understanding the components of an Android application we  now need to know `how to process the APK file` and `extract the Android source code`



### 4.1 Android Debug Bridge



* **ADB** -> command line tool -> to communicate with a connected Android device with our computer
* We can use ADB -> to  copy files to and from your device, or to quickly install modified versions of the application you’re researching
* ADB Documentation -> https://developer.android.com/studio/command-line/adb/
* To start using ADB, 
  * connect our device to our laptop with a USB cable
  * Then turn on **debugging mode** on our device
  * Whenever you want to use ADB on a device connected to your laptop over USB, you `must enable USB debugging.`
  * This process varies based on the mobile device, but should be similar to choosing
    * **Settings -> System -> Developer Options -> Debugging**
    * This will enable you to interact with your device from your laptop via ADB. 
* **NOTE** ->
  * On Android version 4.1 and lower, the developer options screen is available by default
  * In versions of Android 4.2 and later, developer options need to be enabled by choosing
    * **Settings -> About Phone** and then tapping the **Build number** seven times.
* On your mobile device, you should see a window prompting you to allow the connection from your laptop
* **Some Important Commands ->**
  * `adb devices -l`
    * To Make sure that our laptop is connected to the device
  * `adb install PATH_TO_APK`
    * To install APK
  * `adb pull REMOTE_PATH LOCAL_PATH`
    * To download files from our device to our laptop
  * `adb push LOCAL_PATH REMOTE_PATH`
    *  OR to copy files on our laptop to our mobile device



### 4.2 Android Studio



* A  software which is used for developing Android applications
* And we can use it to modify an existing application’s source code
* It also **includes** -> an `emulator `  that runs applications in a virtual environment
  * If we  don’t have a physical Android device then can use Android Studio





### 4.3 Apktool



* A tool for reverse engineering APK files
* It **converts** APKs into **readable source code** files and **reconstructs an APK from these files**
* We  can use Apktool to get individual files from an APK for source code analysis
* Example Command -> ` apktool d example.apk`
  * this command extracts files from an APK called example.apk
* Another useful Command -> `apktool b example -o example.apk`
  * This command `packages the content of the example folder into the file example.apk`
  * Why needing ? -> 
    * Sometimes, we want to modify an APK’s source code and see if that changes the behavior of the app
    * Then we use Apktool to repackage individual source code files after making modifications





### 4.4 Frida



* https://frida.re/
* An amazing instrumentation toolkit that lets us `inject our script` into `running processes` of the application
* We can use it to 
  * **inspect functions** that are called, 
  * analyze the app’s network connections, 
  * and bypass certificate pinning.
* Frida uses JavaScript as its language





### 4.5 Mobile Security Framework



* https://github.com/MobSF/Mobile-Security-Framework-MobSF/
* This automated mobile application testing framework for Android, iOS, and Windows can do both **static and dynamic testing**





---



## 5. Hunting for Vulnerabilities



* Extract the application’s package contents and review the code for vulnerabilities
* Compare `authentication and authorization mechanisms` for the `mobile and web apps` of the same organization
* Developers may trust data coming from the mobile app, and this could lead to **IDORs or broken authentication** if you use a `mobile endpoint`
* Mobile apps also tend to have issues with **session management**, such as 
  * reusing session tokens, 
  * using longer sessions, 
  * or using session cookies that don’t expire
* These issues **can be chained with XSS** `to acquire session cookies `that allow attackers to take over accounts even after users log out or change their passwords
* Some applications use custom implementations for encryption or hashing.
  * So, Look for 
    * insecure algorithms, 
    * weak implementations of known algorithms, 
    * and hardcoded encryption keys
* After reviewing the application’s source code for potential vulnerabilities, we can validate our findings by testing `dynamically on an emulator or a real device`.



> **NOTE** :
>
> Mobile applications are an excellent place to search for additional web vulnerabilities not present in their web application equivalent
>
>
> 
> So, use Burp Suite to intercept the traffic coming out of the mobile app during sensitive actions and then check vulnerabilities just like we check for web based vulnerabilities 



* Mobile apps -> Often contain **unique endpoints** 
  * that may not be as well tested as web endpoints because fewer hackers hunt on mobile apps.
* `Recommendation` =>
  * First test  an organization’s web applications, before  dive into its mobile applications
  * because a mobile application is often a simplified version of its web counterpart
*  Search for IDORs, SQL injections, XSS, and other common web vulnerabilities
* Also look for common web vulnerabilities by analyzing the source code of the mobile application.



> **NOTE :**
>
>
> In addition to the vulnerabilities that you look for in web applications, search for some `mobile-specific vulnerabilities`. 



* ` AndroidManifest.xml contains basic information about the application and its functionalities`
  * Good starting point for analysis 
* Unpack the APK File -> then read the files to get the basic understanding of the applications
  * Like its **components** and **permissions it uses**
  * Then dive into other files to look for other mobile-specific vulnerabilities.
  * Look for `hardcoded secrets or API keys` that the application needs to access web services.
* `res/values/strings.xml file`
  * This file stores the strings in the application.
  * **It’s a good place to look for `hardcoded secrets, keys, endpoints, and other types of info leaks`**
* Also search for **secrets in other files** by `using grep` to search for the known keywords we know
* Also look for `.db or .sqlite` extensions files 
  * these are database files.
  * Look inside these files to see what information gets shipped along with the application
  * These are also an easy source of potential secrets and sensitive information leaks
  * Look for things like 
    * session data, financial information, and sensitive information belonging to the user or organization





> Closely examine the interactions between the client and the server, and dive into the source code
>
> Keep in mind the special classes of vulnerabilities, like hardcoded secrets and the storage of sensitive data in database files, that tend to manifest in mobile apps more than in web applications.





---



## 6. Summary





* Mobile Pentesting is also a good starting point to test compare to web pentesting because of less hackers in Mobile Pentesting
* We can use Physical Device and as well as Emulators [Android Studio and Genymotion - for Android]
* Understanding core concepts of Android is important before testing Android hacking
* **AndroidManifest.xml** -> is the backbone of android applications -> always check this files
* Often contain unique endpoints as compare to web applications - so look for this
* Setting burp with android devices [physical] and emulators -> Very important and must to know the applications and testing
* APK -> Android Package -> just like ZIP File
* Certificate Pinning -> Mechanism that only trust **predefined certificates only**
  * So, as a tester we must know to Bypass this Certificate Pinning
  * Tool -> Frida + Objection
* ADB -> Very good command to connect with devices
* APKTOOL -> Good tool to extract packages from application [apk files]
