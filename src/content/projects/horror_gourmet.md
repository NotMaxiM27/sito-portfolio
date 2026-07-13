---
id: 1
title: "Horror Gourmet"
tags: ["Unreal Engine", "Blueprints", "C++"]
year: 2025
image: "/images/horror_gourmet_cover.png"
video: "/videos/horror_gourmet_alt.mp4"
downloadUrl: "https://nabi-studios.itch.io/horror-gourmet"
order: 1
---

<video src="/videos/horror_gourmet_overview.mp4" autoplay loop muted playsinline controls></video>

## Description
> **Horror Gourmet** is a first person, single player cooking game inspired by Overcooked, where the player must prepare meals for monsters. He needs to read incoming orders and cook the recipes before the timer expires, navigating through various levels and environmental hazards.

## Tech Specs
- Engine: **Unreal Engine 5**
- Language: **C++ & Blueprints**

## Key Features & Architecture
- **Modular Recipe System**: Engineered a fully modular recipe system using nested **Data Assets** (`UPrimaryDataAsset` with `EditInlineNew`). This allows game designers to easily create complex recipes by combining tools, ingredients and timers without writing any code.
- **Cooking Mechanics & Tools**: Implemented various interactive cooking tools, including a cutting board with an integrated minigame and a cauldron for mixing ingredients. Objects can also be thrown.
- **Atmospheric Events & Environmental Hazards**: Programmed dynamic events that spawn patches on the ground, such as ice (which makes the player slide) and mud (which slows the player down).
- **Custom Text Animator**: Developed a custom, fully flexible text animator from scratch. This tool empowers game designers to easily add and format in-game dialogues and UI text with dynamic effects.
- **Cinematic & Tutorial Systems**: Created a tutorial system to teach the player mechanics. Additionally, implemented an easy to use cinematic tool that game designers utilize to create cutscenes showing the level layout before gameplay begins.
- **Physics & Ragdolls**: Utilized **Skeletal Meshes** for elements like arms, enabling ragdoll physics.

## What I learned or improved
- Designing deeply modular systems in **C++** tailored for game designers, making heavy use of Unreal Engine's Data Assets and reflection system.
- Developing custom UI tools (like the Text Animator) to improve the team's workflow and iteration speed.
- Handling complex physics interactions, such as object throwing, sliding mechanics (ice/mud) and ragdoll effects.
- Structuring a complete game loop from cinematic intro to gameplay, managing timers, scoring and dynamic events.
