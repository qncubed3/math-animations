export type AtomData = {
    id: number;
    name: string;
    symbol: string;
    color: string;
    radius: number;
};

// All 118 elements with CPK/Jmol colors
const ATOM_DATA: ReadonlyArray<AtomData> = [
    { id: 1, name: "Hydrogen", symbol: "H", color: "#FFFFFF", radius: 10 },
    { id: 2, name: "Helium", symbol: "He", color: "#D9FFFF", radius: 14 },
    { id: 3, name: "Lithium", symbol: "Li", color: "#CC80FF", radius: 28 },
    { id: 4, name: "Beryllium", symbol: "Be", color: "#C2FF00", radius: 22 },
    { id: 5, name: "Boron", symbol: "B", color: "#FFB5B5", radius: 17 },
    { id: 6, name: "Carbon", symbol: "C", color: "#909090", radius: 17 },
    { id: 7, name: "Nitrogen", symbol: "N", color: "#3050F8", radius: 16 },
    { id: 8, name: "Oxygen", symbol: "O", color: "#FF0D0D", radius: 15 },
    { id: 9, name: "Fluorine", symbol: "F", color: "#90E050", radius: 14 },
    { id: 10, name: "Neon", symbol: "Ne", color: "#B3E3F5", radius: 15 },
    { id: 11, name: "Sodium", symbol: "Na", color: "#AB5CF2", radius: 32 },
    { id: 12, name: "Magnesium", symbol: "Mg", color: "#8AFF00", radius: 27 },
    { id: 13, name: "Aluminum", symbol: "Al", color: "#BFA6A6", radius: 24 },
    { id: 14, name: "Silicon", symbol: "Si", color: "#F0C8A0", radius: 21 },
    { id: 15, name: "Phosphorus", symbol: "P", color: "#FF8000", radius: 19 },
    { id: 16, name: "Sulfur", symbol: "S", color: "#FFFF30", radius: 18 },
    { id: 17, name: "Chlorine", symbol: "Cl", color: "#1FF01F", radius: 18 },
    { id: 18, name: "Argon", symbol: "Ar", color: "#80D1E3", radius: 17 },
    { id: 19, name: "Potassium", symbol: "K", color: "#8F40D4", radius: 38 },
    { id: 20, name: "Calcium", symbol: "Ca", color: "#3DFF00", radius: 34 },
    { id: 21, name: "Scandium", symbol: "Sc", color: "#E6E6E6", radius: 30 },
    { id: 22, name: "Titanium", symbol: "Ti", color: "#BFC2C7", radius: 28 },
    { id: 23, name: "Vanadium", symbol: "V", color: "#A6A6AB", radius: 26 },
    { id: 24, name: "Chromium", symbol: "Cr", color: "#8A99C7", radius: 25 },
    { id: 25, name: "Manganese", symbol: "Mn", color: "#9C7AC7", radius: 25 },
    { id: 26, name: "Iron", symbol: "Fe", color: "#E06633", radius: 24 },
    { id: 27, name: "Cobalt", symbol: "Co", color: "#F090A0", radius: 23 },
    { id: 28, name: "Nickel", symbol: "Ni", color: "#50D050", radius: 22 },
    { id: 29, name: "Copper", symbol: "Cu", color: "#C88033", radius: 23 },
    { id: 30, name: "Zinc", symbol: "Zn", color: "#7D80B0", radius: 25 },
    { id: 31, name: "Gallium", symbol: "Ga", color: "#C28F8F", radius: 26 },
    { id: 32, name: "Germanium", symbol: "Ge", color: "#668F8F", radius: 23 },
    { id: 33, name: "Arsenic", symbol: "As", color: "#BD80E3", radius: 21 },
    { id: 34, name: "Selenium", symbol: "Se", color: "#FFA100", radius: 20 },
    { id: 35, name: "Bromine", symbol: "Br", color: "#A62929", radius: 20 },
    { id: 36, name: "Krypton", symbol: "Kr", color: "#5CB8D1", radius: 19 },
    { id: 37, name: "Rubidium", symbol: "Rb", color: "#702EB0", radius: 42 },
    { id: 38, name: "Strontium", symbol: "Sr", color: "#00FF00", radius: 38 },
    { id: 39, name: "Yttrium", symbol: "Y", color: "#94FFFF", radius: 32 },
    { id: 40, name: "Zirconium", symbol: "Zr", color: "#94E0E0", radius: 30 },
    { id: 41, name: "Niobium", symbol: "Nb", color: "#73C2C9", radius: 29 },
    { id: 42, name: "Molybdenum", symbol: "Mo", color: "#54B5B5", radius: 28 },
    { id: 43, name: "Technetium", symbol: "Tc", color: "#3B9E9E", radius: 27 },
    { id: 44, name: "Ruthenium", symbol: "Ru", color: "#248F8F", radius: 26 },
    { id: 45, name: "Rhodium", symbol: "Rh", color: "#0A7D8C", radius: 26 },
    { id: 46, name: "Palladium", symbol: "Pd", color: "#006985", radius: 26 },
    { id: 47, name: "Silver", symbol: "Ag", color: "#C0C0C0", radius: 29 },
    { id: 48, name: "Cadmium", symbol: "Cd", color: "#FFD98F", radius: 30 },
    { id: 49, name: "Indium", symbol: "In", color: "#A67573", radius: 31 },
    { id: 50, name: "Tin", symbol: "Sn", color: "#668080", radius: 30 },
    { id: 51, name: "Antimony", symbol: "Sb", color: "#9E63B5", radius: 29 },
    { id: 52, name: "Tellurium", symbol: "Te", color: "#D47A00", radius: 28 },
    { id: 53, name: "Iodine", symbol: "I", color: "#940094", radius: 27 },
    { id: 54, name: "Xenon", symbol: "Xe", color: "#429EB0", radius: 26 },
    { id: 55, name: "Cesium", symbol: "Cs", color: "#57178F", radius: 48 },
    { id: 56, name: "Barium", symbol: "Ba", color: "#00C900", radius: 42 },
    { id: 57, name: "Lanthanum", symbol: "La", color: "#70D4FF", radius: 39 },
    { id: 58, name: "Cerium", symbol: "Ce", color: "#FFFFC7", radius: 37 },
    { id: 59, name: "Praseodymium", symbol: "Pr", color: "#D9FFC7", radius: 36 },
    { id: 60, name: "Neodymium", symbol: "Nd", color: "#C7FFC7", radius: 35 },
    { id: 61, name: "Promethium", symbol: "Pm", color: "#A3FFC7", radius: 35 },
    { id: 62, name: "Samarium", symbol: "Sm", color: "#8FFFC7", radius: 34 },
    { id: 63, name: "Europium", symbol: "Eu", color: "#61FFC7", radius: 34 },
    { id: 64, name: "Gadolinium", symbol: "Gd", color: "#45FFC7", radius: 33 },
    { id: 65, name: "Terbium", symbol: "Tb", color: "#30FFC7", radius: 33 },
    { id: 66, name: "Dysprosium", symbol: "Dy", color: "#1FFFC7", radius: 32 },
    { id: 67, name: "Holmium", symbol: "Ho", color: "#00FF9C", radius: 32 },
    { id: 68, name: "Erbium", symbol: "Er", color: "#00E675", radius: 32 },
    { id: 69, name: "Thulium", symbol: "Tm", color: "#00D452", radius: 31 },
    { id: 70, name: "Ytterbium", symbol: "Yb", color: "#00BF38", radius: 31 },
    { id: 71, name: "Lutetium", symbol: "Lu", color: "#00AB24", radius: 31 },
    { id: 72, name: "Hafnium", symbol: "Hf", color: "#4DC2FF", radius: 30 },
    { id: 73, name: "Tantalum", symbol: "Ta", color: "#4DA6FF", radius: 29 },
    { id: 74, name: "Tungsten", symbol: "W", color: "#2194D6", radius: 28 },
    { id: 75, name: "Rhenium", symbol: "Re", color: "#267DAB", radius: 28 },
    { id: 76, name: "Osmium", symbol: "Os", color: "#266696", radius: 27 },
    { id: 77, name: "Iridium", symbol: "Ir", color: "#175487", radius: 27 },
    { id: 78, name: "Platinum", symbol: "Pt", color: "#D0D0E0", radius: 28 },
    { id: 79, name: "Gold", symbol: "Au", color: "#FFD123", radius: 29 },
    { id: 80, name: "Mercury", symbol: "Hg", color: "#B8B8D0", radius: 30 },
    { id: 81, name: "Thallium", symbol: "Tl", color: "#A6544D", radius: 32 },
    { id: 82, name: "Lead", symbol: "Pb", color: "#575961", radius: 33 },
    { id: 83, name: "Bismuth", symbol: "Bi", color: "#9E4FB5", radius: 31 },
    { id: 84, name: "Polonium", symbol: "Po", color: "#AB5C00", radius: 30 },
    { id: 85, name: "Astatine", symbol: "At", color: "#754F45", radius: 29 },
    { id: 86, name: "Radon", symbol: "Rn", color: "#428296", radius: 28 },
    { id: 87, name: "Francium", symbol: "Fr", color: "#420066", radius: 50 },
    { id: 88, name: "Radium", symbol: "Ra", color: "#007D00", radius: 43 },
    { id: 89, name: "Actinium", symbol: "Ac", color: "#70ABFA", radius: 40 },
    { id: 90, name: "Thorium", symbol: "Th", color: "#00BAFF", radius: 38 },
    { id: 91, name: "Protactinium", symbol: "Pa", color: "#00A1FF", radius: 36 },
    { id: 92, name: "Uranium", symbol: "U", color: "#008FFF", radius: 35 },
    { id: 93, name: "Neptunium", symbol: "Np", color: "#0080FF", radius: 35 },
    { id: 94, name: "Plutonium", symbol: "Pu", color: "#006BFF", radius: 35 },
    { id: 95, name: "Americium", symbol: "Am", color: "#545CF2", radius: 35 },
    { id: 96, name: "Curium", symbol: "Cm", color: "#785CE3", radius: 35 },
    { id: 97, name: "Berkelium", symbol: "Bk", color: "#8A4FE3", radius: 35 },
    { id: 98, name: "Californium", symbol: "Cf", color: "#A136D4", radius: 35 },
    { id: 99, name: "Einsteinium", symbol: "Es", color: "#B31FD4", radius: 35 },
    { id: 100, name: "Fermium", symbol: "Fm", color: "#B31FBA", radius: 35 },
    { id: 101, name: "Mendelevium", symbol: "Md", color: "#B30DA6", radius: 35 },
    { id: 102, name: "Nobelium", symbol: "No", color: "#BD0D87", radius: 35 },
    { id: 103, name: "Lawrencium", symbol: "Lr", color: "#C70066", radius: 35 },
    { id: 104, name: "Rutherfordium", symbol: "Rf", color: "#CC0059", radius: 35 },
    { id: 105, name: "Dubnium", symbol: "Db", color: "#D1004F", radius: 35 },
    { id: 106, name: "Seaborgium", symbol: "Sg", color: "#D90045", radius: 35 },
    { id: 107, name: "Bohrium", symbol: "Bh", color: "#E00038", radius: 35 },
    { id: 108, name: "Hassium", symbol: "Hs", color: "#E6002E", radius: 35 },
    { id: 109, name: "Meitnerium", symbol: "Mt", color: "#EB0026", radius: 35 },
    { id: 110, name: "Darmstadtium", symbol: "Ds", color: "#FF1493", radius: 35 },
    { id: 111, name: "Roentgenium", symbol: "Rg", color: "#FF1493", radius: 35 },
    { id: 112, name: "Copernicium", symbol: "Cn", color: "#FF1493", radius: 35 },
    { id: 113, name: "Nihonium", symbol: "Nh", color: "#FF1493", radius: 35 },
    { id: 114, name: "Flerovium", symbol: "Fl", color: "#FF1493", radius: 35 },
    { id: 115, name: "Moscovium", symbol: "Mc", color: "#FF1493", radius: 35 },
    { id: 116, name: "Livermorium", symbol: "Lv", color: "#FF1493", radius: 35 },
    { id: 117, name: "Tennessine", symbol: "Ts", color: "#FF1493", radius: 35 },
    { id: 118, name: "Oganesson", symbol: "Og", color: "#FF1493", radius: 35 }
] as const;

