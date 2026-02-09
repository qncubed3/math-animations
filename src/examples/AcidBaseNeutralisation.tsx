import type { MoleculeAnnotation, MoleculeReactionData, ReactionBondLink } from "../components/MoleculeReaction";
import MoleculeReaction from "../components/MoleculeReaction";
import type { AtomNode } from "../utils/pubchem/client";

const initialNodes: AtomNode[] = [
    // Hydrochloric acid
    { id: "H1", element: 1 },
    { id: "Cl1", element: 17 },

    // Sodium hydroxide
    { id: "Na1", element: 11 },
    { id: "O1", element: 8 },
    { id: "H2", element: 1 },
];

const reactingNodeIds: [string, string] = ["Na1", "Cl1"];

const allLinks: ReactionBondLink[] = [
    // Shared bonds
    { source: "Na1", target: "O1", order: 1, phase: "reactant" },
    { source: "O1", target: "H2", order: 1, phase: "shared" },

    // Reactant-only
    { source: "H1", target: "Cl1", order: 1, phase: "reactant" },

    // Product-only
    { source: "O1", target: "H1", order: 1, phase: "product" },
    { source: "Na1", target: "Cl1", order: 1, phase: "product" },
];

const hcl: MoleculeAnnotation = {
    name: "Hydrochloric Acid",
    atomIds: ["H1", "Cl1"],
    color: [239, 68, 68],
    phase: "reactant"
};

const naoh: MoleculeAnnotation = {
    name: "Sodium Hydroxide",
    atomIds: ["Na1", "O1", "H2"],
    color: [34, 197, 94],
    phase: "reactant"
};

const water: MoleculeAnnotation = {
    name: "Water",
    atomIds: ["O1", "H1", "H2"],
    color: [56, 189, 248],
    phase: "toproduct"
};

const nacl: MoleculeAnnotation = {
    name: "Sodium Chloride",
    atomIds: ["Na1", "Cl1"],
    color: [148, 163, 184],
    phase: "product"
};

const moleculeAnnotations: MoleculeAnnotation[] = [hcl, naoh, water, nacl];

const neutralisationReactionData: MoleculeReactionData = {
    name: "Acid-Base Neutralisation",
    description: "Drag the acidic hydrogen onto the hydroxide oxygen to form water.",
    atoms: initialNodes,
    bonds: allLinks,
    reactingNodeIds,
    moleculeAnnotations,
};

const Neutralisation = () => MoleculeReaction(neutralisationReactionData);
export default Neutralisation;
