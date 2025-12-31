import { interval, animationFrameScheduler, fromEvent, combineLatest } from 'rxjs';
import { scan } from 'rxjs/operators';
import produce from 'immer';

var FPS = 60;

var initialState = {
    frameStartTime: performance.now(),
    deltaTime: 0,
};
var clock = interval(1000 / FPS, animationFrameScheduler);
var updateTime = produce(function (draft, previousTime) {
    draft.frameStartTime = performance.now();
    draft.deltaTime = draft.frameStartTime - previousTime.frameStartTime;
});
var clock$1 = clock.pipe(scan(function (previous) { return updateTime(initialState, previous); }, initialState));
/*
  scan((previous) => {
        const time = performance.now();
        return previous.merge({
          time,
          delta: time - previous.get('time')
        });
      }, state)
    );

const increment = produce((draft: Draft<State>, inc: number) => {
    // `x` can be modified here
    draft.x += inc
})
frameStartTime: Number;
  readonly deltaTime: Number;
 */

var click$ = fromEvent(document, 'click');
var keydown$ = fromEvent(document, 'keydown');
var keyup$ = fromEvent(document, 'keyup');
var keypressed$ = fromEvent(document, 'keypressed');
var touch$ = combineLatest([
    fromEvent(document, 'touchstart'),
    fromEvent(document, 'touchmove'),
    fromEvent(document, 'touchcancel'),
    fromEvent(document, 'touchend'),
]);

export { FPS, click$, clock$1 as clock$, keydown$, keypressed$, keyup$, touch$ };
