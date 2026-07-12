---
id: 2
title: "Museum Visualizer"
tags: ["C++", "OpenGL", "University"]
year: 2026
image: "/images/museum_visualizer/LAB5_1.png"
gallery: 
    - src: "/images/museum_visualizer/LAB5_1.png"
      description: "Top view of the Time-Critical Rendering algorithm in action, choosing different LOD depending on performance"
    - src: "/images/museum_visualizer/LAB5_2.png"
      description: "Close up of chosen LOD mesh for the model"
    - src: "/images/museum_visualizer/LAB1.png"
      description: "Overview of the example map, showing the spawned architecture and correctly transformed models"
    - src: "/images/museum_visualizer/LAB7_1.png"
      description: "Vista principale con PVS attivato"
    - src: "/images/museum_visualizer/LAB7_2.png"
      description: "Vista principale con PVS attivato"
    - src: "/images/museum_visualizer/LAB7_3.png"
      description: "Vista principale con PVS attivato"
    - src: "/images/museum_visualizer/LAB7_4.png"
      description: "Vista principale con PVS attivato"
    - src: "/images/museum_visualizer/bunny.png"
      description: "Original bunny model"
    - src: "/images/museum_visualizer/bunny_LOD1_AVG.png"
      description: "Visual comparison of the bunny model undergoing Vertex Clustering. LOD1"
    - src: "/images/museum_visualizer/bunny_LOD2_AVG.png"
      description: "Visual comparison of the bunny model undergoing Vertex Clustering. LOD2"
    - src: "/images/museum_visualizer/bunny_LOD3_AVG.png"
      description: "Visual comparison of the bunny model undergoing Vertex Clustering. LOD3"
    - src: "/images/museum_visualizer/bunny_LOD4_AVG.png"
      description: "Visual comparison of the bunny model undergoing Vertex Clustering. LOD4"
    - src: "/images/museum_visualizer/bunny_LOD1_NORM.png"
      description: "Visual comparison of the bunny model undergoing Normal Clustering. LOD1"
    - src: "/images/museum_visualizer/bunny_LOD2_NORM.png"
      description: "Visual comparison of the bunny model undergoing Normal Clustering. LOD2"
    - src: "/images/museum_visualizer/bunny_LOD3_NORM.png"
      description: "Visual comparison of the bunny model undergoing Normal Clustering. LOD3"
    - src: "/images/museum_visualizer/bunny_LOD4_NORM.png"
      description: "Visual comparison of the bunny model undergoing Normal Clustering. LOD4"
    - src: "/images/museum_visualizer/bunny_LOD1_QEM.png"
      description: "Visual comparison of of the bunny model and its different Level Of Detail versions using Quadric Error Metrics. LOD1"
    - src: "/images/museum_visualizer/bunny_LOD2_QEM.png"
      description: "Visual comparison of of the bunny model and its different Level Of Detail versions using Quadric Error Metrics. LOD2"
    - src: "/images/museum_visualizer/bunny_LOD3_QEM.png"
      description: "Visual comparison of of the bunny model and its different Level Of Detail versions using Quadric Error Metrics. LOD3"
    - src: "/images/museum_visualizer/bunny_LOD4_QEM.png"
      description: "Visual comparison of of the bunny model and its different Level Of Detail versions using Quadric Error Metrics. LOD4"
order: 2
---

## Description
> A high performance C++ application designed for the interactive exploration of complex 3D virtual environments populated by models made of millions of triangles. It implements optimization algorithms to maintain real-time and consistent frame rates, including Time-Critical Rendering, Level of Detail (LOD) generation and Potentially Visible Set (PVS) culling.

## Tech Specs
- Language: **C++**
- Math Library: **Eigen**, **GLM**
- UI: **Dear ImGui**
- Build System: **CMake**

