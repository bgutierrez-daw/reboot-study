import { useState, useMemo } from 'react';
import { SAMPLE_DEVICES, STATUS_CONFIG } from '../data/devices';

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('Tots');

  const filteredDevices = useMemo(() => {
    return SAMPLE_DEVICES.filter((device) => {
      const matchesSearch =
        device.id.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        device.tipus.toLowerCase().includes(searchTerm.toLowerCase().trim());

      const matchesStatus =
        selectedStatus === 'Tots' || device.estat === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, selectedStatus]);

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

      {/* Targetes de resum d'estat */}
      <section className="stats-grid" aria-label="Resum de l'estat dels dispositius">
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
                        <span
                          className={`status-badge ${statusInfo.className}`}
                          aria-label={statusInfo.ariaLabel}
                        >
                          <span className="status-indicator"></span>
                          {device.estat}
                        </span>
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
            <strong>{SAMPLE_DEVICES.length}</strong> dispositius registrats
          </p>
          <span className="footer-tag">Dades en memòria local</span>
        </footer>
      </main>

      <footer className="app-footer">
        <p>REBOOT Study &copy; {new Date().getFullYear()} — Sistema d'inventari intern</p>
      </footer>
    </div>
  );
}
