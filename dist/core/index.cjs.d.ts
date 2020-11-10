declare const FPS = 60;
declare const click$: import("rxjs").Observable<Event>;
declare const keydown$: import("rxjs").Observable<Event>;
declare const keyup$: import("rxjs").Observable<Event>;
declare const keypressed$: import("rxjs").Observable<Event>;
declare const touch$: import("rxjs").Observable<[
    Event,
    Event,
    Event,
    Event
]>;
export { FPS, default as FrameInterface, default as clock$, click$, keydown$, keyup$, keypressed$, touch$ };
//# sourceMappingURL=index.cjs.d.ts.map