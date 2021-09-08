# MobX训练营文档

[TOC]

## 关于库

**mobx**：提供observable、action、computed、makeObservable、makeAutoObservable等API的库。

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

6. [本训练营代码及文档地址](https://github.com/bubucuo/mobx-2021)

   ​    

## 正文

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

在这里，你可以用任何你需要的数据结构来存储state，如普通对象(plain objects)、数组、类、循环数据结构或者引用。 只要确保所有会随时间流逝而改变的属性打上 `observable` 的标记即可，这样mobx才可以追踪它们。

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

*任何* 来源是*State(状态)* 并且不需要进一步交互的东西都是 Derivation(派生)。Derivations 包括许多方式:

- 用户界面
- 衍生数据，如`todos`的剩余数量
- 后端集成，如把变化发送给服务端

MobX区分以下两种Derivation：

- ***Computed*值**，这种值总是可以使用一个纯函数从当前observable state中衍生出来。
- ***Reactions***，是指当state变化的时候自动执行的副作用。

MobX新手很容易过量使用reactions，所以一定记住这个黄金法则：如果你想基于当前的state再创建一个值，请使用`computed`。



##### 3.1 通过 computed 对派生值进行建模

你可以通过定义 getter 方法并使用 `makeObservable` 将其标记为 `computed` 的方式创建一个 *computed* 值。

如下面，`unfinishedTodoCount`就是基于`observable`的`todos`计算出来的，所以把它标记为`computed`。

```jsx
import { action, computed, makeObservable, observable } from "mobx";
import Todo from "./Todo";

class TodoList {
  todos = [];
  constructor(todos) {
    makeObservable(this, {
      todos: observable,
      add: action,
      del: action,
      unfinishedTodoCount: computed,
    });
    this.todos = todos;
  }

  add(title) {
    this.todos.push(new Todo(title));
  }

  del(id) {
    this.todos = this.todos.filter((todo) => id !== todo.id);
  }

  // 未完成任务计算
  get unfinishedTodoCount() {
    console.log("www"); //sy-log
    return this.todos.filter((todo) => !todo.finished).length;
  }
}

export default TodoList;
```

当新的todo增加到`todos`中或者某个todo的`finished`改变了，MobX会确保`unfinishedTodoCount`的更新。



##### 3.2 使用 reaction 对副作用建模

Reaction 和 computed 类似，但并不产生信息，而是产生副作用，如打印到控制台、发出网络请求、增量更新 React 组件树以便更新DOM等。

简而言之，*reaction* 是 [响应式编程](https://en.wikipedia.org/wiki/Reactive_programming)和[指令式编程](https://en.wikipedia.org/wiki/Imperative_programming)之间的桥梁。

到目前为止，最常用的 reaction 形式是UI组件。 注意，action 和 reaction 都可能引起副作用。 副作用应有一个清晰的、显式的起源，例如在提交表单时发出网络请求，应该从相关的事件处理程序显式触发。



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



##### 3.4 custom reactions

还有一些reactions如 [`autorun`](https://zh.mobx.js.org/reactions.html#autorun)、 [`reaction`](https://zh.mobx.js.org/reactions.html#reaction) 、[`when`](https://zh.mobx.js.org/reactions.html#when)可以定制特殊的业务场景。

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

  

### lesson2 MobX核心

#### 创建可观察状态

属性，完整的对象，数组，Maps 和 Sets 都可以被转化为可观察对象。 使得对象可观察的基本方法是使用 `makeObservable` 为每个属性指定一个注解。 最重要的注解如下：

- `observable` 定义一个存储 state 的可追踪字段。
- `action` 将一个方法标记为可以修改 state 的 action。
- `computed` 标记一个可以由 state 派生出新的值并且缓存其输出的 getter。

像数组，Maps 和 Sets 这样的集合都将被自动转化为可观察对象。

##### `makeObservable`

##### `makeAutoObservable`

##### `extendObservable`

##### `observable`

#### 使用 actions 更新 state

用法：

- `action` *（注解）*
- `action(fn)`
- `action(name, fn)`



