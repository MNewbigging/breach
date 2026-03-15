import { useEffect, useRef, useState } from "react";
import {
  MDBankWord,
  MDLetter,
  MemoryDefragLevel,
} from "../../game/memory-defrag-level";
import { AnimatedBlock } from "../animated-block/animated-block";
import { Screen } from "../screen/screen";
import styles from "./memory-defrag-screen.module.scss";
import { useEventUpdater } from "../hooks/use-event-updater";
import clsx from "clsx";
import { Breach } from "../../game/breach";
import { Dictionary } from "../../game/load-dictionary";

interface MemoryDefragScreenProps {
  breach: Breach;
  dictionary: Dictionary;
}

export function MemoryDefragScreen({
  breach,
  dictionary,
}: MemoryDefragScreenProps) {
  useEventUpdater("memory-defrag-update");
  const [purging, setPurging] = useState(false);

  // Instantiate level state inside ref
  const levelStateRef = useRef<MemoryDefragLevel | null>(null);
  if (!levelStateRef.current) {
    levelStateRef.current = new MemoryDefragLevel(breach, dictionary);
  }

  const levelState = levelStateRef.current;
  const { letterPool, wordBar, wordBank } = levelState;

  // Add/remove listeners from the component
  useEffect(() => {
    window.addEventListener("keydown", levelState.onKeyDown);
    return () => window.removeEventListener("keydown", levelState.onKeyDown);
  }, []);

  function onPressPurge() {
    if (!purging && !breach.canAffordExploit(levelState.purgeExploitCost))
      return;

    setPurging(!purging);
  }

  function onClickPoolLetter(letter: MDLetter) {
    if (purging && letter.state === "unused") {
      levelState.usePurgeExploit(letter);
      setPurging(false);
    } else levelState.onTapPoolLetter(letter);
  }

  return (
    <Screen className={styles["screen-container"]}>
      <AnimatedBlock className={styles["top-bar"]}>
        <div className={styles["exploit-area"]}>
          <div
            className={styles["exploit-button"]}
            onClick={() => levelState.useWildExploit()}
          >
            WILD: {levelState.wildExploitCost}
          </div>
          <div
            className={clsx(
              styles["exploit-button"],
              purging && styles["purging"],
            )}
            onClick={onPressPurge}
          >
            PURGE: {levelState.purgeExploitCost}
          </div>
        </div>
        <div>Exploit Tokens: {breach.exploitTokens}</div>
      </AnimatedBlock>

      <AnimatedBlock className={styles["letter-pool"]}>
        {letterPool.map((letter, index) => (
          <Letter
            key={`pool-letter-${index}`}
            letter={letter}
            className={clsx(
              styles["pool-letter"],
              styles[letter.state],
              purging && styles["purge-active"],
            )}
            onClick={() => onClickPoolLetter(letter)}
          />
        ))}
      </AnimatedBlock>

      <AnimatedBlock className={styles["word-bar"]}>
        <span className={styles["input-prefix"]} aria-hidden="true">
          &gt;
        </span>

        <div className={styles["word-input"]}>
          {wordBar.map((letter, index) => (
            <Letter
              key={`bar-letter-${index}`}
              letter={letter}
              className={styles["bar-letter"]}
              onClick={() => levelState.onTapBarLetter(letter)}
            />
          ))}
        </div>

        <div
          className={styles["submit-button"]}
          onClick={() => levelState.submit()}
        >
          ⏎
        </div>
      </AnimatedBlock>

      <AnimatedBlock className={styles["word-bank"]}>
        {wordBank.map((bankWord, index) => (
          <WordTag
            key={`bank-word-${index}`}
            bankWord={bankWord}
            onClick={() => levelState.clearWord(bankWord)}
          />
        ))}
      </AnimatedBlock>
    </Screen>
  );
}

interface LetterProps {
  className: string; // different styling for pool/bar
  onClick: () => void;
  letter: MDLetter;
}

function Letter({ className, onClick, letter }: LetterProps) {
  return (
    <div className={className} onClick={onClick}>
      {letter.char}
    </div>
  );
}

function WordTag({
  bankWord,
  onClick,
}: {
  bankWord: MDBankWord;
  onClick: () => void;
}) {
  return (
    <div className={styles["word-tag"]}>
      <div>{bankWord.word}</div>
      <div className={styles["tag-clear"]} onClick={onClick}>
        [x]
      </div>
    </div>
  );
}
