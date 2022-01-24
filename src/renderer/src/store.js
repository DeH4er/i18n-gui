import editorReducer from "@/editor/editorSlice";
import { configureStore } from "@reduxjs/toolkit";

export default configureStore({
  reducer: {
    editor: editorReducer,
  },
});
