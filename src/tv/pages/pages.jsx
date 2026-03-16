import { Suspense, useMemo, useRef, useEffect } from 'react';
import { MVP_VARS } from '@/tv/utils/layout';
import { useLocation, useNavigate } from 'react-router-dom';
import { FocusNode, useSetFocus } from '@please/lrud';
import { useSettingsCss } from '@netflix-internal/xd-settings';
import { useUIContext } from '@/contexts/ui';
import { useHotkeys } from 'react-hotkeys-hook';
import Loader from '@/tv/common/loader';

import { FadeInWrapper } from '@/tv/common/motion-wrappers';
import { Pages as pages } from './page-constants';

export default function Page({ pageId, focus, steps = 4 }) {
  const { className, style } = useSettingsCss();
  const focusTimeoutRef = useRef();
  const { setCurrentStep, setPageId, currentStep, setIsToastDismissed } =
    useUIContext();

  const _pageId = `${pageId}-${focus}`;

  // Memoize the component to avoid unnecessary re-renders
  const Component = useMemo(() => pages[_pageId]?.['component'], [_pageId]);
  let _focusId = pages[_pageId]?.['focus']?.[currentStep - 1];

  const setFocus = useSetFocus();

  const location = useLocation();
  const navigate = useNavigate();

  // Redirect to home page if directly landing on the subpage
  useEffect(() => {
    // Check if the user accessed the page directly by checking `location.key`.
    // `location.key` is default if they landed directly on the page (not via navigation).
    if (location.key === 'default') {
      navigate('/');
    }
  }, [location, navigate]);

  useEffect(() => {
    if (!_focusId || _focusId === '') return;
    focusTimeoutRef.current = setTimeout(() => {
      setFocus(_focusId);
    }, 200);
    return () => clearTimeout(focusTimeoutRef.current);
  }, [currentStep]);

  useEffect(() => {
    setPageId(_pageId);
  }, [_pageId, currentStep]);

  const onNext = () => {
    setCurrentStep(Math.min(currentStep + 1, steps));
  };

  const onBack = () => {
    setCurrentStep(Math.max(currentStep - 1, 0));
  };
  // Hotkey rewrite steps
  useHotkeys('1', () => {
    setCurrentStep(1);
    setIsToastDismissed(false);
  });
  useHotkeys('2', () => {
    setCurrentStep(2);
    setIsToastDismissed(true);
  });
  useHotkeys('3', () => {
    setCurrentStep(3);
    navigate('/fifa-menu');
  });
  useHotkeys('4', () => {
    setCurrentStep(4);
  });

  return (
    <div
      className={`tv-screen ${className} ${pageId} --${focus}`}
      style={{ ...MVP_VARS, ...style }}
    >
      <Suspense fallback={<Loader />}>
        <FadeInWrapper>
          <Component onBack={onBack} onNext={onNext} />
        </FadeInWrapper>
      </Suspense>
    </div>
  );
}
