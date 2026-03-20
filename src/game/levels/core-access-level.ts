import { eventDispatcher } from "../../events/event-dispatcher";
import { Breach } from "../breach";
import {
  getCoreAccessAttempts,
  getGuessFeedback,
  GuessFeedback,
} from "../hints/search-space";
import { LevelStats } from "../types";

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
    this.attempts = getCoreAccessAttempts(breach);
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
    const feedback = getGuessFeedback(candidate, this.breach.corePassword);
    const charFeedback = buildCharFeedback(feedback);

    return {
      candidate,
      charsCorrect: feedback.charsCorrect,
      positionsCorrect: feedback.positionsCorrect,
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

function buildCharFeedback(feedback: GuessFeedback): CharFeedbackType[] {
  return feedback.exactMatches.map((isExact, i) => {
    if (isExact) return "pos-match";
    if (feedback.charMatches[i]) return "char-match";
    return "miss";
  });
}
