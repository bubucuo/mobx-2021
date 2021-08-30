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

2. [MobX AP快速查询](https://zh.mobx.js.org/api.html)

3. [mobx源码地址](https://github.com/mobxjs/mobx)

4. [mobx-react源码地址](https://github.com/mobxjs/mobx-react)

5. [mobx-react-lite源码地址](https://github.com/mobxjs/mobx-react-lite)

6. [本训练营代码及文档地址](https://github.com/bubucuo/mobx-2020)

   ​    

## 正文

**以下文档很多部分来自https://zh.mobx.js.org。**



### MobX简介

简单、可扩展的状态管理。

安装 `yarn add mobx `

React 绑定库: `yarn add mobx-react` 或者`yarn add mobx-react-lite`



### 入门

*任何可以从应用状态中派生出来的值都应该被自动派生出来。*

MobX 是一个身经百战的库，它通过运用透明的函数式响应编程（Transparent Functional Reactive Programming，TFRP）使状态管理变得简单和可扩展。



### lesson1-MobX要点

#### 概念

MobX区分了应用程序中的以下三个概念：

1. State(状态)
2. Actions(动作)
3. Derivations(派生)

#### 1. 定义state并使其可观察

**state** 是驱动应用的数据。

在这里，你可以用任何你需要的数据结构来存储state，如普通对象(plain objects)、数组、类、循环数据结构引用。 只要确保所有会随时间流逝而改变的属性打上 `observable` 的标记即可，这样mobx才可以追踪它们。

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



#### 2. 使用action更新state

*Action(动作)* 是任意可以改变 *State(状态)* 的代码，比如用户事件处理、后端推送数据处理、调度器事件处理等等。

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



##### 3.1 通过 computed 对派生值进行建模

你可以通过定义 getter 方法并使用 `makeObservable` 将其标记为 `computed` 的方式创建一个 *computed* 值。

如下面，`unfinishedTodoCount`就是基于`observable`的`todos`计算出来的，所以把它标记为`computed`。

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



##### 3.2 使用 reaction 对副作用建模

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



##### 3.4 自定义reactions

还有一些reactions如 [`autorun`](https://zh.mobx.js.org/reactions.html#autorun)、 [`reaction`](https://zh.mobx.js.org/reactions.html#reaction) 、[`when`](https://zh.mobx.js.org/reactions.html#when)，用的不多。

如下面的代码，这个log`在unfinishedTodoCount`改变的时候会打印。为什么会这样呢，答案就是：任何在执行追踪函数过程中读取的*observable*属性，MobX都会给予响应。

```jsx
autorun(() => {
  console.log("Tasks left: " + todoList.unfinishedTodoCount);
});
```

为什么每次 `unfinishedTodoCount`发生改变时都会输出日志信息呢？答案是以下法则：

*MobX对在执行跟踪函数期间读取的任何现有可观察属性作出响应*。



#### 原则

MobX 使用单向数据流，利用***action***改变***state***，进而更新所有受影响的 ***view***。

![image-20210818181248103](https://zh.mobx.js.org/assets/action-state-view.png)



- 所有的 *derivations* 将在 *state* 改变时**自动且原子化地更新**。因此不可能观察中间值。

- 所有的 *dervations* 默认将会**同步**更新，这意味着 *action* 可以在 *state* 改变 之后安全的直接获得 computed 值。

- *computed value* 的更新是**惰性**的，任何 computed value 在需要他们的副作用发生之前都是不激活的。

- 所有的 *computed value* 都应是**纯函数**,他们不应该修改 *state*。

  

