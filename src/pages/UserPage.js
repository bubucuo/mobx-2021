import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { user } from "../store/index";

export default observer(function UserPage(props) {
  useEffect(() => {
    user.fetch();
  }, []);
  return (
    <div>
      <h3>UserPage</h3>
      <p>{user.data?.name.first}</p>
      <button
        onClick={() => {
          user.fetch();
        }}
      >
        refresh
      </button>
    </div>
  );
});
