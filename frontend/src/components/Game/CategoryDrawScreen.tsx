import styled from 'styled-components';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Wheel } from 'react-custom-roulette';
import { QUESTION_CATEGORIES, QUESTION_CATEGORY } from '../../types/game';
import { WheelData } from 'react-custom-roulette/dist/components/Wheel/types';

const WheelContainer = styled.div`
  display: flex;
  justify-content: center;
  & > div {
    width: 345px;
    height: 345px;
  }
`;

const WHEEL_OPTIONS: WheelData[] = QUESTION_CATEGORIES.map((category) => ({
  option: category
}));

interface CategoryDrawScreen {
  onStopSpinning: () => void;
  category: QUESTION_CATEGORY;
}

export function CategoryDrawScreen({ onStopSpinning, category }: CategoryDrawScreen) {
  const [startSpinnig, setStartSpinning] = useState(false);
  const categoryIndex = WHEEL_OPTIONS.findIndex(({ option }) => option === category);
  const isMounted = useRef(true);

  // Otherwise onStopSpinning callback will be called, even when component is already unomunted :/
  const onStop = useCallback(() => {
    if (isMounted.current) {
      onStopSpinning();
    }
  }, [onStopSpinning]);

  useEffect(() => {
    isMounted.current = true;
    setStartSpinning(true);
    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <WheelContainer>
      <Wheel
        data={WHEEL_OPTIONS}
        prizeNumber={categoryIndex}
        mustStartSpinning={startSpinnig}
        onStopSpinning={onStop}
      />
    </WheelContainer>
  );
}
