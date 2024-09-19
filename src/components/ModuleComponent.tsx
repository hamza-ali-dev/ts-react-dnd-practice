import React from 'react';
import { Box } from '@mui/material';
import { useDrag, useDragDropManager } from 'react-dnd';
import { useRafLoop } from 'react-use';

import ModuleInterface from '../types/ModuleInterface';
import { moduleW2LocalWidth, moduleX2LocalX, moduleY2LocalY } from '../helpers';
import { COLUMN_WIDTH, CONTAINER_WIDTH, GUTTER_SIZE } from '../constants';
import Module from '../types/Module';

type ModuleProps = {
  module: ModuleInterface;
  onModuleMove: (oldModule: ModuleInterface, movedModule: ModuleInterface) => void;
  checkModuleNewCoordOverlap: (module: ModuleInterface) => boolean;
};

const ModuleComponent = (props: ModuleProps) => {
  const { module, onModuleMove, checkModuleNewCoordOverlap } = props;
  const { id, coord: { x, y, w, h } } = module;

  const [{ top, left }, setPosition] = React.useState(() => ({
    top: moduleY2LocalY(y),
    left: moduleX2LocalX(x),
  }));

  const dndManager = useDragDropManager();
  const initialPosition = React.useRef<{ top: number; left: number }>();

  const [stop, start] = useRafLoop(() => {
    const movement = dndManager.getMonitor().getDifferenceFromInitialOffset();

    if (!initialPosition.current || !movement) {
      initialPosition.current = { top: 0, left: 0 };
      return;
    }

    setPosition((prevState) => {

      const newTop = (initialPosition.current?.top ?? 0) + movement.y;
      const newLeft = (initialPosition.current?.left ?? 0) + movement.x;

      const snappedLeft = Math.round(newLeft / COLUMN_WIDTH) * COLUMN_WIDTH + GUTTER_SIZE;
      const constrainedTop = Math.max(newTop, 0);
      const constrainedLeft = Math.min(Math.max(snappedLeft, GUTTER_SIZE), CONTAINER_WIDTH - moduleW2LocalWidth(w) - GUTTER_SIZE);

      let newMovedModule = new Module(id, { x: constrainedLeft, y: constrainedTop, w, h });
      if (checkModuleNewCoordOverlap(newMovedModule)) {
        return prevState;
      }

      onModuleMove(module, newMovedModule);

      return {
        top: moduleY2LocalY(constrainedTop),
        left: constrainedLeft,
      };
    });
  }, false);

  const [, drag] = useDrag(() => ({
    type: 'module',
    item: () => {
      initialPosition.current = { top, left };

      start();
      return { id };
    },
    end: stop,
  }), [top, left]);

  return (
    <Box
      ref={drag}
      display="flex"
      position="absolute"
      border={1}
      borderColor="grey.500"
      padding="10px"
      bgcolor="rgba(0, 0, 0, 0.5)"
      top={top}
      left={left}
      width={moduleW2LocalWidth(w)}
      height={h}
      sx={{
        transitionProperty: 'top, left',
        transitionDuration: '0.1s',
        '& .resizer': {
          opacity: 0,
        },
        '&:hover .resizer': {
          opacity: 1,
        },
      }}
    >
      <Box
        flex={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
        fontSize={40}
        color="#fff"
        sx={{ cursor: 'move' }}
        draggable
      >
        <Box sx={{ userSelect: 'none', pointerEvents: 'none' }}>{id}</Box>
      </Box>
    </Box>
  );
};

export default React.memo(ModuleComponent);
