//****************************************
// OpaqueRefnum View Model
// National Instruments Copyright 2014
//****************************************
import { NIModelProvider } from '../Framework/niModelProvider.js';
import { OpaqueRefnum } from '../Elements/ni-opaque-refnum.js';
import { OpaqueRefnumModel } from '../Modeling/niOpaqueRefnumModel.js';
import { VisualViewModel } from './niVisualViewModel.js';
export class OpaqueRefnumViewModel extends VisualViewModel {
}
NIModelProvider.registerViewModel(OpaqueRefnumViewModel, OpaqueRefnum, OpaqueRefnumModel);
//# sourceMappingURL=niOpaqueRefnumViewModel.js.map