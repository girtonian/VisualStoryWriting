import React, { useState, useEffect } from 'react';
import { Button, Card, CardBody, Tabs, Tab, Switch, Slider, Chip, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/react';
import { useCurmunchkinsStore } from '../../model/CurmunchkinsModel';
import CharacterGraph from './CharacterGraph';
import HeartwoodMap from './HeartwoodMap';
import SparkTimeline from './SparkTimeline';
import { CurmunchkinsPrompts } from '../../model/prompts/curmunchkins/CurmunchkinsPrompts';

export default function CurmunchkinsInterface() {
  const {
    activeView,
    setActiveView,
    isKidMode,
    setKidMode,
    isReadAloudEnabled,
    setReadAloudEnabled,
    readAloudWPM,
    setReadAloudWPM,
    isPictogramMode,
    setPictogramMode,
    regulationMicroBeatActive,
    pauseAndBreatheActive,
    triggerPauseAndBreathe,
    clearRegulation,
    currentStory,
    createNewStory,
    exportStoryJSON,
    exportCareNote,
    telemetry
  } = useCurmunchkinsStore();

  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);
  const [newStoryTitle, setNewStoryTitle] = useState('');
  const [newStoryGoals, setNewStoryGoals] = useState({ emotional: '', skill: '' });
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Auto-clear regulation after timeout
  useEffect(() => {
    if (regulationMicroBeatActive) {
      const timer = setTimeout(() => {
        clearRegulation();
      }, 10000); // 10 seconds
      return () => clearTimeout(timer);
    }
  }, [regulationMicroBeatActive, clearRegulation]);

  const handleCreateStory = () => {
    if (newStoryTitle.trim() && newStoryGoals.emotional.trim() && newStoryGoals.skill.trim()) {
      createNewStory(newStoryTitle, newStoryGoals);
      setNewStoryTitle('');
      setNewStoryGoals({ emotional: '', skill: '' });
      setIsStoryModalOpen(false);
    }
  };

  const handleExport = (type: 'json' | 'care') => {
    if (type === 'json') {
      const jsonData = exportStoryJSON();
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `curmunchkins-story-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (type === 'care') {
      const careNote = exportCareNote();
      const blob = new Blob([careNote], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `care-note-${Date.now()}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'character-graph':
        return <CharacterGraph />;
      case 'heartwood-map':
        return <HeartwoodMap />;
      case 'spark-timeline':
        return <SparkTimeline />;
      default:
        return <CharacterGraph />;
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-800">
              {isKidMode ? '🎭 Curmunchkins Story Time!' : 'Curmunchkins Mode'}
            </h1>
            <Chip color={isKidMode ? 'success' : 'primary'} variant="flat">
              {isKidMode ? 'Kid Mode' : 'Grownup Mode'}
            </Chip>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              color="primary"
              variant="flat"
              onClick={() => setIsStoryModalOpen(true)}
            >
              {currentStory ? 'New Story' : 'Create Story'}
            </Button>
            <Button
              color="default"
              variant="flat"
              onClick={() => setIsExportModalOpen(true)}
            >
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          {/* View Tabs */}
          <Tabs
            selectedKey={activeView}
            onSelectionChange={(key) => setActiveView(key as any)}
            color="primary"
            variant="bordered"
          >
            <Tab key="character-graph" title="Character Graph" />
            <Tab key="heartwood-map" title="Heartwood Map" />
            <Tab key="spark-timeline" title="Spark Timeline" />
          </Tabs>

          {/* Mode Controls */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch
                isSelected={isKidMode}
                onValueChange={setKidMode}
                size="sm"
              />
              <span className="text-sm">Kid Mode</span>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                isSelected={isReadAloudEnabled}
                onValueChange={setReadAloudEnabled}
                size="sm"
              />
              <span className="text-sm">Read Aloud</span>
            </div>

            {isReadAloudEnabled && (
              <div className="flex items-center gap-2 min-w-[200px]">
                <span className="text-sm">Speed:</span>
                <Slider
                  size="sm"
                  step={10}
                  minValue={80}
                  maxValue={200}
                  value={readAloudWPM}
                  onChange={(value) => setReadAloudWPM(Array.isArray(value) ? value[0] : value)}
                  className="flex-1"
                />
                <span className="text-xs text-gray-600">{readAloudWPM} WPM</span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Switch
                isSelected={isPictogramMode}
                onValueChange={setPictogramMode}
                size="sm"
              />
              <span className="text-sm">Pictograms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative">
        {renderActiveView()}

        {/* Regulation Overlays */}
        {regulationMicroBeatActive && (
          <div className="absolute inset-0 bg-yellow-100 bg-opacity-50 flex items-center justify-center z-50">
            <Card className="max-w-md">
              <CardBody className="p-6 text-center">
                <div className="text-4xl mb-4">🧘‍♀️</div>
                <h3 className="text-xl font-bold mb-2">Regulation Micro-Beat</h3>
                <p className="text-gray-600 mb-4">
                  Take a moment to breathe and center yourself. You're doing great!
                </p>
                <Button color="primary" onClick={clearRegulation}>
                  I'm Ready to Continue
                </Button>
              </CardBody>
            </Card>
          </div>
        )}

        {pauseAndBreatheActive && (
          <div className="absolute inset-0 bg-blue-100 bg-opacity-50 flex items-center justify-center z-50">
            <Card className="max-w-md">
              <CardBody className="p-6 text-center">
                <div className="text-4xl mb-4">🫁</div>
                <h3 className="text-xl font-bold mb-2">Pause & Breathe</h3>
                <p className="text-gray-600 mb-4">
                  Let's take some deep breaths together. In... and out...
                </p>
                <Button color="primary" onClick={clearRegulation}>
                  Continue
                </Button>
              </CardBody>
            </Card>
          </div>
        )}

        {/* Emergency Pause Button */}
        <Button
          color="danger"
          variant="solid"
          className="fixed bottom-4 right-4 z-40"
          onClick={triggerPauseAndBreathe}
        >
          Pause & Breathe
        </Button>
      </div>

      {/* Footer with Telemetry */}
      <div className="bg-gray-100 border-t border-gray-200 p-2">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex items-center gap-4">
            <span>Time: {Math.round(telemetry.timeOnTask / 60000)}m</span>
            <span>Edits: {telemetry.edits}</span>
            <span>Regulation: {telemetry.regulationTriggers}</span>
          </div>
          <div>
            {currentStory ? `Story: ${currentStory.title}` : 'No active story'}
          </div>
        </div>
      </div>

      {/* Create Story Modal */}
      <Modal isOpen={isStoryModalOpen} onClose={() => setIsStoryModalOpen(false)}>
        <ModalContent>
          <ModalHeader>Create New Story</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Story title..."
                value={newStoryTitle}
                onChange={(e) => setNewStoryTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                placeholder="Emotional goal..."
                value={newStoryGoals.emotional}
                onChange={(e) => setNewStoryGoals(prev => ({ ...prev, emotional: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                placeholder="Skill goal..."
                value={newStoryGoals.skill}
                onChange={(e) => setNewStoryGoals(prev => ({ ...prev, skill: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="light" onClick={() => setIsStoryModalOpen(false)}>
              Cancel
            </Button>
            <Button color="primary" onClick={handleCreateStory}>
              Create Story
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Export Modal */}
      <Modal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)}>
        <ModalContent>
          <ModalHeader>Export Story</ModalHeader>
          <ModalBody>
            <div className="space-y-2">
              <Button
                color="primary"
                variant="flat"
                className="w-full justify-start"
                onClick={() => handleExport('json')}
              >
                📄 Export as JSON
              </Button>
              <Button
                color="success"
                variant="flat"
                className="w-full justify-start"
                onClick={() => handleExport('care')}
              >
                📋 Export Care Note
              </Button>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="light" onClick={() => setIsExportModalOpen(false)}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
