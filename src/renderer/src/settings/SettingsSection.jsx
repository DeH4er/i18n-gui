import React from 'react';

export default function SettingsSection({ children }) {
  return (
    <section
      style={{
        marginBottom: '40px',
      }}
    >
      {children}
    </section>
  );
}
