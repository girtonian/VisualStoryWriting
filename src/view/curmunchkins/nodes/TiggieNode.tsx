import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardBody, Chip } from '@nextui-org/react';
import { Tiggie } from '../../../model/CurmunchkinsModel';

interface TiggieNodeData extends Tiggie {
  isSelected: boolean;
}

export default function TiggieNode({ data }: NodeProps<TiggieNodeData>) {
  const { type, emoji, tips, isSelected } = data;

  return (
    <div className="relative">
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      
      <Card 
        className={`min-w-[120px] transition-all ${
          isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
        }`}
      >
        <CardBody className="p-3 text-center">
          <div className="text-2xl mb-2">{emoji}</div>
          <div className="font-semibold text-sm mb-2">{type}</div>
          
          <div className="space-y-1">
            {tips.slice(0, 2).map((tip, index) => (
              <div key={index} className="text-xs text-gray-600 bg-gray-100 rounded px-2 py-1">
                {tip}
              </div>
            ))}
            {tips.length > 2 && (
              <div className="text-xs text-gray-400">+{tips.length - 2} more</div>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
