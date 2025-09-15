import React, { useState } from 'react';
import { Card, CardBody, Button, Chip, Progress, Tooltip } from '@nextui-org/react';
import { useCurmunchkinsStore } from '../../model/CurmunchkinsModel';
import { SparkEvent } from '../../model/CurmunchkinsModel';

const SPARK_NAMES = {
  1: 'Hook',
  2: 'Explore/Build',
  3: 'Challenge',
  4: 'Support/Tool',
  5: 'Payoff/Reflection'
};

const SPARK_DESCRIPTIONS = {
  1: 'Predictable opener that sets the scene',
  2: 'Gentle curiosity and world-building',
  3: 'Clear, bounded problem to solve',
  4: 'Prop + Tiggie guidance + regulation',
  5: 'Success + self-labeling of feeling'
};

export default function SparkTimeline() {
  const {
    sparkEvents,
    currentSpark,
    setCurrentSpark,
    addSparkEvent,
    updateSparkEvent,
    regulationMicroBeatActive,
    isKidMode,
    sensoryBudget,
    isSensoryBudgetExceeded
  } = useCurmunchkinsStore();

  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');

  const getSparkEvents = (spark: number) => {
    return sparkEvents.filter(event => event.spark === spark);
  };

  const getSparkProgress = (spark: number) => {
    const events = getSparkEvents(spark);
    if (events.length === 0) return 0;
    return Math.min(100, (events.length / 2) * 100); // 2 events per spark is ideal
  };

  const getSparkColor = (spark: number) => {
    if (spark === 4 && regulationMicroBeatActive) return 'warning';
    if (isSensoryBudgetExceeded) return 'danger';
    if (spark <= currentSpark) return 'primary';
    return 'default';
  };

  const handleAddEvent = (spark: number) => {
    if (newEventTitle.trim()) {
      addSparkEvent({
        spark,
        title: newEventTitle,
        actors: [],
        location: '',
        buggies: {},
        props: [],
        text: ''
      });
      setNewEventTitle('');
      setIsAddingEvent(false);
    }
  };

  const handleRegulationMicroBeat = () => {
    // Auto-insert regulation micro-beat for Spark 4
    if (currentSpark === 4) {
      addSparkEvent({
        spark: 4,
        title: 'Regulation Micro-Beat',
        actors: [],
        location: '',
        buggies: {},
        props: [],
        text: 'Take a deep breath. You can handle this challenge!',
        subBeats: []
      });
    }
  };

  return (
    <div className="w-full h-full p-4">
      <div className="space-y-4">
        {/* Timeline Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Spark Timeline</h2>
          <p className="text-gray-600">
            {isKidMode ? 'Your story adventure!' : '5-beat story structure with sensory regulation'}
          </p>
        </div>

        {/* Spark Lanes */}
        <div className="space-y-6">
          {[1, 2, 3, 4, 5].map((spark) => {
            const events = getSparkEvents(spark);
            const progress = getSparkProgress(spark);
            const isCurrentSpark = spark === currentSpark;
            const isRegulationSpark = spark === 4;

            return (
              <Card 
                key={spark}
                className={`transition-all ${
                  isCurrentSpark ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
                }`}
              >
                <CardBody className="p-4">
                  {/* Spark Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                        getSparkColor(spark) === 'primary' ? 'bg-blue-500' :
                        getSparkColor(spark) === 'warning' ? 'bg-yellow-500' :
                        getSparkColor(spark) === 'danger' ? 'bg-red-500' :
                        'bg-gray-400'
                      }`}>
                        {spark}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{SPARK_NAMES[spark as keyof typeof SPARK_NAMES]}</h3>
                        <p className="text-sm text-gray-600">
                          {SPARK_DESCRIPTIONS[spark as keyof typeof SPARK_DESCRIPTIONS]}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        color="primary"
                        variant="flat"
                        onClick={() => setCurrentSpark(spark)}
                        isDisabled={isCurrentSpark}
                      >
                        {isCurrentSpark ? 'Current' : 'Go to'}
                      </Button>
                      
                      {isRegulationSpark && regulationMicroBeatActive && (
                        <Button
                          size="sm"
                          color="warning"
                          variant="flat"
                          onClick={handleRegulationMicroBeat}
                        >
                          Add Regulation
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="text-sm font-medium">{progress}%</span>
                    </div>
                    <Progress 
                      value={progress} 
                      color={getSparkColor(spark)}
                      className="w-full"
                    />
                  </div>

                  {/* Events */}
                  <div className="space-y-2">
                    {events.map((event, index) => (
                      <Card key={event.id} className="bg-gray-50">
                        <CardBody className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{event.title}</h4>
                              {event.text && (
                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                  {event.text}
                                </p>
                              )}
                              <div className="flex gap-2 mt-2">
                                {event.actors.length > 0 && (
                                  <Chip size="sm" color="primary" variant="flat">
                                    {event.actors.length} actors
                                  </Chip>
                                )}
                                {event.props.length > 0 && (
                                  <Chip size="sm" color="success" variant="flat">
                                    {event.props.length} props
                                  </Chip>
                                )}
                                {Object.keys(event.buggies).length > 0 && (
                                  <Chip size="sm" color="warning" variant="flat">
                                    {Object.keys(event.buggies).length} buggies
                                  </Chip>
                                )}
                              </div>
                            </div>
                            <Button
                              size="sm"
                              color="default"
                              variant="light"
                              onClick={() => {
                                // Edit event functionality would go here
                                console.log('Edit event:', event.id);
                              }}
                            >
                              Edit
                            </Button>
                          </div>
                        </CardBody>
                      </Card>
                    ))}

                    {/* Add Event Button */}
                    {isAddingEvent && isCurrentSpark ? (
                      <Card className="bg-blue-50 border-blue-200">
                        <CardBody className="p-3">
                          <div className="space-y-2">
                            <input
                              type="text"
                              placeholder="Event title..."
                              value={newEventTitle}
                              onChange={(e) => setNewEventTitle(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                              autoFocus
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                color="primary"
                                onClick={() => handleAddEvent(spark)}
                                isDisabled={!newEventTitle.trim()}
                              >
                                Add Event
                              </Button>
                              <Button
                                size="sm"
                                color="default"
                                variant="light"
                                onClick={() => {
                                  setIsAddingEvent(false);
                                  setNewEventTitle('');
                                }}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                    ) : (
                      isCurrentSpark && (
                        <Button
                          size="sm"
                          color="primary"
                          variant="flat"
                          onClick={() => setIsAddingEvent(true)}
                          className="w-full"
                        >
                          + Add Event to Spark {spark}
                        </Button>
                      )
                    )}
                  </div>

                  {/* Sensory Budget Indicator */}
                  {isSensoryBudgetExceeded && (
                    <div className="mt-3 pt-2 border-t border-red-200">
                      <div className="flex items-center gap-2 text-red-600">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-xs font-medium">Sensory budget exceeded</span>
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>
            );
          })}
        </div>

        {/* Timeline Controls */}
        <div className="flex justify-center gap-4 mt-6">
          <Button
            color="primary"
            variant="flat"
            onClick={() => setCurrentSpark(Math.max(1, currentSpark - 1))}
            isDisabled={currentSpark <= 1}
          >
            Previous Spark
          </Button>
          <Button
            color="primary"
            onClick={() => setCurrentSpark(Math.min(5, currentSpark + 1))}
            isDisabled={currentSpark >= 5}
          >
            Next Spark
          </Button>
        </div>
      </div>
    </div>
  );
}
