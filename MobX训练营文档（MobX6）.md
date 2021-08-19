# MobX训练营文档（MobX6）

[TOC]

## 关于库

**mobx**：提供observable、action、computed、makeObservable、makeAutoObservable等API的库，类比redux。

**mobx-react**：MobX与React的绑定库，提供observer等API的库。

**mobx-react-lite**：MobX与React的绑定库，提供observer等API的库，但是相当于是mobx-react的精简版。

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

store/timer.js

```js
import { makeAutoObservable } from "mobx";

class Timer {
  sec = 0;
  constructor() {
    makeAutoObservable(this);
  }
  add() {
    this.sec += 1;
  }
}

const timer = new Timer();

export default timer;
```



App.js

React 组件的 `observer` 包装会自动侦测到依赖于 observable `timer.secondsPassed` 的渲染——即使这种依赖关系没有被明确定义出来。 响应性系统会负责在未来*恰好那个*字段被更新的时候将组件重新渲染。

每个事件（`onClick` 或 `setInterval`）都会调用一个用来更新 *observable 状态* `myTimer.secondsPassed` 的 *action*（`myTimer.create` 或 `myTimer.reset`）。Observable 状态的变更会被精确地传送到 `TimerView` 中所有依赖于它们的*计算*和*副作用*里。

```jsx
import { observer } from "mobx-react-lite";
import timer from "./store/timer";

export default observer(function App(props) {
  return (
    <div>
      <h3>App</h3>
      <button onClick={() => timer.add()}>{timer.sec}</button>
    </div>
  );
});
```



### lesson1-MobX要点

#### 1. 定义state并使其可观察

**state** 是驱动应用的数据。

在这里，你可以用任何你需要的数据结构来存储state，如plain objects、数组、类、循环数据结构、引用。 只要确保所有会随时间流逝而改变的属性打上 `observable` 的标记即可，这样mobx才可以追踪它们。

```javascript
import { makeObservable, observable, action } from "mobx";

class Todo {
  id = Math.random();
  title = "";
  finished = false;

  constructor(title) {
    makeObservable(this, {
      title: observable,
      finished: observable,
      toggle: action,
    });
    this.title = title;
  }

  toggle() {
    this.finished = !this.finished;
  }
}

export default Todo;
```

提示：这里可以直接使用`makeAutoObservable`，但是现在为了帮大家详细区分下不同概念，所以使用了`makeObservable`。



#### 2. 使用action更改state

如果你把某个state定义为`observable`，那么后续要修改这个state的函数就应该标记为`action`。

如上面代码，`finished`是`observable`，那么那么修改`finished`的`toggle`就被标记为了action。



#### 3. 创建自动响应state变化的derivation

**任何** 源自**状态**并且不会再有任何进一步的相互作用的东西就是衍生。它通常以以下形式存在：

- 如用户界面
- 衍生数据，如`todos`的剩余数量
- 后端集成，如把变化发送给服务端

MobX区分以下两种衍生：

- ***Computed*值**，这种值总是可以使用一个纯函数从当前observable state中衍生出来。
- ***Reactions***，是指当state变化的时候自动执行的副作用。

MobX新手很容易过量使用reactions，所以一定记住这个黄金法则：如果你想基于当前的state再创建一个值，请使用`computed`。



##### 3.1 使用computed衍生值

如下面的model，`unfinishedTodoCount`就是基于`observable`的`todos`计算出来的，所以把它标记为`computed`。

```jsx
import { makeObservable, observable, computed } from "mobx";

class TodoList {
  todos = [];
  get unfinishedTodoCount() {
    return this.todos.filter((todo) => !todo.finished).length;
  }
  constructor(todos) {
    makeObservable(this, {
      todos: observable,
      unfinishedTodoCount: computed,
    });
    this.todos = todos;
  }
}

export default TodoList;
```

当新的todo增加到`todos`中或者某个todo的`finished`改变了，MobX会确保`unfinishedTodoCount`的更新。



##### 3.2 使用reactions做副作用

Reactions产生副作用，如打印log、服务端请求、更新dom等。



##### 3.3 响应式组件

在React中，我们可以通过`observer`函数让组件变成响应式。

```jsx
import { observer } from "mobx-react-lite";
import { todoList } from "../store/";

export default observer(function TodoListPage(props) {
  return (
    <div>
      <h3>TodoListPage</h3>
      <ul>
        {todoList.todos.map((todo) => (
          <TodoView todo={todo} key={todo.id} />
        ))}
      </ul>
      Tasks left: {todoList.unfinishedTodoCount}
    </div>
  );
});

const TodoView = observer(({ todo }) => (
  <li>
    <input
      type="checkbox"
      checked={todo.finished}
      onChange={() => todo.toggle()}
    />
    {todo.title}
  </li>
));
```



##### 3.4 传统reactions

还有一些reactions如 [`autorun`](https://zh.mobx.js.org/reactions.html#autorun)、 [`reaction`](https://zh.mobx.js.org/reactions.html#reaction) 、[`when`](https://zh.mobx.js.org/reactions.html#when)，用的不多。

如下面的代码，这个log`在unfinishedTodoCount`改变的时候会打印。为什么会这样呢，答案就是：任何在执行追踪函数过程中读取的*observable*属性，MobX都会给予响应。

```jsx
autorun(() => {
  console.log("Tasks left: " + todoList.unfinishedTodoCount);
});
```



#### 原则

MobX 支持单向数据流，也就是**action**改变**state**，而state的改变会更新所有相关的**视图**。

![image-20210818181248103](https://zh.mobx.js.org/assets/action-state-view.png)



- 当state改变时，所有衍生都会进行**原子级的自动**更新。因此永远不可能观察到中间值。

- 所有衍生默认都是**同步**更新。这意味着例如action可以在改变state之后直接可以安全地检查computed值。

- computed值 是**惰性**更新的。任何不在使用中的computed值将不会更新，除非到到需要它进行副作用（I / O）操作时。 如果一个视图不再使用，那么这个视图会自动被垃圾回收。
- 所有的computed值都应该是**纯净(puer)**的，所有的computed值都不应该改变state。



### lesson2-创建observable state

属性，完整的对象，数组，Maps 和 Sets 都可以被转化为可观察对象。 使得对象可观察的基本方法是使用 `makeObservable` 为每个属性指定一个注解。 最重要的注解如下：

- `observable` 定义一个存储 state 的可追踪字段。
- `action` 将一个方法标记为可以修改 state 的 action。
- `computed` 标记一个可以由 state 派生出新的值并且缓存其输出的 getter。

像数组，Maps 和 Sets 这样的集合都将被自动转化为可观察对象。

#### `makeObservable`

用法：`makeObservable(target, annotations?, options?)`

这个函数可以捕获*已经存在*的对象属性并且使得它们可观察。任何 JavaScript 对象（包括类的实例）都可以作为 `target` 被传递给这个函数。 一般情况下，`makeObservable` 是在类的构造函数中调用的，并且它的第一个参数是 `this` 。 `annotations` 参数将会为每一个成员映射注解。需要注意的是，当使用 [装饰器](https://zh.mobx.js.org/enabling-decorators.html) 时，`annotations` 参数将会被忽略。







