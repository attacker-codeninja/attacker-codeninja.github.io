---
layout: post
title: My Notes on OWASP Top 10 for API from Kontra website
subtitle: Kontra OWASP Top 10 for API - Notes
tags: [api]
---


## Kontra OWASP Top 10 for API - Notes
  

---


### 1. Improper Assets Management

* Change higher api version to lower version => /api/**v3**/code TO /api/**v1**/code  => **Improper Assets Management**

* **TOKEN bypass** => check if can bruteforce token and see if proper protection mechanism applying or not

* If yes then check if old api version also having protection or not. Might be not 



### 2. Excessive Data Exposure

* Analyze Request and Response => and see what **sensitive data is exposure on these requests and response**

* Like while testing **password reset functionality** => we gave our email and => In response => We are getting

> our email and token **is exposing** directly in response => Vulnerable to **Exsessive Data Exposure**

### 3.  Broken Object Level Authorization 

* Learnt to keep an eye on request and response of API and if API is calling **userId** and give back result without validating it then vulnerable to Broken Object Level Authorization

* Like => /api/users/**123422**/order => Change the number to different => /api/users/**123423**/order => 

> and if without validating giving back result of that particular user then serious problem
>
>  > a malicious user gains access to a resource belonging to another user due to the lack of proper **authorization checks**.
>
>  > This attack can potentially occur in any application feature where **untrusted parameter values** are passed to the application without performing adequate **authentication** and **authorization** checks.


### 4. Broken User Authentication

* It refers to ***weaknesses*** in authentication mechanisms and associated application workflows 
* which can include authentication that *does not follow security design best practices*, authentication susceptible to brute-force attacks and credential stuffing, *lack of access token validation*, etc.

* In, this bypassed 2FA Token code , just because it is not having protection against brute-force


### 5. Lack of Resources & Rate Limiting

* Most common areas for User Enumeration => **Registration** or **Forgot Password** Functionality
* Keep an eye on **error messages** for such kind of Enumeration
* Based on error messages can try **bruteforce** for particular thing we needed and If **No Rate Limiting** there then serious issue


### 6. Broken Function Level Authorization

* During testing **userId** of the particular user to check for authorization => If  validating user properly Then =>

> * check for **HTTP Methods** Like => **PUT, OPTIONS, HEAD, DELETE,POST, PATCH** etc
* If this working then really serious issue and its its now not validating **HTTP Methods**

* > **Broken function-level authorization** is a vulnerability, that allows an attacker to utilize the **API endpoint** to which he is not supposed to have **access**. 

> Usually, the attacker figures out the **“hidden”** admin API methods and invokes them directly.



### 7. Mass Assignment

* **Mass Assignment** in which a malicious user modifies properties that they are not supposed to on the data objects stored in the backend, gaining unauthorized access or corrupting data as a result.

* Keep an eye on important properties like **isAdmin** etc

* Might be, during any functionality related to Authorization and Authentication process we see such type of properties 

* During changing Authorization Level or User from normal user to high privilege user or admin => Mean based on User Role Changes

> There might be no proper check by just changing these type of properties



### 8. Security Misconfiguration Part 1

* Testing for 2FA Verification Steps
> * In our own account see what functionality we have given for 2FA = Can we disable 2FA Verification Step there ?
>     * If yes => Now check for => Can we do **clickjacking attack** on that particular to disable 2fa verfication page ?
>       * Is there no protection for **clickjacking** ? Like  Is **x-frame-options** present or not in Request Header
>       * We can make  **Malicious HTML Page**
>         * Where, we need to put a **button** to lure **victim to click on that** [**accept**]
>         * And in **iframe** => we will put link of **disable 2fa verification ** => which is actually **hidden from victim**

* FIX : -> Must be protection there like =>
>     * X-Frame-Options  OR `Content-Security-Policy` header
>     * Both define whether or not a browser should be allowed to embed or render a page in an `<iframe>` element.




### 9. Security Misconfiguration Part 2


