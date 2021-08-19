import Todo from "./Todo";
import TodoList from "./TodoList";

export const todo = new Todo("Get Coffee");
export const todoList = new TodoList([
  new Todo("Get Coffee"),
  new Todo("Write simpler code"),
]);
