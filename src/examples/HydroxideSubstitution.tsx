import type { MoleculeAnnotation, MoleculeReactionData, ReactionBondLink } from "../components/MoleculeReaction";
import MoleculeReaction from "../components/MoleculeReaction";
import type { AtomNode } from "../utils/pubchem/client";

const initialNodes: AtomNode[] = [
    // Chloroethane
    { id: "C1", element: 6 },
    { id: "C2", element: 6 },
    { id: "Cl1", element: 17 },
    { id: "H1", element: 1 },
    { id: "H2", element: 1 },
    { id: "H3", element: 1 },
    { id: "H4", element: 1 },
    { id: "H5", element: 1 },

    // Hydroxide
    { id: "O1", element: 8 },
    { id: "H6", element: 1 },
];

const reactingNodeIds: [string, string] = ["C2", "O1"];

const allLinks: ReactionBondLink[] = [
    // Shared bonds
    { source: "C1", target: "H1", order: 1, phase: "shared" },
    { source: "C1", target: "H2", order: 1, phase: "shared" },
    { source: "C1", target: "H3", order: 1, phase: "shared" },
    { source: "C1", target: "C2", order: 1, phase: "shared" },
    { source: "C2", target: "H4", order: 1, phase: "shared" },
    { source: "C2", target: "H5", order: 1, phase: "shared" },
    { source: "O1", target: "H6", order: 1, phase: "shared" },

    // Reactant-only
    { source: "C2", target: "Cl1", order: 1, phase: "reactant" },

    // Product-only
    { source: "C2", target: "O1", order: 1, phase: "product" },
];

const chloroethane: MoleculeAnnotation = {
    name: "Chloroethane",
    atomIds: ["C1", "C2", "Cl1", "H1", "H2", "H3", "H4", "H5"],
    color: [251, 146, 60],
    phase: "reactant"
};

const hydroxide: MoleculeAnnotation = {
    name: "Hydroxide",
    atomIds: ["O1", "H6"],
    color: [34, 197, 94],
    phase: "reactant"
};

const ethanol: MoleculeAnnotation = {
    name: "Ethanol",
    atomIds: ["C1", "C2", "O1", "H1", "H2", "H3", "H4", "H5", "H6"],
    color: [236, 72, 153],
    phase: "product"
};

const chloride: MoleculeAnnotation = {
    name: "Chloride Ion",
    atomIds: ["Cl1"],
    color: [148, 163, 184],
    phase: "toproduct"
};

const moleculeAnnotations: MoleculeAnnotation[] = [chloroethane, hydroxide, ethanol, chloride];

const substitutionReactionData: MoleculeReactionData = {
    name: "Substitution Reaction (Hydroxide)",
    description: "Drag the hydroxide oxygen onto the carbon bonded to chlorine.",
    atoms: initialNodes,
    bonds: allLinks,
    reactingNodeIds,
    moleculeAnnotations,
};

const HydroxideSubstitution = () => MoleculeReaction(substitutionReactionData);
export default HydroxideSubstitution;
