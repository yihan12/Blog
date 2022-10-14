## 一、TypeScript 是什么
> TypeScript 是一种由微软开发的自由和开源的编程语言。它是 JavaScript 的一个超集，而且本质上向这个语言添加了可选的静态类型和基于类的面向对象编程。所有js 代码都可以在 ts 里面运行

>TS 的官方网站的定义:**TypeScript is a typed superset of JavaScript that compiles to plain JavaScript**(TypeScript 是一个编译到纯 JS 的有类型定义的 JS 超集。)

TypeScript 提供最新的和不断发展的 JavaScript 特性，包括那些来自 2015 年的 ECMAScript 和未来的提案中的特性，比如异步功能和 Decorators，以帮助建立健壮的组件。

官网强调了 TypeScript 的两个最重要的特性——类型系统、适用于任何规模。

### 类型系统
* **TypeScript 是静态类型**

类型系统按照「类型检查的时机」来分类，可以分为动态类型和静态类型。

动态类型是指在运行时才会进行类型检查，这种语言的类型错误往往会导致运行时错误。JavaScript 是一门解释型语言[4]，没有编译阶段，所以它是动态类型。

静态类型是指编译阶段就能确定每个变量的类型，这种语言的类型错误往往会导致语法错误。TypeScript 在运行前需要先编译为 JavaScript，而在编译阶段就会进行类型检查，所以 TypeScript 是静态类型。

* **TypeScript 是弱类型**

TypeScript 是完全兼容 JavaScript 的，它不会修改 JavaScript 运行时的特性，所以它们都是弱类型。

类型系统好处： 

1.**错误检测**

静态类型检查最明显的好处是可以尽早的检查出程序中的错误。错误被尽早的检查出来可以使它得到快速的修复，而不是潜伏在代码中，在中期甚至部署上线后才被发现。而且，错误在编译期可以被更精确的定位出来，而在运行时，错误产生的影响在程序出现问题前可能是不容易被发现的。

程序会有各种各样的数据结构，如果改了一个数据类型，前端很多时候都是通过全局查找来处理这种重构问题的。而静态类型检查则可以使再次编译后就能探知所有可能的错误，加上 IDE 的智能错误提示，重构起来更放心、更方便。

2.**抽象化**

类型系统支持编程阶段的另外一个重要方式是强制让编程遵守纪律。在大规模软件系统中，类型系统组成了组件协作系统的脊梁。类型展现在模块（或者相关的结构如类）的接口中。接口可以看做“模块的类型”，展示了模块所能提供的功能，是一种实现者和用户间的合约。

在大量模块协作组成的大规模结构化软件系统中清晰的接口可以使设计更为抽象，接口的设计和讨论独立于它们的实现。一般来说，对接口更为抽象的思考可以使得做出更好的设计。

类型会让程序员在一个更高的维度思考，而不是在底层的计算机实现细节纠缠。例如，我们可以把字符串想成字符集，而不仅仅是比特数组。更高维度，类型系统可以让我们用接口来思考和表达任意子系统/子程序之间的协作，接口定义可以让子系统/子程序之间的通信方式始终如一。

3.**文档化**

类型对于阅读程序也是有用的。在程序头部的类型声明和模块接口形成了文档的形状，提供程序的行为提示。此外，不同于在注释中的描述，这种形式的文档不会过期，因为每次编译都会校验，这在模块签名里特别重要。

在复用表现力的类型系统中，类型可以看做是一种描述程序员意图的表述方式。例如，我们声明一个函数返回一个时间戳，这样就相当于明确说明了这个函数在更深层次的代码调用中会返回整数类型。

4.**语言安全**

安全语言这个说法是有争议的。受到该语言社区的严重影响。不正式的来说，安全语言可以被定义为在编程时不可能从底层把自己杀死。

类型系统会允许编译器检查无意义或者可能不合法的代码。例如，我们知道3/'hello world'不合法，强类型提供了更多的安全性，但也不能完全做到类型安全。

5.**效率**

静态类型检查会提供有用的编译期信息。例如，如果一个类型需要在内存中占四个字节，编译器可能会使用更有效率的机器指令。

### 适用于任何规模

TypeScript 非常适用于大型项目——这是显而易见的，类型系统可以为大型项目带来更高的可维护性，以及更少的 bug。

在中小型项目中推行 TypeScript 的最大障碍就是认为使用 TypeScript 需要写额外的代码，降低开发效率。但事实上，由于有[类型推论][]，大部分类型都不需要手动声明了。相反，TypeScript 增强了编辑器（IDE）的功能，包括代码补全、接口提示、跳转到定义、代码重构等，这在很大程度上提高了开发效率。而且 TypeScript 有近百个[编译选项][]，如果你认为类型检查过于严格，那么可以通过修改编译选项来降低类型检查的标准。

