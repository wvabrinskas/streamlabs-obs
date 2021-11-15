import { Space } from 'antd';
import React, { HTMLAttributes } from 'react';

export function ButtonGroup(p: HTMLAttributes<unknown>) {
  return (
    <div style={{ textAlign: 'right', marginBottom: '8px' }}>
      <Space align="end">{p.children}</Space>
    </div>
  );
}