* Developer use **X-Frame-Options** to prevent clickjacking but application need to use iframe for their own particular target


* Hence, they make some logics here by allowing certain domains using **sameorigin** and not allowing bad domains by using **deny** in X-Frame-Options

* So, can say a **whitelist**

* Even developer use some **custom server side code** 

* Suppose developer use regex to prevent something but might be there is  mistake in that code ?

* Attacker now what do -> register with similarly domain name which match to **allowing origin subdomain**

> * e.g. => aakash.com allow => so attacker register as => xyzaakash.com => similar 
>     * This way we can bypass **X-Frame-Options** security header


> **Mitigation** =>
>   * Developer should to avoid to use REGEX and use CSP
>
>   * In their example => regular expressions could be completely avoided by using the **Content-Security-Policy** header instead of the **X-Frame-Options** header, the **ALLOW-FROM** directive of which is actually considered deprecated and does not work in modern browsers.
>   * Example =>
>   1. Enable on Nginx
> `add_header Content-Security-Policy "frame-ancestors 'self' https://*.coinpay.com https://*.coinexchange.com";`
>   2. Enable on Apache
> `header always set Content-Security-Policy "frame-ancestors 'self' https://*.coinpay.com https://*.coinexchange.com";`



### 10. SQL Injection


* Reviewing a web application's **HTML** source is a common technique used for mapping the application's structure and reveal potentially useful information such as **developer comments**, **hidden form** **fields**, **URL paths** that may otherwise not be visible in the browser.

* Need to check what request going to server which is related to database.

* Try to inject on many parameters whether it is POST or Cookie or User Agent or GET etc

* No necessary Error we see on page => Better rely on understanding behavior of response = Time delay or True False things

* Mitigation => Use **Prepared Statements** 

* **Prepared statements** prevent SQL Injection attacks by defining **placeholder** variables to safely pass **parameters** inside a SQL statement, which are automatically escaped at runtime.



### 11. Insufficient Logging & Monitoring

* tail -f /var/www/application.log

* In order to effectively mitigate against **Insufficient Logging & Monitoring** issues, developers must follow the following logging best practices:

>  1. Ensure all **login**, **access control failures**, and **server-side input validation failures** can be logged with sufficient **user context** to identify suspicious or malicious accounts, and held for sufficient time to allow delayed forensic analysis.
>  2. Ensure that logs are generated in a format that can be easily consumed by centralized log management solutions.
>  3. Ensure **sensitive actions** have an audit trail with integrity controls to prevent tampering or deletion, such as append-only database tables or similar.
>  4. Establish effective monitoring and alerting such that suspicious activities are detected and responded to in a timely fashion.

* If not monitor properly, they can't detect the leaked token  or any sensitive actions taken by attacker




### 12. XXE Injection

* Find the upload functionality

* **XXE** injection is a well-known XML attack that exploits the parsing of untrusted XML entities by a weakly configured **XML parser**, allowing an attacker to view arbitrary files on the application server filesystem.

* The `ENTITY` declaration is an XML tag used for loading additional data from an external resource. The syntax for loading an external `ENTITY` is `<!ENTITY entity-name SYSTEM "URL">`.

* Accessing like => &entity-name;

* If there no **security implementation during parsing xml file** => Then vulnerable to XXE

* In order to effectively mitigate against **XXE injection** attacks, developers must configure their application's **XML parsers** to disable the parsing of **XML** **eXternal Entities** (XXE) and **Document Type Definitions** (DTD) when parsing XML documents.

* If **DTDs** cannot be completely disabled, developers must disable the parsing of external general entities and external parameter entities when parsing untrusted XML files.

* Mitigation =>
> The `disallow-doctype-decl` set to `true` prohibits the usage of the **DOCTYPE declarations** in the XML document.
> 
> The `external-general-entities` set to `false` prohibits the usage of the **external general entities**.
> 
> The `external-parameter-entities` set to `false` prohibits the usage of the **external parameter entities**.



---
