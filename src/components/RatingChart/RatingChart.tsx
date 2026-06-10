import clsx from 'clsx';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import type { IRatingSummary, Score } from '../../@types/data';
import Heading from '../Heading/Heading';

import './RatingChart.scss';

interface RatingChartProps {
  summary: IRatingSummary | null;
  isLoading: boolean;
}

const LEGEND_KEYS = ['disappointing', 'satisfactory', 'good', 'excellent'] as const;

type Rating = (typeof LEGEND_KEYS)[number];

const LEGEND_SCORE_MAP: Record<Rating, Score[]> = {
  disappointing: [1, 2],
  satisfactory: [3],
  good: [4],
  excellent: [5],
};

const DEFAULT_BREAKDOWN: Record<Score, number> = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };

const EMPTY_CHART: IRatingSummary = {
  avgScore: 0,
  totalCount: 0,
  scoreBreakdown: DEFAULT_BREAKDOWN,
};

export const RatingChartView = ({ summary, isLoading }: RatingChartProps) => {
  const { t } = useTranslation('components', { keyPrefix: 'ratingChart' });

  const { totalCount, scoreBreakdown } = summary || EMPTY_CHART;

  const reversedLegendKeys = useMemo(() => LEGEND_KEYS.toReversed(), []);
  const processedChartData = useMemo(() => {
    const result = [];
    let currentOffset = 0;

    for (const key of LEGEND_KEYS) {
      const score = LEGEND_SCORE_MAP[key].reduce((sum, key) => {
        return sum + (scoreBreakdown[key] ?? 0);
      }, 0);
      const ratio = score / (totalCount || 1);

      result.push({ key, ratio, offset: currentOffset });
      currentOffset += ratio;
    }

    return result;
  }, [scoreBreakdown]);

  const gradientString = useMemo(() => {
    if (isLoading) {
      return 'var(--color-foreground-50)';
    }

    let currentPos = 0;
    const stops: string[] = [];

    processedChartData.forEach(({ key, ratio }) => {
      if (ratio === 0) return;

      const start = currentPos;
      const end = currentPos + ratio * 100;
      const gap = 0.5;

      stops.push(`var(--color-${key}) ${start}%`);
      stops.push(`var(--color-${key}-accent) ${end - gap}%`);
      stops.push(`transparent ${end - gap}%`);
      stops.push(`transparent ${end}%`);

      currentPos = end;
    });

    return `conic-gradient(${stops.join(', ')})`;
  }, [processedChartData, isLoading]);

  return (
    <div className="rating-chart">
      <div className="rating-chart__content">
        <div className="rating-chart__visual">
          <div className="rating-chart__pie" style={{ background: gradientString }} />
          <div className="rating-chart__center">
            <span className="rating-chart__count">{totalCount}</span>
            <br />
            <span className="rating-chart__label">{t('vote', { count: totalCount })}</span>
          </div>
        </div>
        <ul className="rating-chart__legend">
          {reversedLegendKeys.map((key) => (
            <li key={key} className="rating-chart__legend-item">
              <span className={clsx('rating-chart__marker', `rating-chart__marker--${key}`)} />
              {t(`legend.${key}`)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const RatingChart = ({ summary, isLoading }: RatingChartProps) => {
  const { t } = useTranslation('components', { keyPrefix: 'ratingChart' });

  return (
    <section className="rating-chart-wrapper">
      <Heading type="h2">{t('heading')}</Heading>
      <RatingChartView summary={summary} isLoading={isLoading} />
    </section>
  );
};

export default RatingChart;
