import type { CompoundData, PubChemResponse } from "./types";

export interface AtomNode {
    id: string;
    element: number;
    x?: number;
    y?: number;
}

export interface BondLink {
    source: string;
    target: string;
    order: number;
}

export interface MoleculeGraph {
    atoms: AtomNode[];
    bonds: BondLink[];
}

const PUBCHEM_BASE = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug';

async function fetchJSON<T = unknown>(url: string): Promise<T> {
    console.log(url);
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Failed to fetch ${url}`);
    }
    return res.json() as Promise<T>;
}

async function lookupCIDByName(name: string): Promise<number | null> {
    try {
        const url = `${PUBCHEM_BASE}/compound/name/${encodeURIComponent(name)}/cids/JSON`;
        const data = await fetchJSON<{ IdentifierList?: { CID?: number[] } }>(url);
        const cid = data?.IdentifierList?.CID?.[0];
        return cid || null;
    } catch {
        return null;
    }
}

async function getRecordByCID(cid: number): Promise<PubChemResponse> {
    const url = `${PUBCHEM_BASE}/compound/cid/${cid}/record/JSON?record_type=3d`;
    return await fetchJSON<PubChemResponse>(url);
}

async function getCompoundNameFromCID(cid: number): Promise<string> {
    const url = `${PUBCHEM_BASE}/compound/cid/${cid}/property/IUPACName/JSON`;
    const data = await fetchJSON<{ PropertyTable?: { Properties?: Array<{ IUPACName?: string }> } }>(url);
    return data?.PropertyTable?.Properties?.[0]?.IUPACName || '';
}

export async function fetchCompound(name: string): Promise<CompoundData | null> {
    const cid = await lookupCIDByName(name.toLowerCase());
    if (!cid) {
        console.warn(`Compound not found: ${name}`);
        return null;
    }
    const recordData = await getRecordByCID(cid);
    const compoundName = await getCompoundNameFromCID(cid);

    return {
        cid,
        name: compoundName || name,
        recordData: recordData
    };
}

export async function extractCompoundStucture(name: string): Promise<MoleculeGraph | null> {
    const compound = await fetchCompound(name);

    if (!compound) {
        return null;
    }

    const atomsData = compound?.recordData?.PC_Compounds?.[0]?.atoms;
    const atoms: AtomNode[] = atomsData?.aid.map((id, index) => ({
        id: String(id),
        element: atomsData.element[index]
    })) || [];

    const bondsData = compound?.recordData?.PC_Compounds?.[0]?.bonds;
    const bonds: BondLink[] = bondsData?.aid1.map((from, index) => ({
        source: String(from),
        target: String(bondsData.aid2[index]),
        order: bondsData.order[index]
    })) || [];

    return {
        atoms,
        bonds
    };
}