Quiero que construyas un sitio web usando **Astro** con las siguientes características.
El objetivo del sitio es **generar videos de demostración** mostrando una conversación simulada de WhatsApp entre un usuario y nuestra IA llamada **“Vi”**, por lo que todo debe ser **dinámico, reproducible y configurable**.

---

## **🎯 Objetivo del Proyecto**

Crear un **visor de chats estilo WhatsApp**, que se renderice dentro de una **pantalla simulada de un dispositivo** (teléfono, tablet o desktop).
El chat debe poder **reproducir conversaciones cargadas desde archivos JSON**, con animación de *auto-scroll* y controles de reproducción.

---

## **📱 Requisitos funcionales**

### **1. Componente de Dispositivo (DeviceFrame)**

Debe simular distintos dispositivos:

* iPhone moderno (estilo notch)
* Android genérico
* Tablet
* Desktop chat window

El tipo de dispositivo **se define desde el JSON**.

Debe:

* ser responsivo
* permitir zoom (para grabar videos)
* renderizar dentro su contenido (el chat)

---

### **2. Componente de Chat estilo WhatsApp**

Debe verse **idéntico al WhatsApp real**, incluyendo:

* Burbujas verdes y grises
* Horas y fechas
* Enlaces clicables
* Imágenes y fotos
* Mensajes de sistema ("Hoy", "Ayer", etc.)
* Avatares
* Scroll suave

---

### **3. Render desde un archivo JSON**

El sitio debe permitir **cargar un JSON** para renderizar toda la conversación.

Ejemplo de JSON que debes usar como estándar:

```json
{
  "device": "iphone15",
  "theme": "whatsapp-light",
  "conversation": [
    {
      "id": 1,
      "sender": "user",
      "text": "Hola, Vi 👋 ¿me ayudas con mi cita?",
      "timestamp": "2025-01-15 08:32"
    },
    {
      "id": 2,
      "sender": "vi",
      "text": "¡Hola! Claro que sí 😊 Envíame tu correo y país.",
      "timestamp": "2025-01-15 08:33"
    },
    {
      "id": 3,
      "sender": "user",
      "image": "https://example.com/foto.jpg",
      "timestamp": "2025-01-15 08:34"
    },
    {
      "id": 4,
      "sender": "vi",
      "text": "Perfecto. Esta es tu actualización 👉 https://visabot.com.co",
      "timestamp": "2025-01-15 08:35"
    }
  ],
  "settings": {
    "autoplaySpeed": 1.0,
    "showAvatar": true,
    "showTicks": false
  }
}
```

Debes crear una definición fuerte (TypeScript) del JSON.

---

### **4. Controles de Reproducción**

En la interfaz se debe incluir:

* ▶️ **Play**
* ⏸️ **Pause**
* ⏩ **Velocidad (0.5x, 1x, 2x, 4x)**
* 🔁 **Reset**
* Barra de progreso

El *play* debe:

* Mostrar los mensajes uno por uno
* Hacer auto-scroll suave
* Respetar la velocidad configurada

---

### **5. Configuración desde UI**

Debe haber:

* un **selector de dispositivo**
* un **selector de tema (light/dark)**
* un **input para cargar el JSON**
* un preview en vivo

---

## **🧩 Requisitos técnicos**

### **Tecnologías obligatorias:**

* Astro
* TypeScript
* TailwindCSS
* Animaciones con GSAP o framer-motion si aplica
* Composición de componentes limpia

---

### **Estructura sugerida del proyecto**

```
src/
  components/
    DeviceFrame.astro
    ChatView.astro
    MessageBubble.astro
    Controls.astro
  utils/
    scroll.ts
    parser.ts
  types/
    conversation.ts
  pages/
    index.astro
```

---

## **🎞️ Optimizado para grabar videos**

El layout debe permitir:

* pantalla limpia (botón para esconder controles)
* fondo neutro
* tamaño fijo del dispositivo
* scroll estable sin saltos

---

## **📂 Inclusiones adicionales**

Genera también:

* un archivo `example.json` de conversación con:

  * texto
  * imágenes
  * links
  * mensajes largos
  * timestamps reales

* documentación en `README.md` que explique:

  * cómo cargar JSON
  * cómo grabar videos
  * cómo agregar nuevos dispositivos
  * cómo extender el tipo de mensaje

---

## **💬 Nota importante**

La IA llamada **“Vi”** debe ser tratada como remitente especial en el chat (estilo WhatsApp Business: avatar, nombre, color especial opcional).

---

## **✔️ Resultado esperado**

Un proyecto Astro completamente funcional, que:

* carga conversaciones dinámicamente
* se ve como WhatsApp 1:1
* permite reproducir la conversación para hacer videos
* admite distintos dispositivos
* acepta cualquier tipo de mensaje del JSON
* tenga código limpio, tipado y escalable
