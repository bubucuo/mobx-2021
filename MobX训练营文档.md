# MobX训练营文档（MobX6）

[TOC]

## 资源

1. [mobx中文文档](https://zh.mobx.js.org/README.html)

2. [mobx源码地址](https://github.com/mobxjs/mobx)

3. [mobx-react源码地址](https://github.com/mobxjs/mobx-react)(下面的README.md里是完整版本的英文文档)

4. [mobx-react-lite源码地址](https://github.com/mobxjs/mobx-react-lite)

   ​    

## 关于库

**mobx**：提供observable、action、computed、makeObservable、makeAutoObservable等API的库，类比redux。

**mobx-react**：MobX与React的绑定库，提供Provider、inject、observer等API的库。

**mobx-react-lite**：MobX与React的绑定库，相当于是mobx-react的精简版，不支持类组件，不提供Provider、inject。



## 正文

**以下文档大部分来自https://zh.mobx.js.org。**



### MobX简介

简单、可扩展的状态管理。

安装 `yarn add mobx `

React 绑定库: `yarn add mobx-react` 或者`yarn add mobx-react-lite`



### 入门

*任何可以从应用状态中派生出来的值都应该被自动派生出来。*

MobX 是一个身经百战的库，它通过运用透明的函数式响应编程（Transparent Functional Reactive Programming，TFRP）使状态管理变得简单和可扩展。

#### 😙 简单直接

编写无模板的极简代码来精准描述出你的意图。要更新一个记录字段？使用熟悉的 JavaScript 赋值就行。要在异步进程中更新数据？不需要特殊的工具，响应性系统会侦测到你所有的变更并把它们传送到其用武之地。

#### 🚅 轻松实现最优渲染

所有对数据的变更和使用都会在运行时被追踪到，并构成一个截取所有状态和输出之间关系的依赖树。这样保证了那些依赖于状态的计算只有在真正需要时才会运行，就像 React 组件一样。无需使用记忆化或选择器之类容易出错的次优技巧来对组件进行手动优化。

#### 🤹🏻‍♂️ 架构自由

MobX 不会用它自己的规则来限制你，它可以让你在任意 UI 框架之外管理你的应用状态。这样会使你的代码低耦合、可移植和最重要的——容易测试。

