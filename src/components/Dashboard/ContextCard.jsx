import React from 'react';

const ContextCard = React.memo(({ title, value, unit, icon, description }) => {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 transition-colors duration-200 dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center gap-3">
        <span className="text-3xl select-none" aria-hidden="true">{icon}</span>
        <div>
          <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-gray-500 dark:text-gray-400">
            {title}
          </h3>
          <p className="mt-0.5 text-xl font-black text-gray-900 dark:text-white">
            {value.toLocaleString()} <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">{unit}</span>
          </p>
        </div>
      </div>
      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 leading-normal">
        {description}
      </p>
    </div>
  );
});

ContextCard.displayName = 'ContextCard';

export default ContextCard;
