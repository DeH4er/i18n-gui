import Editor from "@/editor/Editor";
import Welcome from "@/welcome/Welcome";
import { connect } from "react-redux";
import { Navigate } from "react-router";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { selectTranslations } from "./editor/editorSlice";

function RootRouter({ translations }) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />}></Route>
        <Route
          path="/editor"
          element={translations.length > 0 ? <Editor /> : <Navigate to="/" />}
        ></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default connect(
  (state) => ({ translations: selectTranslations(state) }),
  null
)(RootRouter);
