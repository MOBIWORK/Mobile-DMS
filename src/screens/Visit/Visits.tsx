import React from 'react';

import ListVisit from './VisitList/ListVisit';
import isEqual from 'react-fast-compare';


const Visits = () => {
  return <ListVisit />;
};

export default React.memo(Visits,isEqual);

