import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardBody, Chip, Button } from '@nextui-org/react';
import { Munchie } from '../../../model/CurmunchkinsModel';

interface MunchieNodeData extends Munchie {
  isSelected: boolean;
  onSelect: () => void;
}

export default function MunchieNode({ data }: NodeProps<MunchieNodeData>) {
  const { name, emoji, profile, accessories, buggies, isSelected, onSelect } = data;

  return (
    <div className="relative">
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      
      <Card 
        className={`min-w-[120px] cursor-pointer transition-all ${
          isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
        }`}
        onClick={onSelect}
      >
        <CardBody className="p-3 text-center">
          <div className="text-2xl mb-2">{emoji}</div>
          <div className="font-semibold text-sm mb-2">{name}</div>
          
          <div className="space-y-1">
            {profile.map((p, index) => (
              <Chip key={index} size="sm" color="primary" variant="flat">
                {p}
              </Chip>
            ))}
          </div>
          
          <div className="mt-2 text-xs text-gray-600">
            <div>Accessories: {accessories.length}</div>
            <div>Buggies: {buggies.length}</div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
