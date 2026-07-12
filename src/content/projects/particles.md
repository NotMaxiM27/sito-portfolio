---
id: 4
title: "Particellare GPU"
tags: ["WebGL", "GLSL"]
image: "/immagini/particles.jpg"
order: 4
---

> **Sistema particellare** che calcola fisica e collisioni per milioni di particelle sfruttando GPGPU tramite ping-pong di texture.

## Implementazione
I dati di posizione e velocità delle particelle sono memorizzati in floating-point textures. I fragment shader aggiornano lo stato a 60 FPS senza overhead sulla CPU.