## Key Features & Architecture
- **Time-Critical Rendering**: Developed a greedy heuristic algorithm with temporal hysteresis to dynamically adjust LODs per frame to mantain real-time performances. Also implemented Funkhouser & Séquin's **Predictive Incremental Algorithm** for optimal LOD transitions.
- **Mesh Simplification (LOD)**: Implemented three distinct algorithms for geometry decimation: **Vertex Clustering**, **Quadric Error Metrics (QEM)** using Eigen for matrix operations and **Normal Clustering** for preserving sharp directional features.
- **Potentially Visible Set (PVS) Culling**: Integrated a cell-based visibility culling mechanism using random ray sampling and the **Supercover Bresenham** algorithm to entirely discard hidden models from the rendering pipeline.
- **Smart Pre-computation & Caching**: Engineered a pipeline that pre-computes LODs and serializes them into custom binary `.ply` files to significantly reduce startup time and allow instant runtime swapping of simplification algorithms.
- **Dynamic Map Parsing**: Decoupled scene generation from source code, allowing users to customize environments and spawn 3D models using a dedicated text configuration format.
- **Real-Time UI & Safety**: Integrated a **ImGui** control panel for real-time debugging (LOD coloring, performance overlay, algorithm swapping) with safety popups to prevent Out-Of-Memory (OOM) OS crashes.

## What I learned or improved
- Advanced implementation of geometric optimization algorithms and complex mathematical operations using the Eigen library.
- Deepened understanding of memory caching, binary serialization and efficient pre-computation pipelines.
- Enhanced skills in C++ profiling and performance optimization to manage large scale 3D environments with real-time performances.

## Code Snippets

### 1. Predictive Incremental Algorithm for Time-Critical Rendering
Instead of rebuilding the scene's LODs from scratch every frame, this algorithm leverages temporal coherence. It initializes the frame using the LOD set from the previous frame and performs incremental adjustments (upgrading the highest benefit/cost mesh or downgrading the lowest).

```cpp
// Scene.cpp - Incremental LOD adjustments based on dynamic frame budget
void Scene::optimizeLODsPredictive() {
    int currentTotalTriangles = 0;
    for (auto inst : visibleObjects) {
        currentTotalTriangles += inst->getTriangleCount(inst->getCurrentLOD());
    }

    float currentTPS = lastFrameTriangles * averageFPS;
    int maxCost = static_cast<int>(currentTPS / targetFPS);
    maxCost = std::min(maxCost, maxTriangleBudget);

    glm::vec3 camPos = camera.getPosition();
    bool bRunning = true;
    while (bRunning) {
        bRunning = false;
        if (currentTotalTriangles > maxCost) {
            // Decrement phase: downgrade the object with the least efficiency loss
            float bestEfficiency = 999999.0f; 
            int bestIdx = -1;
            int bestDeltaCost = 0;

            for (size_t i = 0; i < visibleObjects.size(); ++i) {
                auto inst = visibleObjects[i];
                int currentLOD = inst->getCurrentLOD();
                int maxLOD = inst->getLODCount() - 1;

                if (currentLOD < maxLOD) {
                    int nextLOD = currentLOD + 1; 
                    int costOld = inst->getTriangleCount(currentLOD);
                    int costNew = inst->getTriangleCount(nextLOD);
                    int deltaCost = costOld - costNew;

                    float distance = std::max(0.1f, glm::distance(camPos, glm::vec3(inst->getTransform()[3])));
                    float deltaBenefit = getBenefit(inst, currentLOD, distance) - getBenefit(inst, nextLOD, distance);
                    float efficiency = deltaBenefit / deltaCost;

                    if (efficiency < bestEfficiency) {
                        bestEfficiency = efficiency;
                        bestIdx = i;
                        bestDeltaCost = deltaCost;
                    }
                }
            }

            if (bestIdx != -1) {
                visibleObjects[bestIdx]->setCurrentLOD(visibleObjects[bestIdx]->getCurrentLOD() + 1);
                currentTotalTriangles -= bestDeltaCost;
                bRunning = true;
            }
        }
        // Increment phase logic omitted for brevity...
    }
}
```

### 2. Potentially Visible Set (PVS) via Random Sampling
Cell visibility is estimated statistically. From each source cell, 100 random ray samples are generated and cast toward target cells. To perform ray tracing across the discrete 2D grid structure, the **Supercover Bresenham** algorithm has been employed.

