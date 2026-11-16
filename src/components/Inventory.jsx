import { useState, useMemo, useEffect } from 'react';
import {
  SAMPLE_DEVICES,
  DEVICE_TYPES,
  STATUS_OPTIONS,
  STATUS_CONFIG,
  STORAGE_KEY,
  generateNextId,
} from '../data/devices';

export default function Inventory() {
  // Inicialització des de localStorage o dades per defecte
  const [devices, setDevices] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (error) {
      console.error('Error en carregar les dades de localStorage:', error);
    }
    return SAMPLE_DEVICES;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Tots');

  // Estats del formulari d'alta
  const [selectedType, setSelectedType] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Sincronització automàtica amb localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(devices));
    } catch (error) {
      console.error('Error en desar les dades a localStorage:', error);
    }
  }, [devices]);

  // ID calculat automàticament per al següent dispositiu (RB-001, RB-002...)
  const nextId = useMemo(() => generateNextId(devices), [devices]);

  const handleCreateDevice = (e) => {
    e.preventDefault();

    // Validació: Cal haver seleccionat un tipus d'equip
    if (!selectedType || selectedType.trim() === '') {
      setFormError("Cal seleccionar un tipus d'equip de la llista.");
      setSuccessMessage('');
      return;
    }

    const newDevice = {
      id: nextId,
      tipus: selectedType,
      estat: 'En prova',
    };

    setDevices((prevDevices) => [...prevDevices, newDevice]);
    setSuccessMessage(`L'equip ${nextId} (${selectedType}) s'ha donat d'alta correctament.`);
    setSelectedType('');
    setFormError('');
  };

  // Canvi d'estat d'un equip des del desplegable
  const handleStatusChange = (deviceId, newStatus) => {
    setDevices((prevDevices) =>
      prevDevices.map((device) =>
        device.id === deviceId ? { ...device, estat: newStatus } : device
      )
    );
  };

  // Restabliment a dades de mostra
  const handleResetData = () => {
    if (window.confirm("Vols restablir l'inventari a les dades inicials de mostra?")) {
      setDevices(SAMPLE_DEVICES);
      setSuccessMessage('Inventari restablert a les dades inicials de mostra.');
      setFormError('');
    }
  };

  const filteredDevices = useMemo(() => {
    return devices.filter((device) => {
      const matchesSearch =
        device.id.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        device.tipus.toLowerCase().includes(searchTerm.toLowerCase().trim());

      const matchesStatus =
        selectedStatus === 'Tots' || device.estat === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [devices, searchTerm, selectedStatus]);

  // Mètriques superiors: recompte de dispositius per cada estat
  const stats = useMemo(() => {
    const total = SAMPLE_DEVICES.length;
    const enProva = SAMPLE_DEVICES.filter((d) => d.estat === 'En prova').length;
    const apte = SAMPLE_DEVICES.filter((d) => d.estat === 'Apte').length;
    const diagnosi = SAMPLE_DEVICES.filter((d) => d.estat === 'Diagnosi').length;

    return { total, enProva, apte, diagnosi };
  }, []);

  return (
    <div className="inventory-container">
      {/* Capçalera principal */}
      <header className="inventory-header">
        <div className="brand-badge">
          <span className="brand-dot"></span>
          <span>Plataforma d'Estudi</span>
        </div>
        <h1 className="inventory-title">REBOOT Study</h1>
        <p className="inventory-subtitle">
          Inventari de dispositius assignats i estat operatiu
        </p>
      </header>

      {/* Targetes de resum superior: recompte de dispositius per estat */}
      <section className="stats-grid" aria-label="Recompte de dispositius per estat">
        <div className="stat-card">
          <span className="stat-label">Total dispositius</span>
          <span className="stat-value">{stats.total}</span>
        </div>
        <div className="stat-card stat-card-en-prova">
          <span className="stat-label">En prova</span>
          <span className="stat-value">{stats.enProva}</span>
        </div>
        <div className="stat-card stat-card-apte">
          <span className="stat-label">Apte</span>
          <span className="stat-value">{stats.apte}</span>
        </div>
        <div className="stat-card stat-card-diagnosi">
          <span className="stat-label">Diagnosi</span>
          <span className="stat-value">{stats.diagnosi}</span>
        </div>
      </section>

      {/* Formulari per donar d'alta un nou equip */}
      <section className="register-card" aria-labelledby="form-heading">
        <div className="register-header">
          <h2 id="form-heading" className="register-title">
            Donar d'alta un nou equip
          </h2>
          <p className="register-description">
            L'identificador es genera de manera automàtica i l'estat inicial s'assigna com a «En prova».
          </p>
        </div>

        <form onSubmit={handleCreateDevice} className="register-form" noValidate>
          <div className="form-fields-grid">
            {/* ID generat automàticament */}
            <div className="form-group">
              <label htmlFor="device-id-field" className="form-label">
                Identificador (ID)
              </label>
              <div className="input-readonly-wrapper">
                <input
                  id="device-id-field"
                  type="text"
                  className="form-input form-input-readonly"
                  value={nextId}
                  readOnly
                  aria-describedby="device-id-help"
                />
                <span id="device-id-help" className="form-help-text">
                  Generat automàticament
                </span>
              </div>
            </div>

            {/* Selector de tipus d'equip */}
            <div className="form-group">
              <label htmlFor="device-type-select" className="form-label">
                Tipus d'equip <span className="required-marker">*</span>
              </label>
              <select
                id="device-type-select"
                className={`form-select ${formError ? 'input-error' : ''}`}
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  if (formError) setFormError('');
                }}
                aria-invalid={formError ? 'true' : 'false'}
                aria-describedby={formError ? 'type-error-msg' : undefined}
              >
                <option value="">-- Selecciona un tipus d'equip --</option>
                {DEVICE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Estat inicial (En prova) */}
            <div className="form-group">
              <label htmlFor="device-status-field" className="form-label">
                Estat inicial
              </label>
              <div className="status-preview-box">
                <span className="status-badge badge-en-prova">
                  <span className="status-indicator"></span>
                  En prova
                </span>
                <span className="form-help-text">Assignat per defecte</span>
              </div>
            </div>

            {/* Botó d'acció */}
            <div className="form-group form-submit-group">
              <button type="submit" className="btn-primary">
                <svg
                  className="btn-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Donar d'alta equip
              </button>
            </div>
          </div>

          {/* Missatge d'error de validació */}
          {formError && (
            <div id="type-error-msg" className="form-alert form-alert-error" role="alert">
              <svg
                className="alert-icon"
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
                  d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 7.5h.008v.008H12v-.008Z"
                />
              </svg>
              <span>{formError}</span>
            </div>
          )}

          {/* Missatge de confirmació d'èxit */}
          {successMessage && (
            <div className="form-alert form-alert-success" role="status">
              <svg
                className="alert-icon"
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
              <span>{successMessage}</span>
            </div>
          )}
        </form>
      </section>

      {/* Secció principal de la taula */}
      <main className="inventory-card">
        <div className="inventory-toolbar">
          <div className="search-wrapper">
            <svg
              className="search-icon"
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
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="Cerca per identificador o tipus..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Cerca dispositius per identificador o tipus"
            />
            {searchTerm && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchTerm('')}
                aria-label="Netejar la cerca"
              >
                ✕
              </button>
            )}
          </div>

          <div className="filter-group" role="group" aria-label="Filtra per estat">
            <span className="filter-label">Filtre:</span>
            {['Tots', 'En prova', 'Apte', 'Diagnosi'].map((status) => (
              <button
                key={status}
                type="button"
                className={`filter-btn ${selectedStatus === status ? 'active' : ''}`}
                onClick={() => setSelectedStatus(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Taula de dispositius */}
        <div className="table-responsive">
          <table className="inventory-table">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Tipus</th>
                <th scope="col">Estat</th>
              </tr>
            </thead>
            <tbody>
              {filteredDevices.length > 0 ? (
                filteredDevices.map((device) => {
                  const statusInfo = STATUS_CONFIG[device.estat] || {
                    label: device.estat,
                    className: 'badge-default',
                    ariaLabel: `Estat: ${device.estat}`,
                  };

                  return (
                    <tr key={device.id} className="device-row">
                      <td className="device-id-cell">
                        <span className="device-id-badge">{device.id}</span>
                      </td>
                      <td className="device-type-cell">
                        <div className="device-type-wrapper">
                          <svg
                            className="laptop-icon"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.75}
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0H3"
                            />
                          </svg>
                          <span className="device-type-name">{device.tipus}</span>
                        </div>
                      </td>
                      <td className="device-status-cell">
                        <div className="status-dropdown-wrapper">
                          <select
                            className={`status-select ${statusInfo.className}`}
                            value={device.estat}
                            onChange={(e) => handleStatusChange(device.id, e.target.value)}
                            aria-label={`Canviar estat del dispositiu ${device.id}`}
                          >
                            {STATUS_OPTIONS.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                          <svg
                            className="status-dropdown-arrow"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2.5}
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                          </svg>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={3} className="empty-state-cell">
                    <p className="empty-title">No s'han trobat dispositius</p>
                    <p className="empty-description">
                      Cap equip coincideix amb els criteris de cerca o filtre seleccionats.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Peu de la taula */}
        <footer className="inventory-card-footer">
          <p className="footer-count">
            Mostrant <strong>{filteredDevices.length}</strong> de{' '}
            <strong>{devices.length}</strong> dispositius registrats
          </p>
          <div className="footer-actions">
            <span className="footer-tag">Desat a localStorage</span>
            <button
              type="button"
              className="btn-reset-data"
              onClick={handleResetData}
              title="Restablir dades originals de mostra"
            >
              Restablir dades inicials
            </button>
          </div>
        </footer>
      </main>

      <footer className="app-footer">
        <p>REBOOT Study &copy; {new Date().getFullYear()} — Sistema d'inventari intern</p>
      </footer>
    </div>
  );
}