// Create lookup maps from the array
export const ATOMS_BY_SYMBOL: Readonly<Record<string, AtomData>> = ATOM_DATA.reduce(
    (acc, atom) => {
        acc[atom.symbol] = atom;
        return acc;
    },
    {} as Record<string, AtomData>
);

export const ATOMS_BY_ID: Readonly<Record<number, AtomData>> = ATOM_DATA.reduce(
    (acc, atom) => {
        acc[atom.id] = atom;
        return acc;
    },
    {} as Record<number, AtomData>
);

// Individual atom exports for convenience
export const HYDROGEN = ATOMS_BY_ID[1];
export const HELIUM = ATOMS_BY_ID[2];
export const LITHIUM = ATOMS_BY_ID[3];
export const BERYLLIUM = ATOMS_BY_ID[4];
export const BORON = ATOMS_BY_ID[5];
export const CARBON = ATOMS_BY_ID[6];
export const NITROGEN = ATOMS_BY_ID[7];
export const OXYGEN = ATOMS_BY_ID[8];
export const FLUORINE = ATOMS_BY_ID[9];
export const NEON = ATOMS_BY_ID[10];
export const SODIUM = ATOMS_BY_ID[11];
export const MAGNESIUM = ATOMS_BY_ID[12];
export const ALUMINUM = ATOMS_BY_ID[13];
export const SILICON = ATOMS_BY_ID[14];
export const PHOSPHORUS = ATOMS_BY_ID[15];
export const SULFUR = ATOMS_BY_ID[16];
export const CHLORINE = ATOMS_BY_ID[17];
export const ARGON = ATOMS_BY_ID[18];
export const POTASSIUM = ATOMS_BY_ID[19];
export const CALCIUM = ATOMS_BY_ID[20];
export const SCANDIUM = ATOMS_BY_ID[21];
export const TITANIUM = ATOMS_BY_ID[22];
export const VANADIUM = ATOMS_BY_ID[23];
export const CHROMIUM = ATOMS_BY_ID[24];
export const MANGANESE = ATOMS_BY_ID[25];
export const IRON = ATOMS_BY_ID[26];
export const COBALT = ATOMS_BY_ID[27];
export const NICKEL = ATOMS_BY_ID[28];
export const COPPER = ATOMS_BY_ID[29];
export const ZINC = ATOMS_BY_ID[30];
export const GALLIUM = ATOMS_BY_ID[31];
export const GERMANIUM = ATOMS_BY_ID[32];
export const ARSENIC = ATOMS_BY_ID[33];
export const SELENIUM = ATOMS_BY_ID[34];
export const BROMINE = ATOMS_BY_ID[35];
export const KRYPTON = ATOMS_BY_ID[36];
export const RUBIDIUM = ATOMS_BY_ID[37];
export const STRONTIUM = ATOMS_BY_ID[38];
export const YTTRIUM = ATOMS_BY_ID[39];
export const ZIRCONIUM = ATOMS_BY_ID[40];
export const NIOBIUM = ATOMS_BY_ID[41];
export const MOLYBDENUM = ATOMS_BY_ID[42];
export const TECHNETIUM = ATOMS_BY_ID[43];
export const RUTHENIUM = ATOMS_BY_ID[44];
export const RHODIUM = ATOMS_BY_ID[45];
export const PALLADIUM = ATOMS_BY_ID[46];
export const SILVER = ATOMS_BY_ID[47];
export const CADMIUM = ATOMS_BY_ID[48];
export const INDIUM = ATOMS_BY_ID[49];
export const TIN = ATOMS_BY_ID[50];
export const ANTIMONY = ATOMS_BY_ID[51];
export const TELLURIUM = ATOMS_BY_ID[52];
export const IODINE = ATOMS_BY_ID[53];
export const XENON = ATOMS_BY_ID[54];
export const CESIUM = ATOMS_BY_ID[55];
export const BARIUM = ATOMS_BY_ID[56];
export const LANTHANUM = ATOMS_BY_ID[57];
export const CERIUM = ATOMS_BY_ID[58];
export const PRASEODYMIUM = ATOMS_BY_ID[59];
export const NEODYMIUM = ATOMS_BY_ID[60];
export const PROMETHIUM = ATOMS_BY_ID[61];
export const SAMARIUM = ATOMS_BY_ID[62];
export const EUROPIUM = ATOMS_BY_ID[63];
export const GADOLINIUM = ATOMS_BY_ID[64];
export const TERBIUM = ATOMS_BY_ID[65];
export const DYSPROSIUM = ATOMS_BY_ID[66];
export const HOLMIUM = ATOMS_BY_ID[67];
export const ERBIUM = ATOMS_BY_ID[68];
export const THULIUM = ATOMS_BY_ID[69];
export const YTTERBIUM = ATOMS_BY_ID[70];
export const LUTETIUM = ATOMS_BY_ID[71];
export const HAFNIUM = ATOMS_BY_ID[72];
export const TANTALUM = ATOMS_BY_ID[73];
export const TUNGSTEN = ATOMS_BY_ID[74];
export const RHENIUM = ATOMS_BY_ID[75];
export const OSMIUM = ATOMS_BY_ID[76];
export const IRIDIUM = ATOMS_BY_ID[77];
export const PLATINUM = ATOMS_BY_ID[78];
export const GOLD = ATOMS_BY_ID[79];
export const MERCURY = ATOMS_BY_ID[80];
export const THALLIUM = ATOMS_BY_ID[81];
export const LEAD = ATOMS_BY_ID[82];
export const BISMUTH = ATOMS_BY_ID[83];
export const POLONIUM = ATOMS_BY_ID[84];
export const ASTATINE = ATOMS_BY_ID[85];
export const RADON = ATOMS_BY_ID[86];
export const FRANCIUM = ATOMS_BY_ID[87];
export const RADIUM = ATOMS_BY_ID[88];
export const ACTINIUM = ATOMS_BY_ID[89];
export const THORIUM = ATOMS_BY_ID[90];
export const PROTACTINIUM = ATOMS_BY_ID[91];
export const URANIUM = ATOMS_BY_ID[92];
export const NEPTUNIUM = ATOMS_BY_ID[93];
export const PLUTONIUM = ATOMS_BY_ID[94];
export const AMERICIUM = ATOMS_BY_ID[95];
export const CURIUM = ATOMS_BY_ID[96];
export const BERKELIUM = ATOMS_BY_ID[97];
export const CALIFORNIUM = ATOMS_BY_ID[98];
export const EINSTEINIUM = ATOMS_BY_ID[99];
export const FERMIUM = ATOMS_BY_ID[100];
export const MENDELEVIUM = ATOMS_BY_ID[101];
export const NOBELIUM = ATOMS_BY_ID[102];
export const LAWRENCIUM = ATOMS_BY_ID[103];
export const RUTHERFORDIUM = ATOMS_BY_ID[104];
export const DUBNIUM = ATOMS_BY_ID[105];
export const SEABORGIUM = ATOMS_BY_ID[106];
export const BOHRIUM = ATOMS_BY_ID[107];
export const HASSIUM = ATOMS_BY_ID[108];
export const MEITNERIUM = ATOMS_BY_ID[109];
export const DARMSTADTIUM = ATOMS_BY_ID[110];
export const ROENTGENIUM = ATOMS_BY_ID[111];
export const COPERNICIUM = ATOMS_BY_ID[112];
export const NIHONIUM = ATOMS_BY_ID[113];
export const FLEROVIUM = ATOMS_BY_ID[114];
export const MOSCOVIUM = ATOMS_BY_ID[115];
export const LIVERMORIUM = ATOMS_BY_ID[116];
export const TENNESSINE = ATOMS_BY_ID[117];
export const OGANESSON = ATOMS_BY_ID[118];

// Type-safe accessor functions
export function getAtomBySymbol(symbol: string): AtomData | undefined {
    return ATOMS_BY_SYMBOL[symbol];
}

export function getAtomById(id: number): AtomData | undefined {
    return ATOMS_BY_ID[id];
}

// Get all atoms as an array
export function getAllAtoms(): ReadonlyArray<AtomData> {
    return ATOM_DATA;
}

// Legacy export for backward compatibility
export const ATOMS = ATOMS_BY_SYMBOL;