```cpp
// VisibilityManager.cpp - PVS Random Sampling for occlusion testing
void VisibilityManager::computePVS(int gridWidth, int gridHeight, float cellSize, const vector<vector<int>>& mapLayout) 
{
    const int NUM_SAMPLES = 100; 

    // Building a 3x3 subgrid in order to improve accuracy around tight corners
    const int SUB_MULTIPLIER = 3;
    int highResWidth = gridWidth * SUB_MULTIPLIER;
    int highResHeight = gridHeight * SUB_MULTIPLIER;
    float highResCellSize = cellSize / SUB_MULTIPLIER;

    // ... High-res map construction omitted ...

    for (int cy = 0; cy < gridHeight; cy++) {
        for (int cx = 0; cx < gridWidth; cx++) {
            if (mapLayout[cy][cx] == 1) continue; // Skip computation for wall cells

            int cellId = cy * gridWidth + cx;
            vector<int> visibleCells;
            float camMinX = cx * cellSize;
            float camMinZ = cy * cellSize;

            // Visibility check towards all other cells
            for (int ty = 0; ty < gridHeight; ty++) {
                for (int tx = 0; tx < gridWidth; tx++) {
                    float tgtMinX = tx * cellSize;
                    float tgtMinZ = ty * cellSize;
                    bool isVisible = false;

                    // Random Sampling
                    for (int s = 0; s < NUM_SAMPLES; s++) {
                        float rx = camMinX + static_cast<float>(rand()) / RAND_MAX * cellSize;
                        float rz = camMinZ + static_cast<float>(rand()) / RAND_MAX * cellSize;
                        float px = tgtMinX + static_cast<float>(rand()) / RAND_MAX * cellSize;
                        float pz = tgtMinZ + static_cast<float>(rand()) / RAND_MAX * cellSize;

                        // isLineOfSightClear evaluates the Supercover Bresenham Algorithm
                        if (isLineOfSightClear(glm::vec2(rx, rz), glm::vec2(px, pz), highResCellSize, highResWidth, highResHeight, highResMap)) {
                            isVisible = true;
                            break; 
                        }
                    }

                    if (isVisible) {
                        visibleCells.push_back(ty * gridWidth + tx);
                    }
                }
            }
            pvs[cellId] = visibleCells;
        }
    }
}
```

### 3. Real-Time Algorithm Swapping & Pre-computation
To evaluate the three mesh simplification algorithms, a runtime swapping mechanism was introduced. The engine instantly streams the new model variants into memory without freezing the application.

```cpp
// Scene.cpp - Seamless swapping of the LOD generation algorithms
void Scene::changeAlgorithm()
{
    string suffixes[3] = { "_AVG", "_QEM", "_NORM" };
    string targetSuffix = suffixes[currentAlgoIndex];
    PLYReader reader;

    // Reloading meshes using the newly selected algorithm from pre-computed cache
    for (size_t i = 0; i < mapModels.size(); i++) {
        
        // Cleaning old LODs from memory, keeping only the original model (LOD0)
        for (size_t j = 1; j < mapModels[i].size(); j++) {
            delete mapModels[i][j];
        }
        mapModels[i].resize(1); 
        
        // ... String path handling omitted ...

        // Streaming new LOD variants into memory instantly
        for(int j = 1; j <= 4; j++) {
            string lodFilename = "models/LOD/" + pureName + "_LOD" + to_string(j) + targetSuffix + ".ply";
            TriangleMesh* lodMesh = new TriangleMesh();
            if(reader.readMesh(lodFilename, *lodMesh)) {
                lodMesh->sendToOpenGL();
                mapModels[i].push_back(lodMesh);
            } else {
                delete lodMesh;
            }
        }
    }

    // Resetting time-critical rendering heuristics and hysteresis locks
    for(auto inst : objects) {
        if (inst->modelIndex != -1) {
            inst->setLODs(mapModels[inst->modelIndex]);
        }
        inst->resetFramesSinceLastChange();
        int maxLOD = inst->getLODCount() - 1;
        inst->setCurrentLOD(maxLOD);
    }
}
```
