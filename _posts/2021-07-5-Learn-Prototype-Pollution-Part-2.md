---
layout: post
title: Learn Prototype Pollution in Series - Part 2
tags: [prototype pollution]
---



# Part 2 - Prototype Pollution Continue



---



In 1st Part We learned about objects,constructors, functions, and prototype.

But I still want to clear every basics and concepts related to prototype and objects before diving into attack i.e. Prototype Pollution 

So, lets learn again about the same concept.



### Table of Contents =>



- [x] Objects
- [x] Constructor 
- [x] Prototypes
- [x] Summary
- [x] References



---



> ### Object =>
>
>
> Object is like **container** which contains **collections** of **values** or **properties**
>
> This property structure is "**key:value**"
>
> Curly braces => **{}** ==> Use for Objects => 
>
> ```js
> var a = {
> 	firstName: 'Aakash',
> 	lastName: 'Choudhary',
> 	age: 30,
> 	country: 'India'
> }
> ```
>
>
> These => **firstName,lastName,age,country** => is **properties**
>
> Just like we access array using their index[0-1] similarly we can access objects using **properties **
>
> #### How we access it ?
>
> ```js
> console.log(a) 
> 
> Result =>
> 
> {firstName: "Aakash", lastName: "Choudhary", age: 30, country: "India"}
> age: 30
> country: "India"
> firstName: "Aakash"
> lastName: "Choudhary"
> __proto__: Object
> 
> ----
> 
> //suppose want to particular property =>
> 
> console.log(a.firstName) => Aakash
> 
> //Using console.log => will give result on console
> 
> //Another way => document.write(a) => Print on page
> 
> ```
>
> 
>
> Now remember => this **a** => is actually **object** which have collections of values or properties like firstName etc
>
> And this (a.firstName) => **dot(.)** => is called **dot notation** which is use to access object's properties
>
> Also, we can use **arrays** in objects and also we can use **functions** in objects
>
>
> #### How we can use arrays and functions ?
>
> ```js
> var a = {
> 	array : ['Aakash','loves','sharing','knowledge'],
> 	fun : function(){
> 		return 'power';
> 	}
> }
> 
> console.log(a)
> 
> {array: Array(4), fun: ƒ}
> array: (4) ["Aakash", "loves", "sharing", "knowledge"]
> fun: ƒ ()
> arguments: null
> caller: null
> length: 0
> name: "fun"
> prototype: {constructor: ƒ}
> __proto__: ƒ ()
> [[FunctionLocation]]: VM1176:3
> [[Scopes]]: Scopes[1]
> __proto__:
> constructor: ƒ Object()
> hasOwnProperty: ƒ hasOwnProperty()
> isPrototypeOf: ƒ isPrototypeOf()
> propertyIsEnumerable: ƒ propertyIsEnumerable()
> toLocaleString: ƒ toLocaleString()
> toString: ƒ toString()
> valueOf: ƒ valueOf()
> __defineGetter__: ƒ __defineGetter__()
> __defineSetter__: ƒ __defineSetter__()
> __lookupGetter__: ƒ __lookupGetter__()
> __lookupSetter__: ƒ __lookupSetter__()
> get __proto__: ƒ __proto__()
> set __proto__: ƒ __proto__()
> ```
>
> 
>
> One thing from objects I had question about **this** . Why we use **this.** like =>
> **this.firsName** in function?
>
> > Let's understand this by example =>
> >
> > ```js
> > var a = {
> > 	fName = 'Aakash',
> > 	lName = 'Choudhary'
> > }
> > ```
> >
> > 
> >
> > Now, I want to acces **fName and lName** property in function =>
> >
> > ```js
> > var a = {
> > 	fName : 'Aakash',
> > 	lName : 'Choudhary',
> >   fullName : function{
> >   	return this.fName + " " + this.lName
> >   } 
> > }
> > 
> > 
> > 
> > ```
> >
> > 
> >
> > So, **this** use for Object **a**  mean instead of using **a.fName** we use **this.fName**
> >
> > Mean call **fName** property from **a** object to function we created using **this** property 
> >
> >
> > **this** used from the owner of variable 
> >
> > variable => **fName**
> > owner => **a** [object]
>
> 
>
> Now, why I am telling above things here ? Why I am telling about **functions** ?
>
> Because like variable is a term as **properties** for **Object** Similarly **function** is a term as **methods**
>
> So, we can call properties like => **a.fname**
> Likewise we can call methods like => **a.fullName()**
>
>
> Got the difference ? 
>
> Variable => Properties => dot notation simple [a.fName] (without **()** )
> Function => Methods => dot notation with **()** 
>
>
> ---
>
> 
>
> #### How to create Object ?
>
> ```js
> var a = new Object() => using new we created Object in the variable a
> 
> Example =>
> 
> var person = new Object();
> 
> person.fName = 'Aakash';
> person.lName = 'Choudhary';
> 
> 
> 
> // We can access it like below as well =>
> 
> console.log(person['fName'])
> or
> console.log(person.fName)
> ```



