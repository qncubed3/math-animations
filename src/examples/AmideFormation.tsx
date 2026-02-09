import type { MoleculeAnnotation, MoleculeReactionData, ReactionBondLink } from "../components/MoleculeReaction";
import MoleculeReaction from "../components/MoleculeReaction";
import type { AtomNode } from "../utils/pubchem/client";

const initialNodes: AtomNode[] = [
    // Ethanoic acid
    { id: "C1", element: 6 },
    { id: "O1", element: 8 },
    { id: "O2", element: 8 },
    { id: "H1", element: 1 },

    // Ammonia
    { id: "N1", element: 7 },
    { id: "H2", element: 1 },
    { id: "H3", element: 1 },
    { id: "H4", element: 1 },

    // Extra hydrogen for water
    { id: "H5", element: 1 },
];

const reactingNodeIds: [string, string] = ["N1", "C1"];

const allLinks: ReactionBondLink[] = [
    // Shared bonds
    { source: "C1", target: "O1", order: 2, phase: "shared" },

    { source: "N1", target: "H2", order: 1, phase: "shared" },
    { source: "N1", target: "H3", order: 1, phase: "shared" },

    // Reactant-only
    { source: "C1", target: "O2", order: 1, phase: "reactant" },
    { source: "O2", target: "H1", order: 1, phase: "shared" },
    { source: "N1", target: "H4", order: 1, phase: "reactant" },

    // Product-only
    { source: "C1", target: "N1", order: 1, phase: "product" },
    { source: "O2", target: "H4", order: 1, phase: "product" },
];

const ethanoicAcid: MoleculeAnnotation = {
    name: "Ethanoic Acid",
    atomIds: ["C1", "O1", "O2", "H1"],
    color: [234, 179, 8],
    phase: "reactant",
};

const ammonia: MoleculeAnnotation = {
    name: "Ammonia",
    atomIds: ["N1", "H2", "H3", "H4"],
    color: [34, 197, 94],
    phase: "reactant",
};

const water: MoleculeAnnotation = {
    name: "Water",
    atomIds: ["O2", "H1", "H4"],
    color: [56, 189, 248],
    phase: "toproduct",
};

const ethanamide: MoleculeAnnotation = {
    name: "Ethanamide",
    atomIds: ["C1", "O1", "N1", "H2", "H3"],
    color: [167, 139, 250],
    phase: "product",
};

const moleculeAnnotations: MoleculeAnnotation[] = [
    ethanoicAcid,
    ammonia,
    water,
    ethanamide,
];

const reactionData: MoleculeReactionData = {
    name: "Amide Formation (Condensation)",
    description: "Drag the nitrogen atom onto the carbonyl carbon to form an amide.",
    atoms: initialNodes,
    bonds: allLinks,
    reactingNodeIds,
    moleculeAnnotations,
};

const AmideFormation = () => MoleculeReaction(reactionData);
export default AmideFormation;
