---
layout: post
title: Learn Prototype Pollution in Series - Part 4
tags: [prototype pollution]
---



# Part 4 - Prototype Pollution Continue

---

> So, today we will focus on Prototype Pollution Attack



> ### What is Prototype Pollution?
>
> 
>
> > The Prototype Pollution attack ( as the name suggests partially) is a form of attack (**adding / modifying / deleting properties**) to the Object prototype in Javascript, leading to **logical errors**, 
> > sometimes leading to the execution of fragments Arbitrary code on the system (Remote Code Execution — RCE).
>
> > This vulnerability has been discovered since 2018 in some popular **JavaScript libraries, JQuery**, and recently discovered this vulnerability in the **Lodash library**, one of the popular libraries
>
> > So, It is a loophole that makes Attackers **able to change the properties of all objects in JS Code by manipulating  a single object**  using the **`__proto__`** but not limited to 



> JavaScript uses prototypes extensively to implement object inheritance. Basically, whatever you write into the prototype will be in the object instances



> ### Some Notes :
>
> * Prototype pollution can be exploited at the front end
>
> * Payloads can be sent in similar fashion to reflected and stored XSS, and affect the behaviour of the front end for the victim recieving them
>
> * The most famous example of prototype pollution vulnerabilities is probably from jQuery - a client side library.
>
> * Vulnerable Library doesn't mean your application is also vulnerable.
>
>   * We need to figure out  if we can able to exploit it or not
>
> * Understand what the application does with Javascript and than see if the vulnerability can be used somewhere.
>
> * Main feature of Prototype Pollution is 
>
>   * If we modify the prototype in one place
>   * It will affect how the objects work throughout the entire application.
>
> * Overwriting the prototype of a default javascript object is considered a bad practice for a long time
>
> * If the **prototype ** modified by attacker -> then it is **Prototype  Pollution**
>
>   * It happens due to some unsafe ***merge\***, ***clone\***, ***extend\*** and ***path assignment\*** operations on JSON objects obtained through user inputs.
>
>   * So, we need to make a note of these operations
>
>   * Not only , we can change the properties of one object but also we can even change or add properties to all the objects that run  in our JS Code
>
>   * e.g -> 
>
>     ```js
>     var a1 = {}; // empty object
>     var a2 = {}; // empty object
>     
>     a1.__proto__.pwn = "Pwn by Aakash";
>     console.log(a2.pwn);
>     
>     Result -> Pwn by Aakash
>     
>     See -> we changed the obj a1 but we called obj a2 and still we got the result
>     ```
>
> 
>
> 
>
> * So, we must understand those unsafe keywords about their nature i.e. functionality 
>
>   * **merge** => use to merge 2 objects together 
>   * The merge operation iterates through the source object and will add whatever property that is present in it to the target object
>   * Remember -> This things makes things complicated if the source is supplied by a **3rd party.**
>
> * Severity ?
>
>   * Depend on our payload and application
>   * If, able to bypass authorisation then impact is high
>   * we can crash the application
>   * If **node.js** = **exec or eval** => can lead to RCE
>   * So ->  it can cause other dangerous vulnerabilities such as **RCE, IDOR, Bypass Auth and other vulnerabilities, namely XSS**
>
> * **How many libraries are affected?**
>
>   *  20+ known vulnerabilities across different packages that run on Node.js and the browser.
>   *  Like, **lodash, jquery, hoek , npm etc**



> ### How Attacker pollute  our prototype ?
>
> > Using ` __proto__` property
>
> ```js
> // Common Payload =>
> 
> {
>   "foo": "bar",
>   "__proto__": {
>                   "polluted": "true",
>                }
> }
> ```
>
> 
>
> So, If there is no **sanitization**  on **merge** operation, then it will pollute our object properties





## Difference between `__proto_` and prototype



> * `__proto__` is the actual object that is used in the lookup chain to resolve methods
> * `prototype` is the object that is used to build `__proto__` when we create an object  with **new**
> * So **proto** is the actual object that is saved and used as the prototype while **prototype** is just a blueprint for **proto** which, is infact the actual object saved and used as the protoype.
> * Hence **myobject.prototype** wouldnt be a property of the actual object because its just a temporary thing used by the constructor function to outline what myobject.**proto** should look like.
> * So proto is Javascript's way to reference to the original prototype.
> * Remember, Every function  is born with a prototype object
>   * It is used as the shared prototype (parent) of the objects created by **this** function (invoked as constructor function)
> * The prototype is initially **an empty object**
>   * we can add members to it.
>   * Such all its **children**  have access to these members (properties, methods) as well
> * So, **prototype** is just a property  on every function in JavaScript  with JS Engine adds for us.
> * Inheritance vs Delegation 
>   * **Inheritance **  -> COPY properties FROM
>   * **Delegation **  ->  LINK properties TO
>   * All Objects ultimately **delegate** to **Object.prototype**
>
> 
>
> > So, 
> >
> > `__proto__` -> property of all objects [**except  Object.create(null)**]
> >
> > **prototype ** -> property of all  **constructor ** functions 
> >
> > **constructor ** -> property of all  **prototype ** objects 
> >
> >
> > i.e ->
> >
> > Object.prototype.constuctor === Object // true
> >
> > Function.prototype.constructor === Function // true
> >
> > Function.constructor.prototype === Function.prototype

> As, we know -> prototype is a property of Javascript function => Mean => 
>
> > that you do not have to add it, every Javascript function you have, automatically gets it.

