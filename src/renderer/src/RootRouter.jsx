import Editor from "@/editor/Editor";
import { selectFiles } from "@/editor/editorSlice";
import Welcome from "@/welcome/Welcome";
import { connect } from "react-redux";
import { Navigate } from "react-router";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function RootRouter({ files }) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />}></Route>
        <Route
          path="/editor"
          element={files.length > 0 ? <Editor /> : <Navigate to="/" />}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default connect(
  (state) => ({ files: selectFiles(state) }),
  null
)(RootRouter);
