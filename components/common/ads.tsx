import { useEffect } from 'react';

export const Ads = () => {
  useEffect(() => {
    (window as any).yaContextCb.push(() => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      Ya.Context.AdvManager.render({
        blockId: `R-A-14392644-1`,
        renderTo: `yandex_rtb_R-A-14392644-1`,
        async: true,
      });
    });
  }, []);

  return <div id={`yandex_rtb_R-A-14392644-1`}></div>;
};
