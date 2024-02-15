'use client';

export const ChatIntro = () => {
  return (
    <div className="h-full flex flex-col justify-end">
      <div className="mx-auto grid m:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2 gap-2 lg:max-w-2xl xl:max-w-3xl w-full pb-6 px-4">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="border rounded-lg w-full flex flex-col overflow-hidden p-4 h-[70px]"
          >
            <div className="truncate font-semibold text-sm">Explain superconductors</div>
            <div className="truncate text-secondary-foreground text-xs">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus, veniam? Illum
              fuga quibusdam ipsa expedita sequi eaque aliquid vero in ipsam doloribus, eligendi
              dolorem eveniet nisi nam accusantium dolorum neque.
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
