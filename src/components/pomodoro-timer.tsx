import React, { useEffect, useCallback } from 'react';
import { useInterval } from '../hooks/use-interval';
import { Button } from '../components/button';
import { Timer } from '../components/timer';
import { secondsToTime } from '../utils/seconds-to-time';
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
  const [cyclesManager, setCyclesManager] = React.useState(
    new Array(props.cycles - 1).fill(true),
  );
  const [completedCycles, setCompletedCycles] = React.useState(0);
  const [fullWorkingTime, setFullWorkingTime] = React.useState(0);
  const [quantityOfPomodoros, setQuantityOfPomodoros] = React.useState(0);

  useInterval(
    () => {
      setMainTime(mainTime - 1);
      if (timeWorking) setFullWorkingTime(fullWorkingTime + 1);
    },
    timeCounting ? 1000 : null,
  );

  const configureWork = useCallback(() => {
    setTimeCounting(true);
    setTimeWorking(true);
    setTimeResting(false);
    setMainTime(props.pomodoroTimer);
    audioStartWorking.play();
  }, [
    setTimeCounting,
    setTimeWorking,
    setTimeResting,
    setMainTime,
    props.pomodoroTimer,
  ]);

  const configureRest = useCallback(
    (long: boolean) => {
      setTimeCounting(true);
      setTimeWorking(true);
      setTimeResting(true);

      if (long) {
        setMainTime(props.longRestTime);
      } else {
        setMainTime(props.shortRestTime);
      }

      audioStopWorking.play();
    },
    [
      setTimeCounting,
      setTimeWorking,
      setTimeResting,
      setMainTime,
      props.longRestTime,
      props.shortRestTime,
    ],
  );

  useEffect(() => {
    if (timeWorking) document.body.classList.add('working');
    if (timeResting) document.body.classList.remove('working');

    if (mainTime > 0) return;

    if (timeWorking && cyclesManager.length > 0) {
      configureRest(false);
      cyclesManager.pop();
    } else if (timeWorking && cyclesManager.length <= 0) {
      configureRest(true);
      setCyclesManager(new Array(props.cycles - 1).fill(true));
      setCompletedCycles(completedCycles + 1);
    }

    if (timeWorking) setQuantityOfPomodoros(quantityOfPomodoros + 1);
    if (timeResting) configureWork();
  }, [
    timeWorking,
    timeResting,
    mainTime,
    cyclesManager,
    quantityOfPomodoros,
    completedCycles,
    configureRest,
    setCyclesManager,
    configureWork,
    props.cycles,
  ]);

  return (
    <div className="pomodoro">
      <h2>You are: {timeWorking ? 'Trabalhando' : 'Descansando'}</h2>
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
        <p>Completed Cycles: {completedCycles}</p>
        <p>Worked Hours: {secondsToTime(fullWorkingTime)}</p>
        <p>Completed Pomodoros: {quantityOfPomodoros}</p>
      </div>
    </div>
  );
}
