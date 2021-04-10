import { MatxLoadable } from 'matx';

const Layout1 = MatxLoadable({
  loader: () => import('./Layout1/Layout1'),
});

const MatxLayouts = {
  layout1: Layout1,
};

export default MatxLayouts;
