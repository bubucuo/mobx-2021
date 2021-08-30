// import { runInAction } from "mobx";
import Child from "./Child";
import ObservableState from "./ObservableState";
import Todo from "./Todo";
import TodoList from "./TodoList";

export const todo = new Todo("Get Coffee");
export const todoList = new TodoList([
  new Todo("Get Coffee"),
  new Todo("Write simpler code"),
]);

export const observableState = new ObservableState(0);

// 这样调用 add 是安全的, 因为它已经被绑定了。
// setInterval(observableState.add, 1000);

// runInAction(() => {
//   observableState.count++;
//   observableState.count++;
// });
// export const observableState = ObservableState(0);

// export const observableState = ObservableState;

// export const child = new Child();
