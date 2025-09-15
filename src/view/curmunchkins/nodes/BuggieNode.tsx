import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardBody, Slider, Chip } from '@nextui-org/react';
import { Buggie } from '../../../model/CurmunchkinsModel';

interface BuggieNodeData extends Buggie {
  isSelected: boolean;
  onSelect: () => void;
  onIntensityChange: (intensity: number) => void;
}

export default function BuggieNode({ data }: NodeProps<BuggieNodeData>) {
  const { label, emoji, intensity, isSelected, onSelect, onIntensityChange } = data;

  const getIntensityColor = (intensity: number) => {
    if (intensity <= 1) return 'success';
    if (intensity <= 3) return 'warning';
    return 'danger';
  };

  const getIntensityLabel = (intensity: number) => {
    if (intensity <= 1) return 'Low';
    if (intensity <= 3) return 'Medium';
    return 'High';
  };

  return (
    <div className="relative">
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
      
      <Card 
        className={`min-w-[140px] cursor-pointer transition-all ${
          isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
        }`}
        onClick={onSelect}
      >
        <CardBody className="p-3 text-center">
          <div className="text-2xl mb-2">{emoji}</div>
          <div className="font-semibold text-sm mb-2">{label}</div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Intensity:</span>
              <Chip 
                size="sm" 
                color={getIntensityColor(intensity)}
                variant="flat"
              >
                {intensity}/5
              </Chip>
            </div>
            
            <Slider
              size="sm"
              step={1}
              color={getIntensityColor(intensity)}
              minValue={0}
              maxValue={5}
              value={intensity}
              onChange={(value) => onIntensityChange(Array.isArray(value) ? value[0] : value)}
              className="w-full"
            />
            
            <div className="text-xs text-gray-500">
              {getIntensityLabel(intensity)}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
