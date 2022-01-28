import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { loadRecentProjects } from 'src/editor/editorSlice';

import CreateProject from './CreateProject';
import RecentProjects from './RecentProjects';

function Welcome({ loadRecentProjects }) {
  useEffect(() => {
    loadRecentProjects();
  }, []);
  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <CreateProject />
      <RecentProjects />
    </div>
  );
}
export default connect(null, { loadRecentProjects })(Welcome);
