import React, { useEffect } from 'react';
import { useInterval } from '../hooks/use-interval';
import { Button } from '../components/button';
import { Timer } from '../components/timer';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bellStart = require('../sounds/bell-start.mp3');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const bellFinish = require('../sounds/bell-finish.mp3');

const audioStartWorking = new Audio(bellStart);
const audioStopWorking = new Audio(bellFinish);

interface Props {
  pomodoroTimer: number;
  shortRestTime: number;
  longRestTime: number;
  cycles: number;
}

export function PomodoroTimer(props: Props): JSX.Element {
  const [mainTime, setMainTime] = React.useState(props.pomodoroTimer);
  const [timeCounting, setTimeCounting] = React.useState(false);
  const [timeWorking, setTimeWorking] = React.useState(false);
  const [timeResting, setTimeResting] = React.useState(false);

  useEffect(() => {
    if (timeWorking) document.body.classList.add('working');
    if (timeResting) document.body.classList.remove('working');
  }, [timeWorking]);

  useInterval(
    () => {
      setMainTime(mainTime - 1);
    },
    timeCounting ? 1000 : null,
  );

  const configureWork = () => {
    setTimeCounting(true);
    setTimeWorking(true);
    setTimeResting(false);
    setMainTime(props.pomodoroTimer);
    audioStartWorking.play();
  };

  const configureRest = (long: boolean) => {
    setTimeCounting(true);
    setTimeWorking(true);
    setTimeResting(true);

    if (long) {
      setMainTime(props.longRestTime);
    } else {
      setMainTime(props.shortRestTime);
    }

    audioStopWorking.play();
  };

  return (
    <div className="pomodoro">
      <h2>You are: working</h2>
      <Timer mainTime={mainTime} />
      <div className="controls">
        <Button text="Work" onClick={() => configureWork()}></Button>
        <Button text="Rest" onClick={() => configureRest(false)}></Button>
        <Button
          className={!timeWorking && !timeResting ? 'hidden' : ''}
          text={timeCounting ? 'Pause' : 'Play'}
          onClick={() => setTimeCounting(!timeCounting)}
        ></Button>
      </div>

      <div className="details">
        <p>Testando: sdkjgnjdsng</p>
        <p>Testando: sdkjgnjdsng</p>
        <p>Testando: sdkjgnjdsng</p>
        <p>Testando: sdkjgnjdsng</p>
      </div>
    </div>
  );
}
