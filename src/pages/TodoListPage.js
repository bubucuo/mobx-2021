import { observer } from "mobx-react-lite";
import { todoList } from "../store/";

export default observer(function TodoListPage(props) {
  return (
    <div>
      <h3>TodoListPage</h3>
      <button onClick={() => todoList.add()}>add</button>
      <ul>
        {todoList.todos.map((todo) => (
          <TodoView todo={todo} key={todo.id} />
        ))}
      </ul>
      <p>Tasks left: {todoList.unfinishedTodoCount}</p>
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
