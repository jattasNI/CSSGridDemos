//****************************************
// Layout Panel View Model
// National Instruments Copyright 2014
//****************************************
import { LayoutControlViewModel } from './niLayoutControlViewModel.js';
import { LayoutPanel } from '../Elements/ni-layout-panel.js';
import { LayoutPanelModel } from '../Modeling/niLayoutPanelModel.js';
import { NIModelProvider } from '../Framework/niModelProvider.js';
export class LayoutPanelViewModel extends LayoutControlViewModel {
}
NIModelProvider.registerViewModel(LayoutPanelViewModel, LayoutPanel, LayoutPanelModel);
//# sourceMappingURL=niLayoutPanelViewModel.js.map