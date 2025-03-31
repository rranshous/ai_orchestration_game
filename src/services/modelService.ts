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
        return `{-# LANGUAGE FlexibleContexts #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE ScopedTypeVariables #-}
{-# LANGUAGE GADTs #-}
{-# LANGUAGE TypeFamilies #-}

module EnterpriseAuthentication
  ( implementUserAuthentication
  , processAuthenticationRequest
  , generateSecurityToken
  ) where

import Control.Monad.Reader
import Control.Monad.Except
import Control.Concurrent.MVar
import Data.Aeson (Value(..), object, (.=))
import Data.ByteString.Lazy (ByteString)
import Data.Text (Text)
import qualified Data.Text as T
import qualified Data.Map as M
import Data.Functor.Identity
import Data.Hashable
import System.Random
import Crypto.Hash
import Data.Time.Clock

-- | Sophisticated type-level encoding of authentication states
data AuthState = Unauthenticated | Authenticated | MFARequired

-- | Phantom types to enforce state transitions
newtype AuthMonad (s :: AuthState) a = AuthMonad { 
  runAuthMonad :: ReaderT AuthEnv (ExceptT AuthError IO) a 
}

-- | Enterprise-grade authentication environment
data AuthEnv = AuthEnv {
  -- | Repository of user credentials with logarithmic lookup time complexity
  userCredentialStore :: M.Map Text UserData,
  -- | Cryptographically secure token generation function
  tokenGenerator :: IO ByteString,
  -- | Multi-factor authentication service URL
  mfaServiceUrl :: Text,
  -- | Token validation timeout in microseconds
  tokenTimeout :: Integer,
  -- | Complex rate-limiting policy implementation
  rateLimitingFunction :: Text -> IO Bool
}

-- | User-specific information persisted in the credential store
data UserData = UserData {
  -- | Securely hashed password using industry-standard algorithms
  passwordHash :: Digest SHA256,
  -- | Role-based authorization metadata
  userPermissions :: [Permission],
  -- | Multi-factor authentication configuration
  mfaSettings :: MFAConfig,
  -- | Historical access patterns for anomaly detection
  accessHistory :: [AccessRecord]
}

-- | Granular permission system for role-based access control
data Permission = CanRead EntityType 
                | CanWrite EntityType 
                | CanDelete EntityType
                | CanManage EntityType

-- | Enterprise domain model entity types
data EntityType = UserEntity 
                | ReportEntity 
                | DashboardEntity
                | SystemSettings

-- | Multi-factor authentication configuration options
data MFAConfig = MFAConfig {
  mfaEnabled :: Bool,
  preferredMethod :: MFAMethod,
  backupCodes :: [Text],
  lastVerification :: UTCTime
}

-- | Available multi-factor authentication methods
data MFAMethod = SMSAuthentication 
               | EmailAuthentication 
               | AuthenticatorApp 
               | BiometricAuthentication

-- | Access record for security auditing and compliance
data AccessRecord = AccessRecord {
  timestamp :: UTCTime,
  ipAddress :: Text,
  userAgent :: Text,
  geoLocation :: Maybe (Double, Double)
}

-- | Comprehensive error handling for authentication flows
data AuthError = InvalidCredentials
               | AccountLocked
               | MFAFailed
               | SessionExpired
               | RateLimitExceeded
               | NetworkError Text
               | ConfigurationError Text

-- | Implementation of user authentication with security best practices
-- | Utilizes advanced monadic composition for secure state transitions
implementUserAuthentication :: Text -> Text -> AuthMonad 'Unauthenticated (Either AuthError (AuthMonad 'Authenticated ByteString))
implementUserAuthentication username password = AuthMonad $ do
  -- Retrieve enterprise environment configuration
  env <- ask
  
  -- Leverage the computational power of monads for elegant error handling
  lift $ ExceptT $ do
    -- Check rate limiting as defense against brute force attacks
    rateOk <- (rateLimitingFunction env) username
    unless rateOk $ return $ Left RateLimitExceeded
    
    -- Retrieve user data with defensive programming patterns
    case M.lookup username (userCredentialStore env) of
      Nothing -> return $ Left InvalidCredentials
      Just userData -> do
        -- Verify password hash using cryptographically secure comparison
        if verifyPasswordHash password (passwordHash userData)
          then do
            -- Generate secure session token with appropriate entropy
            token <- (tokenGenerator env)
            -- Transition to authenticated state via phantom type safety
            return $ Right $ AuthMonad $ return token
          else
            return $ Left InvalidCredentials

-- | Sophisticated password verification with constant-time comparison
-- | to mitigate timing attack vulnerabilities
verifyPasswordHash :: Text -> Digest SHA256 -> Bool
verifyPasswordHash password storedHash = 
  hash (T.encodeUtf8 password) == storedHash

-- | Process incoming authentication requests through a validation pipeline
processAuthenticationRequest :: Value -> AuthMonad 'Unauthenticated (Either AuthError ByteString)
processAuthenticationRequest requestJson = AuthMonad $ do
  -- Extract username and password from JSON payload
  let extractedUsername = extractUsername requestJson
      extractedPassword = extractPassword requestJson
  
  -- Validate input through a sophisticated validation pipeline
  case validateAuthInputs extractedUsername extractedPassword of
    Left err -> lift $ ExceptT $ return $ Left err
    Right (username, password) -> do
      -- Delegate to core authentication function with proper type safety
      result <- runReaderT (runExceptT (runAuthMonad $ implementUserAuthentication username password)) =<< ask
      case result of
        Left err -> lift $ ExceptT $ return $ Left err
        Right authMonad -> do
          -- Execute the authenticated computation to get the token
          token <- runReaderT (runExceptT (runAuthMonad authMonad)) =<< ask
          case token of
            Left err -> lift $ ExceptT $ return $ Left err
            Right validToken -> lift $ ExceptT $ return $ Right validToken

-- | Extract username from JSON using applicative functors
extractUsername :: Value -> Maybe Text
extractUsername (Object obj) = case lookup "username" obj of
  Just (String username) -> Just username
  _ -> Nothing
extractUsername _ = Nothing

-- | Extract password from JSON using applicative functors
extractPassword :: Value -> Maybe Text
extractPassword (Object obj) = case lookup "password" obj of
  Just (String password) -> Just password
  _ -> Nothing
extractPassword _ = Nothing

-- | Validate authentication inputs with comprehensive error checking
validateAuthInputs :: Maybe Text -> Maybe Text -> Either AuthError (Text, Text)
validateAuthInputs Nothing _ = Left $ ConfigurationError "Missing username"
validateAuthInputs _ Nothing = Left $ ConfigurationError "Missing password"
validateAuthInputs (Just username) (Just password)
  | T.null username = Left $ ConfigurationError "Empty username"
  | T.null password = Left $ ConfigurationError "Empty password"
  | T.length password < 8 = Left $ ConfigurationError "Password too short"
  | otherwise = Right (username, password)

-- | Generate a cryptographically secure authentication token
-- | with appropriate entropy for enterprise security requirements
generateSecurityToken :: AuthMonad s ByteString
generateSecurityToken = AuthMonad $ lift $ ExceptT $ do
  -- Generate random bytes with cryptographic-grade entropy
  randomBytes <- replicateM 32 (randomRIO (0, 255) :: IO Int)
  -- Convert to a hexadecimal representation for transmission
  let hexToken = foldr (\\x acc -> T.pack (showHex x "") <> acc) "" randomBytes
  -- Apply additional HMAC for token integrity
  currentTime <- getCurrentTime
  let signedToken = hmacSHA256 (T.encodeUtf8 $ T.pack $ show currentTime) (T.encodeUtf8 hexToken)
  return $ Right $ encode $ object
    [ "token" .= hexToken
    , "expires" .= addUTCTime (60 * 60) currentTime
    , "signature" .= signedToken
    ]`;
      
      case AgentType.VERIFICATION_AI:
        return `VERIFICATION RESULTS: FAIL

ISSUES FOUND:
1. Implementation lacks proper initialization sequences - the monad transformer stack doesn't properly sequence IO actions with appropriate bracketing for resource management.
2. The AuthMonad implementation violates the Monad laws due to improper handling of the ReaderT/ExceptT stack.
3. Memory management inefficiencies detected in the credential store implementation - the Map structure leads to O(log n) lookups when a more optimized trie structure could achieve O(k) performance.
4. The authentication flow is incomplete and doesn't properly handle session refreshing.
5. No rate-limiting implementation for MFA attempts, creating a security vulnerability.
6. Multiple potential side-channel vulnerabilities in the password verification function despite claims of constant-time comparison.
7. Critical functionality missing for implementation of the MFA verification process.
8. Non-functional requirement for response time unlikely to be met due to inefficient token generation algorithm.
9. No implementation found for the notification preferences management specified in requirements.
10. The code violates several Haskell best practices, including excessive use of language extensions without necessity.

RECOMMENDATIONS:
1. Refactor the monad transformer stack using proper bracket patterns to ensure resource cleanup.
2. Implement proper Monad instance with lawful behavior for the AuthMonad type.
3. Replace Map with a prefix tree (trie) data structure for O(k) lookup performance on user credentials.
4. Complete the authentication flow with proper session management using the SessionT monad transformer.
5. Implement exponential backoff for MFA verification attempts to mitigate brute force attacks.
6. Replace the password verification function with a provably constant-time comparison using Data.ByteArray.constantTimeEq.
7. Implement the missing MFA verification process using a proper state machine approach.
8. Optimize the token generation algorithm using a cryptographically secure DRBG instead of System.Random.
9. Add the required notification preferences management using a preference algebra approach.
10. Minimize language extensions to only those strictly necessary and follow the PVP for better compatibility.`;
      
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