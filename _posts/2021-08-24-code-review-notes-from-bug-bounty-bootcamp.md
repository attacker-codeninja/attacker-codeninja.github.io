---
layout: post
title: My Notes on Code-Review from Bug Bounty Bootcamp 
subtitle: Code Review Notes
tags: [code review]
---

# Bug Bounty Bootcamp Notes - Chapter 22 : CONDUCTING CODE REVIEWS

---


> Before starting, Thanks to Vickie Li for making this awesome book on Bug Bounty

* Her Twitter Link -> https://twitter.com/vickieli7
* Bug Bounty Bootcamp Link -> https://www.amazon.in/Bug-Bounty-Bootcamp-Reporting-Vulnerabilities-ebook/dp/B08YK368Y3


## 1. The Fast Approach: grep Is Your Best Friend



* Using **grep** => Look for specific dangerous patterns like specific -> 

  * functions
  * strings
  * keywords
  * and coding patterns that are known to be dangerous.
  * Like => **eval() function**

* Focus  on the search for dangerous functions used on user-controlled  data.

  * Potential Dangerous Functions =>

  

| Language   | Function                                                     | Possible Vulnerability                                       |
| ---------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| PHP        | eval(), assert(), system(), exec(), shell_exec(), passthru(), popen(), backticks (``), include(), require() | RCE if used on unsanitized user input. <br />eval() and assert() execute PHP code in its input, <br /><br />while system(), exec(), shell_ exec(), passthru(), popen(), and backticks execute system commands. <br /><br />include() and require() can be used to execute PHP code by feeding the function a URL to a remote PHP script. |
| PHP        | unserialize()                                                | Insecure deserialization if used on unsanitized user input   |
| Python     | eval(), exec(), os.system()                                  | RCE if used on unsanitized user input.                       |
| Python     | pickle.loads(), yaml.load()                                  | Insecure deserialization if used on unsanitized user input.  |
| JavaScript | document.write(), document.writeln                           | XSS if used on unsanitized user input.<br />These functions write to the HTML document. <br />So if attackers can control the value passed into it on a victim’s page, the attacker can write JavaScript onto a victim’s page. |
| JavaScript | document.location.href()                                     | Open redirect when used on unsanitized user input. <br />**document.location.href()** changes the location of the user’s page. |
| Ruby       | System(), exec(), %x(), backticks (`code`)                   | RCE if used on unsanitized user input.                       |
| Ruby       | Marshall.load(), yaml.load()                                 | Insecure deserialization if used on unsanitized user input.  |





### Leaked Secrets and Weak Encryption



* Look for leaked secrets and credentials
* Developers make mistakes of hardcoding  secrets such as => **API keys, encryption keys, and database passwords into source code**
  * If Leak -> the attacker can use these credentials to access the company’s assets. 
* Grep keywords like => such as => 
  * key, secret, password, encrypt, API, login, or token
* Also **regex** based search for hex or base64 strings
  * It depends on the key format of the credentials we are looking for
  * Example => GitHub access tokens are lowercase, 40-character hex strings
    * A search pattern like **[a-f0-9]{40}** would find them in the source code
* **Entropy scanning** -> Can help us to  find secrets that don’t adhere to a specific format.
  * That means => find secrets that is in randomness formats [Thus unpredictable]
  * Example => **aaaaa** => weak entropy or low entropy
  * Example => A longer string with a larger set of characters, like **wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY** =>  has higher entropy.
  * **Entropy is therefore a good tool to find highly randomized and complex strings, which often indicate a secret**
  * Good Tool => TruffleHog => https://github.com/trufflesecurity/truffleHog/
    * searches for secrets by using both regex and entropy scanning
* **Weak Cryptography or Hashing Algorithm**
  * Hard - During Black Box Pentesting
  * Easy to spot - During Code Review
  * `Look for issues such as weak encryption keys, breakable encryption algorithms, and weak hashing algorithms`
  * Grep the names of weak algorithms like **ECB, MD4, and MD5**.
    * The application might have functions named after these algorithms, such as
      * **ecb(), create_md4(), or md5_hash()**
    * might also have variables with the name of the algorithm, like **ecb_key**, and so on
  * The impact of weak hashing algorithms depends on where they are used
  * `If they are used to hash values that are not considered security sensitive, their usage will have less of an impact than if they are used to hash passwords.`





### New Patches and Outdated Dependencies



* If  have access to the **commit** or **change history** of the source code
  * Focus  on the most **recent code fixes** and **security patches**
* Recent changes haven’t stood the test of time and are more likely to contain bugs. 
* Look at the protection mechanisms implemented and see if you can bypass them.
* Also search for the **program’s dependencies** and check whether any of them **are outdated**
* Grep for specific code **import functions** in the language we are using  with **keywords** =>
  * **import, require, and dependencies**
* Then research the versions they’re using to see if any vulnerabilities are associated with them in the CVE database
  * The OWASP Dependency-Check tool => https://owasp.org/www-project-dependency-check/





### Developer Comments



* We must also  look for 
  * **developer comments** and
  * **hidden debug functionalities**, and 
  * **accidentally exposed configuration files**
* Developers often forgot above things
* Developer comments can point out obvious programming mistakes. 
* We  can find developer comments by searching for the comment characters of each programming language
  * Python => **#**
  * Java / JavaScript / C++ => **//**
