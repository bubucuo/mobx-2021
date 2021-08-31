import { autorun } from "mobx";
import Todo from "./Todo";
import TodoList from "./TodoList";

export const todoList = new TodoList([new Todo("早饭")]);

autorun(() => {
  console.log("Tasks left: " + todoList.unfinishedTodoCount);
});