> ### Note
>
> We, can use Objects inside Objects
>
>
> And we see we can create objects in 2 ways
>
> 1. Var a = new Object() => **This is called Object Constructor**
> 2. Var a = {} => **This is called Object Literal**



> ####  Now What is **Constructor ** ?
>
> 
>
> > A JavaScript constructor method is a special type of method used to initialize and create an object. It is called when memory is allocated for an object
>
> > The class of which the constructor is made, if when the object of the same class is created, then it is automatically called.
> >
> > Constructor is similar to its class name, but Constructor has no return type.
>
> 
>
> > Object constructors require functions and their parameters.
> >
> > **this** keyword; Returns a reference to the current object.
> >
> > Here the value of each parameter will be assigned to the current object with this keyword.
> >
> > More than one object is created in short form through the Object Constructor.
>
> 
>
> > Constructors are just functions that describe how to create an Object.
>
> 
>
> Few Conventions of Constructor function are
>
> 1. Define with a capitalized name to distinguish them from other functions
> 2. Constructors use the keyword `this` to set the properties of the object they will create.
> 3. Constructors define properties and behaviors instead of returning a value!
>
> **Note:** The constructor function is JavaScript's version of a class. 
>
> **Note:** Constructor function doesn't return anything explicit.
>
> 
>
> 
>
> > So, the `new` operator is used when calling a constructor.
> > This tells JavaScript to create a new instance of Object
>
> > **Without the new operator, `this` inside the constructor would not point to the newly created object, giving unexpected results.**
>
> 
>
> **The advantage of constructors is that objects created with the same constructor contain the same properties and methods. **
>
> So, when we want to create multiple similar objects, we can create our own  constructors and therefore our own reference types









