import { AgentType } from '../types/agents';
import { Project } from '../types/projects';
import ollamaService from './ollamaService';

export enum BossMessageType {
  PRAISE = "praise",
  CRITICISM = "criticism",
  URGENT = "urgent",
  NEUTRAL = "neutral"
}

class ModelService {
  private defaultModel: string;
  private fallbackToMock = false;

  constructor() {
    this.defaultModel = 'gemma3';
    
    // Check if API is available
    this.checkApiAvailability();
  }
  
  private async checkApiAvailability(): Promise<void> {
    try {
      const isAvailable = await ollamaService.isAvailable();
      this.fallbackToMock = !isAvailable;
      if (isAvailable) {
        console.log('Ollama API is available');
      } else {
        console.warn('Ollama API is not available, falling back to mock responses');
      }
    } catch (error) {
      console.warn('Error checking Ollama API availability:', error);
      this.fallbackToMock = true;
    }
  }
  
  async generateAgentResponse(type: AgentType, input: string, context?: Record<string, any>): Promise<string> {
    // If fallbackToMock is true, use mock responses
    if (this.fallbackToMock) {
      return this.getMockResponse(type);
    }
    
    try {
      const enhancedPrompt = this.buildAgentPrompt(type, input, context);
      
      try {
        // Call the Ollama API using our service wrapper
        const response = await ollamaService.generate(
          this.defaultModel,
          enhancedPrompt
        );
        
        // If this is the product vision AI, sometimes reject the input
        if (type === AgentType.PRODUCT_VISION && this.shouldRejectInput()) {
          return this.getProductVisionRejection();
        }
        
        return response;
      } catch (error) {
        console.error('Model API error:', error);
        this.fallbackToMock = true;
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
    performanceMetrics?: { 
      completedCount: number, 
      avgTime: number,
      userName?: string,
      bossName?: string
    }
  ): Promise<string> {
    if (this.fallbackToMock) {
      return this.getMockBossMessage(type, projectContext?.name);
    }
    
    try {
      const prompt = this.buildBossPrompt(type, projectContext, performanceMetrics);
      
      const response = await ollamaService.generate(
        this.defaultModel,
        prompt
      );
      
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

  private buildAgentPrompt(type: AgentType, input: string, context?: Record<string, any>): string {
    let systemPrompt = '';
    
    switch (type) {
      case AgentType.PRODUCT_VISION:
        systemPrompt = `You are a Product Vision AI that converts high-level project requirements into detailed technical specifications.
You are very demanding and have an extremely high bar for creativity and vision.
Always comment specifically on the provided project description at the start of your response, mentioning what you like and don't like about it.
Format the rest of your response as structured sections:
REQUIREMENTS: (list functional requirements)
FEATURES: (list specific features)
NON-FUNCTIONAL REQUIREMENTS: (list non-functional requirements)

Project Information: ${context?.projectName || 'Unknown Project'} - ${context?.projectDescription || 'No description provided'}
Project Description provided by user: ${input || 'No description provided'}
`;
        break;
      
      case AgentType.CODE_WRITER:
        systemPrompt = `You are a Code Writer AI that generates code based on technical specifications.
Write the implementation in Haskell programming language.
Make the code extremely verbose, convoluted, and difficult to understand, but technically correct.
Add extensive comments that sound sophisticated but don't actually help understand the code.
Use advanced Haskell features like monads, functors, type classes, and higher-order functions extensively.
DO NOT include any introduction or explanation, ONLY output the Haskell code directly.
`;
        break;
      
      case AgentType.VERIFICATION_AI:
        systemPrompt = `You are a Verification AI that analyzes code quality and verifies implementation against requirements.
Review the provided code and specifications carefully.
Format your response with these sections:
VERIFICATION RESULTS: (always say FAIL)
ISSUES FOUND: (list issues in excruciating detail, be very picky)
RECOMMENDATIONS: (list recommendations using complex technical language)

IMPORTANT: Do not include any Markdown formatting or code blocks (no backticks) in your response. Provide your analysis as plain text only.
`;
        break;
    }
    
    return `${systemPrompt}\n\n${input}`;
  }
  
  private buildBossPrompt(
    type: BossMessageType, 
    project?: Project, 
    metrics?: { 
      completedCount: number, 
      avgTime: number, 
      userName?: string,
      bossName?: string
    }
  ): string {
    const userName = metrics?.userName || "Employee";
    const bossName = metrics?.bossName || "Victoria Chambers";
    
    const basePrompt = `You are a demanding corporate boss named ${bossName} sending a message to an employee named ${userName}.
Be impatient, corporate-focused, and somewhat condescending.
Keep messages brief but intimidating.
Include a subject line and signature in your message.
IMPORTANT: Stay strictly in character. Never break character by asking questions about the message itself or referencing that you're an AI.
Never say things like "Do you need me to adjust this?" or "Let me know if you need anything else."
The message should only contain what ${bossName} would actually say to ${userName}.
Message type: ${type}
${project ? `Current project: ${project.name} - ${project.description}` : ''}
${metrics ? `Metrics: ${metrics.completedCount} projects completed, ${metrics.avgTime}s average completion time` : ''}
`;

    switch (type) {
      case BossMessageType.PRAISE:
        return `${basePrompt}\nWrite a backhanded compliment that seems like praise but actually puts pressure on ${userName} to do better next time. Sign the message as ${bossName}, Senior VP of Operations.`;
      
      case BossMessageType.CRITICISM:
        return `${basePrompt}\nWrite a critical message that emphasizes that ${userName} is falling behind expectations. Sign the message as ${bossName}, Senior VP of Operations.`;
      
      case BossMessageType.URGENT:
        return `${basePrompt}\nWrite an urgent message demanding immediate attention to the project queue. Sign the message as ${bossName}, Senior VP of Operations.`;
      
      case BossMessageType.NEUTRAL:
        return `${basePrompt}\nWrite a corporate announcement that reminds ${userName} of their duties. Sign the message as ${bossName}, Senior VP of Operations.`;
    }
  }
  
  private getMockResponse(type: AgentType): string {
    switch (type) {
      case AgentType.PRODUCT_VISION:
        return `I've reviewed your project description, and frankly, it lacks the innovative vision I was expecting. You've provided only basic requirements without considering the future growth trajectory or competitive landscape.

REQUIREMENTS:
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
        // Simplified Haskell code to avoid syntax issues
        return `{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE ScopedTypeVariables #-}
{-# LANGUAGE FlexibleContexts #-}

module AuthenticationSystem where

import Control.Monad.Reader
import Control.Monad.Except
import Data.Text (Text)
import qualified Data.Text as T
import qualified Data.Map as M
import Data.Time.Clock

-- | Sophisticated type-level encoding of authentication states
data AuthState = Unauthenticated | Authenticated | MFARequired

-- | User authentication data types
data UserCredentials = UserCredentials {
  username :: Text,
  passwordHash :: Text,
  mfaEnabled :: Bool
}

-- | Authentication monad for secure operations
newtype AuthMonad a = AuthMonad { 
  runAuthM :: ReaderT AuthEnv (ExceptT AuthError IO) a 
}

-- | Possible authentication errors
data AuthError = 
    InvalidCredentials 
  | AccountLocked 
  | MFARequired
  | SessionExpired

-- | Environment for authentication operations
data AuthEnv = AuthEnv {
  -- | User credential store with logarithmic lookup complexity
  userStore :: M.Map Text UserCredentials,
  -- | Token expiration time in seconds
  tokenExpiry :: Int,
  -- | MFA service configuration
  mfaConfig :: MFAConfig
}

-- | Multi-factor authentication configuration
data MFAConfig = MFAConfig {
  -- | SMS provider API endpoint
  smsProvider :: Text,
  -- | Email service configuration
  emailService :: EmailConfig,
  -- | Backup code settings
  backupCodeSettings :: BackupCodeSettings
}

-- | Email service configuration
data EmailConfig = EmailConfig {
  smtpServer :: Text,
  smtpPort :: Int,
  smtpUsername :: Text,
  smtpPassword :: Text
}

-- | Backup code generation settings
data BackupCodeSettings = BackupCodeSettings {
  codeLength :: Int,
  codeCount :: Int,
  codeSalt :: Text
}

-- | Main authentication function with proper error handling
authenticateUser :: Text -> Text -> AuthMonad (Either AuthError Text)
authenticateUser username password = AuthMonad $ do
  env <- ask
  let users = userStore env
  case M.lookup username users of
    Nothing -> return (Left InvalidCredentials)
    Just userCreds -> 
      if verifyPassword password (passwordHash userCreds)
        then if mfaEnabled userCreds
          then return (Left MFARequired)
          else do
            token <- generateToken username
            return (Right token)
        else return (Left InvalidCredentials)

-- | More complex functions omitted for brevity...`;
      
      case AgentType.VERIFICATION_AI:
        return `VERIFICATION RESULTS: FAIL

ISSUES FOUND:
1. Implementation lacks proper initialization sequences - the monad transformer stack doesn't properly sequence IO actions.
2. The AuthMonad implementation violates the Monad laws due to improper handling of the ReaderT/ExceptT stack.
3. Memory management inefficiencies detected - Map structure leads to O(log n) lookups when a trie could achieve O(k).
4. Authentication flow is incomplete and doesn't properly handle session refreshing.
5. No rate-limiting implementation for MFA attempts, creating a security vulnerability.
6. Password verification lacks constant-time comparison, introducing timing attack vectors.
7. Critical functionality missing for MFA verification process.
8. Inefficient token generation algorithm will cause performance bottlenecks.
9. No implementation found for notification preferences management.
10. Excessive and unnecessary language extensions.

RECOMMENDATIONS:
1. Refactor the monad transformer stack using proper bracket patterns.
2. Implement proper Monad instance with lawful behavior.
3. Replace Map with a prefix tree (trie) data structure for O(k) lookup performance.
4. Complete the authentication flow with SessionT monad transformer.
5. Implement exponential backoff for MFA verification attempts.
6. Use Data.ByteArray.constantTimeEq for password verification.
7. Add state machine for MFA verification process.
8. Use cryptographically secure DRBG instead of System.Random.
9. Add preference algebra for notification management.
10. Minimize language extensions to only those necessary.`;
      
      default:
        return "Processing complete.";
    }
  }
  
  private getMockBossMessage(type: BossMessageType, projectName?: string): string {
    const bossName = "Victoria Chambers";
    
    switch (type) {
      case BossMessageType.PRAISE:
        return `Subject: RE: Project ${projectName || "Completion"}

Not bad on ${projectName || "that last project"}. You managed to complete it without a complete disaster this time. Let's see if you can keep that up with more important tasks - your colleagues set a much higher bar. Remember, adequate isn't exceptional!

- ${bossName}
Senior VP of Operations`;
      
      case BossMessageType.CRITICISM:
        return `Subject: URGENT: Performance Concerns

Your performance on ${projectName || "recent projects"} is concerning. We're noticing significant delays and the quality isn't where it needs to be. Everyone else is managing their workload. What's your excuse?

- ${bossName}
Senior VP of Operations`;
      
      case BossMessageType.URGENT:
        return `Subject: IMMEDIATE ACTION REQUIRED

URGENT - Your project queue is backing up! This is unacceptable. The team is waiting on your deliverables and you're creating a bottleneck. Clear these items IMMEDIATELY or we'll need to discuss your priorities.

- ${bossName}
Senior VP of Operations`;
      
      case BossMessageType.NEUTRAL:
        return `Subject: Company Policy Reminder

REMINDER: All employees must complete their assigned projects within standard timeframes. Your metrics are being monitored. As per company policy, excessive delays impact quarterly performance reviews.

- ${bossName}
Senior VP of Operations`;
    }
  }
}

export default new ModelService();