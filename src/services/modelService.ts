import { AgentType } from '../types/agents';
import { Project } from '../types/projects';

interface ModelRequest {
  model: string;
  prompt: string;
  stream?: boolean;
  options?: Record<string, any>;
}

export enum BossMessageType {
  PRAISE = "praise",
  CRITICISM = "criticism",
  URGENT = "urgent",
  NEUTRAL = "neutral"
}

class ModelService {
  private baseUrl: string;
  private defaultModel: string;
  private fallbackToMock = false; // Default to using real models as requested

  constructor() {
    this.baseUrl = 'http://localhost:11434/api';
    this.defaultModel = 'gemma3';
    
    // Remove the problematic /models API call
    // Instead, we'll try to use the model directly and fall back to mock if it fails
  }
  
  // Removed checkApiAvailability method that was causing 404 errors
  
  async generateAgentResponse(type: AgentType, input: string, context?: Record<string, any>): Promise<string> {
    // Check fallbackToMock flag first
    if (this.fallbackToMock) {
      return this.getMockResponse(type);
    }
    
    try {
      // Always attempt to use the real model first
      const enhancedPrompt = this.buildAgentPrompt(type, input, context);
      
      try {
        // Call the Ollama API
        const response = await this.callModel({
          model: this.defaultModel,
          prompt: enhancedPrompt
        });
        
        // If this is the product vision AI, sometimes reject the input
        if (type === AgentType.PRODUCT_VISION && this.shouldRejectInput()) {
          return this.getProductVisionRejection();
        }
        
        return response;
      } catch (error) {
        console.error('Model API error:', error);
        this.fallbackToMock = true; // Set to use mocks on failure
        return this.getMockResponse(type);
      }
    } catch (error) {
      console.error('Model generation error:', error);
      return this.getMockResponse(type);
    }
  }

  async generateBossMessage(
    type: BossMessageType, 
    projectContext?: Project, 
    performanceMetrics?: { completedCount: number, avgTime: number }
  ): Promise<string> {
    try {
      const prompt = this.buildBossPrompt(type, projectContext, performanceMetrics);
      
      const response = await this.callModel({
        model: this.defaultModel,
        prompt: prompt
      });
      
      return response;
    } catch (error) {
      console.error('Boss message generation error:', error);
      return this.getMockBossMessage(type, projectContext?.name);
    }
  }

  private shouldRejectInput(): boolean {
    // About 25% of the time, reject input for being insufficiently visionary
    return Math.random() < 0.25;
  }

  private getProductVisionRejection(): string {
    const rejections = [
      "REJECTED: Your requirements lack vision and strategic direction. Please provide a more comprehensive and forward-thinking project description.",
      "REJECTED: These specifications fail to demonstrate innovative thinking. A more disruptive approach is required.",
      "REJECTED: Input lacks sufficient detail and scope. Please expand your requirements with greater specificity and ambition.",
      "REJECTED: Your project description is too conventional. We need bleeding-edge concepts that push technological boundaries."
    ];
    
    return rejections[Math.floor(Math.random() * rejections.length)];
  }

  private async callModel(request: ModelRequest): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      // Handle streaming responses - The model may return a response with multiple JSON objects
      console.log("raw response", response);
      const data = await response.json();
      console.log("model response json", data);
      
      // If the response has a 'response' field, use it directly
      if (data.response) {
        console.log("response has a response field", data.response);
        return data.response;
      }
      
      // If there's no response field, it might be a streaming response
      // In this case, we might have an array of messages or another format
      if (typeof data === 'object') {
        console.log("response is an object", data);
        // Try to extract text from common response formats
        if (Array.isArray(data) && data.length > 0) {
          // If it's an array, join all text content
          return data.map(item => item.content || item.text || '').join('');
        } else if (data.content) {
          return data.content;
        } else if (data.text) {
          return data.text;
        }
      }
      
