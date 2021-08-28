---
layout: post
title: My Notes on Hacking APIs from Bug Bounty Bootcamp 
subtitle: android hacking Notes
tags: [androing pentesting]
---

# Bug Bounty Bootcamp Notes - Chapter 24 - API HACKING

---



* I am much thankful to Vickie Li for making this awesome book. So, full credits go to Her
  * Her Profile -> https://twitter.com/vickieli7
  * Bug Bounty Bootcamp Book Link -> https://www.amazon.in/Bug-Bounty-Bootcamp-Reporting-Vulnerabilities-ebook/dp/B08YK368Y3



---

## 1. What Are APIs?



* Application programming interfaces (APIs)
* A way for programs to **communicate with each other**, and they power a wide variety of applications
  * So, an  API is a **set of rules** that allow one application to communicate with another.
  * Applications share data in a controlled way
* Using APIs, applications on the internet can take advantage of other applications’ resources to build more complex features.
  * Example -> Twitter’s API
  * Using this public API, Outside developers can  access Twitter’s data and actions
* `API endpoints often require certain parameters to determine which resource to return`
* APIs usually return data in **JSON** or **XML** format
* `JSON` -> 
  * A way in which Data is represented as plaintext
  * Used to transport data within web messages
  * Start and end with -> curly brackets -> `{ }`
  * Within these curly brackets, the properties of the represented object are stored in **key-value pairs.**
  * JSON objects can also contain lists or other objects
  * **Curly brackets denote objects**
  * **Lists are denoted with square brackets.**
* `How API Decides -> who can access data or execute actions ?`
  * APIs often `require users to authenticate` before accessing their services
  * users include `access tokens in their API requests` to **prove their identities**
  * Other times, users are required to use **special authentication headers or cookies**.
  * Then server use **credentials** which is send with request ->  to determine which resources and actions the user should access.





### 1.1 REST APIs



* Representational State Transfer (REST) API
* REST is one of the most commonly used API structures
* Most of the time, REST APIs return data in either JSON or plaintext format
* REST API users send requests to specific resource endpoints to access that resource
* Example -> to get user details send GET request like -> `https://api.twitter.com/1.1/users/show`
* REST APIs usually have defined structures for queries that make it easy for users to predict the specific endpoints to which they should send their requests.
* Example ->
  * To delete request -> https://api.target.com/users/delete
* REST APIs can also use various HTTP methods
  * GET is usually used to retrieve resources
  * POST is used to update or create resources
  * PUT is used to update resources
  * DELETE is used to delete them





### 1.2 SOAP APIs



* SOAP is an API architecture that is less commonly used in modern applications.

* `plenty of older apps and IoT apps still use SOAP APIs`

* SOAP APIs -> use XML -> to transport data

  * their message contains **a header and a body**

* Example -> 

  ```
  DELETE / HTTPS/1.1
  Host: example.s3.amazonaws.com
  
  <DeleteBucket xmlns="http://doc.s3.amazonaws.com/2006-03-01">
   <Bucket>quotes</Bucket>
   <AWSAccessKeyId> AKIAIOSFODNN7EXAMPLE</AWSAccessKeyId>
   <Timestamp>2006-03-01T12:00:00.183Z</Timestamp>
   <Signature>Iuyz3d3P0aTou39dzbqaEXAMPLE=</Signature>
   </DeleteBucket>
  ```

  * It deletes an S3 bucket named **quotes**.

* API **request parameters** are passed to the server **as tags within the XML document**.

* SOAP Response =>

  * ```
    <DeleteBucketResponse xmlns="http://s3.amazonaws.com/doc/2006-03-01">
     <DeleteBucketResponse>
     <Code>204</Code>
     <Description>No Content</Description>
     </DeleteBucketResponse>
    </DeleteBucketResponse>
    ```

* This response indicates that the bucket is successfully deleted and no longer found.

* SOAP APIs -> have service -> **Web Services Description Language (WSDL)**

  * which is used to describe the structure of the API and how to access it

* If we find **WSDL** ->

  *  use it to understand the API before hacking it

* How to Find ? ->

  * `.wsdl` or `?wsdl` to the end of an API endpoint
  *  or searching for URL endpoints containing the term **wsdl**

