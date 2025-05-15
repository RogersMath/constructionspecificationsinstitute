import React, { useState, useEffect } from 'react';
import { Bell, Clipboard, Calendar, CheckCircle, XCircle, FileText, Award, Coffee, ArrowRight, HelpCircle, Home } from 'lucide-react';

const CSIDocumentGame = () => {
  // Game state
  const [gameState, setGameState] = useState({
    day: 1,
    reputation: 50,
    money: 1000,
    document: null,
    currentScenario: null,
    timeRemaining: 120,
    scenariosCompleted: 0,
    correctDecisions: 0,
    showTutorial: true,
    gameStarted: false,
    gameOver: false,
    scenarioHistory: [],
  });

  // CSI MasterFormat document types (simplified for the game)
  const documentTypes = [
    { id: 'g702', name: 'AIA G702', description: 'Application and Certificate for Payment' },
    { id: 'g703', name: 'AIA G703', description: 'Continuation Sheet for G702' },
    { id: 'g701', name: 'AIA G701', description: 'Change Order Form' },
    { id: 'g704', name: 'AIA G704', description: 'Certificate of Substantial Completion' },
    { id: 'g706', name: 'AIA G706', description: 'Contractor\'s Affidavit of Payment of Debts and Claims' },
    { id: 'g706a', name: 'AIA G706A', description: 'Contractor\'s Affidavit of Release of Liens' },
    { id: 'g707', name: 'AIA G707', description: 'Consent of Surety to Final Payment' },
    { id: 'g709', name: 'AIA G709', description: 'Proposal Request Form' },
    { id: 'g710', name: 'AIA G710', description: 'Architect\'s Supplemental Instructions' },
    { id: 'g714', name: 'AIA G714', description: 'Construction Change Directive' },
    { id: 'g715', name: 'AIA G715', description: 'Supplemental Attachment for ACORD Certificate of Insurance' },
    { id: 'rfp', name: 'RFP', description: 'Request for Proposal' },
    { id: 'rfq', name: 'RFQ', description: 'Request for Qualification' },
    { id: 'rfi', name: 'RFI', description: 'Request for Information' },
    { id: 'sob', name: 'SOB', description: 'Schedule of Benefits' },
    { id: 'sov', name: 'SOV', description: 'Schedule of Values' },
    { id: 'ntp', name: 'NTP', description: 'Notice to Proceed' },
    { id: 'co', name: 'CO', description: 'Certificate of Occupancy' },
    { id: 'warranty', name: 'Warranty', description: 'Construction Warranty Document' },
    { id: 'submittal', name: 'Submittal', description: 'Material or Equipment Submittal' },
  ];

  // Scenarios for the game
  const scenarios = [
    {
      id: 1,
      title: 'Contractor Payment Request',
      description: 'Apex Construction has completed 35% of the project scope for Phase 1 and is requesting a payment for work completed to date.',
      correctDocuments: ['g702', 'g703', 'sov'],
      message: 'The contractor needs to submit a formal payment application with a detailed breakdown of work completed.',
      difficulty: 'easy',
    },
    {
      id: 2,
      title: 'Project Scope Addition',
      description: 'The client wants to add three more offices to the second floor, which wasn\'t in the original scope. This will increase project costs by $45,000.',
      correctDocuments: ['g701', 'rfi'],
      message: 'The contractor should submit a change order for the additional work scope with the client\'s approval.',
      difficulty: 'easy',
    },
    {
      id: 3,
      title: 'Construction Nearly Complete',
      description: 'The building is 95% complete and ready for initial occupancy while minor finishes are being completed.',
      correctDocuments: ['g704'],
      message: 'A Certificate of Substantial Completion should be issued to mark that the project is ready for its intended use.',
      difficulty: 'medium',
    },
    {
      id: 4,
      title: 'Final Payment Release',
      description: 'The project is 100% complete. The contractor is requesting final payment and release of retainage.',
      correctDocuments: ['g706', 'g706a', 'g707'],
      message: 'Final payment requires verification that all debts and claims have been satisfied, and the surety approves final payment.',
      difficulty: 'hard',
    },
    {
      id: 5,
      title: 'Material Specification Clarification',
      description: 'The contractor is unsure about the specified type of insulation material for the exterior walls.',
      correctDocuments: ['rfi'],
      message: 'The contractor should submit a Request for Information to get clarification from the architect.',
      difficulty: 'easy',
    },
    {
      id: 6,
      title: 'Project Initiation',
      description: 'The contract has been signed, and the project team is ready to begin construction.',
      correctDocuments: ['ntp'],
      message: 'A Notice to Proceed formally authorizes the contractor to begin work on the project.',
      difficulty: 'easy',
    },
    {
      id: 7,
      title: 'Design Clarification',
      description: 'The architect needs to provide additional details for the lobby ceiling design that weren\'t clear in the original drawings.',
      correctDocuments: ['g710'],
      message: 'The architect should issue supplemental instructions to clarify design details.',
      difficulty: 'medium',
    },
    {
      id: 8,
      title: 'Urgent Design Change',
      description: 'Unforeseen structural issues require immediate changes to the foundation design to maintain the project schedule.',
      correctDocuments: ['g714'],
      message: 'A Construction Change Directive allows work to proceed before a price is finalized when changes are urgent.',
      difficulty: 'medium',
    },
    {
      id: 9,
      title: 'Insurance Documentation',
      description: 'The owner has requested additional documentation about the contractor\'s insurance coverage for the project.',
      correctDocuments: ['g715'],
      message: 'The supplemental attachment provides additional insurance information beyond the standard ACORD certificate.',
      difficulty: 'hard',
    },
    {
      id: 10,
      title: 'Building Ready for Occupancy',
      description: 'Construction is complete, all inspections have passed, and the building is ready for legal occupancy.',
      correctDocuments: ['co'],
      message: 'A Certificate of Occupancy from the local building authority is required before the building can be legally occupied.',
      difficulty: 'medium',
    },
    {
      id: 11,
      title: 'Pre-Construction Planning',
      description: 'The project team needs to establish the detailed cost breakdown for all elements of the project.',
      correctDocuments: ['sov'],
      message: 'A Schedule of Values details the cost allocation for each element of the project and serves as the basis for payment applications.',
      difficulty: 'medium',
    },
    {
      id: 12,
      title: 'HVAC System Approval',
      description: 'The contractor needs to confirm the specific HVAC units before ordering equipment.',
      correctDocuments: ['submittal'],
      message: 'Submittals allow the architect and engineer to verify that the proposed materials and equipment meet the design requirements.',
      difficulty: 'medium',
    },
  ];

  // Timer effect
  useEffect(() => {
    let timer;
    if (gameState.gameStarted && !gameState.gameOver && !gameState.showTutorial && gameState.timeRemaining > 0) {
      timer = setInterval(() => {
        setGameState(prevState => {
          const newTimeRemaining = prevState.timeRemaining - 1;
          if (newTimeRemaining <= 0) {
            endGame();
            return { ...prevState, timeRemaining: 0, gameOver: true };
          }
          return { ...prevState, timeRemaining: newTimeRemaining };
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [gameState.gameStarted, gameState.gameOver, gameState.showTutorial, gameState.timeRemaining]);

  // Generate next scenario
  const generateScenario = () => {
    const remainingScenarios = scenarios.filter(
      scenario => !gameState.scenarioHistory.includes(scenario.id)
    );
    
    // If all scenarios have been used, reset history but don't repeat the last scenario
    let availableScenarios = remainingScenarios.length > 0 
      ? remainingScenarios 
      : scenarios.filter(s => s.id !== gameState.currentScenario?.id);
    
    if (availableScenarios.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * availableScenarios.length);
    return availableScenarios[randomIndex];
  };

  // Start the game
  const startGame = () => {
    const firstScenario = generateScenario();
    setGameState({
      ...gameState,
      gameStarted: true,
      showTutorial: false,
      currentScenario: firstScenario,
      scenarioHistory: [firstScenario.id],
    });
  };

  // End the game
  const endGame = () => {
    setGameState(prevState => ({
      ...prevState,
      gameOver: true
    }));
  };

  // Restart the game
  const restartGame = () => {
    setGameState({
      day: 1,
      reputation: 50,
      money: 1000,
      document: null,
      currentScenario: null,
      timeRemaining: 120,
      scenariosCompleted: 0,
      correctDecisions: 0,
      showTutorial: false,
      gameStarted: true,
      gameOver: false,
      scenarioHistory: [],
    });
    
    const firstScenario = generateScenario();
    setGameState(prevState => ({
      ...prevState,
      currentScenario: firstScenario,
      scenarioHistory: [firstScenario.id],
    }));
  };

  // Handle document selection
  const selectDocument = (docId) => {
    setGameState(prevState => ({
      ...prevState,
      document: docId
    }));
  };

  // Handle document submission
  const submitDocument = () => {
    if (!gameState.document || !gameState.currentScenario) return;
    
    const isCorrect = gameState.currentScenario.correctDocuments.includes(gameState.document);
    const difficultyValue = { 'easy': 1, 'medium': 2, 'hard': 3 };
    const scenarioDifficulty = difficultyValue[gameState.currentScenario.difficulty] || 1;
    
    let reputationChange = 0;
    let moneyChange = 0;
    
    if (isCorrect) {
      reputationChange = 5 * scenarioDifficulty;
      moneyChange = 200 * scenarioDifficulty;
    } else {
      reputationChange = -7 * scenarioDifficulty;
      moneyChange = -100 * scenarioDifficulty;
    }
    
    const nextScenario = generateScenario();
    
    setGameState(prevState => {
      const newReputation = Math.max(0, Math.min(100, prevState.reputation + reputationChange));
      const newMoney = prevState.money + moneyChange;
      const newScenariosCompleted = prevState.scenariosCompleted + 1;
      const newCorrectDecisions = isCorrect ? prevState.correctDecisions + 1 : prevState.correctDecisions;
      const newDay = prevState.day + 1;
      
      // Check if game should end
      const gameOver = newReputation <= 0 || newMoney <= 0 || newDay > 10 || !nextScenario;
      
      return {
        ...prevState,
        reputation: newReputation,
        money: newMoney,
        day: newDay,
        document: null,
        currentScenario: gameOver ? prevState.currentScenario : nextScenario,
        scenariosCompleted: newScenariosCompleted,
        correctDecisions: newCorrectDecisions,
        gameOver: gameOver,
        scenarioHistory: gameOver ? prevState.scenarioHistory : [...prevState.scenarioHistory, nextScenario.id],
        lastResult: {
          isCorrect,
          message: gameState.currentScenario.message,
          correctDocuments: gameState.currentScenario.correctDocuments.map(id => 
            documentTypes.find(doc => doc.id === id)?.name
          )
        }
      };
    });
  };

  // Format time remaining
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Calculate game score
  const calculateScore = () => {
    const baseScore = gameState.correctDecisions * 100;
    const timeBonus = Math.floor(gameState.timeRemaining / 10) * 10;
    const reputationBonus = Math.floor(gameState.reputation / 10) * 20;
    return baseScore + timeBonus + reputationBonus;
  };

  // Get appropriate status color based on value
  const getStatusColor = (value, max = 100) => {
    const percentage = (value / max) * 100;
    if (percentage >= 70) return 'text-green-600';
    if (percentage >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Render the game tutorial
  const renderTutorial = () => (
    <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-blue-800 mb-4">Welcome to CSI Document Master!</h2>
      
      <p className="mb-4">
        You've just been hired as a document specialist at a growing construction firm. Your job is to select the correct construction documents for various scenarios that arise during projects.
      </p>
      
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
        <h3 className="font-bold text-blue-700">How to Play:</h3>
        <ol className="list-decimal pl-5 space-y-2 mt-2">
          <li>Read each scenario carefully to understand what's happening on the construction project</li>
          <li>Select the appropriate document(s) that should be used in that situation</li>
          <li>Submit your decision and see if you were correct</li>
          <li>Manage your reputation and budget as you progress through construction projects</li>
        </ol>
      </div>
      
      <p className="mb-4">
        Your performance will be tracked by:
      </p>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center">
          <Award className="h-5 w-5 text-yellow-600 mr-2" />
          <span>Reputation: Your professional standing</span>
        </div>
        <div className="flex items-center">
          <FileText className="h-5 w-5 text-blue-600 mr-2" />
          <span>Scenarios: Construction situations</span>
        </div>
        <div className="flex items-center">
          <Calendar className="h-5 w-5 text-purple-600 mr-2" />
          <span>Day: Progress through your career</span>
        </div>
        <div className="flex items-center">
          <Coffee className="h-5 w-5 text-green-600 mr-2" />
          <span>Money: Your project budget</span>
        </div>
      </div>
      
      <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
        <p className="font-medium text-yellow-700">
          Remember: Choosing the wrong documents can cost money and damage your reputation. The game ends when you run out of money, reputation, or complete 10 days.
        </p>
      </div>
      
      <button
        onClick={startGame}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition duration-200 flex items-center justify-center"
      >
        Start Your Career <ArrowRight className="ml-2 h-5 w-5" />
      </button>
    </div>
  );

  // Render main game interface
  const renderGame = () => (
    <div className="flex flex-col h-full">
      {/* Status Bar */}
      <div className="bg-gray-800 text-white p-3 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 mr-1" />
            <span>Day: {gameState.day}/10</span>
          </div>
          <div className="flex items-center">
            <Bell className="h-5 w-5 mr-1" />
            <span className={getStatusColor(gameState.reputation)}>Reputation: {gameState.reputation}</span>
          </div>
        </div>
        <div className="text-center">
          <span className="bg-blue-600 px-3 py-1 rounded-lg">
            Time: {formatTime(gameState.timeRemaining)}
          </span>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <span className={getStatusColor(gameState.money, 5000)}>Budget: ${gameState.money}</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-1 text-green-500" />
            <span>{gameState.correctDecisions}/{gameState.scenariosCompleted}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Scenario Panel */}
        <div className="w-1/2 bg-gray-100 p-4 overflow-y-auto">
          {gameState.currentScenario && (
            <div className="bg-white rounded-lg shadow p-4">
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-4">
                <h2 className="text-xl font-bold text-blue-800">{gameState.currentScenario.title}</h2>
                <div className="text-xs mt-1 inline-block bg-gray-200 px-2 py-1 rounded">
                  Difficulty: {gameState.currentScenario.difficulty}
                </div>
              </div>
              
              <p className="mb-4">{gameState.currentScenario.description}</p>
              
              {gameState.lastResult && (
                <div className={`mt-4 p-3 rounded-lg ${gameState.lastResult.isCorrect ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'}`}>
                  <div className="flex items-start">
                    {gameState.lastResult.isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 mr-2 mt-0.5" />
                    )}
                    <div>
                      <p className={`font-medium ${gameState.lastResult.isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                        {gameState.lastResult.isCorrect ? 'Correct choice!' : 'Incorrect choice.'}
                      </p>
                      <p className="text-sm mt-1">{gameState.lastResult.message}</p>
                      {!gameState.lastResult.isCorrect && (
                        <p className="text-sm mt-2">
                          Correct document(s): {gameState.lastResult.correctDocuments.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-6">
                <h3 className="font-bold text-gray-700 mb-2">Select the appropriate document:</h3>
                <div className="flex flex-wrap gap-2">
                  {gameState.document ? (
                    <button 
                      onClick={submitDocument}
                      className="mt-4 w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded transition duration-200"
                    >
                      Submit Document
                    </button>
                  ) : (
                    <p className="text-gray-500 italic">Select a document from the list</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Document Selection Panel */}
        <div className="w-1/2 bg-gray-200 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-800">Available Documents</h3>
              <p className="text-sm text-gray-600">Click to select the appropriate document for the scenario</p>
            </div>
            
            <div className="p-2">
              {documentTypes.map((doc) => (
                <div 
                  key={doc.id}
                  onClick={() => selectDocument(doc.id)}
                  className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-blue-50 transition-colors ${gameState.document === doc.id ? 'bg-blue-100 border-l-4 border-blue-500' : ''}`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-800">{doc.name}</h4>
                      <p className="text-sm text-gray-600">{doc.description}</p>
                    </div>
                    {gameState.document === doc.id && (
                      <CheckCircle className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render game over screen
  const renderGameOver = () => (
    <div className="bg-white rounded-lg shadow-xl p-6 max-w-xl mx-auto text-center">
      <h2 className="text-2xl font-bold text-blue-800 mb-2">Game Over!</h2>
      
      {gameState.reputation <= 0 && (
        <p className="mb-4 text-red-600">Your reputation has fallen too low. You've been asked to find another position.</p>
      )}
      
      {gameState.money <= 0 && (
        <p className="mb-4 text-red-600">Your project has run out of budget. The client has terminated your contract.</p>
      )}
      
      {gameState.day > 10 && gameState.reputation > 0 && gameState.money > 0 && (
        <p className="mb-4 text-green-600">Congratulations! You've completed your first 10 days as a document specialist.</p>
      )}
      
      <div className="bg-gray-100 rounded-lg p-4 mb-6">
        <h3 className="font-bold text-lg mb-2">Your Performance</h3>
        
        <div className="grid grid-cols-2 gap-4 text-left">
          <div>
            <p className="text-gray-600">Days Completed:</p>
            <p className="font-bold">{gameState.day - 1}/10</p>
          </div>
          <div>
            <p className="text-gray-600">Correct Decisions:</p>
            <p className="font-bold">{gameState.correctDecisions}/{gameState.scenariosCompleted}</p>
          </div>
          <div>
            <p className="text-gray-600">Final Reputation:</p>
            <p className={`font-bold ${getStatusColor(gameState.reputation)}`}>{gameState.reputation}/100</p>
          </div>
          <div>
            <p className="text-gray-600">Budget Remaining:</p>
            <p className={`font-bold ${getStatusColor(gameState.money, 5000)}`}>${gameState.money}</p>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-300">
          <p className="text-gray-600">Final Score:</p>
          <p className="font-bold text-2xl text-blue-700">{calculateScore()}</p>
        </div>
      </div>
      
      <button
        onClick={restartGame}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition duration-200"
      >
        Play Again
      </button>
    </div>
  );

  // Main render function
  return (
    <div className="min-h-screen bg-gray-300 flex flex-col">
      {/* Header */}
      <header className="bg-blue-700 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Clipboard className="h-6 w-6 mr-2" />
            <h1 className="text-xl font-bold">CSI Document Master</h1>
          </div>
          
          {gameState.gameStarted && !gameState.gameOver && (
            <button
              onClick={() => setGameState(prev => ({ ...prev, showTutorial: true }))}
              className="flex items-center bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-sm"
            >
              <HelpCircle className="h-4 w-4 mr-1" />
              Help
            </button>
          )}
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 container mx-auto p-4 flex items-center justify-center">
        {gameState.showTutorial ? renderTutorial() : 
         gameState.gameOver ? renderGameOver() : 
         renderGame()}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white p-2 text-center text-sm">
        <p>&copy; 2025 CSI Document Master Simulation Game</p>
      </footer>
    </div>
  );
};

export default CSIDocumentGame;

