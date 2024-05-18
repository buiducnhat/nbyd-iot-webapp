import { css } from '@emotion/react';
import { Flex, Modal, Typography } from 'antd';
import { useCallback } from 'react';

import useApp from '@/hooks/use-app';

type TPairingModalContentProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  onCancel: () => void;
  timeout: number;
};

const ParingModal = ({
  open,
  onCancel,
  timeout,
}: TPairingModalContentProps) => {
  const { t, token } = useApp();

  const secondToMinute = useCallback((seconds: number) => {
    const minute = Math.floor(seconds / 60);
    const second = seconds % 60;
    return `${minute < 10 ? `0${minute}` : minute}:${
      second < 10 ? `0${second}` : second
    }`;
  }, []);

  return (
    <Modal
      title={t('Paring')}
      open={open}
      onCancel={onCancel}
      cancelText={t('Cancel')}
      okButtonProps={{ style: { display: 'none' } }}
    >
      <Flex
        vertical
        align="center"
        css={css`
          margin-left: -48px;
        `}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid"
          width="200"
          height="200"
          style={{
            shapeRendering: 'auto',
            display: 'block',
            background: 'transparent',
          }}
          xmlnsXlink="http://www.w3.org/1999/xlink"
        >
          <g>
            <circle
              cx="50"
              cy="50"
              r="0"
              fill="none"
              stroke={token.colorSuccess}
              strokeWidth={2}
            >
              <animate
                attributeName="r"
                repeatCount="indefinite"
                dur="2s"
                values="0;40"
                keyTimes="0;1"
                keySplines="0 0.2 0.8 1"
                calcMode="spline"
                begin="0s"
              ></animate>
              <animate
                attributeName="opacity"
                repeatCount="indefinite"
                dur="2s"
                values="1;0"
                keyTimes="0;1"
                keySplines="0.2 0 0.8 1"
                calcMode="spline"
                begin="0s"
              ></animate>
            </circle>
            <circle
              cx="50"
              cy="50"
              r="0"
              fill="none"
              stroke={token.colorSuccess}
              strokeWidth={2}
            >
              <animate
                attributeName="r"
                repeatCount="indefinite"
                dur="2s"
                values="0;40"
                keyTimes="0;1"
                keySplines="0 0.2 0.8 1"
                calcMode="spline"
                begin="-1s"
              ></animate>
              <animate
                attributeName="opacity"
                repeatCount="indefinite"
                dur="2s"
                values="1;0"
                keyTimes="0;1"
                keySplines="0.2 0 0.8 1"
                calcMode="spline"
                begin="-1s"
              ></animate>
            </circle>
            <g></g>
          </g>
        </svg>

        <Typography.Title
          level={3}
          css={css`
            color: ${token.colorSuccess} !important;
          `}
        >
          {secondToMinute(timeout)}
        </Typography.Title>
      </Flex>
    </Modal>
  );
};

export default ParingModal;
