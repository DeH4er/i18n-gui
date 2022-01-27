import { Breadcrumbs } from "baseui/breadcrumbs";
import { StyledLink } from "baseui/link";
import React, { memo } from "react";

function TranslationPath({ path, select }) {
  const withoutLastPath = path.slice(0, path.length - 1);
  const lastPath = path[path.length - 1];

  function onClick(i) {
    select(path.slice(0, i + 1));
  }

  return (
    <Breadcrumbs>
      {withoutLastPath.map((p, i) => (
        <StyledLink key={p + i} onClick={() => onClick(i)}>
          {p}
        </StyledLink>
      ))}
      <span>{lastPath}</span>
    </Breadcrumbs>
  );
}

export default memo(TranslationPath);
