import { Button, KIND } from "baseui/button";
import { Popover } from "baseui/popover";
import React from "react";

export default function Actions({ children, isOpen, setIsOpen, maxVisible }) {
  const visibleChildren = children.filter(
    (c) => c.props.isVisible === true || c.props.isVisible === undefined
  );

  if (visibleChildren.length <= maxVisible) {
    return visibleChildren;
  }

  return (
    <Popover
      isOpen={isOpen}
      content={() => (
        <div style={{ display: "flex", flexDirection: "column", width: '180px' }}>
          {visibleChildren}
        </div>
      )}
      onClick={() => setIsOpen(true)}
      onClickOutside={() => setIsOpen(false)}
    >
      <Button kind={KIND.secondary}>Menu</Button>
    </Popover>
  );
}
