// audioProcessor.js
class AudioProcessor extends AudioWorkletProcessor {
  process(inputs, outputs, parameters) {
      const inputBuffer = inputs[0];
      this.port.postMessage(inputBuffer);
      return true;
  }
}

registerProcessor('audio-processor', AudioProcessor);