*  In the WSDL, we will be able to find a list of API endpoints we can test.





### 1.3 GraphQL APIs



* GraphQL is a newer API technology
* In this, with only **single API Call** ->
  * can get the resource fields which is needing 
  * and can fetch multiple resources 
* GraphQL is becoming increasingly common because of these benefits.
* `GraphQL APIs use a custom query language and a single endpoint for all the API’s functionality`
* These endpoints located at ->
  * /graphql
  * /gql
  * /g
* GraphQL has two main kinds of operations:
  * `queries`
    * fetch data - **just like the GET requests in REST APIs.**
  * `mutations`
    * create, update, and delete data - **just like the POST, PUT, and DELETE requests in REST APIs.** 
    * Mutations, used to edit data, can have arguments and return values.
* Learn about Graphql Syntax ->
  * https://graphql.org/
* Good Tool for Bug Hunters -> **introspection**
  *  allows API users to ask a GraphQL system for information about itself
  *  they’re queries that return information about how to use the API.
  * Example ->
    * `_schema`
    * `_type`
  * Introspection makes recon a breeze for the API hacker
  * Many organizations **disable introspection** in their GraphQL APIs.
    * To prevent malicious attackers from enumerating their APIs





### 1.4 API-Centric Applications



> Mean -> applications built using APIs

> Instead of retrieving complete HTML documents from the server, 
> API-centric apps consist of a **client-side component** that requests and renders data from the server by using API calls. 



* It means, API-Centric Applications -> have some components in client side -> which request data from server using API Calls and then render it



* Example -> FB Posts -> Mobile FB Applications use API Calls  
  *  to retrieve data about the posts from the server 
  * But **not retrieve whole html documents** and thus process is fast and reliable
* Many mobile applications are built this way
* With this approach , those web applications use it and having mobile applications as well then their time is save
* APIs allow developers to separate the app’s rendering and data-transporting tasks: 
  * developers can use API calls to transport data and then build a separate rendering mechanism for mobile, instead of reimplementing the same functionalities



> Seriously, this is very good approach for users and developers both.



* Problem ? -> Yes ->
  * as this thing is rising , so exposing data using APIs is also rising
  * APIs often `leak sensitive data and the application logic` of the hosting application
* Thus,  this makes API bugs a widespread source of security breaches and a fruitful target for bug hunters





---



## 2. Hunting for API Vulnerabilities





* **Postman** ->  is a handy tool that will help us to  test APIs
* **GraphQL Playground** -> an IDE for crafting GraphQL queries that has autocompletion and error highlighting.
  * https://github.com/graphql/graphql-playground/
  * `when introspection is disabled` => Use => https://github.com/nikitastupin/clairvoyance/





### 2.1 Performing Recon



