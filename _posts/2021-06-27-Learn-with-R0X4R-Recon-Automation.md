---
layout: post
title: Learn-with-R0X4R-Recon-Automation
subtitle: Recon Automation by R0X4R
tags: [recon,automation]
---

### Subdomain Enumeration



* subfinder
* sudomy
* chaos



> use **dnsx** => command to get live domains => for all active subdomains -> good for subdomain takeovers
>
> httpx => for protocol [443 and 80] only

### Port Scan



* Using Sublist3r - scan ports for 21 - ftp => annoymous:anonymous



> put ftp instead of http protocol



### Screenshot





### Vul Scan



* xss - custom payloads use for own 
  * not use alert => instead use **onprompt,confirm,prompt, eval**
  * **quickxss** tool use
* https://github.com/R0X4R/Pinaak
  * sqlmap
  * gf patterns
  * smuggler
  * Openredirex
  * kxss
  * qsreplace
  * nuclei
  * dalfox
  * anew
  * notify
  * urldedupe
  * gauplus
  * crlfuzz
  * ffuf
* Can automate above with GET Based not for POST Based
* Alternative to Burp Collaborator [pro] in Burp Community =>
  * Interactsh from pd 
  * Headers given by author and just paste url from interactsh to these headers
    * https://gist.github.com/R0X4R/d93177fd1a9ad9a3053153b82fa8ced8
  * Use this in Match and Replace burp
    * Add -> Type [Request header] -> Replace [add those headers here]
  * Good alternative for Burp Collaborator Everywhere
* Copy as ffuf command [burp extension]
  * Give requests and useful for FUZZ which we want parameters 
* Another burp extension -> send to -> suppose want to do sqlmap -> this will get command for sqlmap 
* BurpSuiteAutocompletion -> Burp Extension
* Mobile Apps Search Engine => betigil
* Another tool for Mobile Pentesting - apkleaks
* BB Tip => sing in with something [google,fb etc] -> redirect path => try xss [javascript:payload]
