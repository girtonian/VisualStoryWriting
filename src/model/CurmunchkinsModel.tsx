import { create } from 'zustand';

// Curmunchkins Data Model Types
export interface Munchie {
  id: string;
  name: string;
  profile: string[];
  accessories: string[];
  buggies: string[];
  emoji: string;
}

export interface Tiggie {
  id: string;
  type: string;
  tips: string[];
  emoji: string;
}

export interface Buggie {
  id: string;
  label: string;
  intensity: number; // 0-5
  emoji: string;
}

export interface Prop {
  id: string;
  name: string;
  effect: {
    proprioceptive: number;
    anxiety: number;
    [key: string]: number;
  };
  nfc?: string;
  emoji: string;
}

export interface Location {
  id: string;
  name: string;
  sensory: {
    audio: number;
    visual: number;
    social: number;
    proprioceptive: number;
    cognitive: number;
  };
  emoji: string;
}

export interface SparkEvent {
  id: string;
  spark: number; // 1-5
  title: string;
  actors: string[]; // Munchie IDs
  location: string; // Location ID
  buggies: { [buggieId: string]: number };
  props: string[]; // Prop IDs
  text: string;
  subBeats?: SparkEvent[];
}

export interface Story {
  id: string;
  title: string;
  sparks: number[]; // [1,2,3,4,5]
  events: string[]; // SparkEvent IDs
  mode: 'kid' | 'grownup';
  goals: {
    emotional: string;
    skill: string;
  };
}

// Sensory Budget System
export interface SensoryBudget {
  audio: number;
  visual: number;
  social: number;
  proprioceptive: number;
  cognitive: number;
}

export interface SensoryBudgetCaps {
  total: number; // default 6
  perAxis: number; // default 3
}

// Curmunchkins Store State
export interface CurmunchkinsState {
  // Core data
  munchies: Munchie[];
  tiggies: Tiggie[];
  buggies: Buggie[];
  props: Prop[];
  locations: Location[];
  sparkEvents: SparkEvent[];
  currentStory: Story | null;
  
  // UI state
  selectedMunchie: string | null;
  selectedBuggie: string | null;
  selectedProp: string | null;
  selectedLocation: string | null;
  currentSpark: number; // 1-5
  
  // Sensory budget
  sensoryBudget: SensoryBudget;
  sensoryBudgetCaps: SensoryBudgetCaps;
  isSensoryBudgetExceeded: boolean;
  
  // Mode settings
  isKidMode: boolean;
  isReadAloudEnabled: boolean;
  readAloudWPM: number;
  isPictogramMode: boolean;
  
  // Regulation
  regulationMicroBeatActive: boolean;
  pauseAndBreatheActive: boolean;
  
  // Visual views
  activeView: 'character-graph' | 'heartwood-map' | 'spark-timeline';
  
  // Export data
  telemetry: {
    timeOnTask: number;
    edits: number;
    sbsOveragesMitigated: number;
    regulationTriggers: number;
  };
}

// Curmunchkins Store Actions
export interface CurmunchkinsActions {
  // Data management
  setMunchies: (munchies: Munchie[]) => void;
  setTiggies: (tiggies: Tiggie[]) => void;
  setBuggies: (buggies: Buggie[]) => void;
  setProps: (props: Prop[]) => void;
  setLocations: (locations: Location[]) => void;
  setSparkEvents: (events: SparkEvent[]) => void;
  setCurrentStory: (story: Story | null) => void;
  
  // Selection
  setSelectedMunchie: (id: string | null) => void;
  setSelectedBuggie: (id: string | null) => void;
  setSelectedProp: (id: string | null) => void;
  setSelectedLocation: (id: string | null) => void;
  setCurrentSpark: (spark: number) => void;
  
  // Sensory budget
  updateSensoryBudget: (locationId: string, props: string[]) => void;
  checkSensoryBudget: () => boolean;
  resetSensoryBudget: () => void;
  
  // Mode settings
  setKidMode: (isKid: boolean) => void;
  setReadAloudEnabled: (enabled: boolean) => void;
  setReadAloudWPM: (wpm: number) => void;
  setPictogramMode: (enabled: boolean) => void;
  
  // Regulation
  triggerRegulationMicroBeat: () => void;
  triggerPauseAndBreathe: () => void;
  clearRegulation: () => void;
  
  // Visual views
  setActiveView: (view: 'character-graph' | 'heartwood-map' | 'spark-timeline') => void;
  
  // Story management
  createNewStory: (title: string, goals: { emotional: string; skill: string }) => void;
  addSparkEvent: (event: Omit<SparkEvent, 'id'>) => void;
  updateSparkEvent: (eventId: string, updates: Partial<SparkEvent>) => void;
  moveCharacterToLocation: (munchieId: string, locationId: string) => void;
  adjustBuggieIntensity: (buggieId: string, intensity: number) => void;
  
  // Export
  exportStoryJSON: () => string;
  exportStoryPDF: () => void;
  exportVisualSchedule: () => void;
  exportCareNote: () => string;
  