> ### Conclusion - proto vs prototype
>
> > *The prototype is used to create __proto__* Simple!
> >
> > > The subject of prototype is related to Javascript objects and object creation and relation
>
> > `__proto__` is an internal property of an object, pointing to its prototype.
>
> > *Instances* have **__proto__**, *classes* have **prototype**.
>
> > __proto__ is the actual object that is used in the lookup chain to resolve methods.
> >
> > It is a property that all objects have
> >
> > This is the property which is used by the JavaScript engine for inheritance
>
> > **prototype** is a property belonging only to functions.
> >
> > It is used to build __proto__ when the function happens to be used as a constructor with the <i>new</i> keyword
>
> > This is like 
> >
> > "if I don't have a property or method that is requested of me, go to the object that this field references my <i>prototype</i> and look for it". 
> > Since that object will also have this "prototype" field as well, this becomes a recursive process. It is what is meant by a <i>prototype chain.</i> "
>
> 



> ### Best Answer =>
>
> To explain let us create a function
>
> ```js
>  function a (name) {
>   this.name = name;
>  }
> ```
>
> When JavaScript executes this code, it adds `prototype` property to `a`, `prototype` property is an object with two properties to it:
>
> 1. `constructor`
> 2. `__proto__`
>
> So when we do
>
> `a.prototype` it returns
>
> ```js
>      constructor: a  // function definition
>     __proto__: Object
> ```
>
> Now as you can see `constructor` is nothing but the function `a` itself and `__proto__` points to the root level `Object` of JavaScript.
>
> Let us see what happens when we use `a` function with `new` key word.
>
> ```js
> var b = new a ('JavaScript');
> ```
>
> When JavaScript executes this code it does 4 things:
>
> 1. It creates a new object, an empty object // {}
> 2. It creates `__proto__` on `b` and makes it point to `a.prototype` so `b.__proto__ === a.prototype`
> 3. It executes `a.prototype.constructor` (which is definition of function `a` ) with the newly created object (created in step#1) as its context (this), hence the `name` property passed as 'JavaScript' (which is added to `this`) gets added to newly created object.
> 4. It returns newly created object in (created in step#1) so var `b` gets assigned to newly created object.
>
> Now if we add `a.prototype.car = "BMW"` and do `b.car`, the output "BMW" appears.
>
> this is because when JavaScript executed this code it searched for `car` property on `b`, it did not find then JavaScript used `b.__proto__` (which was made to point to 'a.prototype' in step#2) and finds `car` property so return "BMW".



> ### Example =>
>
> ```js
> var fooFunction =  function() {
> //
> }
> 
> console.log(fooFunction.prototype); // does not print undefined so its there
> console.log(typeof fooFunction.prototype) // prints "object"
> 
> 
> ----
> 
> var regularObj = {
>       id : 1,
>       type : 'regularObject'
> }
> 
> console.log(regularObj.prototype) // prints undefined
> 
> 
> 
> which confirms that prototype property is only available by default to Functions.
> 
> 
> ```





---



> ## Prototype Chain
>
> 
>
> > prototype chain as a chain of ***command\*** request. 
>
> > Its a chain that links you to where to go in other to get your requests answered. 
>
> > And if you do not get an answer, it leads or points you to the next place where you can make the request again. 
>
> > Think of a typical support call centre. A call comes in and a question is asked. if the call centre operative knows the answer, it is given. If not, most likely, the call would be directed to another department who would be better suited to provide the answer. This process of forwarding the request in other to get it answered may very well go on until an answer is provided or all possible source for an answer has been exhausted and at that point, the caller is told that his/her question/request can not be answered.
>
> > similar happens when you have an object and you call a property on it in Javascript.
>
> 





---



### Summary



> **What is a prototype?**
>
> A prototype is an object from which other objects inherit properties
>
>
> 
> **Can any object be a prototype?**
>
> Yes.
> 
> 
>
> **Which objects have prototypes?**
>
> Every object has a prototype by default. Since prototypes are themselves objects, every prototype has a prototype too. (There is only one exception, the default object prototype at the top of every prototype chain.)
>
> 
>
> **what is an object ?**
>
> An object in JavaScript is any unordered collection of key-value pairs. If it’s not a primitive (undefined, null, boolean, number or string) it’s an object.
>
> 
>
> **Old vs New ?**
>
> `__proto__` -> Old one and IE Supports it
> ***Object.getPrototypeOf(object)*** -> New one and Supports  Firefox, Safari, Chrome and IE9 and introduced by ECMA 5
>
> ```js
> var a = {};
>  
> Object.getPrototypeOf(a); //[object Object]
>  
> a.__proto__; //[object Object]
>  
> //all browsers
> //(but only if constructor.prototype has not been replaced and fails with Object.create)
> a.constructor.prototype; //[object Object]
> ```
>
>  
> 
> 



## References



* https://medium.com/node-modules/what-is-prototype-pollution-and-why-is-it-such-a-big-deal-2dd8d89a93c
* https://levelup.gitconnected.com/javascripts-proto-vs-prototype-a21ec7f25bc1
* https://stackoverflow.com/questions/9959727/proto-vs-prototype-in-javascript
* https://www.geekabyte.io/2013/03/difference-between-protoype-and-proto.html
* https://javascriptweblog.wordpress.com/2010/06/07/understanding-javascript-prototypes/
