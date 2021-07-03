---
layout: post
title: Youtube Notes - Learn-with-darklotuskdb-Recon
tags: [recon, notes]
---

## Subdomain Enumeration



* Enumerate Subdomains Through Google Dorks
  * Tool -> https://github.com/darklotuskdb/sd-goo
* Facebook Certificate  Transparency Monitoring 
  * https://developers.facebook.com/tools/ct/search 
    * Subscription Tab  -> There click on Subscribe 
    * We will get email
    * We will get 1st to get notification about new subdomains 



## Shodan Recon



* ssl.cert.subject.cn:target.com
* hostname:target.com
* org:target.com
* We can use shodan cli
* domain + status 200 => org:target.com http.status:200
* http.component:AngularJS
* http.title:Grafana => Cve => CVE-2020-11110
* Net:ip/24
* Port:443





## Spyse Recon



* Moodle XSS
  * check dark lotus blog on it [darklotus.medium.com]
  * Advance Search -> Add Filter -> Technology -> Name -> Contains -> Moodle -> Apply
    * can use **equals to (=)**
* Hunting for CVEs =>
  * Advanced Search -> Add Filter ->  CVE ID or CVE Severity -> High,low,medium
  * Now for target -> Add Filter -> Domain Name -> equals to(=) or ends with -> target.com





## Open Redirect



* https://www.youtube.com/watch?v=xPkbqTpaU0k&t=17s
  * POC for -> How I was able to bypass Google redirect warning of other domains
  * Very cool trick
  * Google give warning but when using youtube no warning
  * now when use youtube link in google but with our desire place to redirect now youtube showing warning
  * Now url encode of & which is %26 and then then both warning bypassess and got url redirect of our desire result
  * Nice
* Easy way to find open redirect 
  * ?url=/dashboard -> ?url=.evil.com





## SSRF



* Internal Port Scanning via open redirect 
  * https://target.com/image?url=https://or.vul.com/next?redirect=http://localhost:8080
  * that means 3rd party domains which have open redirect vulnerability try
  * If 3rd party allow by our target then can try





## Bug Bounty Tips - Bot



* https://ifttt.com/home

