// @vitest-environment happy-dom
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import CarouselItem from './CarouselItem';
import type { CarouselRef } from './index';
import Carousel from './index';

const TEST_TRANSITION = { duration: 0 };

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn().mockImplementation(() => ({
    t: (key: string) => key,
  })),
}));

describe('Carousel component', () => {
  const createChildrenMock = (count = 3) =>
    Array.from({ length: count }).map((_, i) => {
      return (
        <CarouselItem key={i} data-testid={`slide-${i + 1}`}>
          <span>{i + 1}</span>
        </CarouselItem>
      );
    });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('rendering edge cases', () => {
    it('should render nothing (null) when children is empty', () => {
      // @ts-expect-error "case of no children"
      const { container } = render(<Carousel hasControlButtons hasNavPanel />);

      expect(container.firstChild).toBeNull();
    });

    it('should render the slide but no controls when there is only one child', () => {
      const targetText = 'some text';
      render(
        // @ts-expect-error "case of one childe"
        <Carousel hasControlButtons hasNavPanel>
          <CarouselItem>
            <span>{targetText}</span>
          </CarouselItem>
        </Carousel>,
      );

      screen.getByText(targetText);

      expect(screen.queryByLabelText('movePrev')).toBeNull();
      expect(screen.queryByLabelText('moveNext')).toBeNull();
      expect(screen.queryByLabelText('navPanel')).toBeNull();
      expect(screen.queryByLabelText(/^jumpTo/)).toBeNull();
    });

    it('should render both controls and nav panel when there are multiple children', () => {
      render(
        <Carousel hasControlButtons hasNavPanel>
          {createChildrenMock()}
        </Carousel>,
      );

      screen.getByLabelText('movePrev');
      screen.getByLabelText('moveNext');
      screen.getByLabelText('navPanelStatus');
    });
  });

  describe('active slide', () => {
    it('should render first child as active when activeItemIndex is not specified', () => {
      render(<Carousel>{createChildrenMock()}</Carousel>);

      const slide = screen.getByTestId('slide-1');

      expect(slide.className.includes('--active')).toBe(true);
    });

    it.each([0, 1, 2])('should render n-th child as active when activeItemIndex is %s', (i) => {
      render(<Carousel activeItemIndex={i}>{createChildrenMock()}</Carousel>);

      const slide = screen.getByTestId(`slide-${i + 1}`);

      expect(slide.className.includes('--active')).toBe(true);
    });
  });

  describe('slide rendering and props injection', () => {
    it('should be only one active slide when not sliding', () => {
      render(<Carousel activeItemIndex={1}>{createChildrenMock()}</Carousel>);

      const slides = screen.getAllByTestId(/^slide/);
      const activeSlides = slides.filter((slide) => slide.className.includes('--active'));
      expect(activeSlides.length).toBe(1);
    });

    it('should pass isSliding is true to both moving slides when sliding', async () => {
      render(
        <Carousel activeItemIndex={1} hasControlButtons transition={TEST_TRANSITION}>
          {createChildrenMock()}
        </Carousel>,
      );

      const btnNext = screen.getByLabelText('moveNext');

      fireEvent.click(btnNext);

      await waitFor(() => {
        const slideFrom = screen.getByTestId('slide-2');
        const slideTo = screen.getByTestId('slide-3');
        expect(slideFrom.className.includes('--sliding')).toBe(true);
        expect(slideTo.className.includes('--sliding')).toBe(true);
      });
    });

    it('should only render slides that are active, from-position, or to-position', async () => {
      render(
        <Carousel activeItemIndex={1} hasControlButtons transition={TEST_TRANSITION}>
          {createChildrenMock()}
        </Carousel>,
      );

      const btnNext = screen.getByLabelText('moveNext');

      const sliders = screen.getAllByTestId(/^slide/);
      expect(sliders.length).toBe(1);
      expect(sliders[0].className.includes('--active')).toBe(true);

      fireEvent.click(btnNext);

      await waitFor(() => {
        const sliders = screen.getAllByTestId(/^slide/);
        expect(sliders.length).toBe(2);
        expect(sliders[0].className.includes('--sliding')).toBe(true);
        expect(sliders[1].className.includes('--sliding')).toBe(true);
      });
    });
  });

  describe('control buttons', () => {
    it('should toggle controls based on hasControlButtons prop', () => {
      render(<Carousel hasControlButtons={false}>{createChildrenMock()}</Carousel>);

      expect(screen.queryByLabelText('movePrev')).toBeNull();
      expect(screen.queryByLabelText('moveNext')).toBeNull();
    });

    it('should trigger next logic when clicking next button', async () => {
      render(
        <Carousel hasControlButtons activeItemIndex={1} transition={TEST_TRANSITION}>
          {createChildrenMock(3)}
        </Carousel>,
      );

      fireEvent.click(screen.getByLabelText('moveNext'));

      const slide = await screen.findByTestId('slide-3');
      await waitFor(() => {
        expect(slide.className.includes('--active')).toBe(true);
        expect(slide.className.includes('--sliding')).toBe(false);
      });
    });

    it('should trigger prev logic when clicking prev button', async () => {
      render(
        <Carousel hasControlButtons activeItemIndex={2} transition={TEST_TRANSITION}>
          {createChildrenMock(3)}
        </Carousel>,
      );

      fireEvent.click(screen.getByLabelText('movePrev'));

      const slide = await screen.findByTestId('slide-2');
      await waitFor(() => {
        expect(slide.className.includes('--active')).toBe(true);
        expect(slide.className.includes('--sliding')).toBe(false);
      });
    });

    it('should disable buttons during sliding animation', async () => {
      vi.useFakeTimers();

      render(
        <Carousel activeItemIndex={0} hasControlButtons transition={{ duration: 500 }}>
          {createChildrenMock(3)}
        </Carousel>,
      );

      const btnPrev = screen.getByLabelText('movePrev');
      const btnNext = screen.getByLabelText('moveNext');

      fireEvent.click(btnNext);

      vi.advanceTimersByTime(250);

      expect(btnPrev.getAttribute('aria-disabled')).toBe('true');
      expect(btnNext.getAttribute('aria-disabled')).toBe('true');

      fireEvent.click(btnNext);

      await act(async () => {
        vi.runAllTimers();
        await Promise.resolve();
      });

      const slideSecond = screen.getByTestId('slide-2');
      expect(slideSecond.className.includes('--active')).toBe(true);
      expect(slideSecond.className.includes('--sliding')).toBe(false);
    });

    it.each([true, false])(
      'should have correct tabIndex based on isFocusable [%s]',
      (isFocusable) => {
        render(
          <Carousel hasControlButtons isFocusable={isFocusable}>
            {createChildrenMock()}
          </Carousel>,
        );

        const btnPrev = screen.getByLabelText('movePrev');
        const btnNext = screen.getByLabelText('moveNext');

        expect(btnNext.tabIndex).toBe(isFocusable ? 0 : -1);
        expect(btnPrev.tabIndex).toBe(isFocusable ? 0 : -1);
      },
    );
  });

  describe('nav panel', () => {
    it('should show nav panel when hasNavPanel is true', () => {
      render(<Carousel hasNavPanel>{createChildrenMock()}</Carousel>);

      screen.getByLabelText('navPanelStatus');
    });

    it('should highlight the correct nav item as active', () => {
      const { container } = render(
        <Carousel hasNavPanel activeItemIndex={3}>
          {createChildrenMock(5)}
        </Carousel>,
      );

      const navItems = container.querySelectorAll('.carousel__nav-item');
      const activeNavItems = Array.from(navItems).filter((item) =>
        item.className.includes('--active'),
      );

      expect(activeNavItems.length).toBe(1);
      expect((activeNavItems[0] as HTMLElement).dataset.id).toBe('3');
    });

    it('should jump to specific slide when clicking nav item', async () => {
      const { container } = render(
        <Carousel hasNavPanel transition={TEST_TRANSITION}>
          {createChildrenMock(5)}
        </Carousel>,
      );

      const navItem = container.querySelector('[data-id="2"]');
      if (navItem) fireEvent.click(navItem);

      const slide = await screen.findByTestId(`slide-3`);
      await waitFor(() => {
        expect(slide.className.includes('--active')).toBe(true);
        expect(slide.className.includes('--sliding')).toBe(false);
      });
    });

    it('should disable nav items during sliding animation', async () => {
      vi.useFakeTimers();

      const { container } = render(
        <Carousel hasNavPanel transition={{ duration: 500 }}>
          {createChildrenMock(3)}
        </Carousel>,
      );

      const navItems = container.querySelectorAll('.carousel__nav-item');
      fireEvent.click(navItems[2]);

      vi.advanceTimersByTime(250);

      fireEvent.click(navItems[1]);

      await act(async () => {
        vi.runAllTimers();
        await Promise.resolve();
      });

      const slideThird = screen.getByTestId('slide-3');
      expect(slideThird.className.includes('--active')).toBe(true);
      expect(slideThird.className.includes('--sliding')).toBe(false);
    });
  });

  describe('imperative API', () => {
    it('should expose next/prev methods via ref', async () => {
      const ref = React.createRef<CarouselRef>();

      render(
        <Carousel activeItemIndex={0} ref={ref} transition={TEST_TRANSITION}>
          {createChildrenMock()}
        </Carousel>,
      );

      act(() => ref.current?.next());

      await screen.findByTestId('slide-2');

      act(() => ref.current?.prev());

      await screen.findByTestId('slide-1');
    });

    it('should expose getElement method which returns the container DOM node', () => {
      const ref = React.createRef<CarouselRef>();

      const { container } = render(
        <Carousel activeItemIndex={3} ref={ref}>
          {createChildrenMock(5)}
        </Carousel>,
      );

      const containerElem = ref.current?.getElement();

      expect(container.querySelector('.carousel__container')).toBe(containerElem);
    });

    it('should expose jumpTo method in ref', async () => {
      const ref = React.createRef<CarouselRef>();

      render(
        <Carousel activeItemIndex={0} ref={ref} transition={TEST_TRANSITION}>
          {createChildrenMock(5)}
        </Carousel>,
      );

      act(() => ref.current?.jumpTo(4));

      await screen.findByTestId('slide-5');
    });
  });
});
