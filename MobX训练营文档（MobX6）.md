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

  

### lesson2-创建observable state

属性，完整的对象，数组，Maps 和 Sets 都可以被转化为可观察对象。 使得对象可观察的基本方法是使用 `makeObservable` 为每个属性指定一个注解。 最重要的注解如下：

- `observable` 定义一个存储 state 的可追踪字段。
- `action` 将一个方法标记为可以修改 state 的 action。
- `computed` 标记一个可以由 state 派生出新的值并且缓存其输出的 getter。

像数组，Maps 和 Sets 这样的集合都将被自动转化为可观察对象。



#### 创建observable state的API

##### `makeObservable(target, annotations?, options?)`

这个函数可以捕获*已经存在*的对象属性并且使得它们可观察。任何 JavaScript 对象（包括类的实例）都可以作为 `target` 被传递给这个函数。 一般情况下，`makeObservable` 是在类的构造函数中调用的，并且它的第一个参数是 `this` 。 `annotations` 参数将会为每一个成员映射注解。需要注意的是，当使用 [装饰器](https://zh.mobx.js.org/enabling-decorators.html) 时，`annotations` 参数将会被忽略。



##### `makeAutoObservable(target, overrides?, options?)`

`makeAutoObservable` 就像是加强版的 `makeObservable`，在默认情况下它将推断所有的属性。你仍然可以使用 `overrides` 重写某些注解的默认行为。 具体来说，`false` 可用于从自动处理中排除一个属性或方法。 查看上面的代码分页获取示例。 与使用 `makeObservable` 相比，`makeAutoObservable` 函数更紧凑，也更容易维护，因为新成员不需要显式地提及。 然而，`makeAutoObservable` 不能被用于带有 super 的类或 [子类](https://zh.mobx.js.org/subclassing.html)。

推断规则：

- 所有 *自有* 属性都成为 `observable`。
- 所有 `get`ters 都成为 `computed`。
- 所有 `set`ters 都成为 `action`。
- 所有 *prototype 中的 functions* 都成为 `autoAction`。
- 所有 *prototype 中的 generator functions* 都成为 `flow`。（需要注意，generators 函数在某些编译器配置中无法被检测到，如果 flow 没有正常运行，请务必明确地指定 `flow` 注解。）
- 在 `overrides` 参数中标记为 `false` 的成员将不会被添加注解。例如，将其用于像标识符这样的只读字段。

#### 

##### `observable(source, overrides?, options?)`

`observable` 注解可以作为一个函数进行调用，从而一次性将整个对象变成可观察的。 `source` 对象将会被克隆并且所有的成员都将会成为可观察的，类似于 `makeAutoObservable` 做的那样。 同样，你可以传入一个 `overrides` 对象来为特定的成员提供特定的注解。 查看上面的代码获取示例。

由 `observable` 返回的对象将会使用 Proxy 包装，这意味着之后被添加到这个对象中的属性也将被侦测并使其转化为可观察对象（除非禁用 [proxy](https://zh.mobx.js.org/configuration.html#proxy-support)）。

`observable` 方法也可以被像 [arrays](https://zh.mobx.js.org/api.html#observablearray)，[Maps](https://zh.mobx.js.org/api.html#observablemap) 和 [Sets](https://zh.mobx.js.org/api.html#observableset) 这样的集合调用。这些集合也将被克隆并转化为可观察对象。



#### 如何定义observable state

组件代码：pages/ObservableStatePage

```jsx
import { observer } from "mobx-react-lite";
import { observableState } from "../store";

export default observer(function ObservableStatePage(props) {
  return (
    <div>
      <h3>ObservableStatePage</h3>
      <p>{observableState.count}</p>
      <p>doubler: {observableState.double}</p>
      <p>{observableState.user?.name?.first}</p>
      <button onClick={() => observableState.add()}>add</button>
      <button onClick={() => observableState.fetch()}>fetch</button>
    </div>
  );
});
```



##### 1. 使用class定义observable state

建议选择makeAutoObservable，因为简单。

```js
import {
  makeObservable,
  observable,
  computed,
  action,
  flow,
  makeAutoObservable,
} from "mobx";

export default class ObservableState {
  count = null;
  user = null;

  constructor(count) {
    // makeObservable(this, {
    //   count: observable,
    //   user: observable,
    //   double: computed,
    //   add: action,
    //   fetch: flow,
    // });
    makeAutoObservable(this);
    this.count = count;
  }

  get double() {
    return this.count * 2;
  }

  add() {
    this.count++;
  }

  *fetch() {
    const response = yield fetch("https://randomuser.me/api");
    response.json().then((res) => {
      this.user = res.results[0];
    });
  }
}
```

store/index

````js
import ObservableState from "./ObservableState";
export const observableState = new ObservableState(0);
````



##### 2. 使用factory函数定义observable state

```jsx
// !方法2： factory
export default function ObservableState(count) {
  return makeAutoObservable(
    {
      count,
      user: null,
      get double() {
        return this.count * 2;
      },
      add() {
        this.count++;
      },
      *fetch() {
        const response = yield fetch("https://randomuser.me/api");
        response.json().then((res) => {
          this.user = res.results[0];
        });
      },
    },
    {
      // 在 `overrides` 参数中标记为 `false` 的成员将不会被添加注解
      //  user: false,
    }
  );
}
```

如果选择makeObservable，则

```jsx
export default function ObservableState(count) {
  return makeObservable(
    {
      count,
      user: null,
      get double() {
        return this.count * 2;
      },
      add() {
        this.count++;
      },
      *fetch() {
        const response = yield fetch("https://randomuser.me/api");
        response.json().then((res) => {
          this.user = res.results[0];
        });
      },
    },
    {
      count: observable,
      user: observable,
      double: computed,
      add: action,
      fetch: flow,
    }
  );
}
```

store/index

```js
export const observableState = ObservableState(0);
```



##### 3. 使用observable函数定义observable state

`observable` 支持为对象添加（和删除）字段。 这使得 `observable` 非常适合用于像动态键控的对象、数组、Maps 和 Sets 之类的集合。

```js
// !方法3： observable
const ObservableState = observable(
  {
    count: 0,
    user: null,
    get double() {
      return this.count * 2;
    },
    add() {
      this.count++;
    },
    *fetch() {
      const response = yield fetch("https://randomuser.me/api");
      response.json().then((res) => {
        this.user = res.results[0];
      });
    },
  },
  {
    // user: false,
  }
);

export default ObservableState;
```



#### observable（使用代理）与 makeObservable（不使用代理）

`make(Auto)Observable` 和 `observable` 之间最主要的区别在于，`make(Auto)Observable` 会修改你作为第一个参数传入的对象，而 `observable` 会创建一个可观察的 *副本* 对象。

第二个区别是，`observable` 会创建一个 [`Proxy`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) 对象，以便能够在你将该对象当作动态查询映射使用时捕获将要添加的属性。 如果你想把一个对象转化为可观察对象，而这个对象具有一个常规结构，其中所有的成员都是事先已知的，那么我们建议使用 `makeObservable`，因为非代理对象的速度稍快一些，而且它们在调试器和 `console.log` 中更容易检查。

因此，`make(Auto)Observable` 推荐在工厂函数中使用。 值得一提的是，可以将 `{ proxy: false }` 作为 option 传入 `observable` 获取非代理副本。



### lesson3-action

所有的应用程序都有action。action 就是任意一段修改 state 的代码。

尽管 [`makeAutoObservable`](https://zh.mobx.js.org/observable-state.html#makeautoobservable) 可以自动帮你声明一部分 actions，但是 MobX 还是要求你声明你的 actions。Actions 可以帮助你更好的组织你的代码并提供以下性能优势：

1. 它们在 [transactions](https://zh.mobx.js.org/api.html#transaction) 内部运行。任何可观察对象在最外层的 action 完成之前都不会被更新，这一点保证了在 action 完成之前，action 执行期间生成的中间值或不完整的值对应用程序的其余部分都是不可见的。
2. 默认情况下，不允许在 actions 之外改变 state。这有助于在代码中清楚地对状态更新发生的位置进行定位。



#### `action.bound`

`action.bound` 注解可用于将方法自动绑定到正确的实例，这样 `this` 会始终被正确绑定在函数内部。

`makeAutoObservable(o, {}, { autoBind: true })` 自动绑定所有的 actions 和 flows 。

```jsx
class ObservableState {
  count = null;
  user = null;

  constructor(count) {
    // makeObservable(this, {
    //   count: observable,
    //   user: observable,
    //   double: computed,
    //   add: action.bound,
    //   fetch: flow,
    // });
    makeAutoObservable(this, {}, { autoBind: true });
    this.count = count;
  }

  get double() {
    return this.count * 2;
  }

  add() {
    this.count++;
  }

  *fetch() {
    const response = yield fetch("https://randomuser.me/api");
    response.json().then((res) => {
      this.user = res.results[0];
    });
  }
}
```

store/index.js

```js
export const observableState = new ObservableState(0);

// 这样调用 add 是安全的, 因为它已经被绑定了。
setInterval(observableState.add, 1000);
```



#### action 和继承

只有定义在**原型**上的函数可以被子类**覆盖**。

