import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardBody, Chip, Tooltip } from '@nextui-org/react';
import { Prop } from '../../../model/CurmunchkinsModel';

interface PropNodeData extends Prop {
  isSelected: boolean;
  onSelect: () => void;
}

export default function PropNode({ data }: NodeProps<PropNodeData>) {
  const { name, emoji, effect, nfc, isSelected, onSelect } = data;

  const getEffectColor = (value: number) => {
    if (value < 0) return 'success';
    if (value === 0) return 'default';
    return 'warning';
  };

  const getEffectIcon = (value: number) => {
    if (value < 0) return '↓';
    if (value === 0) return '—';
    return '↑';
  };

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
            {Object.entries(effect).map(([key, value]) => (
              <Tooltip 
                key={key}
                content={`${key}: ${value > 0 ? '+' : ''}${value}`}
                placement="top"
              >
                <Chip 
                  size="sm" 
                  color={getEffectColor(value)}
                  variant="flat"
                  className="text-xs"
                >
                  {key} {getEffectIcon(value)}{Math.abs(value)}
                </Chip>
              </Tooltip>
            ))}
          </div>
          
          {nfc && (
            <div className="mt-2 text-xs text-gray-500">
              NFC Ready
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
