import { makeObservable, observable, computed, autorun } from "mobx";

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
    // this.todos = todos;
  }
}

export default TodoList;
