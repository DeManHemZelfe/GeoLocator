declare module 'ol-ext' {
  const x: any;
  export default x;
}

declare module 'ol-ext/interaction/transform' {
  import Pointer from 'ol/interaction/Pointer';
  import BaseLayer from 'ol/layer/Base';
  import Feature from 'ol/Feature';
  import { Condition } from 'ol/events/condition';
  import Collection from 'ol/Collection';
  import Style from 'ol/style/Style';
  import olEvent from 'ol/events/Event';

  export default class Transform extends Pointer {
    constructor(options?: TransformOptions)
  }

  export interface TransformOptions {
    filter?: (feature: Feature, layer: BaseLayer) => boolean;
    layers?: BaseLayer[];
    features?: Collection<Feature>;
    addCondition?: Condition | undefined;
    hitTolerance?: number | undefined;
    translateFeature?: boolean;
    translate?: boolean;
    stretch?: boolean;
    scale?: boolean;
    rotate?: boolean;
    noFlip?: boolean;
    selection?: boolean;
    keepAspectRatio?: Condition | undefined;
    modifyCenter?: Condition | undefined;
    style?: Style[];
  }

  export interface TransformEvent extends olEvent {
    feature?: Feature;
  }
}

// Workaround for issue with editing figures.
// See issue: https://github.com/openlayers/openlayers/issues/6310
// See workaround: https://github.com/openlayers/openlayers/issues/6310#issuecomment-408389319
declare module 'ol/structs/RBush' {
  export default class RBush {
    update(): void;
  }
}