import { useMemo } from 'react';
import { GAME_CONTROLS_SCREEN } from '../../types/game';
import { CategoryDrawConfirm } from './CategoryDrawConfirm';
import React from 'react';
import { BiddingScreen } from './BiddingScreen';
import { QuestionControls } from './QuestionControls';

interface GameControlsProps {
  controlsScreen: GAME_CONTROLS_SCREEN;
  isSpinningDone: boolean;
  setIsSpinningDone: (isDone: boolean) => void;
}

export function GameControls({
  controlsScreen,
  setIsSpinningDone,
  isSpinningDone
}: GameControlsProps) {
  const currentScreen = useMemo(() => {
    switch (controlsScreen) {
      case GAME_CONTROLS_SCREEN.CATEGORY_DRAW_CONFIRM:
        return (
          <CategoryDrawConfirm
            isSpinningDone={isSpinningDone}
            setIsSpinningDone={setIsSpinningDone}
          />
        );
      case GAME_CONTROLS_SCREEN.BIDDING:
        return <BiddingScreen />;
      case GAME_CONTROLS_SCREEN.QUESTION:
        return <QuestionControls />;
      case GAME_CONTROLS_SCREEN.FINISHED:
        return null;
      default:
        return null;
    }
  }, [controlsScreen, isSpinningDone, setIsSpinningDone]);

  return currentScreen;
}