* First -> know what application **expects**
* Then -> Use payloads accordingly  to manipulate its functionality. 
* For Graphql APIs -> ` might start by sending introspection queries to figure out the API’s structure. `
* For SOAP APIs -> `start by looking for the WSDL file`
* `If attacking a REST or SOAP API, or if introspection is disabled on the GraphQL API we are  attacking,  then -> start by enumerating the API`
* **API enumeration** =>
  * Identify **API Endpoints** as much as we can
  * Read API’s public documentation if available
    * Often contain detailed documentation `about the API’s endpoints and their parameters`
    * How to Find ?
      * Search on internet -> `company_name API or company_name developer docs.`
    * **NOTE** =>
      * official documentation doesn't contain `ALL API ENDPOINTS`
      * APIs often have public and private endpoints
      * **and only the public ones will be found in these developer guides.**
  * https://swagger.io/
    *  a toolkit developers use for developing APIs
    * So, also look for this while Enumeration
    * Swagger includes a tool for generating and maintaining API documentation that developers often use to document APIs internally. 
    * Sometimes company -> don't public their APIs Documentation -> BUT -> `forget to lock down internal documentation hosted on Swagger.`
    * Internet Search -> `company_name inurl:swagger`
    * This documentation often includes all 
      * **API endpoints, their input parameters, and sample responses.**
  * Now, next task is to `go through all the application workflows to capture API calls.`
    * Browse application with BURP proxy 
  * Next Task ->
    * Based on given endpoints -> PREDICT their structure and can try for other endpoints by assuming or predicting 
    * Example ->
      * If -> ``/posts/POST _ID/read and /posts/POST_ID/delete`   => exist
      * Then try -> `/posts/POST_ID/edit`
      * If -> ` /posts/1234 and /posts/1236` => Then try => `/posts/1235`
      * Might get result or not based on application
  * Next Task ->
    * Try to get more API Endpoints -> by reading  **JavaScript source code** or the **company’s public GitHub repositories**
    * Also ->  try to generate error messages in hopes that the API leaks information about itself.
      * try to provide unexpected data types or malformed JSON code to the API endpoints.
  * Next Task -> `Fuzzing techniques` ->
    * find additional API endpoints by using a wordlist
    * https://gist.github.com/yassineaboukir/8e12adefbd505ef704674ad6ad48743d/
  * Remember -> `APIs are often updated`
    * So, Even if Application not using OLD APIs, might there chance OLD APIs still working somewhere
    * `For every endpoint you find in a later version of the API, you should test whether an older version of the endpoint works`
    * Example =>
      * if the **/api/v2/user_emails/52603991338963203244** endpoint exists
      *  Try -> **/api/v1/user_emails/52603991338963203244** => Might work ?
    * Older API Version => Often contain `Vulnerabilities` => Which has been **fixed** in NEWER Version
    * Lesso Learnt => Check for Older Version of APIs while Recon
  * We must
    *  `understand each API endpoint’s functionality, parameters and query structure `
  * **The more you can learn about how an API works, the more you’ll understand how to attack it**
  *  Identify all the possible **user data input locations** for future testing
  * Look out for any **authentication mechanisms**, including these:
    * What access tokens are needed? 
    * Which endpoints require tokens and which do not? 
    * How are access tokens generated? 
    * Can users use the API to generate a valid token without logging in? 
    * Do access tokens expire when updating or resetting passwords?





> **NOTE: **
>
> Make sure to take lots of notes while RECON
>
> **Document the endpoints you find and their parameters.**





### 2.2 Testing for Broken Access Control and Info Leaks





* After RECON -> `start by testing for access-control issues and info leaks. `
* Most APIs use **access tokens** to determine the rights of the client
  * API issue **access token** to each API Client
  * and clients use these access token **to perform actions or retrieve data**
* If these **access tokens** => `aren’t properly issued and validated`
  * **attackers might bypass authentication and access data illegally. **
* Example ->
  * sometimes API tokens aren’t validated after the server receives them
  * Other times, API tokens are not randomly generated and can be predicted
  * some API tokens aren’t invalidated regularly
    * so attackers who’ve stolen tokens maintain access to the system indefinitely
* Another issue is `broken resource or function-level access control`
  * Sometimes API endpoints don’t have the same access-control mechanisms as the main application
  * Example =>
    * a user with a valid API key can retrieve data about themselves => Then Check =>
      * Can they also read data about other users?
      * Can they perform actions on another’s behalf through the API? 
      * Can  a regular user `without` admin privileges read data from endpoints restricted to admins?
  *  Separately from REST or SOAP APIs, the **GraphQL API** of an application may `have its own authorization mechanisms and configuration`
    *  This means that we can test for **access-control issues** on `GraphQL endpoints` even though the web or REST API of an application is secure.
    * Wow, this is new to me
    * These issues are similar to the IDOR vulnerabilities
  * Remember =>
    * an API offers multiple ways to perform the same action, and access control isn’t implemented across all of them
    * Example =>
      * a REST API has two ways of deleting a blog post
        * `sending a POST request to /posts/POST_ID/delete`
        * and `sending a DELETE request to /posts/POST_ID`
    * Now ask ourself => **are the two endpoints subject to the same access controls?**
* Another common `API vulnerability is information leaks`
  * API endpoints often return more information than they should, or than is needed to render the web page
* `Make a list of the endpoints that should be restricted by some form of access control.`
  *  For each of these endpoints, **create two user accounts with different levels of privilege:**
    * One Account -> should have access the Functionality 
    * 2nd Account -> `shouldn't` that Functionality to access
  * **Test whether you can access the restricted functionality with the lower-privileged account.**
  * If => lower-privileged user `can’t access` the restricted functionality
    *  try removing access tokens, 
    * or adding additional parameters like the cookie admin=1 to the API call
  * Also try to switch `HTTP Request Methods` => GET, POST,DELETE,PUT,PATCH
    * to see if access control is properly implemented across all methods or not
    * Example =>
      * if you can’t edit another user’s blog posts via a POST request to an API endpoint 
        * `can you bypass the protection by using a PUT request instead?`
  * Try to **view, modify, and delete** other users’ info by switching out user IDs or other user identification parameters found in the API calls.
  * If IDs used to identify users and resources are unpredictable, try to leak IDs through info leaks from other endpoints
  * In **GraphQL** 
    * a common misconfiguration is allowing lower-privileged users to modify a piece of data that they should not **via a mutation request**. 
    * Try to capture GraphQL queries allowed from one user’s account, 
      * and see if you can send the same query and achieve the same results from another who shouldn’t have permission
