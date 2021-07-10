---
layout: post
title: Learn Prototype Pollution in Series - Part 3
tags: [prototype pollution]
---




# Part 3 - Prototype Pollution Continue

---



> So, today I will learn more about prototype



# Let's Begin =>

> We know there are following ways to **Create Objects**
>
> 
>
> 1. Using Object Literals
> 2. Using **new Object()** notation
> 3. Create an object based on another object:
>    1. obj2 = Object.create(obj1);
> 4. Using constructor functions and a **new operator**

> ### Constructor Function 
>
> 
>
> * In JAVA , classes have **constructor **
> * In JavaScript, a Function can serve as a constructor 
> * We use **Capital Letter** for naming our Constructor Function

> ### Prototype Inheritance 
>
> 
>
> > In Java or C# , we define a blueprint first: **class A**, and another blueprint based on the first one : **class B extends A**.
> >
> > After that we can create **instances** of **A and/or B**
>
> > In JavaScript => an Object can **inherit** from other object via a **Property  ** => which is called **Prototype **
>
> > Example => 
> >
> > ObjectA -> ObjectB =>  ObjectB.prototype=ObjectA;
>
> 

> ### Examples =>
>
> ```js
> Person Objects =>
> 
> // Constructor Function Person
> function Person(name,title){
> 	this.name = name;
> 	this.title = title;
> 	this.subordinate = [];
> }
> 
> // Constructor  Function Employee
> function Employee(name,title){
> 	this.name = name;
> 	this.title = title;
> }
> ```
>
> ```js
> Now, let's make an Employee a "subclass" of a Person:
> 
> Employee.prototype = new Person();
> 
> var emp = new Employee("Aakash", "Senior Security Engineer");
> ```
>
> > Now, If a JS Engine won't find a property in **Employee **, it will keep looking in its prototype chain -> **Person** and **Object**
>
> > There is also another property `__proto__` which came in ECMA6



> ### What is a Prototype?
>
> > In General,
> > A model of something, from which other forms are developed or copied.
>
> > In JS,
> > Prototypes are the mechanism by which JavaScript objects inherit features from one another
>
> > Example ->
> >
> > ```js
> > // suppose we have following object ->
> > 
> > var obj = {name : 'Aakash'}
> > 
> > //access it ->
> > 
> > obj.name -> result Aakash
> > 
> > // But when use toString() function or method
> > 
> > obj.toString() -> Result -> [object Object]
> > 
> > // toString() -> is a function and doesn't belong to our obj but still JS giving result instead of undefined
> > 
> > // Why ? => 
> > 
> > // obj.name =>. this is  Object Property
> > // obj.toString => 
> > // Now object first look in its Object and didn't find toString
> > // So, Now it looks this method on its Prototype -> prototype -> onbj{}
> > // If it find toString() method there then it will give output
> > // But, if it not find such method -> then  it can actually continue  going for  a while
> > // It can  continue  looking on the prototypes prototype
> > ```
>
> > So, it is like as ->
> >
> > obj.toString() -> Either //undefined if not find even in prototype or find in -> prototype obj{} -> and then again check in prototype obj{toString} or whatever
> >
> > and thus it will look until it find in its own prototype objects
>
> > i.e. It will keep looking  until it has reached the end.

> ### NOTE 
>
> And what does above process is ? -> **Prototype  Chain**
>
> 



> So, prototype object is actually the **class** that is used to create the object
>
> And to see which class was  used to create a particular object ->  we can essentially check the name of the **constructor **
>
> -> HOW ? -> ``__proto__``
>
> We need to access this using `__proto__`
>
>
> What ever we have like array or methods etc -> this proto method will reveal something about the object

```js
var obj = {name : "Aakash"}
undefined

obj.name
"Aakash"

obj 
{name: "Aakash"}
name: "Aakash"
__proto__:
constructor: ƒ Object()
hasOwnProperty: ƒ hasOwnProperty()
isPrototypeOf: ƒ isPrototypeOf()
propertyIsEnumerable: ƒ propertyIsEnumerable()
toLocaleString: ƒ toLocaleString()
toString: ƒ toString()
valueOf: ƒ valueOf()
__defineGetter__: ƒ __defineGetter__()
__defineSetter__: ƒ __defineSetter__()
__lookupGetter__: ƒ __lookupGetter__()
__lookupSetter__: ƒ __lookupSetter__()
get __proto__: ƒ __proto__()
set __proto__: ƒ __proto__()
```



```js
// Array =>

arr = [1,2,3];

(3) [1, 2, 3]

arr

(3) [1, 2, 3]
0: 1
1: 2
2: 3
length: 3
__proto__: Array(0)
concat: ƒ concat()
constructor: ƒ Array()
copyWithin: ƒ copyWithin()
entries: ƒ entries()
every: ƒ every()
fill: ƒ fill()
filter: ƒ filter()
find: ƒ find()
findIndex: ƒ findIndex()
flat: ƒ flat()
flatMap: ƒ flatMap()
forEach: ƒ forEach()
includes: ƒ includes()
indexOf: ƒ indexOf()
join: ƒ join()
keys: ƒ keys()
lastIndexOf: ƒ lastIndexOf()
length: 0
map: ƒ map()
pop: ƒ pop()
push: ƒ push()
reduce: ƒ reduce()
reduceRight: ƒ reduceRight()
reverse: ƒ reverse()
shift: ƒ shift()
slice: ƒ slice()
some: ƒ some()
sort: ƒ sort()
splice: ƒ splice()
toLocaleString: ƒ toLocaleString()
toString: ƒ toString()
unshift: ƒ unshift()
values: ƒ values()
Symbol(Symbol.iterator): ƒ values()
Symbol(Symbol.unscopables): {copyWithin: true, entries: true, fill: true, find: true, findIndex: true, …}
Symbol(values): ƒ ()
__proto__: Object
```



