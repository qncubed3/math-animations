// PubChem API data structure types

interface Atoms {
    aid: number[];
    element: number[];
}

interface Bonds {
    aid1: number[];
    aid2: number[];
    order: number[];
}

// URN (Uniform Resource Name) for property metadata
interface PropertyURN {
    label: string;
    name?: string;
    datatype: number;
    parameters?: string;
    version?: string;
    software?: string;
    source?: string;
    release?: string;
    implementation?: string;
}

// Property value types
interface PropertyValue {
    ival?: number;
    fval?: number;
    sval?: string;
    binary?: string;
    ivec?: number[];
    fvec?: number[];
    slist?: string[];
}

// Property data structure
interface Property {
    urn: PropertyURN;
    value: PropertyValue;
}

interface Conformer {
    x: number[];
    y: number[];
    z?: number[];
    data?: Property[];
}

interface Coords {
    type?: number[];
    aid?: number[];
    conformers: Conformer[];
    data?: Property[];
}

interface TetrahedralStereo {
    center: number;
    above: number;
    top: number;
    bottom: number;
    below: number;
    parity: number;
    type: number;
}

interface Stereo {
    tetrahedral?: TetrahedralStereo;
}

interface Count {
    heavy_atom?: number;
    atom_chiral?: number;
    atom_chiral_def?: number;
    atom_chiral_undef?: number;
    bond_chiral?: number;
    bond_chiral_def?: number;
    bond_chiral_undef?: number;
    isotope_atom?: number;
    covalent_unit?: number;
    tautomers?: number;
}

export interface Compound {
    id?: {
        id: {
            cid: number;
        };
    };
    atoms: Atoms;
    bonds: Bonds;
    coords: Coords[];
    stereo?: Stereo[];
    props?: Property[];
    count?: Count;
}

export interface PubChemResponse {
    PC_Compounds: Compound[];
}

// Viewer-specific types
export interface AtomUserData {
    atomId: number;
    element: number;
    elementName: string;
    position: { x: number; y: number; z: number };
    originalPosition: { x: number; y: number; z: number };
}

export interface ConnectedAtom {
    id: number;
    element: string;
    bondOrder: number;
}

export interface SelectedAtomInfo extends AtomUserData {
    connectedAtoms: ConnectedAtom[];
}

export interface CompoundData {
    cid: number;
    name: string;
    recordData: PubChemResponse;
}