TypeScript 还可以和 JavaScript 共存。这意味着如果你有一个使用 JavaScript 开发的旧项目，又想使用 TypeScript 的特性，那么你不需要急着把整个项目都迁移到 TypeScript，你可以使用 TypeScript 编写新文件，然后在后续更迭中逐步迁移旧文件。如果一些 JavaScript 文件的迁移成本太高，TypeScript 也提供了一个方案，可以让你在不修改 JavaScript 文件的前提下，编写一个[类型声明文件][]，实现旧项目的渐进式迁移。

事实上，就算你从来没学习过 TypeScript，你也可能已经在不知不觉中使用到了 TypeScript——在 VSCode 编辑器中编写 JavaScript 时，代码补全和接口提示等功能就是通过 TypeScript Language Service 实现的



## 二、TypeScript 与 JavaScript 的区别

TypeScript | JavaScript
---|---
JavaScript 的超集用于解决大型项目的代码复杂性	|一种脚本语言，用于创建动态网页
可以在编译期间发现并纠正错误|作为一种解释型语言，只能在运行时发现错误
强类型，支持静态和动态类型|弱类型，没有静态类型选项
最终被编译成 JavaScript 代码，使浏览器可以理解|可以直接在浏览器中使用
支持模块、泛型和接口|不支持模块，泛型或接口
社区的支持仍在增长，而且还不是很大|大量的社区支持以及大量文档和解决问题的支持

* JavaScript 属于动态编程语言，而ts 属于静态编程语言
    * js：边解释边执行，错误只有在运行的时候才能发现
    * ts：先编译再执行，在写的时候就会发现错误了（**ts不能直接执行，需要先编译成 js** ）
* ts 完全支持 js ，可以直接转换
* ts 有类型支持，有强大的代码类型提示

## 三、获取 TypeScript
命令行的 TypeScript 编译器可以使用 npm 包管理器来安装。
* **1.安装 TypeScript**
```
$ npm install -g typescript
```
以上命令会在全局环境下安装 tsc 命令，安装完成之后，我们就可以在任何地方执行 tsc 命令了。
* **2.验证 TypeScript**
```
$ tsc -v 
# Version 4.0.2
```
* **3.编译 TypeScript 文件**
```
$ tsc helloworld.ts
# helloworld.ts => helloworld.js
```
当然，对刚入门 TypeScript 的小伙伴来说，也可以不用安装 typescript，而是直接使用线上的 [TypeScript Playground](https://www.typescriptlang.org/play/) 来学习新的语法或新特性。通过配置 TS Config 的 Target，可以设置不同的编译目标，从而编译生成不同的目标代码。
> TypeScript Playground地址:https://www.typescriptlang.org/play/

TypeScript 最大的优势之一便是增强了编辑器和 IDE 的功能，包括代码补全、接口提示、跳转到定义、重构等。

主流的编辑器都支持 TypeScript，这里我推荐使用 [Visual Studio Code](https://code.visualstudio.com/)。

它是一款开源，跨终端的轻量级编辑器，内置了对 TypeScript 的支持。

它本身也是用 TypeScript 编写的。

> 下载安装：https://code.visualstudio.com/

## 四、TypeScript 初体验
我们从一个简单的例子开始。

新建一个 hello.ts 文件，并输入以下内容：
```
function greet(person: string) {
  return 'Hello, ' + person;
}
let user = 'yihan12'
console.log(greet(user)); // 'Hello, yihan12'
```

然后执行 tsc hello.ts 命令。
```
tsc hello.ts
```
之后会生成一个编译好的文件 hello.js：
```
"use strict";
function greet(person) {
  return 'Hello, ' + person;
}
var user = 'yihan12'
console.log(greet(user));
```
观察以上编译后的输出结果，我们发现 person 参数的类型信息在编译后被擦除了。

如果我们将代码改成如下：
```
function greet(person: string) {
  return 'Hello, ' + person;
}
let user = 123
console.log(greet(user)); // 'Hello, yihan12'
```
编辑器中会提示错误，编译的时候也会出错：
```
Argument of type 'number' is not assignable to parameter of type 'string'.
```

但是还是生成了 js 文件：
```
"use strict";
function greet(person) {
  return 'Hello, ' + person;
}
var user = 123
console.log(greet(user));
```
**TypeScript 编译的时候即使报错了，还是会生成编译结果。**

TypeScript 只会在编译阶段对类型进行静态检查，如果发现有错误，编译时就会报错。而在运行时，编译生成的 JS 与普通的 JavaScript 文件一样，并不会进行类型检查

## 相关链接
[TypeScript 体系调研报告](https://github.com/ProtoTeam/blog/blob/master/002.TypeScript%20%E4%BD%93%E7%B3%BB%E8%B0%83%E7%A0%94%E6%8A%A5%E5%91%8A.md)
