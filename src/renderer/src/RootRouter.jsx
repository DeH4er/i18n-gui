import { connect } from 'react-redux';
import { Navigate } from 'react-router';
import { HashRouter, Route, Routes } from 'react-router-dom';

import Editor from 'src/editor/Editor';
import Welcome from 'src/welcome/Welcome';

import { selectTranslations } from './editor/editorSlice';

function RootRouter({ translations }) {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route
          path="/editor"
          element={translations ? <Editor /> : <Navigate to="/" />}
        />
      </Routes>
    </HashRouter>
  );
}

export default connect(
  (state) => ({ translations: selectTranslations(state) }),
  null
)(RootRouter);