> But, now question arise why we need such things ? [ Objects, Functions] ?
>
>
> 
> As, we know Obeject is primitive data type, they[objects] are used to describe things with a lot of detail  -> and this detail is call **properties** . The properties allow us to describe our objects.
>
> 
>
> **Functions** are for reusable code. You don't want to write the same code over and over if you're using it in multiple places. This is D.R.Y (don't repeat yourself) method. 
>
> **Objects** are use to store key-value data. Let's say you create an app that stores users. And object would be the best way to store it since you'll probably have properties like name, email, password, etc
>
> 
>
> **Credit : masterpanda**



> Suppose we have this code =>
>
> ```JS
> const person = {
>     name: "Aakash",
>     interest: ["Hacking","Dancing"],
>     greet: function() { 
>     return "Welcome " + person.name
>    }      
> }
> person.greet() // "Welcome Aakash"
> ```
>
> 
>
> Now, suppose there are 1000 Users , we want to greet. Then to avoid Repeating steps again and again we replace **person.name** with **this.name**
>
> This => **this** is a keyword which is refers to the object person hrough which the `greet` method is associated with.
>
> Therefore `this` keyword helps to reuse code more easily.





> ```JS
> // some more ways to create Objects
> // 1st way - Object Literal
> // 2nd way - Constructor Function
> 
> // Using Object Constructor Function
> let person1 = new Object()  //creates a empty Object, you can then add properties and methods into this with help of dot notation!
> 
> //Passing Object literal
> 
> let person1 = new Object({
> name: 'Chris',
>   age: 38,
>   greeting: function() {
>     alert('Hi! I\'m ' + this.name + '.');
>   }
> })
> 
> // Using create(), we can create Objects without first creating the constructor Function
> //With it, you can create a new object, using an existing object as the prototype of the newly created object.
> 
> let person2 = Object.create(person1);
> //Remember `person1` is an Object already created which is passed inside!
> //One limitation of create() is that IE8 does not support it. So constructors may be more effective if you want to support older browsers.
> ```





> Enough about it. Now time for Prototype 





### Prototype 



* JavaScript is an object-based language based on prototypes
* **Prototypes are the mechanism by which JavaScript objects inherit features from one another**
* We can add multiple properties in Prototype 
* **Drawback of Adding Prototype properties manually**
  * it erases the `constructor` property.
  * Solution ?
    * whenever a prototype is manually set to a new object, remember to define the constructor property



> ```js
> Person.prototype = {
>   constructor: Person,
>   eyes: 2, 
>   greeting: function() {
>     console.log("Welcome");
>   }
> ```
>
> 



> What does this mean ?[JS is based on Prototype]
>
> This means that whenever we create a function, JavaScript adds an internal property inside the function which is also known as **Prototype Object.**
>
> 
>
> This means we can attach methods and properties which enables all other objects to inherit these methods and properties as well.
>
> 
>
> In JavaScript, a prototype can be used to add properties and methods to a constructor function
>
>
> Objects inherit properties and methods from a prototype
>
> Mean -> **All JavaScript objects inherit properties and methods from a prototype.**



> Remember => We **can't**   add a new property to an existing object constructor
>
> JavaScript don't have feature of **inheritance**, So, JS Use **Prototype** for **inheritance**



> ### Why we use Prototype ?
>
> 
>
> > In existing **objects** or **object constructor ** => we want to add **property** and **methods**
>
> > And **JavaScript  Prototype ** property allows us to add new properties to object constructors and also new methods to object constructors
>
> How? => 
>
> **object.prototype.property="value"**
>
> **object.prototype.method=function(){ return this.property;}**



> #### NOTE:
>
> Prototype only **modifies** => **own prototypes**



> ### Example =>
>
> ```JS
> // Constructor function
> 
> function Person(){
> 	this.name = 'Aakash',
> 	this.hobby = 'Hacking',
> 	this.job = 'Yes'
> }
> 
> // add  a property
> 
> Person.prototype.language = 'Hindi';
> 
> // create an object
> 
> var person2 = new Person(); => // Now person2 variable inherit all the functionalities of Person object
> 
> console.log(person2.hobby) => //Hacking
> 
> 
> // Changing the property value of Prototype
> Person.prototype.hobby = 'Coding'
> 
> or
> 
> Person.prototype = {'hobby' : 'Coding'}
> 
> // create new object
> 
> var person3 = new Person();
> 
> console.log(person3.hobby) => Coding
> console.log(person2.hobby) => Hacking
> 
> 
> ```
>
> 
>
> See, **person2** => still having same  result but **person3** have changed prototype value





> #### Understand Where an Object's Prototype Comes From
>
> 
>
> Just like people inherit genes from their parents, an object inherits its prototype directly from the constructor function that created it. For example, here the `Person` constructor creates the `person` object:
>
> 
>
> ```JS
> function Person(name) {
>   this.name = name;
> }
> 
> 
> let person = new Person("Aakash");
> 
> ```
>
>
> The `person` Object inherits its prototype from the `Person` constructor function. You can show this relationship with the `isPrototypeOf` method:
>
> ```JS
> Person.prototype.isPrototypeOf(person);  // returns true
> 
> ```





* Almost every function (with the exception of some built-in functions) has a `prototype` property that is used during the creation of new instances.
* That prototype is shared among all of the object instances, and those instances can access properties of the prototype
* Browsers implement prototypes through the `__proto__` property

---



### Prototype Chain



> ### Note : 
>
> an object's prototype itself is an object.
>
> So, a prototype is an object, and a prototype can have its own prototype
>
> i.e  the prototype of `Person.prototype` is Object.prototype
>
>
> It's mean we can use inbuilt **property** of **prototype**
>
> 
>
> This thing is called Prototype Chain
>
> Like -> person1 -> inherit from Person prototype -> which again inherits from Object prototype 





---





### Summary =>



* In JavaScript every function is actually a Function object

* A functions is still an object (inherits from `Object`)

* ```js
  hasOwnProperty` is a method of `Object
  ```

* > An object is a container of properties, where a property has a name and a value.

* Properties =>

  * A property has a **name** and a **value**.
  * A property name can be any string, including the empty string.
  * All property names are converted to string
  * Properties can also be assign by variable name (shorthand)
  * **Properties** are like nouns. They have a value or state.

* Methods =>

  * When a property has a function as a value, it's called a method.
  * **Methods** are like verbs. They perform actions.

* There are two ways to create an object:

  - Using literals
  - Using `Object` constructor function

* If a function is invoked with the `new` prefix, then a new object will be created. It's called the **constructor invocation pattern**.

* When invoked with `new` keyword, the function creates a new object

* Invoked with `new` keywords, **any function can be a constructor**.

* > `Object` is a function.
  >
  > As a function, `Object` is an object, which can contain properties and methods.
  >
  > As a function, `Object` is a **constructor** and can be invoked with **new** keyword to create new instances.
  >
  > As a constructor, `Object` contains a prototype object that will be linked to any instances of `Object`.

* Every object is linked to a **prototype** object from which it can **"inherit"** properties.

* All objects created from object literals (or constructor) are linked to `Object.prototype`, an object that comes standard with JavaScript.

* ```js
  To get the prototype of an object:
  
  Object.getPrototypeOf(obj);
  ```



* Methods are stored in the prototype ( `Array.prototype`, `Object.prototype`, `Date.prototype`, `Function.prototype`, `Promise.prototype`etc.).

* Chaining -> arr->Array.prototype->Object.prototype

* Primitives also store their methods in the prototype object-wrappers: `Number.prototype`, `String.prototype`, `Boolean.prototype`.

  * Only values `undefined`and `null`no wrapper objects.

* **Changing Prototypes ** 

  * > Any changes to the prototype will be immediately visible to all objects referencing this prototype.

* > - With the __proto__ property of Prototype Object, it has information on the parent object that created it.

* ```js
  Object.prototype = {
    hasOwnProperty: function(){...}, // If an object contains property
    isPrototypeOf: function(){...}, // If object is in the prototype
    toString: function(){...}, // Get string representation of the object.
    valueOf: function(){...}, //  Get primitive value of the specified object.
    /* ... */
  }	
  ```

  

---



### References =>



* https://medium.com/geekculture/javascript-prototype-f2c451029ec0
* https://payalkherajani.hashnode.dev/all-in-one-oops-in-js
* https://dev.to/arnavaggarwal/master-javascript-prototypes--inheritance



