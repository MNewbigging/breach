import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatedBlock } from "../animated-block/animated-block";
import { Screen } from "../screen/screen";
import styles from "./memory-defrag-screen.module.scss";
import { useEventUpdater } from "../hooks/use-event-updater";
import clsx from "clsx";
import { Breach } from "../../game/breach";
import { Dictionary } from "../../game/load-dictionary";
import {
  MDBankWord,
  MDLetter,
  MemoryDefragLevel,
} from "../../game/levels/memory-defrag-level";
import { Button } from "../button/button";
import { SideMenu } from "../side-menu/side-menu";
import { isSortable, useSortable } from "@dnd-kit/react/sortable";
import {
  DragDropEventHandlers,
  DragDropProvider,
  PointerSensor,
} from "@dnd-kit/react";
import { PointerActivationConstraints } from "@dnd-kit/dom";

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
    levelStateRef.current = new MemoryDefragLevel(
      breach,
      dictionary,
      breach.getNextLevel().difficulty,
    );
  }

  const levelState = levelStateRef.current;
  const { letterPool, wordBar, wordBank } = levelState;

  // Add/remove listeners from the component
  useEffect(() => {
    window.addEventListener("keydown", levelState.onKeyDown);
    return () => window.removeEventListener("keydown", levelState.onKeyDown);
  }, []);

  // This comp owns the custom visual ordering of the letters in pool
  const [poolOrder, setPoolOrder] = useState<string[]>(() =>
    letterPool.map((letter) => letter.id),
  );

  const orderedLetterPool = useMemo(() => {
    const byId = new Map(letterPool.map((letter) => [letter.id, letter]));
    return poolOrder
      .map((id) => byId.get(id))
      .filter((letter): letter is MDLetter => Boolean(letter));
  }, [letterPool, poolOrder]);

  useEffect(() => {
    setPoolOrder((current) => {
      const nextIds = letterPool.map((letter) => letter.id);
      console.log("runs");
      // Preserve existing order where possible & add new ids
      const kept = current.filter((id) => nextIds.includes(id));
      const appended = nextIds.filter((id) => !kept.includes(id));
      return [...kept, ...appended];
    });
  }, [letterPool]);

  function handleDragEnd(
    event: Parameters<DragDropEventHandlers["onDragEnd"]>[0],
  ) {
    if (event.canceled) return;

    const { source } = event.operation;
    if (!isSortable(source)) return;

    const { initialIndex, index } = source;
    if (initialIndex === index) return;

    setPoolOrder((current) => {
      const next = [...current];
      const [removed] = next.splice(initialIndex, 1);
      next.splice(index, 0, removed);
      return next;
    });
  }

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
      <AnimatedBlock className={clsx(styles["section"], styles["title-bar"])}>
        {`>MEMORY DEFRAG<`}
        <SideMenu breach={breach} />
      </AnimatedBlock>

      <AnimatedBlock
        className={clsx(styles["section"], styles["exploit-area"])}
      >
        <Button
          size="s"
          text={`WILD: ${levelState.wildExploitCost}`}
          onClick={() => levelState.useWildExploit()}
          disabled={breach.exploitTokens === 0}
        />

        <Button
          size="s"
          text={`PURGE: ${levelState.purgeExploitCost}`}
          onClick={onPressPurge}
          disabled={breach.exploitTokens === 0}
        />

        <div>Exploit Tokens: {breach.exploitTokens}</div>
      </AnimatedBlock>

      <AnimatedBlock className={clsx(styles["section"], styles["letter-pool"])}>
        <DragDropProvider
          sensors={(defaults) =>
            defaults.map((sensor) => {
              if (sensor === PointerSensor) {
                return PointerSensor.configure({
                  activationConstraints: [
                    new PointerActivationConstraints.Delay({
                      value: 0,
                      tolerance: 2,
                    }),
                  ],
                });
              }
              return sensor;
            })
          }
          onDragEnd={handleDragEnd}
        >
          {orderedLetterPool.map((letter, index) => (
            <SortableLetter
              key={letter.id}
              index={index}
              className={clsx(
                styles["pool-letter"],
                styles[letter.state],
                purging && styles["purge-active"],
              )}
              onClick={() => onClickPoolLetter(letter)}
              letter={letter}
            />
          ))}
        </DragDropProvider>
      </AnimatedBlock>

      <AnimatedBlock className={clsx(styles["section"], styles["word-bar"])}>
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

      <AnimatedBlock className={clsx(styles["section"], styles["word-bank"])}>
        {wordBank.map((bankWord, index) => (
          <WordTag
            key={`bank-word-${index}`}
            bankWord={bankWord}
            onClick={() => levelState.clearWord(bankWord)}
          />
        ))}
      </AnimatedBlock>

      <AnimatedBlock className={clsx(styles["section"], styles["centered"])}>
        <Button
          size="s"
          text="FINISH"
          onClick={() => levelState.finish()}
          disabled={!levelState.canFinish()}
        />
      </AnimatedBlock>
    </Screen>
  );
}

interface SortableLetterProps {
  index: number;
  className: string;
  onClick: () => void;
  letter: MDLetter;
}

function SortableLetter({
  index,
  className,
  onClick,
  letter,
}: SortableLetterProps) {
  const { ref } = useSortable({ id: letter.id, index });

  return (
    <div
      ref={ref}
      className={className}
      onClick={onClick}
      style={{ touchAction: "none" }}
    >
      {letter.char}
    </div>
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
