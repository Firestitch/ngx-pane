import { InjectionToken } from '@angular/core';

/** Injection token that can be used to access the data that was passed in to a drawer. */
export const PANE_DATA = new InjectionToken<any>('fs.pane-data');
