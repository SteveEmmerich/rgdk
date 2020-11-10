'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var rxjs = require('rxjs');
var operators = require('rxjs/operators');
var produce = require('immer');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var produce__default = /*#__PURE__*/_interopDefaultLegacy(produce);

var FPS = 60;

var initialState = {
    frameStartTime: performance.now(),
    deltaTime: 0,
};
var clock = rxjs.interval(1000 / FPS, rxjs.animationFrameScheduler);
var updateTime = produce__default['default'](function (draft, previousTime) {
    draft.frameStartTime = performance.now();
    draft.deltaTime = draft.frameStartTime - previousTime.frameStartTime;
});
var clock$1 = clock.pipe(operators.scan(function (previous) { return updateTime(initialState, previous); }, initialState));
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

var click$ = rxjs.fromEvent(document, 'click');
var keydown$ = rxjs.fromEvent(document, 'keydown');
var keyup$ = rxjs.fromEvent(document, 'keyup');
var keypressed$ = rxjs.fromEvent(document, 'keypressed');
var touch$ = rxjs.combineLatest([
    rxjs.fromEvent(document, 'touchstart'),
    rxjs.fromEvent(document, 'touchmove'),
    rxjs.fromEvent(document, 'touchcancel'),
    rxjs.fromEvent(document, 'touchend'),
]);

exports.FPS = FPS;
exports.click$ = click$;
exports.clock$ = clock$1;
exports.keydown$ = keydown$;
exports.keypressed$ = keypressed$;
exports.keyup$ = keyup$;
exports.touch$ = touch$;
