import type { CompoundData, PubChemResponse } from "./types";

interface AtomData {
    id: number;
    element: number;
}

interface BondData {
    source: number;
    target: number;
    order: number;
}

interface MoleculeStructure {
    atoms: AtomData[];
    bonds: BondData[];
}

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

export async function extractCompoundStucture(name: string): Promise<MoleculeStructure | null> {
    const compound = await fetchCompound(name);

    if (!compound) {
        return null
    }
    
    const atomsData = compound?.recordData?.PC_Compounds?.[0]?.atoms
    const atoms: AtomData[] = atomsData?.aid.map((id, index) => ({
        id,
        element: atomsData.element[index]
    }))

    const bondsData = compound?.recordData?.PC_Compounds?.[0]?.bonds
    const bonds: BondData[] = bondsData?.aid1.map((from, index) => ({
        source: from,
        target: bondsData.aid2[index],
        order: bondsData.order[index]
    }));

    return {
        atoms,
        bonds
    }
    

}

async function main() {
    const name = process.argv.slice(2).join(" ");
    if (!name) {
        console.error("Usage: ts-node fetchCompound.ts <compound-name>");
        process.exit(1);
    }

    const result = await extractCompoundStucture(name);
    console.log(JSON.stringify(result, null, 4));
}


main().catch(err => {
    console.error(err);
    process.exit(1);
});
