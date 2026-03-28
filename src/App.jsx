import React, { useState } from 'react';
import { Activity, ShieldAlert, Zap, Server, CheckCircle2 } from 'lucide-react';
import { processChaoticInput } from './lib/gemini';

function App() {
  const [apiKey, setApiKey] = useState('');
  const [inputData, setInputData] = useState(`MASSIVE PILEUP on I-95 South marker 42. Three trucks involved, one leaking unknown fluid. Traffic backed up 10 miles. Need hazmat ASAP. Ambulances routing through side streets but totally gridlocked. Send helicopters or clear emergency lanes!`);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleProcess = async () => {
    if (!apiKey.trim()) {
      setError('Please provide a Gemini API Key to continue.');
      return;
    }
    if (!inputData.trim()) {
      setError('Please provide some unstructured input data.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const data = await processChaoticInput(apiKey, inputData, 'Traffic Gridlock & Incident Response');
      setResult(data);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header-bar">
        <div className="title-section">
          <div className="title-icon">
            <Activity size={32} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>Nexus Responder</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Universal Intent-to-Action Bridge
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <ShieldAlert size={20} color="var(--warning)" />
          <input
            type="password"
            placeholder="Gemini API Key"
            className="input-field"
            style={{ padding: '0.5rem 1rem', width: '250px' }}
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </div>
      </header>

      {/* Main Layout */}
      <main className="grid-layout">
        
        {/* Left Column - Input */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Server size={20} color="var(--accent)" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Unstructured Input</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Paste raw text, chaotic reports, or garbled intelligence below.
          </p>
          <textarea
            className="input-field"
            style={{ flex: 1, minHeight: '200px', fontFamily: 'monospace', lineHeight: 1.5 }}
            placeholder="Awaiting data stream..."
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
          />
          {error && (
            <div style={{ color: 'var(--danger)', fontSize: '0.9rem', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '4px' }}>
              {error}
            </div>
          )}
          <button 
            className="glow-btn" 
            onClick={handleProcess}
            disabled={isProcessing}
            style={{ padding: '1rem' }}
          >
            <Zap size={20} className={isProcessing ? 'pulse' : ''} />
            {isProcessing ? 'Processing Intent...' : 'Transform to Action Plan'}
          </button>
        </div>

        {/* Right Column - Output */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <CheckCircle2 size={20} color="var(--success)" />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>Structured Action Plan</h2>
          </div>

          {!result && !isProcessing && (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontStyle: 'italic', textAlign: 'center' }}>
              Awaiting data processing...<br/>Provide an API key and submit input.
            </div>
          )}

          {isProcessing && (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
              <div className="pulse">
                <Server size={48} color="var(--accent)" />
              </div>
              <p style={{ color: 'var(--accent)', fontWeight: 500 }}>Correlating entities...</p>
            </div>
          )}

          {result && !isProcessing && (
            <div className="fade-in" style={{ flex: 1, overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Status: {result.verified ? 'Verified' : 'Unverified'}</span>
                <span className={`badge ${result.priority.toLowerCase()}`}>
                  {result.priority} Priority
                </span>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Summary</h3>
                <p style={{ fontSize: '1.1rem', lineHeight: 1.5 }}>{result.summary}</p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Extracted Entities</h3>
                <div>
                  {result.entities && result.entities.map((entity, idx) => (
                    <span key={idx} className="entity-tag">{entity}</span>
                  ))}
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Immediate Actions</h3>
                {result.actionSteps && result.actionSteps.map((action, idx) => (
                  <div key={idx} className="action-step">
                    <div style={{ background: 'var(--accent)', color: 'white', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      {idx + 1}
                    </div>
                    <div>
                      <p style={{ fontWeight: 500, marginBottom: '0.25rem' }}>{action.step}</p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--accent)' }}>Assign To: {action.assignee}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

export default App;
