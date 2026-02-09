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

    // Ammonia
    { id: "N1", element: 7 },
    { id: "H6", element: 1 },
    { id: "H7", element: 1 },
    { id: "H8", element: 1 },

    // Extra hydrogen for HCl product
    { id: "H9", element: 1 },
];

const reactingNodeIds: [string, string] = ["N1", "C2"];

const allLinks: ReactionBondLink[] = [
    // Shared bonds
    { source: "C1", target: "C2", order: 1, phase: "shared" },

    { source: "C1", target: "H1", order: 1, phase: "shared" },
    { source: "C1", target: "H2", order: 1, phase: "shared" },
    { source: "C1", target: "H3", order: 1, phase: "shared" },

    { source: "C2", target: "H4", order: 1, phase: "shared" },
    { source: "C2", target: "H5", order: 1, phase: "shared" },

    { source: "N1", target: "H6", order: 1, phase: "shared" },
    { source: "N1", target: "H7", order: 1, phase: "shared" },
    { source: "N1", target: "H8", order: 1, phase: "shared" },

    // Reactant-only
    { source: "C2", target: "Cl1", order: 1, phase: "reactant" },

    // Product-only
    { source: "C2", target: "N1", order: 1, phase: "product" },
    { source: "Cl1", target: "H9", order: 1, phase: "product" },
];

const chloroethane: MoleculeAnnotation = {
    name: "Chloroethane",
    atomIds: ["C1", "C2", "Cl1", "H1", "H2", "H3", "H4", "H5"],
    color: [251, 146, 60],
    phase: "reactant",
};

const ammonia: MoleculeAnnotation = {
    name: "Ammonia",
    atomIds: ["N1", "H6", "H7", "H8"],
    color: [34, 197, 94],
    phase: "reactant",
};

const ethylamine: MoleculeAnnotation = {
    name: "Ethylamine",
    atomIds: ["C1", "C2", "N1", "H1", "H2", "H3", "H4", "H5", "H6", "H7", "H8"],
    color: [167, 139, 250],
    phase: "product",
};

const hydrogenChloride: MoleculeAnnotation = {
    name: "Hydrogen Chloride",
    atomIds: ["H9", "Cl1"],
    color: [239, 68, 68],
    phase: "toproduct",
};

const moleculeAnnotations: MoleculeAnnotation[] = [
    chloroethane,
    ammonia,
    ethylamine,
    hydrogenChloride,
];

const reactionData: MoleculeReactionData = {
    name: "Haloalkane + Ammonia (Substitution)",
    description: "Drag the nitrogen atom onto the carbon bonded to chlorine to form an amine.",
    atoms: initialNodes,
    bonds: allLinks,
    reactingNodeIds,
    moleculeAnnotations,
};

const HaloalkaneAmmonia = () => MoleculeReaction(reactionData);
export default HaloalkaneAmmonia;
