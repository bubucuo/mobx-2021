import { observer } from "mobx-react-lite";
import { child } from "../store";

export default observer(function ChildPage(props) {
  return (
    <div>
      <h3>ChildPage</h3>
      <button onClick={() => child.action()}>{child.name}</button>
    </div>
  );
});
