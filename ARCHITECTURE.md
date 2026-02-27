# Arquitectura Refactorizada - Contador de Billar

## Estructura de Módulos

Este proyecto ha sido refactorizado para separar responsabilidades en módulos especializados. Cada módulo es un patrón IIFE (Immediately Invoked Function Expression) que encapsula su lógica y expone una API pública.

### 📁 Estructura de Carpetas

```
ContadorBillar/
├── contador.js              # Orquestador principal
├── index.html              # HTML principal
├── main.js                 # Proceso principal de Electron
├── preload.js              # Preload de Electron
├── package.json
├── utils/
│   ├── dataManager.js      # Gestión de persistencia
│   ├── playerManager.js    # Gestión de jugadores
│   ├── counterManager.js   # Creación de contadores
│   ├── scoreManager.js     # Acumulación de puntos
│   ├── statsManager.js     # Promedios y series
│   ├── resetManager.js     # Reinicio de datos
│   └── modalManager.js     # Gestión de modales
└── data/                   # Datos persistidos
```

---

## 📋 Descripción de Módulos

### 1. **dataManager.js** - Gestión de Persistencia de Datos
**Responsabilidad**: Manejar todas las operaciones de lectura/escritura con el sistema de archivos.

**API Pública:**
```javascript
DataManager.getSetActual()           // Obtiene set actual
DataManager.saveGeneralFile(name, value)
DataManager.loadGeneralFile(name)
DataManager.saveSetFile(name, value)
DataManager.loadSetFile(name)
```

---

### 2. **playerManager.js** - Gestión de Jugadores
**Responsabilidad**: Manejar nombres, handicaps e intercambio de jugadores.

**API Pública:**
```javascript
PlayerManager.initializeListeners()   // Inicializa listeners
PlayerManager.exchange()              // Intercambia jugadores
```

**Qué hace:**
- Escucha cambios en inputs de nombres/handicaps
- Sincroniza con archivos automáticamente
- Proporciona función para intercambiar jugadores

---

### 3. **counterManager.js** - Gestión de Contadores
**Responsabilidad**: Crear contadores genéricos con incremento/decremento.

**API Pública:**
```javascript
CounterManager.createCounter(idBtnMas, idBtnMenos, idDisplay, esGeneral, guardarEnAmbos)
CounterManager.initializeAllCounters()
```

**Qué hace:**
- Crea contadores reutilizables
- Maneja incremento/decremento
- Sincroniza automáticamente con archivos

---

### 4. **scoreManager.js** - Gestión de Acumulación de Puntos
**Responsabilidad**: Acumular puntos de contadores a marcadores.

**API Pública:**
```javascript
ScoreManager.accumulate(idContador, idMarcador)
ScoreManager.initializeListeners()
```

**Qué hace:**
- Suma puntos del contador al marcador
- Reinicia contador a 0
- Guarda en archivos (set y general)

---

### 5. **statsManager.js** - Gestión de Estadísticas
**Responsabilidad**: Calcular promedios y gestionar series (rachas).

**API Pública:**
```javascript
StatsManager.calculateAndUpdateAverage(...)
StatsManager.updateWhiteAverage()
StatsManager.updateYellowAverage()
StatsManager.updateSeries(...)
StatsManager.initializeListeners()
```

**Qué hace:**
- Calcula promedio: (marcador + puntos) / entradas * 1000
- Actualiza series más altas
- Guarda estadísticas en archivos

---

### 6. **resetManager.js** - Gestión de Reinicio
**Responsabilidad**: Reiniciar sets, marcadores y todos los datos asociados.

**API Pública:**
```javascript
ResetManager.resetCounters(ids, esGeneral, archivos, valor)
ResetManager.resetSet(sinConfirmacion)
ResetManager.resetAllMarkers()
ResetManager.initializeListeners()
```

**Qué hace:**
- Reinicia datos de un set
- Reinicia marcador completo (todos los sets)
- Muestra confirmación modal
- Recalcula promedios después del reinicio

---

### 7. **modalManager.js** - Gestión de Modales
**Responsabilidad**: Mostrar diálogos de confirmación.

**API Pública:**
```javascript
ModalManager.showConfirmation(mensaje, callback)
```

**Qué hace:**
- Crea modal personalizado
- Maneja respuestas Sí/No
- Proporciona efectos hover

---

### 8. **contador.js** - Orquestador Principal
**Responsabilidad**: Inicializar todos los módulos y coordinar su funcionamiento.

**Estructura:**
```javascript
document.addEventListener('DOMContentLoaded', function() {
  PlayerManager.initializeListeners();
  CounterManager.initializeAllCounters();
  ScoreManager.initializeListeners();
  StatsManager.initializeListeners();
  ResetManager.initializeListeners();
  // Listener de Electron
});
```

---

## 🔄 Flujo de Inicialización

```
HTML cargado
    ↓
Cargar módulos en orden:
  1. dataManager.js      (no requiere dependencias)
  2. playerManager.js    (usa DataManager)
  3. counterManager.js   (usa DataManager)
  4. scoreManager.js     (usa DataManager)
  5. statsManager.js     (usa DataManager)
  6. modalManager.js     (no requiere dependencias)
  7. resetManager.js     (usa StatsManager, ModalManager, DataManager)
    ↓
Ejecutar contador.js
    ↓
Inicializar todos los listeners
    ↓
Aplicación lista
```

---

## 🎯 Ventajas de esta Arquitectura

1. **Separación de Responsabilidades**
   - Cada módulo tiene una única responsabilidad
   - Código más organizado y fácil de mantener

2. **Reutilización**
   - Los módulos pueden usarse independientemente
   - APIs claras y consistentes

3. **Testabilidad**
   - Cada módulo puede testearse por separado
   - Dependencias explícitas

4. **Escalabilidad**
   - Agregar nuevas funcionalidades es más fácil
   - Nuevos módulos pueden crearse sin afectar existentes

5. **Mantenibilidad**
   - Bugs se localizan más fácilmente
   - Cambios no afectan todo el sistema

---

## 📝 Cómo Agregar Una Nueva Funcionalidad

1. **Crear nuevo módulo** en `utils/nombreModulo.js`
2. **Definir API pública** usando IIFE
3. **Listar dependencias** en comentarios
4. **Importar en `index.html`** en posición correcta (por dependencias)
5. **Inicializar en `contador.js`** si es necesario

### Ejemplo: Nuevo módulo

```javascript
// utils/customManager.js
const CustomManager = (() => {
  /**
   * Descripción de la función
   */
  function myFunction() {
    // Implementación
    DataManager.saveGeneralFile("key", "value");
  }

  return {
    myFunction
  };
})();
```

---

## 🔗 Dependencias Entre Módulos

```
modalManager ─────┐
                  ├─→ resetManager ────→ statsManager
dataManager ──────┤                          ↓
                  ├─→ playerManager        scoreManager
                  ├─→ counterManager       counterManager
                  └─→ scoreManager
```

---

## ✅ Checklist de Prueba

- [ ] Contadores incrementan/decrementan correctamente
- [ ] Datos se guardan en archivos
- [ ] Promedios se calculan correctamente
- [ ] Series se registran
- [ ] Intercambio de jugadores funciona
- [ ] Reinicio de set funciona con confirmación
- [ ] Reinicio de marcador completo funciona
- [ ] Modal se muestra correctamente
- [ ] Cambio de set carga datos correctos

