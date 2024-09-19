import { Box } from '@mui/material';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

import PageComponent from './PageComponent';

const PortfolioComponent = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Box mt="20px">
        <PageComponent />
      </Box>
    </DndProvider>
  );
};

export default PortfolioComponent;
