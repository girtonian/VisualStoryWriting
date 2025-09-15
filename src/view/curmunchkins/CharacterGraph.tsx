import React, { useCallback, useEffect, useState } from 'react';
import { ReactFlow, Node, Edge, Controls, Background, useNodesState, useEdgesState, addEdge, Connection, NodeTypes, EdgeTypes } from '@xyflow/react';
import { Button, Card, CardBody, Slider, Chip, Tooltip } from '@nextui-org/react';
import { useCurmunchkinsStore } from '../../model/CurmunchkinsModel';
import MunchieNode from './nodes/MunchieNode';
import TiggieNode from './nodes/TiggieNode';
import BuggieNode from './nodes/BuggieNode';
import PropNode from './nodes/PropNode';
import '@xyflow/react/dist/style.css';

const nodeTypes: NodeTypes = {
  munchie: MunchieNode,
  tiggie: TiggieNode,
  buggie: BuggieNode,
  prop: PropNode,
};

const edgeTypes: EdgeTypes = {};

export default function CharacterGraph() {
  const {
    munchies,
    tiggies,
    buggies,
    props,
    selectedMunchie,
    selectedBuggie,
    selectedProp,
    setSelectedMunchie,
    setSelectedBuggie,
    setSelectedProp,
    adjustBuggieIntensity,
    isKidMode,
    regulationMicroBeatActive,
    pauseAndBreatheActive
  } = useCurmunchkinsStore();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Convert store data to ReactFlow nodes
  useEffect(() => {
    const flowNodes: Node[] = [
      // Munchie nodes
      ...munchies.map((munchie, index) => ({
        id: munchie.id,
        type: 'munchie',
        position: { x: 100 + index * 200, y: 100 },
        data: {
          ...munchie,
          isSelected: selectedMunchie === munchie.id,
          onSelect: () => setSelectedMunchie(munchie.id)
        }
      })),
      
      // Tiggie nodes
      ...tiggies.map((tiggie, index) => ({
        id: tiggie.id,
        type: 'tiggie',
        position: { x: 100 + index * 200, y: 300 },
        data: {
          ...tiggie,
          isSelected: false
        }
      })),
      
      // Buggie nodes
      ...buggies.map((buggie, index) => ({
        id: buggie.id,
        type: 'buggie',
        position: { x: 100 + index * 200, y: 500 },
        data: {
          ...buggie,
          isSelected: selectedBuggie === buggie.id,
          onSelect: () => setSelectedBuggie(buggie.id),
          onIntensityChange: (intensity: number) => adjustBuggieIntensity(buggie.id, intensity)
        }
      })),
      
      // Prop nodes
      ...props.map((prop, index) => ({
        id: prop.id,
        type: 'prop',
        position: { x: 100 + index * 200, y: 700 },
        data: {
          ...prop,
          isSelected: selectedProp === prop.id,
          onSelect: () => setSelectedProp(prop.id)
        }
      }))
    ];

    setNodes(flowNodes);
  }, [munchies, tiggies, buggies, props, selectedMunchie, selectedBuggie, selectedProp, setSelectedMunchie, setSelectedBuggie, setSelectedProp, adjustBuggieIntensity]);

  // Create edges based on relationships
  useEffect(() => {
    const flowEdges: Edge[] = [];
    
    // Munchie to Buggie connections (triggers)
    munchies.forEach(munchie => {
      munchie.buggies.forEach(buggieId => {
        const buggie = buggies.find(b => b.id === buggieId);
        if (buggie) {
          flowEdges.push({
            id: `${munchie.id}-${buggieId}`,
            source: munchie.id,
            target: buggieId,
            type: 'smoothstep',
            style: { stroke: '#ff6b6b', strokeWidth: 2 },
            label: 'triggers',
            labelStyle: { fontSize: 12, fill: '#ff6b6b' }
          });
        }
      });
    });

    // Munchie to Prop connections (helps)
    munchies.forEach(munchie => {
      munchie.accessories.forEach(propId => {
        const prop = props.find(p => p.id === propId);
        if (prop) {
          flowEdges.push({
            id: `${munchie.id}-${propId}`,
            source: munchie.id,
            target: propId,
            type: 'smoothstep',
            style: { stroke: '#4ecdc4', strokeWidth: 2 },
            label: 'helps',
            labelStyle: { fontSize: 12, fill: '#4ecdc4' }
          });
        }
      });
    });

    // Tiggie to Buggie connections (co-regulates)
    tiggies.forEach(tiggie => {
      buggies.forEach(buggie => {
        flowEdges.push({
          id: `${tiggie.id}-${buggie.id}`,
          source: tiggie.id,
          target: buggie.id,
          type: 'smoothstep',
          style: { stroke: '#45b7d1', strokeWidth: 2 },
          label: 'co-regulates',
          labelStyle: { fontSize: 12, fill: '#45b7d1' }
        });
      });
    });

    setEdges(flowEdges);
  }, [munchies, tiggies, buggies, props]);

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Background />
        <Controls />
      </ReactFlow>

      {/* Regulation indicators */}
      {regulationMicroBeatActive && (
        <div className="absolute top-4 left-4 z-10">
          <Card className="bg-yellow-100 border-yellow-400">
            <CardBody className="p-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Regulation Micro-Beat Active</span>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {pauseAndBreatheActive && (
        <div className="absolute top-4 right-4 z-10">
          <Card className="bg-blue-100 border-blue-400">
            <CardBody className="p-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Pause & Breathe</span>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Kid mode controls */}
      {isKidMode && (
        <div className="absolute bottom-4 left-4 z-10">
          <Card className="bg-green-100 border-green-400">
            <CardBody className="p-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Kid Mode</span>
                <Chip size="sm" color="success">Active</Chip>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-10">
        <Card className="bg-white shadow-lg">
          <CardBody className="p-3">
            <div className="text-xs space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-400 rounded"></div>
                <span>Triggers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-teal-400 rounded"></div>
                <span>Helps</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded"></div>
                <span>Co-regulates</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
