import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { todoList } from "../store";

export default observer(function TodoListPage(props) {
  const [text, setText] = useState("");
  return (
    <div>
      <h3>TodoListPage</h3>
      <ul>
        {todoList.todos.map((todo) => (
          <TodoView
            key={todo.id}
            todo={todo}
            del={() => todoList.del(todo.id)}
          />
        ))}
      </ul>

      <p>未完成任务：{todoList.unfinishedTodoCount}</p>
      <input
        type="text"
        placeholder="新增"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.keyCode === 13) {
            // add
            todoList.add(text);
            setText("");
          }
        }}
      />
    </div>
  );
});

const TodoView = observer(function ({ todo, del }) {
  return (
    <li>
      <input
        type="checkbox"
        checked={todo.finished}
        onChange={() => todo.toggle()}
      />
      <span>{todo.title}</span>
      <button onClick={() => del()}> del</button>
    </li>
  );
});
