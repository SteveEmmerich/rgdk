import FrameInterface from './frame.interface';
import { FPS } from '../constants';
import { interval, animationFrameScheduler } from 'rxjs';
import { scan } from 'rxjs/operators';
import produce,  { Draft } from 'immer'

const initialState: FrameInterface = {
    frameStartTime: performance.now(),
    deltaTime: 0,
};

const clock = interval(1000/FPS, animationFrameScheduler);

const updateTime = produce((draft: Draft<FrameInterface>, previousTime) => {
  draft.frameStartTime = performance.now();
  draft.deltaTime = draft.frameStartTime - previousTime.frameStartTime;
})

export default clock.pipe(
  scan(previous => updateTime(initialState, previous), initialState),
)

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