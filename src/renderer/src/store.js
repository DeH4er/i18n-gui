import { configureStore } from '@reduxjs/toolkit';
import editorReducer from 'src/editor/editorSlice';

export default (opts = {}) =>
  configureStore({
    reducer: {
      editor: editorReducer,
    },
    ...opts,
  });
