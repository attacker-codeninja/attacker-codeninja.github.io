---
layout: post
title: Learn from AMA Series Part 1
tags: [AMA,ama, bug bounty]
---

## Learn from AMA Series from BugBountyForum



### 1. By @0xteknogeek =>



* Check for -> **IDOR, Authentication, any assumption that developer might have made with mobile app API**
* Web Application =>
  * Subdomain Scan
  * Google Dorks
  * Look Github => repositories and secrets =>
    *  check for **hidden folders like .git, and directory scans**
  * After Recon =>  go hands-on with the application and experiment with it as a user before dive in further
* **understand the mistakes that a developer might have made**
* Testing Server Side Bugs ? => **Understand** =>
  * what the code on the server side is actually doing?
  * what the query or command string might look like based on the action being performed ?
  * try to get as much information as you can from **side-channels**
  * What version of PHP are they using, are they using Linux or Windows, what commands are available on the system ?
  * **is the system using something custom or distributed?**



---



### 2. By  @edoverflow =>



* Spend quite a lot of time practicing in a controlled environment and looking for unusual, but good ways of approaching a target

* Personal Recon Wrapper Script =>

  * find subdomains
  * open ports
  * various directories
  * check the target's DNS Records
  * Take Screenshots of all the endpoints

* Target Approaching **varies** based on the Target

  * Financial company => handle payments => have certain **functionality** => **that when implemented incorrectly cause certain issues.**

  * look for certain features that could potentially open the target to various issues

  * Got **webhooks** ? => Server-Side Request Forgery 

    * Because the integration has to connect to an external instance with a user-supplied address.

  * Tools I use =>

    * Sublis3r, 

    * knockpy, 

    * dirsearch, 

    * meg (actually any tool developed by Tom), 

    * LinkFinder, 

    * virtual-host-discovery, 

    * wpscan, 

    * webscreenshot, 

    * twitterBFTD, 

    * broken-link-checker, 

    * Fransrosen => parameter collection bookmark thingy =>

      * ```js
        javascript:(function()%7Bvar str='';var attack=prompt('Attack','');if(!attack)return false;function getallelems(v)%7Bvar ii=document.getElementsByTagName(v);for(var i=0;i<ii.length;i++)%7Bif(!ii%5Bi%5D.name)continue;str+=(str?'&':'')+ii%5Bi%5D.name+'='+attack;%7D%7Dgetallelems('input');getallelems('textarea');getallelems('select');str=document.location.search+(document.location.search.indexOf('?')==-1?'?':'&')+str;alert(str);document.location.search=str;%7D)();
        ```

        

* Testing Server-Side Vulns ?

  * Be familiar with Proxy + Do a lots of practice in CTF Environments
  * Writing own vulnerable software => can help to better understanding of how to exploit server-side vulnerabilities.



---



### 3. By @securinti =>



* Recon  =>
  * Sublist3r, knock, dirsearch, nmap, Github, BitBucket, Pastebin, HaveIBeenPwned
  * Censys, WayBack machine, Twitter, Google and shodan
  * Mainly focus on **Documentation**
* Testing Server Side Bugs ?
  * focus on the blind stuff
    * Blind SQLi, Blind RCE, Blind Template Injection etc
  * Not necessarily because it’s easier (it’s not), but mainly because it is often overseen by other hackers
    * can have a huge impact and requires the hacker to think about the application
    * and what’s going on behind the scenes and to look for creative ways to blindly execute a payload



---



### 4. By  @orange_8361 =>