* While hunting for access control issues, closely study the data being sent back by the server
* Don’t just look at the resulting HTML page; 
  * dive into the raw API response, as APIs often return data that doesn’t get displayed on the web page
  * We  might be able to find sensitive information disclosures in the response body
  * Is the API endpoint returning any private user information or sensitive information about the organization?
  * Should the returned information be available to the current user?
  *  Does the returned information pose a security risk to the company?





### 2.3 Testing for Rate-Limiting Issues



* APIs often **lack rate limiting**
  * the API server **doesn’t restrict** the number of requests a client or user account can send within a short time frame.
  * Low  Severity Vulnerability BUT if attacker able to exploit it then can be Critical
* When it can be Critical ?
  * If we got an Critical Endpoint and if there is Lack of Rate Limiting - Then it can be critical
  * Example -> 
    * `send large numbers of requests to the server to harvest database information or brute-force credentials.`
* Endpoints that can be dangerous when not rate limited include =>
  * `authentication endpoints,` 
  * `endpoints not protected by access control,` 
  * `and endpoints that return large amounts of sensitive data`
* **How to test Rate Limiting?**
  * make large numbers of requests to the endpoint
  * Either use the **Burp intruder** or **curl** to send 100 to 200 requests in a short time
  * NOTE: => **Repeat the test in different authentication stages**
    * `because users with different privilege levels can be subject to different rate limits`
* **Careful during Rate Limiting**
  * Might  accidentally launch a **DoS attack** on the app by drowning it with requests.
  * Must ` time-throttle our requests`







### 2.4 Testing for Technical Bugs



* Sometimes developers forget to implement proper input validation mechanisms for APIs
* APIs are therefore susceptible to many of the other vulnerabilities that affect regular web applications too
* If an API endpoint can **access external URLs**, it might be vulnerable to **SSRF**
  * So, must check whether its access to internal URLs isn’t restricted.
* **Race conditions** can also happen within APIs
* Other vulnerabilities, like path traversal, file inclusion, insecure deserialization issues, XXE, and XSS can also happen
* If an API endpoint returns **internal resources via a filepath**, 
  * attackers might use that endpoint to **read sensitive files stored on the server.**
* If an API endpoint used for file uploads and doesn’t limit the data type that users can upload, 
  * attackers might upload malicious files, such as web shells or other malware, to the server
* APIs also commonly accept user input in **serialized formats such as XML.**
  * `insecure deserialization or XXEs can happen.`
* **RCEs via file upload or XXEs are commonly seen in API endpoints**
* If  an API’s URL parameters are reflected in the response => `XSS`
* For vulnerabilities like path traversals and file-inclusion attacks
  * **look out for absolute and relative filepaths in API endpoints and try to mess with the path parameters**
* If an API endpoint accepts XML input => `Insert an XXE payload into the request`
* We  can also utilize fuzz-testing techniques





---



## 3. SUMMARY



* API -> Application Programming Interface
  * Used to communicate between user and server Using Requests
* Get all Endpoints and enumerate them and test them for various vulnerabilities 
* Check for all HTTP Request Methods and switch between them
* Not only focus Endpoints for Web but also for Mobile
  * Might set protection for both differently and hence -> can be loophole there
* Various Methodologies are there for API Testing and all are written is above






