import type { CompoundData, PubChemResponse } from "./types";

const PUBCHEM_BASE = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug';

async function fetchJSON(url: string) {
    console.log(url)
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`Failed to fetch ${url}`);
    }
    return res.json();
}

async function lookupCIDByName(name: string): Promise<number|null> {
    try {
        const url = `${PUBCHEM_BASE}/compound/name/${encodeURIComponent(name)}/cids/JSON`
        const data = await fetchJSON(url);
        const cid = data?.IdentifierList?.CID?.[0];
        return cid || null
    } catch {
        return null
    }
}

async function getRecordByCID(cid: number): Promise<PubChemResponse> {
    const url = `${PUBCHEM_BASE}/compound/cid/${cid}/record/JSON?record_type=3d`
    return await fetchJSON(url)
}

async function getCompoundNameFromCID(cid: number): Promise<string> {
    const url = `${PUBCHEM_BASE}/compound/cid/${cid}/property/IUPACName/JSON`;
    const data = await fetchJSON(url);
    return data?.PropertyTable?.Properties?.[0]?.IUPACName || '';
}

export async function fetchCompound(name: string): Promise<CompoundData | null> {
    const cid = await lookupCIDByName(name.toLowerCase());
    if (!cid) {
        console.warn(`Compound not found: ${name}`)
        return null;
    }
    const recordData = await getRecordByCID(cid)
    const compoundName = await getCompoundNameFromCID(cid)

    return {
        cid,
        name: compoundName || name,
        recordData: recordData
    }
}