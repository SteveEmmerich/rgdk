import { fromEvent, combineLatest } from 'rxjs';


export const click$ = fromEvent(document, 'click');
export const keydown$ = fromEvent(document, 'keydown');
export const keyup$ = fromEvent(document, 'keyup');
export const keypressed$ = fromEvent(document, 'keypressed');
export const touch$ = combineLatest(
  fromEvent(document, 'touchstart'),
  fromEvent(document, 'touchmove'),
  fromEvent(document, 'touchcancel'),
  fromEvent(document, 'touchend'),
);