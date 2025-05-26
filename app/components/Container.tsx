'use client';
import React, { FC, ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

const Container: FC<ContainerProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`mx-auto max-w-[1920px] px-7 pt-15 pb-15 md:px-14 ${className}`}
    >
      {children}
    </div>
  );
};

export default Container;
