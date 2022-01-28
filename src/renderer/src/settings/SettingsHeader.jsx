import React from 'react';

import { useStyletron } from 'baseui';

export default function SettingsHeader({ children }) {
  const [, theme] = useStyletron();

  return (
    <div
      style={{
        ...theme.typography.font550,
        color: theme.colors.primary,
        marginBottom: '20px',
      }}
    >
      {children}
    </div>
  );
}
