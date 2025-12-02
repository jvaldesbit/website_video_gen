# WhatsApp Chat Video Generator

This project allows you to generate and record simulated WhatsApp conversations using a JSON configuration.

## Features

- **Device Simulation**: iPhone 15, Android, Tablet, Desktop.
- **WhatsApp Style**: Authentic look and feel.
- **Dynamic Playback**: Play, Pause, Speed Control, Reset.
- **JSON Configuration**: Load conversations dynamically.

## Usage

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Load Conversation**:
   - Open the app in your browser.
   - Paste your JSON configuration in the settings panel or click "Load Example".
   - Click "Load JSON".

4. **Record Video**:
   - Use your screen recording tool to capture the device frame.
   - Use the playback controls to animate the conversation.

## JSON Structure

See `src/types/conversation.ts` for strict typing.

```json
{
  "device": "iphone15",
  "theme": "whatsapp-light",
  "conversation": [
    {
      "id": 1,
      "sender": "user",
      "text": "Hello",
      "timestamp": "10:00"
    }
  ],
  "settings": {
    "autoplaySpeed": 1.0,
    "showAvatar": true,
    "showTicks": false
  }
}
```
