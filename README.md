# REBOOT Study — Inventari de dispositius

Pràctica realitzada en parella per:
* **Beatriz Gutierrez** (`bgutierr.daw2n26@lamerce.com`)
* **Alba Chavez**

---

## 3. Una correcció documentada (EN PARELLA · 10 MIN)

> **Segur que alguna cosa no surt bé a la primera. Documenteu-ne una.**

* **Què fallava:**  
  En canviar l'estat d'un equip des del desplegable de la taula, els comptadors superiors no s'actualitzaven en temps real.

* **Com ho vau detectar:**  
  Vam passar l'equip `RB-A` d'«En prova» a «Apte» i vam veure que les targetes de dalt mantenien les xifres antigues.

* **Què vau demanar o canviar:**  
  Vam demanar recalcular les mètriques directament des de l'estat reactiu dels equips en lloc d'usar les dades estàtiques inicials (`SAMPLE_DEVICES`).

* **Com vau comprovar que ja funciona:**  
  Vam canviar l'estat de diversos equips i vam veure com els comptadors superiors s'incrementaven i decreixien al mateix instant.

---

## Característiques del projecte

* **Llistat d'inventari:** Pantalla amb taula de dispositius, ID, tipus i estat amb estils visuals diferenciats.
* **Formulari d'alta:** Generació automàtica d'identificador (`RB-001`, `RB-002`...), selecció de tipus amb validació i assignació inicial «En prova».
* **Desplegable d'estats a la taula:** Modificació interactiva de l'estat de qualsevol dispositiu en temps real.
* **Mètriques superiors:** Comptadors actualitzats al moment per cada estat (Total, En prova, Apte, Diagnosi).
* **Persistència local:** Guardat automàtic a `localStorage` perquè les dades no es perdin en recarregar.
* **Idioma:** Interfície 100% en català.

## Execució local

```bash
npm install
npm run dev
```
