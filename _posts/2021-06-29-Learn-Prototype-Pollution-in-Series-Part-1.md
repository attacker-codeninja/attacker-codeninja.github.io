---
layout: post
title: Learn Prototype Pollution in Series - Part 1
tags: [prototype pollution]
---

# Vulnerability Focus - Prototype Pollution - Part 1



---



## What is prototype pollution ?



### In this Part , we are learning very basics



> JavaScript is **prototype-based**  i.e. JS is prototype-based language

> Before understanding prototype pollution must know about prototype and Objects

> Quick Recap about JS Objects =>
>
> * JS Data Types => 8  => [String, Number, BigInt, Boolean,undefined, null, Symbol, Objects]
> * Primitive Data Types => Except Object all 7 are Primitives and value is fixed in this type
> * Object is -> Non Primitive Data Type
> * In Object we can store multiple collections of data.
> * In JS,  we don't need to create classes when creating objects

> Now Learn about **Prototype** :
>
> * We can create an object in JavaScript using an object constructor function.
>
> ```js
> // constructor function
> function Person () {
>     this.name = 'Aakash',
>     this.age = 30
> }
> 
> // creating objects
> const person1 = new Person();
> const person2 = new Person();
> ```
>
> `function Person()` is an object constructor function. 
>   person1` and `person2 => 2 Objects
>
>
> In JS => Every Function and Object => Has property named **prototype** by default.
>
> Example =>
>
> ```js
> function Person () {
>     this.name = 'Aakash',
>     this.age = 30
> }
> 
> const person = new Person();
> 
> // checking the prototype value
> console.log(Person.prototype); // { ... }
> 
> //Person.prototype => used to access the prototype of a Person constructor function
> ```
>
> 
>
> Now, If we are beginner and learner and don't know what constructor is then => 
>
> > Constructor is a function which is used to create **Objects**
> >
> > To create an object from a constructor function, we use the `new` keyword.
> >
> > So, new Person() => here we created constructor object
>
> 
>
> > Also, in function we use **this** keyword => actually **this** refers to the object when the object is created.
>
>
> In JS , we must know **methods** and **properties**
>
> > In JavaScript , poperties is value realted to Object
> >
> > Generally **properties** can be change,add or delete and some can read only
> >
> > In JS Objects => Named Value => are called properties
> >
> > e.g. => Propert [name] have Value[Aakash]
> >
> > We can add another property to object like => Person.love="Maa"
> >
> > Likewise, we can delete like => delete Person.age or delete Person["age"]
> >
> >
> > **Prototype** is also **property**
>
> > JavaScript **methods** are actions that can be performed on objects
> >
> > A JavaScript method is a property that contains a function definition.
> >
> > Like, what we want from our object ? 
> >
> > Example =>
> >
> > we create a button using javascript + html => 
> >
> > * Button is object 
> > * Button name => property
> > * Clicking on that Button => action => so clicking is method



### More on Prototype

> So, far we learned about Objects , properties and methods
>
> Now learn about prototype 
>
> * In JavaScript, a prototype can be used to add properties and methods to a constructor function. 
> * And objects inherit properties and methods from a prototype
>
>
> Example =>
>
> ```js
> // constructor function
> function Person () {
>     this.name = 'Aakash',
>     this.age = 30
> }
> 
> // creating objects
> const person1 = new Person();
> const person2 = new Person();
> 
> // adding property to constructor function
> Person.prototype.gender = 'male';
> 
> // prototype value of Person
> console.log(Person.prototype);
> 
> // inheriting the property from prototype
> console.log(person1.gender);
> console.log(person2.gender);
> ```
>
>
> we have added a new property `gender` to the `Person` constructor function using: **Person.prototype.gender = 'male';**
>
>
> Then object `person1` and `person2` inherits the property `gender` from the prototype property of `Person` constructor function.
>
> Hence, both objects `person1` and `person2` can access the gender property.
>
> So, Prototype is used to provide additional property to all the objects created from a constructor function.

> Likewise we can also add **methods** to prototype like we added properties 
>
> ```js
> // adding a method to the constructor function
> Person.prototype.greet = function() {
>     console.log('hello' + ' ' +  this.name);
> }
> 
> person1.greet(); // hello Aakash
> person2.greet(); // hello Aakash
> ```



> greet => this is method which we added to Person constructor function **using a prototype.**
>
> and likewise => we can add many methods and properties using **prototype**



> **Point to Note:**
>
> If a prototype value is changed, then all the new objects will have the changed property value.
>
> All the previously created objects will have the previous value
>
> So, newly created prototype value => affected new Object but **not Old Objects**
>
>
> Example =>
>
> ```js
> // constructor function
> function Person() {
>     this.name = 'John'
> }
> 
> // add a property
> Person.prototype.age = 20;
> 
> // creating an object
> const person1 = new Person();
> 
> console.log(person1.age); // 20
> 
> // changing the property value of prototype
> Person.prototype = { age: 50 }
> 
> // creating new object
> const person3 = new Person();
> 
> console.log(person3.age); // 50
> console.log(person1.age); // 20
> ```



> ### Good Practice for Developers
>
>
> You should not modify the prototypes of standard JavaScript built-in objects like strings, arrays, etc. It is considered a bad practice.



> We can access Prototype property like =>
>
> ```js
> // adding a prototype
> Person.prototype.age = 30;
> 
> // accessing prototype property
> console.log(person.__proto__);   // { age: 30 }
> ```





## Prototype at a Glance or Summary =>



* Prototypes are the mechanism by which JavaScript objects inherit features from one another.

* Prototype Property allows you to add properties to any object

* JavaScript objects inherit the property of their prototype. 

* The delete keyword does not remove inherited properties, but if you delete a prototype property, it will affect the object inherited from the prototype.

* JS is **prototype-based language** . WHY ?

  * to provide inheritance

* objects can have a **`prototype` object**, which acts as a template object that it inherits methods and properties from.

* An object's prototype object may also have a prototype object, which it inherits methods and properties from, and so on.

  * And this is called **prototype chain**

* > ```
  > __proto__  property => Prototype 
  > ```
  >
  >  

* > *Every object can have another object as its prototype*
  > *Then the former object inherits all of its prototype's properties.*
  >
  > *An object specifies its prototype via the internal property* `*[[Prototype]]*`
  >
  > *The chain of objects connected by the* `*[[Prototype]]*` *property is called the* *prototype chain*

  

* > *The* `__proto__` *is an* [accessor property](http://www.javascripttutorial.net/javascript-objects/#accessor_property) *of the* `Object.prototype` *object.*
  >
  > *It exposes the internal prototype linkage (* `[[Prototype]])`) *of an object through which it is accessed*

* > `**[[Prototype]]**`An object specifies its prototype via the internal property
  >
  > `**__proto__**` brings direct access to `[[Prototype]]` to the language
  >
  > ```js
  > **prototype**` is the ***object\*** that is used to build `__proto__` when you create an object with `new.
  > ```
  >
  > `**prototype**` is not available on the instances themselves (or other objects), but only on the constructor functions.
  >
  > `**prototype**` is only available on functions since they are copied from `Function` and `Object,` but in anything else it is not. 
  >
  > However, `**__proto__**` is available everywhere.





### References 



* https://www.programiz.com/javascript/prototype
* https://www.programiz.com/javascript/constructor-function
* https://hackernoon.com/understand-nodejs-javascript-object-inheritance-proto-prototype-class-9bd951700b29

