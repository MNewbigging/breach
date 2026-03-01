import styles from './cheat-sheet.module.scss';

export function CheatSheet() {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  return <div className={styles['cheat-sheet']}>
    {[...letters].map(ch => (<div key={ch} className={styles['letter']}>{ch}</div>))}
  </div>
}