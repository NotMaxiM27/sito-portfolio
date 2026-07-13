---
id: 2
title: "Shiny Robot"
tags: ["Unreal Engine", "Blueprints", "C++"]
year: 2024
image: "/images/shiny_robot_cover.png"
video: "/videos/Shiny Overview.mp4"
downloadUrl: "https://nabi-studios.itch.io/shiny-robot"
order: 2
---

## Description
> **Shiny Robot** is a story driven isometric puzzle game with stealth elements and environmental storytelling. In a post-apocalyptic world inhabited by machines, a scrap gathering robot wanders in search of objects to recover its memory. 

## Tech Specs
- Engine: **Unreal Engine 5**
- Language: **C++ & Blueprints**
- AI: **Behavior Trees & Blackboards**
- Animation: **Animation Blueprints, Blend Spaces & IK**
- VFX & Physics: **Niagara & Chaos**
- Audio: **FMOD**

## Key Features & Architecture
- **Raycasting Light Reflection System**: Developed a puzzle mechanic using **raycasting**, allowing the player's flashlight beam to bounce off mirrors and reach distant surfaces to interact with the environment.
- **Complex AI & Stealth Mechanics**: Engineered complex AI for the **K4-B00M** enemies using **Behavior Trees** and **Blackboards**. Enemies feature a hive-mind communication: if one is alerted, all are alerted. They operate in three distinct states:
  - **Patrolling (Blue Light)**: Following standard patrol routes.
  - **Alert (Yellow Light)**: Investigating the player's last known position.
  - **Attacking (Red Light)**: Preparing an attack. If they attach to the player, they explode, triggering a checkpoint restart.
<video src="/videos/K4b00m Overview.mp4" autoplay loop muted playsinline controls></video>
- **Companion System (R0bby)**: Implemented a robotic magpie companion. If and object gets illuminated by the player's light beam, R0bby assists in collecting it.
- **Inventory & Inspection System**: Built an inventory UI that allows players to collect, store and inspect items in 3D, alongside a carefully animated **workbench** that allows the player to receive upgrades.
- **Advanced Animation Systems**: Meticulously crafted **Animation Blueprints** and **Blend Spaces**. This includes idle animations like K4-B00M randomly "blinking" its claws or looking around, making the characters feel realistic and responsive. Utilized **Inverse Kinematics (IK)** and head tracking for the arm of the workbench.
- **VFX & Audio Integration**: Utilized **Niagara** for particle systems like explosions and welding and **Chaos** for characters explosions and destruction. Integrated **FMOD** for immersive and event-driven audio design.

## What I learned or improved
- Collaborating effectively within a team setting, coordinating technical implementation with Art Directors and Game Designers.
- Deepened expertise in Unreal Engine's AI and animation systems, translating complex requirements into modular Behavior Trees and highly polished Animation Blueprints.
- Implementing robust interaction systems like the light reflection via raycasting and the 3D inventory inspection.
- Problem-solving and lateral thinking (e.g. finding efficient solutions for IK and head tracking vs. standard movement).
- Integrating external tools like FMOD into the Unreal Engine pipeline.
