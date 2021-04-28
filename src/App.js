import React from 'react';
import { useEffect, useState } from 'react';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import styles from './App.module.css';

const App = () => {
  const [sec, setSec] = useState(0);
  const [status, setStatus] = useState('stop');
  const [firstClicktime, setFirstClicktime] = useState(0);
  useEffect(() => {
    const unsubscribe$ = new Subject();
    interval(1000)
      .pipe(takeUntil(unsubscribe$))
      .subscribe(() => {
        if (status === 'run') {
          setSec(val => val + 1000);
        }
      });
    return () => {
      unsubscribe$.next();
      unsubscribe$.complete();
    };
  }, [status]);

  const start = React.useCallback(() => {
    setStatus('run');
  }, []);

  const stop = React.useCallback(() => {
    setStatus('stop');
    setSec(0);
  }, []);

  const reset = React.useCallback(() => {
    setSec(0);
  }, []);

  const wait = () => {
    const clickTime = Date.now();
    if (clickTime - firstClicktime < 300) {
      setStatus('wait');
    }
    setFirstClicktime(clickTime);
  };

  return (
    <div className={styles.container}>
            <div className={styles.timerDisplay}>{new Date(sec).toISOString().slice(11, 19)}</div>
      <button className={styles.button} onClick={start}>
        Start
      </button>
      <button className={styles.button} onClick={stop}>
        Stop
      </button>
      <button className={styles.button} onClick={reset}>Reset</button>
      <button className={styles.button} onClick={wait}>Wait</button>
    </div>
  );
};

export default App;
