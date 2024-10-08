'use client'
import React, { useState } from 'react';
import { Thing } from '@smartacct';

const DemoComponent: React.FC = () => {

  console.log('Thing', Thing);
  return (
    <div>
      <h1>Smart Account Demo</h1>
    </div>
  );
};

export default DemoComponent;
