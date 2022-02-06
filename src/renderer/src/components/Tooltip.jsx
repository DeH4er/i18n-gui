import React, { memo, useCallback, useState, useRef, Children } from 'react';
import { animated, useTransition } from 'react-spring';

import { useStyletron } from 'baseui';
import { Layer, TetherBehavior, TETHER_PLACEMENT } from 'baseui/layer';

import { useForceUpdate, useEventListener } from 'src/core/utils';

function Tooltip({ tooltip, children }) {
  const forceUpdate = useForceUpdate();
  const [, theme] = useStyletron();
  const [isOpen, setIsOpen] = useState(false);
  const [offset, setOffset] = useState(null);
  const transition = useTransition(isOpen, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    delay: 300,
    config: { duration: 100 },
  });

  const anchor = Children.only(children);
  const anchorRef = useRef();
  const popperRef = useRef();

  const openTooltip = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeTooltip = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEventListener(anchorRef, 'mouseenter', openTooltip);
  useEventListener(anchorRef, 'mouseleave', closeTooltip);

  function onPopperUpdate(normalizedOffsets) {
    setOffset(normalizedOffsets.popper);
  }

  return (
    <>
      {React.cloneElement(anchor, { ...anchor.props, ref: anchorRef })}
      {isOpen && (
        <Layer onMount={forceUpdate} isHoverLayer>
          <TetherBehavior
            anchorRef={anchorRef.current}
            popperRef={popperRef.current}
            placement={TETHER_PLACEMENT.bottom}
            onPopperUpdate={onPopperUpdate}
            popperOptions={{
              preventOverflow: { enabled: false },
              modifiers: { padding: 0 },
            }}
          >
            {transition((animation) => (
              <animated.div
                ref={popperRef}
                style={{
                  ...animation,
                  ...theme.typography.font200,
                  padding: '10px 20px',
                  background: theme.colors.backgroundTertiary,
                  color: theme.colors.primary,
                  top: `${offset?.top}px`,
                  left: `${offset?.left}px`,
                  position: 'absolute',
                  marginTop: '5px',
                  boxShadow: `0 0 15px ${theme.colors.backgroundSecondary}`,
                }}
              >
                {tooltip}
              </animated.div>
            ))}
          </TetherBehavior>
        </Layer>
      )}
    </>
  );
}

export default memo(Tooltip);
