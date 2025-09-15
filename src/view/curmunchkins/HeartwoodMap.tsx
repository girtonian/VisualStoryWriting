import React, { useState, useCallback } from 'react';
import { Card, CardBody, Button, Chip, Slider, Tooltip } from '@nextui-org/react';
import { useCurmunchkinsStore } from '../../model/CurmunchkinsModel';
import { Location, Munchie } from '../../model/CurmunchkinsModel';

interface HeartwoodMapProps {
  onLocationChange?: (locationId: string) => void;
}

export default function HeartwoodMap({ onLocationChange }: HeartwoodMapProps) {
  const {
    locations,
    munchies,
    selectedMunchie,
    selectedLocation,
    setSelectedLocation,
    moveCharacterToLocation,
    sensoryBudget,
    isSensoryBudgetExceeded,
    isKidMode
  } = useCurmunchkinsStore();

  const [draggedMunchie, setDraggedMunchie] = useState<string | null>(null);

  const getSensoryColor = (value: number, max: number = 3) => {
    const ratio = value / max;
    if (ratio <= 0.33) return 'success';
    if (ratio <= 0.66) return 'warning';
    return 'danger';
  };

  const getSensoryLabel = (value: number) => {
    if (value <= 1) return 'Low';
    if (value <= 2) return 'Medium';
    return 'High';
  };

  const handleMunchieDragStart = (munchieId: string) => {
    setDraggedMunchie(munchieId);
  };

  const handleLocationDrop = (locationId: string) => {
    if (draggedMunchie) {
      moveCharacterToLocation(draggedMunchie, locationId);
      onLocationChange?.(locationId);
    }
    setDraggedMunchie(null);
  };

  const handleLocationClick = (locationId: string) => {
    setSelectedLocation(locationId);
    onLocationChange?.(locationId);
  };

  return (
    <div className="w-full h-full p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
        {locations.map((location) => (
          <Card 
            key={location.id}
            className={`cursor-pointer transition-all ${
              selectedLocation === location.id 
                ? 'ring-2 ring-blue-500 shadow-lg' 
                : 'hover:shadow-md'
            } ${isSensoryBudgetExceeded ? 'border-red-300' : ''}`}
            onClick={() => handleLocationClick(location.id)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => handleLocationDrop(location.id)}
          >
            <CardBody className="p-4">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{location.emoji}</div>
                <h3 className="text-lg font-semibold">{location.name}</h3>
              </div>

              {/* Sensory Profile */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Sensory Profile</h4>
                {Object.entries(location.sensory).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-600 capitalize">{key}</span>
                      <Chip 
                        size="sm" 
                        color={getSensoryColor(value)}
                        variant="flat"
                      >
                        {value}/5
                      </Chip>
                    </div>
                    <Slider
                      size="sm"
                      step={1}
                      color={getSensoryColor(value)}
                      minValue={0}
                      maxValue={5}
                      value={value}
                      isDisabled
                      className="w-full"
                    />
                  </div>
                ))}
              </div>

              {/* Current Sensory Budget */}
              <div className="mt-4 pt-3 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Current Load</h4>
                <div className="space-y-1">
                  {Object.entries(sensoryBudget).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-xs text-gray-600 capitalize">{key}</span>
                      <Chip 
                        size="sm" 
                        color={getSensoryColor(value)}
                        variant="flat"
                      >
                        {value}
                      </Chip>
                    </div>
                  ))}
                </div>
              </div>

              {/* Characters in this location */}
              <div className="mt-4 pt-3 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Characters</h4>
                <div className="flex flex-wrap gap-1">
                  {munchies
                    .filter(munchie => selectedMunchie === munchie.id)
                    .map(munchie => (
                      <Chip 
                        key={munchie.id}
                        size="sm"
                        color="primary"
                        variant="flat"
                        className="cursor-move"
                        draggable
                        onDragStart={() => handleMunchieDragStart(munchie.id)}
                      >
                        {munchie.emoji} {munchie.name}
                      </Chip>
                    ))}
                </div>
              </div>

              {/* Kid mode indicator */}
              {isKidMode && (
                <div className="mt-3 pt-2 border-t border-gray-200">
                  <div className="text-xs text-green-600 font-medium">
                    ✓ Kid-friendly location
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Sensory Budget Warning */}
      {isSensoryBudgetExceeded && (
        <div className="fixed top-4 right-4 z-50">
          <Card className="bg-red-100 border-red-400">
            <CardBody className="p-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-red-800">
                  Sensory Budget Exceeded!
                </span>
              </div>
              <p className="text-xs text-red-700 mt-1">
                Consider moving to a calmer location or using regulation props.
              </p>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Drag instruction for kid mode */}
      {isKidMode && draggedMunchie && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          <Card className="bg-blue-100 border-blue-400">
            <CardBody className="p-3">
              <div className="text-center">
                <div className="text-sm font-medium text-blue-800">
                  Drop {munchies.find(m => m.id === draggedMunchie)?.name} on a location!
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}
