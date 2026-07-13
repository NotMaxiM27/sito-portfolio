---
id: 5
title: "Master Thesis"
tags: ["Unity", "C#", "Python"]
year: 2026
image: "/images/nav_mesh_floor.png"
video: "/videos/Showcase_tesi.mp4"
#downloadUrl: "https://github.com/yourusername/your-repo"
order: 5
---

## Description
> Developed as a Master's Thesis, this project is a hybrid data-driven framework designed to bridge the gap between Digital Cultural Heritage and real-time 3D simulation. It empowers domain experts, such as historians and archaeologists, to author and simulate complex historical rituals with cinematic realism, completely bypassing the need for programming or manual animation alignment.

## Tech Specs
- Engine: **Unity**
- Language: **C# & Python**
- Animation: **Motion Matching**
- Navigation: **NavMesh & Custom Pathfinding Controller**

## Key Features & Architecture
- **No Code Authoring Pipeline**: Domain experts define actors, semantic tags and locations in an **Excel** spreadsheet. Custom **Python** scripts parse and serialize this into a **JSON** format, which is dynamically read by Unity at runtime to orchestrate the simulation.
- **Motion Matching Engine**: Replaced traditional Animation State Machines with a continuous procedural solver. The system continuously searches an unstructured Motion Capture database to automatically select and blend the best matching frames, eliminating manual synchronization.
- **Custom Event & Grasping Framework**: Extended a base Motion Matching library in C# to support frame accurate discrete events. Successfully fused continuous locomotion with discrete actions (using Avatar Masks, physics disabling and object reparenting) to achieve precise object grasping.
- **Automated Pathfinding Integration**: Integrated Unity's **NavMesh** with the Motion Matching solver. The custom controller extracts 3D paths, converts them to 2D trajectory constraints and dynamically scales velocities, allowing characters to navigate around static obstacles.
- **Asynchronous Execution Logic**: Developed the `RitualDirector`, a centralized asynchronous state machine that reads semantic commands (Setup, Move, Action, Wait) and custom parameters (e.g. mapping qualitative Speed tags to root motion velocity limits) to drive the runtime orchestration.

## What I learned or improved
- Designing scalable data-driven architectures with a focus on the **Separation of Concerns**.
- Extending and modifying third-party libraries to implement custom functionality, such as frame accurate event execution.
- Solving spatial and synchronization problems, specifically merging discrete 3D navigation (NavMesh) with continuous procedural animation solvers.
- Building accessible pipelines that translate human-readable inputs into automated real-time 3D simulations.
- Translating historical requirements into robust software engineering solutions.