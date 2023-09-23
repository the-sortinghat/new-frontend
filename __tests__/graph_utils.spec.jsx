import { calculateNeighborsByDepth } from "../services/graph_utils";


test('Test calculate neighbors by depth', () => {
    var result = 0;
    console.log(result);
    // // Random tree
    const N = 5;
    const gData = {
        nodes: [...Array(N).keys()].map(i => ({ id: i, neighbors: [{id: i+1}] })),
        links: [...Array(N).keys()]
            .filter(id => id)
            .map(id => ({
            source: id,
            target: (id + 1) % N
        }))
    };

    const result2 = calculateNeighborsByDepth(gData.nodes[0], 5);
    console.log(result2);

    expect(result).toEqual(0);
});