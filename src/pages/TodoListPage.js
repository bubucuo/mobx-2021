import { observer } from "mobx-react-lite";
import { autorun } from "mobx";

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