> In proto -> we see Constructor for Object -> constructor: ƒ Object()
>
> But for array -> constructor: ƒ Array()



> So, proto -> telling us what constructor available -> i.e Object or Array

> #### Why I wrote above things ?
>
> To learn -> how to access prototype object and see what's available there and check the name of the **constructor **
>
>
> we can do this -> `arr.__proto__`  
>
> And we can see what is available there and what name of constructor is there



> #### Now, what we can do by this knowing things ?
>
>
> We, can use methods available in them like ->
>
> ```
> arr.toString()
> arr.hasOwnProperty('name')
> ```
>
> 
>
> #### NOTE
>
>
> If you see earlier in array code , we will not see  **hasOwnProperty** method available. But there is another **proto** available  in under `__proto__`
>
> ```js
> Symbol(Symbol.iterator): ƒ values()
> Symbol(Symbol.unscopables): {copyWithin: true, entries: true, fill: true, find: true, findIndex: true, …}
> Symbol(values): ƒ ()
> __proto__: Object
> 
> =>
> 
> 
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
> So, now it look **hasOwnProperty** method in its own **proto** method
>
> This is like -> Level 1 proto and then Level 2 proto -> **Mean Prototype chain**
>
>
> In the same way we can do this ->
>
> ```js
> arr.__proto__.__proto__
> 
> 
> //And now if you see this -> you will find that Now Constructor is Object
> ```
>
> 
>
> > But if we do another `arr.__proto__.__proto__.__proto__` 
> > and if result is **null** -> this mean we reached to the end of  **chain**





## Prototype Inheritance 



> Now time to learn about Prototype inheritance 
>
> ```JS
> function Person(name,age){
>   this.name = name;
>   this.age = age;
>   this.getInfo(){
>     console.log(`Name : $(this,name) , Age: $(this.age)`);
>   }
> }
> 
> 
> var p1 = new Person('Aakash': 30)
> var p2 = new Person('Vikash' : 23)
> 
> ```
>
> 
>
> > In above code, we made constructor function **Person** and there we made 2 properties and one method
> >
> > Now ,we assign 2 variables and hence created **Objects**
> >
> >
> > But, those objects have one method [getInfo] which is repeating everytime 
> >
> > So, we need to use DRY Approach [ Don't Repeat Yourself ]
> >
> >
> > For this we do this ->
> >
> > ```js
> > Person.prototype.getInfo() = function(){
> >     console.log(`Name : $(this,name) , Age: $(this.age)`);
> >   }
> > 
> > // and replace previous code as =>
> > 
> > function Person(name,age){
> >   this.name = name;
> >   this.age = age;  
> > }
> > 
> > // We, still get the same info as before but now we remove the duplicates things for every objects
> > 
> > ```
>
> > Why we use **prototype** instead of `__proto__` ?
> >
> > because for JS Engine we use -> `__proto__`
>
> > Now, in Console -> `p1.__proto__` -> We can see our function comes under proto



> Some more examples to use prototype to extend our needs ->
>
> ```js
> arr = [1,2,3]
> console.log(0) => to access 1st element
> 
> // Now using same thing with prototpe
> 
> Array.prototype.first = function(){
>   if (this.length) {
>     	console.log(`Your first element is: ${this[0]}`);
>   } else {
>     console.error(`the array is empty :(`);
>   }
> }
> ```
>
> 







> #### Some More Notes
>
> 
>
> * [[Prototype]]
>   * Internal link to object's property
> * `__proto__`
>   * External link to object's prototype
>   * Support in most modern browsers,  but  is not a  standard untio ES6
>   * From ES6 -> **Object.getPrototypeOf()** => should be used instead
> * **prototype** -> Property of a function







### Very Good Reference ->



* https://levelup.gitconnected.com/javascripts-proto-vs-prototype-a21ec7f25bc1
* https://dillionmegida.com/p/understanding-the-prototype-chain-in-javascript/



---



## Prototype Pollution



> Now, time to understand prototype pollution :smiley:



> **Prototype  Pollution** occus when there is a bug in application that makes it possible to pollute **Object.prototype** with **arbitrary properties.**



> Example =>
>
> ```js
> if (user.isAdmin) {
> 	// Do something
> }
> ```
>
>
> Attacker try this then if application  is vulnerable ->
>
> ```js
> Object.prototype.isAdmin = true	
> 
> Then everyone is Admin
> ```
>
> 
>
> Reference -> https://slides.com/securitymb/prototype-pollution-in-kibana#/





---



Enough for Today, Next time I will cover this prototpe pollution more in depth





