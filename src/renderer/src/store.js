import { configureStore } from "@reduxjs/toolkit";
import editorReducer from "src/editor/editorSlice";

export default configureStore({
  reducer: {
    editor: editorReducer,
  },
});
