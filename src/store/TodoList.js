import { makeObservable, observable, computed, autorun } from "mobx";
import Todo from "./Todo";

class TodoList {
  todos = [];

  constructor(todos) {
    makeObservable(this, {
      todos: observable,
      unfinishedTodoCount: computed,
    });
    this.todos = todos;
  }

  get unfinishedTodoCount() {
    return this.todos.filter((todo) => !todo.finished).length;
  }

  add = () => {
    this.todos.push(new Todo("title" + this.todos.length));
  };
}

export default TodoList;
