import { Poppins } from 'next/font/google';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500'] });

export const PrettyLoader = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="loadingio-spinner-blocks-5424qohlmgh">
        <div className="ldio-n11zyy0r5u">
          <div style={{ left: '9px', top: '9px', animationDelay: '0s' }}></div>
          <div style={{ left: '20px', top: '9px', animationDelay: '0.0625s' }}></div>
          <div style={{ left: '31px', top: '9px', animationDelay: '0.125s' }}></div>
          <div style={{ left: '9px', top: '20px', animationDelay: '0.4375s' }}></div>
          <div style={{ left: '31px', top: '20px', animationDelay: '0.1875s' }}></div>
          <div style={{ left: '9px', top: '31px', animationDelay: '0.375s' }}></div>
          <div style={{ left: '20px', top: '31px', animationDelay: '0.3125s' }}></div>
          <div style={{ left: '31px', top: '31px', animationDelay: '0.25s' }}></div>
        </div>
      </div>
      <div className={poppins.className}>
        <p className="font-semibold text-base text-neutral-700 dark:text-neutral-300">Nova LMS</p>
        <p className="text-xs text-muted-foreground">Portal&nbsp;for&nbsp;educational purposes</p>
      </div>
    </div>
  );
};
