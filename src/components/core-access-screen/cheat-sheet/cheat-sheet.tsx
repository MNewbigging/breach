import { useState } from 'react';
import styles from './cheat-sheet.module.scss';
import clsx from 'clsx';

export function CheatSheet() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  return <div className={styles['cheat-sheet']}>
    {[...letters].map((ch, i) => (
      <Letter key={`cheat-sheet-letter-${i}`} letter={ch} />
    ))}
  </div>
}


type LetterType = 'default' | 'highlight' | 'hide';

function Letter({ letter }: { letter: string }) {
  const [type, setType] = useState<LetterType>('default');

  function onClick() {
    // Cycle through types
    if (type === 'default') setType('highlight');
    else if (type === 'highlight') setType('hide');
    else if (type === 'hide') setType('default');
  }


  return <div className={clsx(styles['letter'], styles[type])} onClick={onClick}>
    <span>{letter}</span>
    <span>{letter.charCodeAt(0) - 64}</span>
  </div>
}