* Recon process Same =>

  * FuzzDB, Dirbuster, nmap, google dorking etc

  * usually found something interesting in:

    [pastebin.org](http://pastebin.org/)

    [github.com](http://github.com/)

    [gist.github.com](http://gist.github.com/)

    [google.com](http://google.com/)[netcraft.com](http://netcraft.com/) -

  * Check Domain and IP History

  * Check DNS Recon

  * Try =>

    * Internet Census 2012 
    * scans.io 
    * fofa.io 
    * Zoomeye.org 
    * Shodan.io

  * Whois, Reverse Whois

    * DomainTools
    * Benmi

  * Do, DNS Bruteforcing , Check for **SSL Certifications**

  * Do Reverse IP

    * dig 
    * Robtex 
    * You get signal 
    * Bing ip

  * Passive DNS => VirusTotal , PassiveTotal , DNSDB , sitedossier

* Simple => Look for as many vulnerabilities as possible!

* Mostly tools => Post-exploitation

* Burp Extensions:

  * Active Scan++ 
  * J2EE Scan 
  * Backslash Powered Scanner 
  * HTTPoxy Scanner 
  * Java Deserialization Scanner 
  * Retrie.js

* Testing for SQLi =>

  * page=1‘ 
  * page=1‘’ 
  * page=1%cc‘ 
  * page=1’-sleep(10)-’ 
  * page=1" 
  * page=1"“ 
  * page=1%cc” 
  * page=1"-sleep(10)-” 
  * page=1/1 
  * page=1/0 
  * page=1/sleep(10) 
  * page=1\

* **Testing for RCE** => Usually use **sleep 10**

  * page=1`sleep 10 
  * page=1|sleep 10 
  * page=1$(sleep 10) 
  * page=1%0asleep 10%0a

* **Testing for LFI =>**

  * page=1 
  * page=./1 
  * page=.//1 
  * page=././1 
  * page=../pages/1 
  * page=\1

* Remember =>

  * Finding server-side vulnerabilities is not about payloads
  * **It depended on how you process the context, how you find the TINY detail that no one notice on each request.**
  * **Most important thing** 
    *  learned all the tricks, techniques and skills as much as possible
    *  **Whatever the skill, trick and technique in Web Security or not. It will open your mind!**





---



### 5. By @uraniumhacker =>



* Approach the target as => real user AND not as an Attacker
* Don't jump directly **into finding all the bugs**
* Run recon tool which searching for vulnerabilities that already we found  before 
  * so that we do not keep looking for them in other programs
* Browsing the programs + spend  some hours using the website + make notes for **any special pages** =>
  * that could have good impacts.
* Use notebook => write notes there
  * These notes can  be use as a **map of the website** => based on that  can see important + critical part
* Spend more hour => to **visualizing bugs**
  * Very important
    * write certain parameters that might serious
    * what kind of bug it might have and which params
* Tools ? =>
  * Shodan, Censys and certificate tools to gather information about the company.
  * Sublist3r and HostileSubBruteforcer to gather subdomains.
  * Github to look for leaked keys, usernames, password etc..
  * And some Google dorks to find files in the company
  * Censys - specific search parameters
  * IFTT - as a trigger to detect execution of bXSS.
  * Google Dork - find special directory or pages that can help exploiting a bug.
  * Facebook & Google Ceritificate transparency - find old and new subdomains
  * Gitrob - to analyze github repos
  * HackerOne policy update to know of new potential targets
* Low hanging fruits are often times a duplicate
  * So, look for specific vulns in the code.
* Example =>
  * test an app and try to find as much IDORs
  * If IDOR in low impact case =>  test it at the end =>  This way =>
    * can reduce the number of duplicates and submit valid and high quality reports to companies.
* **Test for Server Side vulnerabilities** ?
  * RCE =>
    * see how a website functions.
    * If it is retrieve something from another website 
      * put  a open FTP Protocol and then check the log to see how that responds.
    * If any weird happens note down it and do other tests
    * Play with parameters
    * Look for **jenkins instances**
      * try to bruteforce sudomains or use Shodan to detect **Jenkins**
  * SQLI =>
    * retrieving something from the server ? 
      * do a recon on the website to see how it is structured and test different sql injections.
    * Common test => simple quote (') or backslash (/)



### References

[BugBountyForum Blog AMA](https://bugbountyforum.com/ama/)
