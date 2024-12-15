import React from 'react';
import { Button } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import styled from 'styled-components';
import { useSuccessNotification } from '../../hooks/useSuccessNotification';
import { getErrorMessage } from '../../services/utils';
import { useErrorNotification } from '../../hooks/useErrorNotification';
import { Players } from './Players';
import { GameContent } from './GameContent';

const GameContainer = styled.div`
  width: 100%;
  min-width: 500px;
  max-width: 1500px;
  margin-inline: auto;
  margin-top: 40px;
`;

const GameHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

export function Game() {
  const notifySuccess = useSuccessNotification();
  const notifyError = useErrorNotification();

  const onCopy = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => notifySuccess('Game url copied.'))
      .catch((err) => {
        console.error('Failed to copy game url', getErrorMessage(err));
        notifyError('Failed to copy game url: ' + getErrorMessage(err));
      });
  };

  return (
    <GameContainer>
      <GameHeader>
        <Button endIcon={<ContentCopy />} onClick={onCopy}>
          Copy game url
        </Button>
        <Players />
      </GameHeader>
      <GameContent />
    </GameContainer>
  );
}
