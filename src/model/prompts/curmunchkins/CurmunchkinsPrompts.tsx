import { openai } from '../../Model';

export interface SceneSynthesisParams {
  spark: number;
  actors: string[];
  location: string;
  buggies: { [buggieId: string]: number };
  props: string[];
  goals: {
    emotional: string;
    skill: string;
  };
  sensoryBudget: {
    audio: number;
    visual: number;
    social: number;
    proprioceptive: number;
    cognitive: number;
  };
  isKidMode: boolean;
}

export interface RegulationBeatParams {
  prop: string;
  tiggieCue: string;
  feeling: string;
  isKidMode: boolean;
}

export interface ReflectionParams {
  spark: number;
  changes: string[];
  effort: string;
  isKidMode: boolean;
}

export class CurmunchkinsPrompts {
  /**
   * Generate scene text for a specific Spark
   */
  static async generateSceneSynthesis(params: SceneSynthesisParams): Promise<string> {
    const { spark, actors, location, buggies, props, goals, sensoryBudget, isKidMode } = params;
    
    const buggiesText = Object.entries(buggies)
      .map(([id, intensity]) => `${id}: ${intensity}/5`)
      .join(', ');
    
    const propsText = props.join(', ');
    
    const sensoryText = Object.entries(sensoryBudget)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
    
    const prompt = `You are writing for ages 4-12 with neuroinclusive clarity.

Spark: ${spark} of 5
SBS caps: total<=6; axis<=3
Current SBS: ${sensoryText}
Actors: ${actors.join(', ')}
Location: ${location}
Buggies+intensity: ${buggiesText}
Props in play: ${propsText}
Goals: ${goals.emotional}, ${goals.skill}

${isKidMode ? 'KID MODE: Use simple words, short sentences, concrete sensory language.' : 'GROWNUP MODE: Include more complex concepts while maintaining clarity.'}

Write 4-6 short sentences with:
- Concrete sensory language
- 1 feeling word the child can repeat
- Clear, predictable structure
- Age-appropriate vocabulary

If sensory caps exceeded, quietly simplify stimuli first (fewer sounds, dimmer lights, smaller groups).

Response format: Just the story text, no explanations.`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 300
      });
      
      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Error generating scene synthesis:', error);
      return 'The story continues...';
    }
  }

  /**
   * Generate regulation micro-beat for Spark 4
   */
  static async generateRegulationBeat(params: RegulationBeatParams): Promise<string> {
    const { prop, tiggieCue, feeling, isKidMode } = params;
    
    const prompt = `Generate a 2-3 sentence coping step for a neurodivergent child.

Prop: ${prop}
Tiggie cue: ${tiggieCue}
Feeling: ${feeling}

${isKidMode ? 'KID MODE: Very simple language, short sentences.' : 'GROWNUP MODE: More detailed but still clear.'}

Requirements:
- Use the prop in the coping strategy
- Include the Tiggie cue as a one-line instruction
- Name the feeling explicitly
- Model self-advocacy in 6-10 words
- End with empowerment

Response format: Just the regulation text, no explanations.`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.6,
        max_tokens: 150
      });
      
      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Error generating regulation beat:', error);
      return `Take a deep breath with your ${prop}. ${tiggieCue} You can do this!`;
    }
  }

  /**
   * Generate reflection for Spark 5
   */
  static async generateReflection(params: ReflectionParams): Promise<string> {
    const { spark, changes, effort, isKidMode } = params;
    
    const changesText = changes.join(', ');
    
    const prompt = `Generate a reflection for Spark 5 (final beat) of a neurodivergent-friendly story.

Spark: ${spark} of 5
Changes made: ${changesText}
Effort shown: ${effort}

${isKidMode ? 'KID MODE: Simple celebration, clear choices.' : 'GROWNUP MODE: More detailed reflection while staying positive.'}

Requirements:
- Name what changed (celebrate progress)
- Acknowledge effort shown
- Prompt a tiny choice for next time ("next time I can ____")
- End with positive reinforcement
- Keep it encouraging and empowering

Response format: Just the reflection text, no explanations.`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.6,
        max_tokens: 200
      });
      
      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Error generating reflection:', error);
      return `Great job! You tried really hard. Next time I can try something different. You're doing amazing!`;
    }
  }

  /**
   * Generate alternative scene when sensory budget is exceeded
   */
  static async generateSensoryAlternative(
    originalText: string,
    sensoryBudget: { [key: string]: number },
    caps: { total: number; perAxis: number }
  ): Promise<string> {
    const exceededAxes = Object.entries(sensoryBudget)
      .filter(([_, value]) => value > caps.perAxis)
      .map(([axis, _]) => axis);
    
    const total = Object.values(sensoryBudget).reduce((sum, val) => sum + val, 0);
    const totalExceeded = total > caps.total;
    
    const prompt = `The current scene exceeds sensory budget limits. Create a gentler version.

Original scene: "${originalText}"

Issues:
${totalExceeded ? `- Total sensory load (${total}) exceeds cap (${caps.total})` : ''}
${exceededAxes.map(axis => `- ${axis} load exceeds per-axis cap (${caps.perAxis})`).join('\n')}

Make it gentler by:
- Reducing crowd/background noise
- Dimming visual stimuli
- Simplifying social interactions
- Using calmer language
- Maintaining story flow

Response format: Just the revised scene text, no explanations.`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
        max_tokens: 300
      });
      
      return response.choices[0]?.message?.content || originalText;
    } catch (error) {
      console.error('Error generating sensory alternative:', error);
      return originalText;
    }
  }

  /**
   * Generate profanity/violence filter check
   */
  static async checkContentSafety(text: string): Promise<{ isSafe: boolean; filteredText: string; issues: string[] }> {
    const prompt = `Check this text for age-appropriate content for ages 4-12.

Text: "${text}"

Check for:
- Profanity or inappropriate language
- Violence or scary content
- Overwhelming sensory descriptions
- Complex emotional concepts beyond age range

Respond with JSON:
{
  "isSafe": boolean,
  "filteredText": "cleaned version if needed",
  "issues": ["list of issues found"]
}

If safe, return original text. If not, provide gentle, age-appropriate alternatives.`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3,
        max_tokens: 200
      });
      
      const result = JSON.parse(response.choices[0]?.message?.content || '{"isSafe": true, "filteredText": "' + text + '", "issues": []}');
      return result;
    } catch (error) {
      console.error('Error checking content safety:', error);
      return { isSafe: true, filteredText: text, issues: [] };
    }
  }
}
