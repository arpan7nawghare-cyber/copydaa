// Sample texts used by the "Load Sample" button on the Input step.
// Three preset pairs so a viva examiner can see three outcomes quickly.

export const SAMPLES = {
  exact: {
    label: "Exact Copy",
    original:
      "Dynamic programming is an optimization technique that breaks problems into overlapping subproblems. Each subproblem is solved once and its answer is stored in a table. This avoids redundant computation and reduces the overall time complexity.",
    suspected:
      "Dynamic programming is an optimization technique that breaks problems into overlapping subproblems. Each subproblem is solved once and its answer is stored in a table. This avoids redundant computation and reduces the overall time complexity.",
  },
  edited: {
    label: "Edited Copy",
    original:
      "A greedy algorithm builds up a solution piece by piece. It always chooses the next piece that offers the most immediate benefit. Although greedy algorithms are fast, they do not always produce the optimal solution.",
    suspected:
      "A greedy method constructs a solution step by step. It always picks the next step that gives the most immediate gain. While greedy approaches are quick, they may not yield the best overall answer.",
  },
  different: {
    label: "Different Text",
    original:
      "Dijkstra's algorithm finds the shortest path from a source node to every other node in a weighted graph. It uses a priority queue to always expand the nearest unvisited vertex.",
    suspected:
      "The quicksort algorithm partitions an array around a pivot element and recursively sorts the two halves. It has an average time complexity of n log n and is widely used in practice.",
  },
};
