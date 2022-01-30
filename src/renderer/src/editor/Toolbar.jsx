import { memo, useCallback } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useStyletron } from 'baseui';
import { Button, KIND, SIZE } from 'baseui/button';
import {
  FiBox,
  FiChevronLeft,
  FiDownload,
  FiKey,
  FiSettings,
  FiUpload,
} from 'react-icons/fi';

import Tooltip from 'src/components/Tooltip';

import { pull, push } from './editorSlice';

function NavigateWelcome() {
  const navigate = useNavigate();
  const navigateWelcome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return (
    <Tooltip tooltip="Go to projects">
      <Button
        kind={KIND.secondary}
        size={SIZE.compact}
        onClick={navigateWelcome}
      >
        <FiChevronLeft />
      </Button>
    </Tooltip>
  );
}

function Toolbar({ openSettings, pull, push, addGroup, addKey }) {
  const [, theme] = useStyletron();

  return (
    <div
      style={{
        ...theme.typography.font300,
        display: 'flex',
        alignItems: 'center',
        padding: '10px',
        color: theme.colors.primary,
        boxShadow: `0px 0px 10px ${theme.colors.backgroundOverlayDark}`,
        gap: '10px',
        flexWrap: 'wrap',
      }}
    >
      <NavigateWelcome />

      <Tooltip tooltip="Reload files">
        <Button kind={KIND.secondary} size={SIZE.compact} onClick={pull}>
          <FiDownload />
        </Button>
      </Tooltip>

      <Tooltip tooltip="Save to files">
        <Button kind={KIND.secondary} size={SIZE.compact} onClick={push}>
          <FiUpload />
        </Button>
      </Tooltip>

      <Tooltip tooltip="Settings">
        <Button
          kind={KIND.secondary}
          size={SIZE.compact}
          onClick={openSettings}
        >
          <FiSettings />
        </Button>
      </Tooltip>

      <Tooltip tooltip="Add group">
        <Button data-testid="add-group" size={SIZE.compact} onClick={addGroup}>
          <FiBox />
        </Button>
      </Tooltip>

      <Tooltip tooltip="Add key">
        <Button data-testid="add-key" size={SIZE.compact} onClick={addKey}>
          <FiKey />
        </Button>
      </Tooltip>
    </div>
  );
}

export default memo(
  connect(null, {
    pull,
    push,
  })(Toolbar)
);