* Beside comments, we also need to search for =>  
  * **todo**, **fix**, **completed**, **config**, **setup**, and **removed** in source code





### Debug Functionalities, Configuration Files, and Endpoints



* Hidden debug functionalities often lead to privilege escalation, 
  * as they’re intended to let the developers themselves bypass protection mechanisms
* We can often find them at special endpoints
  *  so search for strings like HTTP, HTTPS, FTP, and dev.
  *  e.g. => http://dev.example.com/admin?debug=1&password=password # Access debug panel
* **Configuration files**
  * allows us  to gain more information about the target application and might contain credentials
  * Look for **filepaths** to configuration files in source code as well
  * Configuration files often have the file extensions 
    * **.conf, .env, .cnf, .cfg, .cf, .ini, .sys, or .plist**
* **Additional paths, deprecated endpoints, and endpoints **
  * These are endpoints that users might not encounter when using the application normally.
  * But , If found by attacker =>  lead to vulnerabilities such as **authentication bypass** and **sensitive information leak**, depending on the exposed endpoint.
  * search for strings and characters that indicate URLs like
    * **HTTP, HTTPS, slashes (/), URL parameter markers (?), file extensions (.php, .html, .js, .json), and so on.**





## 2. The Detailed Approach



>  Instead of reading the entire codebase line by line, try following strategies to maximize our efficiency



### 1. Important Functions



* When reading source code, focus on **important functions**, 
  * such as **authentication**, **password reset**, **state-changing actions**, and **sensitive info reads**. 
* Which parts of the application are important depend on the priorities of the organization.
* Also review how important components interact with other parts of the application.
* This will show us that => how an attacker's input can affect  different parts of the application.



### 2. User Input



* Another approach is to carefully read the code that processes user input.
* User Input =>  the entry points for attackers to exploit the application’s vulnerabilities
  * HTTP request parameters
  * HTTP headers
  * HTTP request paths
  * Database entries
  * File Reads
  * File Uploads
* Focusing on parts of the code that deal with user input will provide a good starting point for identifying potential dangers
*  Also must review to how the user input gets stored or transferred.
* Also, see whether other parts of the application use the previously processed user input.
* We, might find that the same user input interacts differently with various components of the application.





---



## Exercise: Spot the Vulnerabilities



* The more you look at vulnerable code, the more adept you will become at spotting bugs.





### Vulnerable Python Code =>



```
import requests
import urllib.parse as urlparse
from urllib.parse import parse_qs
api_path = "https://api.example.com/new_password"
user_data = {"new_password":"", "csrf_token":""}
def get_data_from_input(current_url):
 # get the URL parameters
 # todo: we might want to stop putting user passwords 1
 # and tokens in the URL! This is really not secure.
 # todo: we need to ask for the user's current password
 # before they can change it!
 url_object = urlparse.urlparse(current_url)
 query_string = parse_qs(url_object.query)
 try:
 	user_data["new_password"] = query_string["new_password"][0]
 	user_data["csrf_token"] = query_string["csrf_token"][0]
 except: pass

def new_password_request(path, user_data):
 if user_data["csrf_token"]: 2
 	validate_token(user_data["csrf_token"])
 resp = requests.Response()
 try:
 	resp = requests.post(url=path, headers=headers, timeout=15, verify=False, data=user_data)
 	print("Your new password is set!")
 except: pass


def validate_token(csrf_token):
 if (csrf_token == session.csrf_token):
 	pass
 else:
 	raise Exception("CSRF token incorrect. Request rejected.")

def validate_referer(): 3
 # todo: implement actual referer check! Now the function is a placeholder. 4
 if self.request.referer:
 	return True
 else:
 	throw_error("Referer incorrect. Request rejected.")
 
 if __name__ == "__main__":
 	validate_referer()
 	get_data_from_input(self.request.url)
 	new_password_request(api_path, user_data)
```



> Let's solve above code one by one



* First -> `api_path = "https://api.example.com/new_password"`
  * This api is use to set **new password**
* Second -> `{"new_password":"", "csrf_token":""}`
  * This is user data which used to set new password alongwith **csrf token**
  * it validates the CSRF token and performs the POST request to change the user’s password.
* Issue 1 => Developer's Comment -> 
  * It points out that the request to change the user’s password is initiated by a GET request, and both the user’s new password and CSRF token are communicated in the URL
  *  Transmitting secrets in URLs is bad practice because they may be made available to `browser histories, browser extensions, and traffic analytics providers.`
  * This creates the possibility of attackers stealing these secrets.
  * Also , from comments, we came to know that => `user’s current password isn’t needed to change to a new password!`
  * Also, from comments, we came to know that => ` CSRF referer check functionality is incomplete`
  * So, two types of CSRF protection are there,  but both of which are incomplete
* Issue 2 => validate_referer()  Function =>
  * The referer check function checks only if the **referer** is **present**, not whether the referer URL is from a legitimate site
* Issue 3 => if user_data["csrf_token"]: Condition =>
  * the site implements incomplete CSRF token validation
  * It checks that the CSRF token is valid only if the csrf_token parameter is provided in the URL
  * Attackers will be able to execute the CSRF to change users’ passwords by simply providing them with a URL that **doesn’t have the csrf_token parameter**, or **contains a blank csrf_token**
  * Example =>
    * https://example.com/change_password?new_password=abc&csrf_token= 
    * https://example.com/change_password?new_password=abc










