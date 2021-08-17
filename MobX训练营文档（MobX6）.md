# MobX训练营文档（MobX6）

[TOC]

## 关于库

**mobx**：提供observable、action、computed、makeObservable、makeAutoObservable等API的库，类比redux。

**mobx-react**：MobX与React的绑定库，提供observer等API的库。

**mobx-react-lite**：MobX与React的绑定库，提供observer等API的库，但是相当于是mobx-react的精简版，不支持类组件。

> mobx- react vs mobx-react-lite
>
> 在本文中我们使用 `mobx-react-lite` 作为默认包。mobx-react 是mobx-react-lite的大兄弟，它里面也引用了 `mobx-react-lite` 包。 它提供了很多在新项目中不在需要的特性， mobx-react附加的特性有：
>
> 1. 对于React class components的支持。
> 2. `Provider` 和`inject`. MobX的这些东西在有 React.createContext 替代后变得不必要了。
> 3. 特殊的观察对象 `propTypes`。
>
> 要注意 `mobx-react` 是全量包，也会暴露 `mobx-react-lite`包中的任何方法,其中包含对函数组件的支持。 如果你使用 `mobx-react`，那就不要添加 `mobx-react-lite` 的依赖和引用了。



## 资源

1. [mobx中文文档](https://zh.mobx.js.org/README.html)

2. [mobx源码地址](https://github.com/mobxjs/mobx)

3. [mobx-react源码地址](https://github.com/mobxjs/mobx-react)

4. [mobx-react-lite源码地址](https://github.com/mobxjs/mobx-react-lite)

5. [本训练营代码及文档地址](https://github.com/bubucuo/mobx-2020)

   ​    

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

### 示例

App.js

```jsx
import { observer } from "mobx-react";
import timer from "./store/timer";

export default observer(function App(props) {
  return (
    <div>
      <h3>App</h3>
      <button onClick={() => timer.reset()}>
        已过秒数：{timer.secondsPassed}
      </button>
    </div>
  );
});
```

store/timer.js

```js
import { makeAutoObservable } from "mobx";

// 对应用状态进行建模。
class Timer {
  secondsPassed = 0;

  constructor() {
    makeAutoObservable(this);
  }

  increase() {
    this.secondsPassed += 1;
  }

  reset() {
    this.secondsPassed = 0;
  }
}

const timer = new Timer();

setInterval(() => {
  timer.increase();
}, 1000);

export default timer;
```





