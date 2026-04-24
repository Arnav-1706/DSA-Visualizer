# DSA Web Visualizer - Project Specification

## Project Overview
* **What the project is:** A purely web-based application designed to visualize how fundamental data structures and algorithms execute step-by-step.
* **Its main purpose:** To intuitively demonstrate algorithmic execution (like sorting and searching) through dynamic, color-coded visual animations.
* **Target users:** Computer science students, coding beginners, educators, and developers looking for a visual aid to understand algorithmic logic.

## Core Features
* **Sorting Visualizations:** Watch arrays get sorted in real-time. Supports Quick Sort and Bubble Sort.
* **Searching Visualizations:** Watch an algorithm find a target number. Supports Linear Search and Binary Search (which auto-sorts the array before searching).
* **Step-by-Step Animation:** Algorithms do not execute instantly. They are broken down into logical steps (e.g., comparing two items, swapping, marking as sorted) which are animated sequentially.
* **Playback Controls:** Users can 'Play', 'Pause', and 'Reset' the animation at any time.
* **Speed Control:** A 'Wait Time' slider allowing users to speed up or slow down the step-by-step execution.
* **Array Generation:** A 'Generate New Array' button continuously produces a new, randomized data set of varying heights.

## Technical Architecture
* **Tech stack:** 100% Client-Side. Developed using HTML5, Vanilla CSS3, and Vanilla JavaScript (ES6+). It has absolutely no external dependencies, libraries, frameworks, or backend requirements.
* **High-level system design:** The project utilizes a strict separation of concerns between algorithmic logic and rendering. Algorithms are executed purely in memory to generate an array of "instructions" (steps). The renderer then independently consumes this array of instructions sequentially, painting the UI frame-by-frame.
* **Folder structure:** 
  * `/web/index.html` - The single-page entry point containing the UI layout, header, interactive controls, and the empty container for the visualizer.
  * `/web/style.css` - Contains the styling for the page, utilizing CSS Flexbox for responsive layouts and specific classes (`.bar.compare`, `.bar.swap`, etc.) to handle color state transitions.
  * `/web/script.js` - Contains the entire logic payload, bridging the UI interactions, algorithmic step generation, and sequential DOM manipulation.

## Key Components / Modules
* **`generate[Algorithm]Steps(arr)` Functions:** Pure functions executing a specific algorithm on a cloned array. As they execute, they record their actions into a `localSteps` array (e.g., `{ type: 'compare', indices: [0, 1] }`) and return it.
* **`setupAlgorithm()`:** Initialization function triggered whenever an algorithm is selected or reset. It prepares `currentArray`, zeroes out `states`, dynamically spawns the required `steps` array based on the selected algorithm, and triggers a fresh base render.
* **`renderBars()`:** Clears the DOM container and dynamically rebuilds `div` elements representing the array. It calculates heights cleanly and assigns the proper CSS classes based on the `states` array.
* **`handleStep(step)`:** A pure state-mutation function that consumes a single step object, updates the temporary/permanent indices in the `states` array, optionally mutates `currentArray` (if swapping/overwriting), and triggers `renderBars()`.
* **`playSteps()`:** An asynchronous recursive loop that iterates through the global `steps` array. It respects `isPaused` and `isPlaying` flags, utilizing `await sleep(delay)` to create the visual time gaps.

## Algorithms & Logic
* **Quick Sort:** Uses a recursive divide-and-conquer approach. Steps include `pivot` (purple highlight), `compare`, `swap`, and finally `mark_sorted` for correctly placed elements.
* **Bubble Sort:** Uses nested iterative loops to push the highest unsorted value to the extreme right sequentially. Utilizes `compare`, `swap`, and `mark_sorted`.
* **Linear Search:** Scans index by index from left to right. Utilizes `compare` on every element until the target is hit, generating a final `found` step.
* **Binary Search:** Slices a sorted array strictly down the middle, narrowing bounds based on high/low comparisons. Fast operation utilizing `compare` and ending gracefully on `found`.

## Data Flow
* **State Management:** 
  * `originalArray`: Holds the pure generated data source to allow reliable resets.
  * `currentArray`: The working array visually modified on screen.
  * `states`: An array identical in length to `currentArray`, tracking the string status of every index (e.g., `default`, `mark_sorted`, `found`).
  * `steps`: The total instruction queue generated before the animation starts.
* **Flow:** Array is generated $\rightarrow$ User selects algorithm $\rightarrow$ Algorithm runs internally and generates `steps` $\rightarrow$ User clicks Play $\rightarrow$ Async loop consumes `steps[i]` $\rightarrow$ `states` modifies $\rightarrow$ DOM re-renders.

## UI/UX Behavior
* **Responsiveness:** Visualizer bars use `flex: 1` with a `max-width: 40px`, smoothly scaling down dynamically to fit smaller windows.
* **Searching Targets:** If a searching algorithm is selected, a new UI element seamlessly appears natively specifying "Searching for Target: X".
* **Persistent States:** When an element is fully solved (e.g., in correct sort order, or it's the found target), it smoothly transitions its background color persistently (Blue indefinitely for sorted, Bright glowing green indicating success for a search).

## Configuration & Setup
* **How to run:** Open `web/index.html` natively in any modern web browser. No build step, node package, or server is required.

## Limitations / Known Issues
* Fixed array size: The script currently restricts arrays to exactly 20 elements during the randomized generation loop.
* Synchronous step generation: Extremely large scales (e.g., 100,000+ elements) would briefly lock the main thread while the step generator processes before playback can begin.

## Future Improvements
* Add dynamic User Inputs to manually define the array size.
* Support custom user data sets (e.g., typing `10, 5, 20, 8` into an input).
* Modularize `script.js` into ES6 Modules separated by algorithm assuming a web server setup.
* Introduce Graph algorithms like Dijkstra's or Pathfinding representations.
