import type { MoleculeAnnotation, MoleculeReactionData, ReactionBondLink } from "../components/MoleculeReaction";
import MoleculeReaction from "../components/MoleculeReaction";
import type { AtomNode } from "../utils/pubchem/client";

const initialNodes: AtomNode[] = [
    // Ethanol
    { id: "C1", element: 6 },
    { id: "C2", element: 6 },
    { id: "O1", element: 8 },
    { id: "H1", element: 1 },
    { id: "H2", element: 1 },
    { id: "H3", element: 1 },
    { id: "H4", element: 1 },
    { id: "H5", element: 1 },
    { id: "H6", element: 1 },

    // Propanoic acid
    { id: "C3", element: 6 },
    { id: "C4", element: 6 },
    { id: "C5", element: 6 },
    { id: "O2", element: 8 },
    { id: "O3", element: 8 },
    { id: "H7", element: 1 },
    { id: "H8", element: 1 },
    { id: "H9", element: 1 },
    { id: "H10", element: 1 },
    { id: "H11", element: 1 },
    { id: "H12", element: 1 },

    // Sulfuric acid
    { id: "S1", element: 16 },
    { id: "O4", element: 8 },
    { id: "O5", element: 8 },
    { id: "O6", element: 8 },
    { id: "O7", element: 8 },
    { id: "H13", element: 1 },
    { id: "H14", element: 1 },
];

const reactingNodeIds: [string, string] = ["O1", "C5"];


const allLinks: ReactionBondLink[] = [
    // Shared bonds
    { source: "C1", target: "H1", order: 1, phase: 'shared' },
    { source: "C1", target: "H2", order: 1, phase: 'shared' },
    { source: "C1", target: "H3", order: 1, phase: 'shared' },
    { source: "C1", target: "C2", order: 1, phase: 'shared' },
    { source: "C2", target: "H4", order: 1, phase: 'shared' },
    { source: "C2", target: "H5", order: 1, phase: 'shared' },
    { source: "C2", target: "O1", order: 1, phase: 'shared' },
    { source: "C3", target: "H7", order: 1, phase: 'shared' },
    { source: "C3", target: "H8", order: 1, phase: 'shared' },
    { source: "C3", target: "H9", order: 1, phase: 'shared' },
    { source: "C3", target: "C4", order: 1, phase: 'shared' },
    { source: "C4", target: "H10", order: 1, phase: 'shared' },
    { source: "C4", target: "H11", order: 1, phase: 'shared' },
    { source: "C4", target: "C5", order: 1, phase: 'shared' },
    { source: "C5", target: "O2", order: 2, phase: 'shared' },
    { source: "O3", target: "H12", order: 1, phase: 'shared' },

    { source: "S1", target: "O4", order: 1, phase: "shared"},
    { source: "S1", target: "O5", order: 1, phase: "shared" },
    { source: "S1", target: "O6", order: 2, phase: "shared" },
    { source: "S1", target: "O7", order: 2, phase: "shared" },
    { source: "O4", target: "H13", order: 1, phase: "shared" },
    { source: "O5", target: "H14", order: 1, phase: "shared" },

    // Reactant-only bonds (broken during reaction)
    { source: "O1", target: "H6", order: 1, phase: 'reactant' },
    { source: "C5", target: "O3", order: 1, phase: 'reactant' },

    // Product-only bonds (formed during reaction)
    { source: "O1", target: "C5", order: 1, phase: 'product' },
    { source: "O3", target: "H6", order: 1, phase: 'product' },
];


const ethanol: MoleculeAnnotation = {
    name: "Ethanol",
    atomIds: ["C1", "C2", "O1", "H1", "H2", "H3", "H4", "H5", "H6"],
    color: [236, 72, 153],
    phase: "reactant"
};

const propanoicAcid: MoleculeAnnotation = {
    name: 'Propanoic Acid',
    atomIds: ["C3", "C4", "C5", "O2", "O3", "H7", "H8", "H9", "H10", "H11", "H12"],
    color: [234, 179, 8],
    phase: "reactant"
};

const water: MoleculeAnnotation = {
    name: "Water",
    atomIds: ["O3", "H6", "H12"],
    color: [56, 189, 248],
    phase: "toproduct"
};

const ethylPropanoate: MoleculeAnnotation = {
    name: "Ethyl Propanoate",
    atomIds: ["C1", "C2", "O1", "C3", "C4", "C5", "O2", "H1", "H2", "H3", "H4", "H5", "H7", "H8", "H9", "H10", "H11"],
    color: [167, 139, 250],
    phase: "product"
};

const sulfuricAcid: MoleculeAnnotation = {
    name: "Sulfuric Acid",
    atomIds: ["S1", "O4", "O5", "O6", "O7", "H13", "H14"],
    color: [204, 255, 0],
    phase: "none"
};

const moleculeAnnotations: MoleculeAnnotation[] = [ethanol, propanoicAcid, water, ethylPropanoate, sulfuricAcid];

const esterificationReactionData: MoleculeReactionData = {
    name: "Esterification",
    description: "Click and drag to pan, scroll to zoom. Drag atom O1 onto atom C5 to complete reaction. To turn this into a lesson, provide some compounds, students to identify reactive atoms for a given reaction.",
    atoms: initialNodes,
    bonds: allLinks,
    reactingNodeIds: reactingNodeIds,
    moleculeAnnotations: moleculeAnnotations,
}

const Esterification = () => MoleculeReaction(esterificationReactionData)
export default Esterification
