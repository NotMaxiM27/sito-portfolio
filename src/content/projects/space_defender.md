---
id: 3
title: "Space Defender"
tags: ["OpenGL", "C++", "University"]
year: 2023
image: "/images/space_defender.png"
video: "/videos/Spacedefendershowcase.mp4"
miro: "https://miro.com/app/live-embed/uXjVLDJhuhE=/?embedMode=view_only_without_ui&moveToViewport=-5785,-2310,5534,2633&embedId=762597637353"
downloadUrl: "https://drive.google.com/file/d/1ITTUxiLh0_zJMyDunKlK7SYgHwB6w1VJ/view?usp=sharing"
order: 3
---

## Description
> A university OpenGL project made completely from scratch using C++. It's a 2D shooter game set in space in which the player has to defend the Earth from enemy ships. It's a roguelike game with an upgrade system, incremental difficulty enemies, power-ups and leaderboards.

## Tech Specs
- Language: **C++**
- Rendering: **OpenGL**
- UI: **ImGui**
- 3D Modeling: **Blender**
- Audio: **irrKlang**
- Asset Loading: **Assimp** & **FreeType**

## Key Features & Architecture
- **Custom "MiniEngine"**: Built a lightweight object oriented engine from scratch, managing the game loop and defining components like `GameObject`, `Transform`, `Health` and `Collider` for a modular entity structure.
- **Design Patterns**: 
  - **Singleton** pattern for global access to the `Game` instance, `SoundManager`, `UpgradeManager` and `TimerManager`.
  - **Observer** pattern (`IObserver`) to handle event callbacks, heavily utilized by the custom `Timer` system to notify game entities when specific events or cooldowns occur.
- **Roguelike Progression & Shop**: Implemented an `IUpgradable` interface and an `UpgradeManager` that scales player attributes (ship health, bullet count, shooting rate, planet health, etc.). Included a shop UI built with **ImGui** offering randomically selected upgrades.
- **State Management & UI**: Handled multiple game states (`Menu`, `Play`, `Pause`, `Shop`, `GameOver`), with state transitions supported by **ImGui** menus and HUDs.
- **Data Persistence**: Developed a leaderboard system that serializes top scores and rounds to a local text file, maintaining high scores across sessions.
- **Audio & Visuals**: Integrated OpenGL shaders for 3D rendering, Assimp for loading 3D models, FreeType for text rendering and irrKlang for audio.

## What I learned or improved
- Deepened understanding of the OpenGL rendering pipeline, shaders and 3D matrix transformations (Model, View, Projection).
- Advanced C++ memory management, OOP principles and implementation of standard design patterns.
- Game development fundamentals including collision detection, delta-time management and game state loops.

## Code Snippets

### 1. Observer Pattern & Custom Timer System
To ensure a decoupled architecture, I implemented a custom Timer system based on the **Observer Pattern**. Instead of tightly coupling entities to poll for time, game objects implement the `IObserver` interface. The `TimerManager` (a Singleton) manages all active timers and calls `getNotified` on the observer when the time expires. This is heavily used for enemy shooting rates and spawn cooldowns.

```cpp
// Timer.cpp - When the time expires, the observer is notified via callback
void Timer::updateTimer(float deltaTime) {
	currentTimeAmount = currentTimeAmount - deltaTime <= 0.f ? 0.0f : currentTimeAmount - deltaTime;
	if (currentTimeAmount <= 0.f) {
		isTicking = false;
		if (shouldNotify && observer) {
			observer->getNotified(name, shouldNotify);
		}
	}
}

// Enemy.cpp - The Enemy class implements IObserver to handle its shooting cooldown
void Enemy::getNotified(std::string timerName, bool isCallbackEnabled) {
	canShoot = true; // Callback triggered by TimerManager
}
```

### 2. Procedural Enemy Spawning & Trigonometry
Enemies are spawned procedurally at random angles outside the planet's orbit. I used basic trigonometry (`atan2`, `cos`, `sin`) to calculate the exact rotation needed for the enemy's 3D model to face the center of the screen (the planet) and its starting position on the spawn radius.

```cpp
// Enemy.cpp - Calculating spawn coordinates and rotation towards the center
std::pair<float, float> coordinates = generateEnemyCoordinates(spawnRadius);
glm::vec3 objCoordinates(coordinates.first, coordinates.second, 0.0f);

// Calculate the direction vector from the enemy to the planet (0,0,0)
glm::vec3 direction = glm::normalize(planetPosition - objCoordinates);

// Calculate the rotation angle in the XY plane to make the enemy face the planet
float angle = atan2(direction.y, direction.x); 
float angleInDegrees = glm::degrees(angle);

// Apply the rotation on the Z-axis
glm::vec3 eulerAngles(0.0f, 0.0f, angleInDegrees);
Transform *newTransform = new Transform(glm::vec3(x, y, 0), eulerAngles, enemyScale);
```

### 3. ImGui Shop & Procedural Upgrades
The game features a shop where players can spend collected coins on upgrades. To make it dynamic, the shop randomly selects 3 available upgrades from the `UpgradeManager` array using the C++ `<random>` library. The UI is completely handled by **ImGui**.

```cpp
// UI.h - Example of the random upgrade selection logic in the shop UI using ImGui
static bool choiceMade = false;
static std::vector<int> randUpgIdx;

if (!choiceMade) {
    randUpgIdx = gen3Nums(); // Generates 3 unique random upgrades
    choiceMade = true;
}

// Displaying 3 random upgrades as interactive buttons
for (int i = 0; i < 3; i++) {
    UpgradeIndex upgradeIdx = static_cast<UpgradeIndex>(randUpgIdx[i]);
    const char* upgradeName = UpgradeManager::Instance().getUpgradeName(upgradeIdx);
    int upgradeCost = UpgradeManager::Instance().getUpgradeCost(upgradeIdx);

    std::string buttonText = std::string(upgradeName) + ": " + std::to_string(upgradeCost);

    if (ImGui::Button(buttonText.c_str(), upgradeButton)) {
        if (Game::Instance().player->getMoney() >= upgradeCost) {
            Game::Instance().player->addMoney(-upgradeCost);
            UpgradeManager::Instance().makeUpgrade(upgradeIdx);
            Game::Instance().upgrade(upgradeIdx); // Applies the upgrade effect globally
        }
    }
}
```