  // Telemetry
  logEvent: (event: string, data?: any) => void;
  updateTelemetry: (updates: Partial<CurmunchkinsState['telemetry']>) => void;
  
  // Reset
  reset: () => void;
}

// Default values
const defaultSensoryBudget: SensoryBudget = {
  audio: 0,
  visual: 0,
  social: 0,
  proprioceptive: 0,
  cognitive: 0
};

const defaultSensoryBudgetCaps: SensoryBudgetCaps = {
  total: 6,
  perAxis: 3
};

const defaultTelemetry = {
  timeOnTask: 0,
  edits: 0,
  sbsOveragesMitigated: 0,
  regulationTriggers: 0
};

// Sample data for testing
const sampleMunchies: Munchie[] = [
  {
    id: 'silo-01',
    name: 'Silo',
    profile: ['Autism'],
    accessories: ['weighted-arms'],
    buggies: ['overwhelm'],
    emoji: '🤖'
  }
];

const sampleTiggies: Tiggie[] = [
  {
    id: 'verbal-tiggie-01',
    type: 'Verbal Thinker',
    tips: ['Take deep breaths', 'Count to five'],
    emoji: '🧠'
  }
];

const sampleBuggies: Buggie[] = [
  {
    id: 'overwhelm',
    label: 'Overwhelm',
    intensity: 0,
    emoji: '😰'
  }
];

const sampleProps: Prop[] = [
  {
    id: 'weighted-arms',
    name: 'Weighted Arms',
    effect: {
      proprioceptive: -2,
      anxiety: -1
    },
    nfc: 'urn:nfc:weighted-arms',
    emoji: '🦾'
  }
];

const sampleLocations: Location[] = [
  {
    id: 'whispering-grove',
    name: 'Whispering Grove',
    sensory: {
      audio: 1,
      visual: 1,
      social: 0,
      proprioceptive: 0,
      cognitive: 1
    },
    emoji: '🌳'
  },
  {
    id: 'market-square',
    name: 'Market Square',
    sensory: {
      audio: 3,
      visual: 3,
      social: 2,
      proprioceptive: 0,
      cognitive: 2
    },
    emoji: '🏪'
  }
];

