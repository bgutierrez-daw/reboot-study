import { useMemo } from 'react';
import { STATUS_CONFIG } from '../data/devices';

export default function FitxaDeVida({ device, tests, onApplyResult, onClose }) {
  // Cerca de la darrera prova (la que té el número de test més alt)
  const latestTest = useMemo(() => {
    if (!tests || tests.length === 0) return null;
    const highestNum = Math.max(...tests.map((t) => t.test));
    return tests.find((t) => t.test === highestNum) || null;
  }, [tests]);

  if (!device) return null;

  const currentStatusInfo = STATUS_CONFIG[device.estat] || {
    label: device.estat,
    className: 'badge-default',
  };

  // Comprova si l'estat actual de l'inventari ja coincideix amb el resultat de la darrera prova
  const isAlreadySameStatus = latestTest ? device.estat === latestTest.result : false;
  const isButtonDisabled = !latestTest || isAlreadySameStatus;

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="fitxa-vida-title"
      >
        {/* Capçalera del modal */}
        <header className="modal-header">
          <div>
            <div className="brand-badge modal-badge">
              <span className="brand-dot"></span>
              <span>Registre d'Equip</span>
            </div>
            <h2 id="fitxa-vida-title" className="modal-title">
              Fitxa de vida: {device.id}
            </h2>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Tancar la fitxa de vida"
          >
            ✕
          </button>
        </header>

        {/* Dades generals del dispositiu */}
        <section className="device-summary-card" aria-label="Dades generals de l'equip">
          <div className="summary-item">
            <span className="summary-label">Identificador</span>
            <span className="summary-value device-id-badge">{device.id}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Tipus d'equip</span>
            <span className="summary-value device-type-name">{device.tipus}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Estat actual a l'inventari</span>
            <span className={`status-badge ${currentStatusInfo.className}`}>
              <span className="status-indicator"></span>
              {device.estat}
            </span>
          </div>
        </section>

        {/* Secció: Resultat de la darrera prova i botó d'aplicar */}
        {latestTest && (
          <section className="latest-test-card" aria-label="Resultat de la darrera prova">
            <div className="latest-test-content">
              <div className="latest-test-meta">
                <span className="latest-test-label">
                  Resultat de la darrera prova (Prova #{latestTest.test})
                </span>
                <div className="latest-test-result-wrapper">
                  <span
                    className={`status-badge ${
                      STATUS_CONFIG[latestTest.result]?.className || 'badge-default'
                    }`}
                  >
                    <span className="status-indicator"></span>
                    {latestTest.result}
                  </span>
                  {latestTest.maxTempC !== undefined && (
                    <span className="latest-test-detail">
                      Temp. màx: {latestTest.maxTempC} °C
                    </span>
                  )}
                  {latestTest.batteryPct !== undefined && (
                    <span className="latest-test-detail">
                      Bateria: {latestTest.batteryPct}%
                    </span>
                  )}
                </div>
              </div>

              <div className="latest-test-action">
                <button
                  type="button"
                  className="btn-apply-result"
                  disabled={isButtonDisabled}
                  onClick={() => onApplyResult(device.id, latestTest.result)}
                  title={
                    isAlreadySameStatus
                      ? `L'equip ja té l'estat «${device.estat}»`
                      : `Assigna l'estat «${latestTest.result}» a l'inventari`
                  }
                >
                  <svg
                    className="btn-apply-icon"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  Aplica el resultat
                </button>
                {isAlreadySameStatus && (
                  <span className="apply-synced-hint">
                    L'estat ja està actualitzat a {device.estat}
                  </span>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Llistat de proves del banc */}
        <section className="tests-section" aria-label="Resultats de les proves">
          <div className="tests-header">
            <h3 className="tests-title">Historial de proves del banc</h3>
            <span className="tests-count-badge">
              {tests.length} {tests.length === 1 ? 'prova' : 'proves'}
            </span>
          </div>

          {tests.length === 0 ? (
            <div className="no-tests-box">
              <svg
                className="no-tests-icon"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                />
              </svg>
              <p className="no-tests-text">Encara no té proves</p>
              <p className="no-tests-subtext">
                Aquest dispositiu no disposa de cap registre de prova al banc de REBOOT.
              </p>
            </div>
          ) : (
            <div className="tests-list">
              {tests.map((testItem, index) => {
                const isApte = testItem.result === 'Apte';
                const resultBadgeClass = isApte ? 'badge-apte' : 'badge-diagnosi';
                const isHighest = latestTest && testItem.test === latestTest.test;

                return (
                  <article key={index} className="test-card">
                    <div className="test-card-header">
                      <div className="test-card-info">
                        <span className="test-number-tag">
                          Prova #{testItem.test}
                        </span>
                        {isHighest && (
                          <span className="latest-test-badge">Darrera prova</span>
                        )}
                        {testItem.bench && (
                          <span className="test-bench-tag">{testItem.bench}</span>
                        )}
                      </div>
                      <span className={`status-badge ${resultBadgeClass}`}>
                        <span className="status-indicator"></span>
                        {testItem.result}
                      </span>
                    </div>

                    <div className="test-metrics-grid">
                      <div className="metric-box">
                        <span className="metric-label">Temperatura màxima</span>
                        <span className="metric-value">
                          {testItem.maxTempC !== undefined ? `${testItem.maxTempC} °C` : '—'}
                        </span>
                      </div>
                      <div className="metric-box">
                        <span className="metric-label">Bateria</span>
                        <span className="metric-value">
                          {testItem.batteryPct !== undefined ? `${testItem.batteryPct}%` : '—'}
                        </span>
                      </div>
                    </div>

                    {/* Motius del diagnòstic */}
                    {testItem.reasons && testItem.reasons.length > 0 ? (
                      <div className="test-reasons-wrapper">
                        <span className="reasons-label">Motius del diagnòstic:</span>
                        <ul className="reasons-list">
                          {testItem.reasons.map((reason, rIdx) => (
                            <li key={rIdx} className="reason-item">
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="test-reasons-empty">
                        <span>Sense incidències registrades.</span>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Peu del modal */}
        <footer className="modal-footer">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Tancar fitxa
          </button>
        </footer>
      </div>
    </div>
  );
}
