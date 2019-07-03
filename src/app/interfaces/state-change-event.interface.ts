export enum FsPaneStateChangeType {
  Created = 'created',
  Shown = 'shown',
  Hidden = 'hidden',
  Destroyed = 'destroyed',
  ContentChanged = 'contentChanged',
  OrientationChanged = 'orientationChanged',
}

export interface FsPaneStateChangeEvent {
  name: string;
  type: FsPaneStateChangeType
}