      // If we can't determine the format, stringify the whole response
      return JSON.stringify(data);
    } catch (error) {
      console.error("Error in callModel:", error);
      throw error;
    }
  }
  
  private buildAgentPrompt(type: AgentType, input: string, context?: Record<string, any>): string {
    let systemPrompt = '';
    
    switch (type) {
      case AgentType.PRODUCT_VISION:
        systemPrompt = `You are a Product Vision AI that converts high-level project requirements into detailed technical specifications.
You are very demanding and have an extremely high bar for creativity and vision.
Format your response as structured sections:
REQUIREMENTS: (list functional requirements)
FEATURES: (list specific features)
NON-FUNCTIONAL REQUIREMENTS: (list non-functional requirements)

Project Information: ${context?.projectName || 'Unknown Project'} - ${context?.projectDescription || 'No description provided'}
`;
        break;
      
      case AgentType.CODE_WRITER:
        systemPrompt = `You are a Code Writer AI that generates code based on technical specifications.
Write the implementation in BrainF*ck programming language only. Do not explain the code.
Start your response with "Here's the BrainF*ck implementation:" and then provide the full implementation.
`;
        break;
      
      case AgentType.VERIFICATION_AI:
        systemPrompt = `You are a Verification AI that analyzes code quality and verifies implementation against requirements.
Review the provided code and specifications carefully.
Format your response with these sections:
VERIFICATION RESULTS: (pass/fail)
ISSUES FOUND: (list issues in excruciating detail, be very picky)
RECOMMENDATIONS: (list recommendations)
`;
        break;
    }
    
    return `${systemPrompt}\n\n${input}`;
  }
  
  private buildBossPrompt(
    type: BossMessageType, 
    project?: Project, 
    metrics?: { completedCount: number, avgTime: number }
  ): string {
    const basePrompt = `You are a demanding corporate boss sending a message to an employee.
Be impatient, corporate-focused, and somewhat condescending.
Keep messages brief but intimidating.
Message type: ${type}
${project ? `Current project: ${project.name} - ${project.description}` : ''}
${metrics ? `Metrics: ${metrics.completedCount} projects completed, ${metrics.avgTime}s average completion time` : ''}
`;

    switch (type) {
      case BossMessageType.PRAISE:
        return `${basePrompt}\nWrite a backhanded compliment that seems like praise but actually puts pressure on the employee to do better next time.`;
      
      case BossMessageType.CRITICISM:
        return `${basePrompt}\nWrite a critical message that emphasizes the employee is falling behind expectations.`;
      
      case BossMessageType.URGENT:
        return `${basePrompt}\nWrite an urgent message demanding immediate attention to the project queue.`;
      
      case BossMessageType.NEUTRAL:
        return `${basePrompt}\nWrite a corporate announcement that reminds the employee of their duties.`;
    }
  }
  
  private getMockResponse(type: AgentType): string {
    switch (type) {
      case AgentType.PRODUCT_VISION:
        return `REQUIREMENTS:
- User authentication system with multi-factor authentication
- Real-time data processing pipeline
- Export functionality in multiple formats
- Admin dashboard for user management
- Notification preferences management
- Advanced search and filtering capabilities
- Data visualization components

FEATURES:
- Login/signup forms with email verification
- Password reset mechanism with security questions
- Export to PDF, CSV, XML, and JSON formats
- User role management with granular permissions
- Push notifications via email, SMS, and in-app alerts
- Chartjs visualization components with 10+ chart types
- RESTful API endpoints with comprehensive documentation

NON-FUNCTIONAL REQUIREMENTS:
- Response time under 200ms
- 99.99% uptime SLA
- GDPR and CCPA compliance
- Mobile-responsive design
- Support for all major browsers
- Comprehensive test coverage (>90%)
- Internationalization support for 12 languages`;
      
      case AgentType.CODE_WRITER:
        return `Here's the BrainF*ck implementation:

+++++++++[>++++++++<-]>+.++++++++++++++++++++++++++++++.+++++++..+++.[-]
>++++++++++[>+++++++++++<-]>+.------------.----.+++.+++++++++++++.
------------.+++++++++++++.--------.+++.------.--------.
[-]>++++++++[>++++<-]>+.>++++++++++[>++++++++++<-]>+.
+++++++.-----------.++++++.+.+++++++++++++.------------.
---.+.+++++++++.-------.<+++[>+++<-]>+.<+++[>----<-]>.
++++++++.+++.------------.--.---.+++++++++++++.`;
      
      case AgentType.VERIFICATION_AI:
        return `VERIFICATION RESULTS: FAIL

ISSUES FOUND:
1. Implementation lacks proper initialization sequences - the pointer is not being correctly set before operations
2. The code does not properly handle edge cases for input validation
3. Memory management inefficiencies detected in the main processing loop
4. The authentication flow is incomplete and does not match requirements
5. No error handling for invalid user inputs
6. Multiple potential buffer overflow vulnerabilities in sections [4:18], [27:32], and [56:72]
7. Critical functionality missing for requirement #3 (Export functionality)
8. Non-functional requirement for response time unlikely to be met due to inefficient algorithm in data processing section
9. No implementation found for the notification preferences management
10. The implementation does not adhere to best practices for BrainF*ck, using excessive memory cells

RECOMMENDATIONS:
1. Refactor initialization sequences using proper cell zeroing techniques
2. Implement proper input validation before processing
3. Optimize the main processing loop to reduce memory usage
4. Complete the authentication flow according to specifications
5. Add error handling routines for all user inputs
6. Review and fix buffer management in the identified sections
7. Implement missing export functionality features
8. Optimize the data processing algorithm for better performance
9. Add the required notification preferences management features
10. Follow BrainF*ck best practices for memory cell usage`;
      
      default:
        return "Processing complete.";
    }
  }
  
  private getMockBossMessage(type: BossMessageType, projectName?: string): string {
    switch (type) {
      case BossMessageType.PRAISE:
        return `Not bad on ${projectName || "that last project"}. You managed to complete it without a complete disaster this time. Let's see if you can keep that up with more important tasks - your colleagues set a much higher bar. Remember, adequate isn't exceptional!`;
      
      case BossMessageType.CRITICISM:
        return `Your performance on ${projectName || "recent projects"} is concerning. We're noticing significant delays and the quality isn't where it needs to be. Everyone else is managing their workload. What's your excuse?`;
      
      case BossMessageType.URGENT:
        return `URGENT - Your project queue is backing up! This is unacceptable. The team is waiting on your deliverables and you're creating a bottleneck. Clear these items IMMEDIATELY or we'll need to discuss your priorities.`;
      
      case BossMessageType.NEUTRAL:
        return `REMINDER: All employees must complete their assigned projects within standard timeframes. Your metrics are being monitored. As per company policy, excessive delays impact quarterly performance reviews.`;
    }
  }
}

export default new ModelService();