// Store implementation
export const useCurmunchkinsStore = create<CurmunchkinsState & CurmunchkinsActions>()((set, get) => ({
  // Initial state
  munchies: sampleMunchies,
  tiggies: sampleTiggies,
  buggies: sampleBuggies,
  props: sampleProps,
  locations: sampleLocations,
  sparkEvents: [],
  currentStory: null,
  
  selectedMunchie: null,
  selectedBuggie: null,
  selectedProp: null,
  selectedLocation: null,
  currentSpark: 1,
  
  sensoryBudget: { ...defaultSensoryBudget },
  sensoryBudgetCaps: { ...defaultSensoryBudgetCaps },
  isSensoryBudgetExceeded: false,
  
  isKidMode: true,
  isReadAloudEnabled: true,
  readAloudWPM: 130,
  isPictogramMode: false,
  
  regulationMicroBeatActive: false,
  pauseAndBreatheActive: false,
  
  activeView: 'character-graph',
  
  telemetry: { ...defaultTelemetry },
  
  // Actions
  setMunchies: (munchies) => set({ munchies }),
  setTiggies: (tiggies) => set({ tiggies }),
  setBuggies: (buggies) => set({ buggies }),
  setProps: (props) => set({ props }),
  setLocations: (locations) => set({ locations }),
  setSparkEvents: (events) => set({ sparkEvents: events }),
  setCurrentStory: (story) => set({ currentStory: story }),
  
  setSelectedMunchie: (id) => set({ selectedMunchie: id }),
  setSelectedBuggie: (id) => set({ selectedBuggie: id }),
  setSelectedProp: (id) => set({ selectedProp: id }),
  setSelectedLocation: (id) => set({ selectedLocation: id }),
  setCurrentSpark: (spark) => set({ currentSpark: spark }),
  
  updateSensoryBudget: (locationId, propIds) => {
    const state = get();
    const location = state.locations.find(l => l.id === locationId);
    if (!location) return;
    
    // Start with location sensory load
    let newBudget = { ...location.sensory };
    
    // Apply prop effects
    propIds.forEach(propId => {
      const prop = state.props.find(p => p.id === propId);
      if (prop) {
        Object.keys(prop.effect).forEach(key => {
          if (key in newBudget) {
            newBudget[key as keyof SensoryBudget] += prop.effect[key];
          }
        });
      }
    });
    
    // Ensure no negative values
    Object.keys(newBudget).forEach(key => {
      newBudget[key as keyof SensoryBudget] = Math.max(0, newBudget[key as keyof SensoryBudget]);
    });
    
    const isExceeded = get().checkSensoryBudget();
    set({ sensoryBudget: newBudget, isSensoryBudgetExceeded: isExceeded });
  },
  
  checkSensoryBudget: () => {
    const state = get();
    const total = Object.values(state.sensoryBudget).reduce((sum, val) => sum + val, 0);
    const anyAxisExceeded = Object.values(state.sensoryBudget).some(val => val > state.sensoryBudgetCaps.perAxis);
    
    return total > state.sensoryBudgetCaps.total || anyAxisExceeded;
  },
  
  resetSensoryBudget: () => set({ sensoryBudget: { ...defaultSensoryBudget }, isSensoryBudgetExceeded: false }),
  
  setKidMode: (isKid) => set({ isKidMode: isKid }),
  setReadAloudEnabled: (enabled) => set({ isReadAloudEnabled: enabled }),
  setReadAloudWPM: (wpm) => set({ readAloudWPM: wpm }),
  setPictogramMode: (enabled) => set({ isPictogramMode: enabled }),
  
  triggerRegulationMicroBeat: () => {
    set({ regulationMicroBeatActive: true });
    get().updateTelemetry({ regulationTriggers: get().telemetry.regulationTriggers + 1 });
  },
  
  triggerPauseAndBreathe: () => {
    set({ pauseAndBreatheActive: true });
    // Auto-clear after 5 seconds
    setTimeout(() => {
      get().clearRegulation();
    }, 5000);
  },
  
  clearRegulation: () => set({ regulationMicroBeatActive: false, pauseAndBreatheActive: false }),
  
  setActiveView: (view) => set({ activeView: view }),
  
  createNewStory: (title, goals) => {
    const story: Story = {
      id: `story-${Date.now()}`,
      title,
      sparks: [1, 2, 3, 4, 5],
      events: [],
      mode: get().isKidMode ? 'kid' : 'grownup',
      goals
    };
    set({ currentStory: story, sparkEvents: [] });
  },
  
  addSparkEvent: (eventData) => {
    const event: SparkEvent = {
      ...eventData,
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    set(state => ({
      sparkEvents: [...state.sparkEvents, event],
      currentStory: state.currentStory ? {
        ...state.currentStory,
        events: [...state.currentStory.events, event.id]
      } : null
    }));
  },
  
  updateSparkEvent: (eventId, updates) => {
    set(state => ({
      sparkEvents: state.sparkEvents.map(event => 
        event.id === eventId ? { ...event, ...updates } : event
      )
    }));
  },
  
  moveCharacterToLocation: (munchieId, locationId) => {
    // This would trigger a re-render of the visual and update sensory budget
    get().updateSensoryBudget(locationId, []);
    get().logEvent('CHARACTER_MOVED', { munchieId, locationId });
  },
  
  adjustBuggieIntensity: (buggieId, intensity) => {
    set(state => ({
      buggies: state.buggies.map(buggie =>
        buggie.id === buggieId ? { ...buggie, intensity } : buggie
      )
    }));
    
    // Check if regulation micro-beat should be triggered
    if (intensity > 3) {
      get().triggerRegulationMicroBeat();
    }
    
    get().logEvent('BUGGIE_INTENSITY_CHANGED', { buggieId, intensity });
  },
  
  exportStoryJSON: () => {
    const state = get();
    if (!state.currentStory) return '';
    
    return JSON.stringify({
      story: state.currentStory,
      events: state.sparkEvents,
      munchies: state.munchies,
      tiggies: state.tiggies,
      buggies: state.buggies,
      props: state.props,
      locations: state.locations,
      telemetry: state.telemetry
    }, null, 2);
  },
  
  exportStoryPDF: () => {
    // Implementation would generate PDF
    console.log('Exporting to PDF...');
  },
  
  exportVisualSchedule: () => {
    // Implementation would generate visual schedule
    console.log('Exporting visual schedule...');
  },
  
  exportCareNote: () => {
    const state = get();
    const buggieTrends = state.buggies.map(b => `${b.label}: ${b.intensity}/5`).join(', ');
    const successfulProps = state.props.filter(p => p.effect.anxiety < 0).map(p => p.name).join(', ');
    
    return `Care Note Summary:
Buggie Trends: ${buggieTrends}
Successful Props: ${successfulProps}
Regulation Triggers: ${state.telemetry.regulationTriggers}
Time on Task: ${Math.round(state.telemetry.timeOnTask / 60000)} minutes`;
  },
  
  logEvent: (event, data) => {
    console.log(`Curmunchkins Event: ${event}`, data);
    get().updateTelemetry({ edits: get().telemetry.edits + 1 });
  },
  
  updateTelemetry: (updates) => {
    set(state => ({
      telemetry: { ...state.telemetry, ...updates }
    }));
  },
  
  reset: () => {
    set({
      munchies: sampleMunchies,
      tiggies: sampleTiggies,
      buggies: sampleBuggies,
      props: sampleProps,
      locations: sampleLocations,
      sparkEvents: [],
      currentStory: null,
      selectedMunchie: null,
      selectedBuggie: null,
      selectedProp: null,
      selectedLocation: null,
      currentSpark: 1,
      sensoryBudget: { ...defaultSensoryBudget },
      isSensoryBudgetExceeded: false,
      isKidMode: true,
      isReadAloudEnabled: true,
      readAloudWPM: 130,
      isPictogramMode: false,
      regulationMicroBeatActive: false,
      pauseAndBreatheActive: false,
      activeView: 'character-graph',
      telemetry: { ...defaultTelemetry }
    });
  }
}));
