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
    this.todos = this.todos.filter((todo) => todo.id !== id);
  }

  // 计算当前未完成任务还有多少
  get unfinishedTodoCount() {
    return this.todos.filter((todo) => !todo.finished).length;
  }
}
export default TodoList;
