import TranslationPath from './TranslationPath';

export default function TranslationHeader({ path, children, select }) {
  return (
    <section
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px',
        flexWrap: 'wrap',
        rowGap: '20px',
      }}
    >
      <TranslationPath path={path} select={select} />
      <div
        style={{
          display: 'flex',
          gap: '10px',
          alignSelf: 'center',
        }}
      >
        {children}
      </div>
    </section>
  );
}
