import { format } from 'date-fns';
import { useTranslations } from 'next-intl';
import React from 'react';
import { HeatMapGrid } from 'react-grid-heatmap';

import { getNovaPulse } from '@/actions/nova-pulse/get-nova-pulse';
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui';
import { formatTimeInSeconds } from '@/lib/date';
import { capitalize } from '@/lib/utils';

type HeatmapProps = {
  data: Awaited<ReturnType<typeof getNovaPulse>>['heatMap'];
  summary: Awaited<ReturnType<typeof getNovaPulse>>['summary'];
};

const getHeatMapColor = (
  value: number,
  min: number,
  max: number,
  startColor: { r: number; g: number; b: number },
  endColor: { r: number; g: number; b: number },
) => {
  const normalized = Math.min(Math.max((value - min) / (max - min), 0), 1);

  const r = Math.floor(startColor.r + normalized * (endColor.r - startColor.r));
  const g = Math.floor(startColor.g + normalized * (endColor.g - startColor.g));
  const b = Math.floor(startColor.b + normalized * (endColor.b - startColor.b));

  return `rgb(${r}, ${g}, ${b})`;
};

export const Heatmap = ({ data, summary }: HeatmapProps) => {
  const t = useTranslations('nova-pulse.heatmap');

  const xLabels = new Array(12).fill(0).map((_, index) => {
    const date = new Date(2024, index, 1);

    return capitalize(format(date, 'LLL'));
  });
  const yLabels = Object.keys(data)
    .map((key) => key.split('-')[0])
    .filter((value, index, arr) => arr.indexOf(value) === index)
    .toSorted((a, b) => Number(b) - Number(a));

  const maxValue = Math.max(...Object.values(data).map((progress) => progress.xp));

  const heatMapData: number[][] = [];

  yLabels.forEach((y) => {
    const row = xLabels.map((_, indexX) => {
      const key = `${y}-${indexX + 1 < 10 ? 0 : ''}${indexX + 1}`;
      const xp = data?.[key]?.xp;

      return xp ?? 0;
    });

    heatMapData.push(row);
  });

  return (
    <Card className="shadow-none h-full p-6">
      <CardTitle className="mb-2">{t('title')}</CardTitle>
      <CardDescription className="text-xs mb-4">{summary.body}</CardDescription>
      <CardContent className="m-0 p-0">
        <div
          style={{
            width: '100%',
            fontFamily: 'sans-serif',
          }}
        >
          <HeatMapGrid
            data={heatMapData}
            yLabels={yLabels}
            xLabels={xLabels}
            cellRender={(x, y, value) => {
              const style = {
                opacity: value ? 1 : 0.3,
                background: getHeatMapColor(
                  value,
                  0,
                  maxValue,
                  { r: 4, g: 120, b: 87 },
                  { r: 167, g: 243, b: 208 },
                ),
              };

              const key = `${yLabels[x]}-${y + 1 < 10 ? 0 : ''}${y + 1}`;
              const targetInfo = data[key];

              return value > 0 ? (
                <TooltipProvider key={`${x}-${y}`}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="w-full h-full dark:text-muted border bg-muted hover:cursor-pointer"
                        style={style}
                      >
                        {value}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      <p>
                        Набрано <strong>{value} </strong> XP
                      </p>
                      {targetInfo.totalSpentTimeInSec > 0 && (
                        <p>
                          Потрачено{' '}
                          <strong>{formatTimeInSeconds(targetInfo.totalSpentTimeInSec)}</strong>
                        </p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <div style={style}>&nbsp;</div>
              );
            }}
            xLabelsStyle={(index) => ({
              color: index % 2 ? 'transparent' : '#777',
              fontSize: '.65rem',
            })}
            yLabelsStyle={() => ({
              fontSize: '.65rem',
              textTransform: 'uppercase',
              color: '#777',
            })}
            cellStyle={() => ({
              background: 'none',
              border: 'none',
              borderRadius: '0',
              fontSize: '.7rem',
              margin: '1px',
            })}
            cellHeight="1.5rem"
            xLabelsPos="bottom"
          />
        </div>
      </CardContent>
    </Card>
  );
};
