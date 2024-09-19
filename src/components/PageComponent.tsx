import React from 'react';
import { Box } from '@mui/material';
import { useDrop } from 'react-dnd';

import Grid from './GridComponent';
import { GUTTER_SIZE } from '../constants';
import ModuleComponent from './ModuleComponent';
import Module from '../types/Module';
import ModuleInterface from '../types/ModuleInterface';

const PageComponent = () => {
  const [modules, setModules] = React.useState([
    new Module(1, { x: 1, y: 80, w: 2, h: 200 }),
    new Module(2, { x: 5, y: 0, w: 3, h: 100 }),
    new Module(3, { x: 4, y: 310, w: 3, h: 200 }),
  ]);

  const checkModuleNewCoordOverlap = (moduleNewCoord: Module) => {
    for (const module of modules) {
      if (module.overlaps(moduleNewCoord)) {
        return true;
      }
    }
    return false;
  };

  const containerRef = React.useRef<HTMLDivElement>();

  const [, drop] = useDrop({ accept: 'module' });
  drop(containerRef);

  const containerHeight = React.useMemo(() => {
    return Math.max(...modules.map(({ coord: { y, h } }) => y + h)) + GUTTER_SIZE * 2;
  }, [modules]);

  const onModuleMove = (oldModule: ModuleInterface, movedModule: ModuleInterface) => {
    if (oldModule.coord.y === movedModule.coord.y) {
      return;
    }

    const isAnotherModuleCloseToBottom = modules.some(module =>
      module.id !== oldModule.id && module.coord.y + module.coord.h > containerHeight - GUTTER_SIZE,
    );

    if (isAnotherModuleCloseToBottom) {
      return;
    }

    setModules(prevModules =>
      prevModules.map(module =>
        module.id === movedModule.id ? movedModule : module,
      ),
    );
  };

  return (
    <Box
      ref={containerRef}
      position="relative"
      width={1024}
      height={containerHeight}
      margin="auto"
      sx={{
        overflow: 'hidden',
        outline: '1px dashed #ccc',
        transition: 'height 0.2s',
      }}
    >
      <Grid height={containerHeight} />
      {modules.map((module) => (
        <ModuleComponent key={module.id} module={module} onModuleMove={onModuleMove} checkModuleNewCoordOverlap={checkModuleNewCoordOverlap} />
      ))}
    </Box>
  );
};

export default PageComponent;
