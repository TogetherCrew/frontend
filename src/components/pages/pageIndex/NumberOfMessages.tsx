import clsx from 'clsx';
import React from 'react';

function NumberOfMessages() {
  const squareTexts = ['0+', '10+', '20+', '30+', '50+', '70+', '100+'];
  const squareColors = [
    'bg-gray-white',
    'bg-gray-light',
    'bg-blue-light',
    'bg-blue-dark',
    'bg-purple-light',
    'bg-purple-dark',
    'bg-purple-darker',
  ];

  return (
    <div>
      <div className='flex flex-col'>
        <p className='text-base'>Number of messages </p>
        <div className='flex flex-row'>
          {squareTexts.map((text, index) => (
            <div
              key={index}
              className={clsx(
                `square ${squareColors[index]} flex h-[35px] w-[35px] items-center justify-center rounded-sm text-center text-sm md:h-[40px] md:w-[40px]`,
                index <= 3 ? 'text-black' : 'text-white'
              )}
            >
              {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NumberOfMessages;
