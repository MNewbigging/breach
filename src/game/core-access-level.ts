import { eventDispatcher } from "../events/event-dispatcher";
import { Breach } from "./breach";
import { getBreachAttempts } from "./hints/search-space";
import { LevelStats } from "./types";

export type CharFeedbackType = "pos-match" | "char-match" | "miss";

export interface CandidateFeedback {
  candidate: string;
  charsCorrect: number;
  positionsCorrect: number;
  charFeedback: CharFeedbackType[];
}

export class CoreAccessLevel {
  feedback: CandidateFeedback[] = [];
  attempts: number;

  constructor(private breach: Breach) {
    this.attempts = getBreachAttempts(breach);
    console.log(breach.corePassword);
  }

  submit(candidate: string) {
    // Don't resubmit passwords
    if (this.alreadySubmitted(candidate)) return;

    // Get feedback for this candidate
    const feedback = this.getCandidateFeedback(candidate);
    this.feedback.push(feedback);

    // Reduce attempts
    this.attempts--;

    // Game over?
    const stats = this.getGameOverStats(feedback);
    if (stats) {
      // Wait a second for animations
      setTimeout(() => this.breach.concludeLevel(stats), 1000);
    }

    eventDispatcher.fire("core-access-update");
  }

  getCandidateFeedback(candidate: string) {
    let charsCorrect = 0;
    let positionsCorrect = 0;

    const pwArr = [...this.breach.corePassword];
    const candidateArr = [...candidate];
    const charFeedback: CharFeedbackType[] = Array(candidate.length).fill(
      "miss",
    );

    // First pass — exact matches
    for (let i = 0; i < candidateArr.length; i++) {
      if (candidateArr[i] === pwArr[i]) {
        positionsCorrect++;
        charFeedback[i] = "pos-match";
        pwArr[i] = null as any; // consume
        candidateArr[i] = null as any; // consume
      }
    }

    // Second pass — character matches (wrong position)
    for (let i = 0; i < candidateArr.length; i++) {
      if (candidateArr[i] && pwArr.includes(candidateArr[i])) {
        charsCorrect++;
        charFeedback[i] = "char-match";

        const index = pwArr.indexOf(candidateArr[i]);
        pwArr[index] = null as any; // consume matched char so dupes don't re-match
      }
    }

    return {
      candidate,
      charsCorrect,
      positionsCorrect,
      charFeedback,
    };
  }

  private alreadySubmitted(candidate: string) {
    return this.feedback.some((fb) => fb.candidate === candidate);
  }

  private getGameOverStats(
    lastFeedback: CandidateFeedback,
  ): LevelStats | undefined {
    // Win
    if (lastFeedback.positionsCorrect === this.breach.corePassword.length) {
      return {
        screen: "core-access",
        result: "win",
        gainedXp: 1,
      };
    }

    // Loss
    if (this.attempts <= 0) {
      return {
        screen: "core-access",
        result: "lose",
        gainedXp: 0,
      };
    }

    return undefined;
  }
}
