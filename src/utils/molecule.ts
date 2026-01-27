import * as THREE from 'three'
import type { Compound, PubChemResponse } from './pubchem/types';

// const ELEMENT_NAMES: Record<number, string> = {
//     1: 'Hydrogen', 6: 'Carbon', 7: 'Nitrogen', 8: 'Oxygen',
//     15: 'Phosphorus', 16: 'Sulfur', 17: 'Chlorine', 9: 'Fluorine'
// };

// Atom colors (CPK coloring)
const ATOM_COLORS: Record<number, number> = {
    1: 0xffffff,  // Hydrogen - white
    6: 0x909090,  // Carbon - gray
    7: 0x3050f8,  // Nitrogen - blue
    8: 0xff0d0d,  // Oxygen - red
    15: 0xff8000, // Phosphorus - orange
    16: 0xffff30, // Sulfur - yellow
};

// Atom sizes (van der Waals radii scale)
const ATOM_SIZES: Record<number, number> = {
    1: 0.3,   // Hydrogen   
    6: 0.5,   // Carbon
    7: 0.5,   // Nitrogen
    8: 0.5,   // Oxygen
    15: 0.6,  // Phosphorus
    16: 0.6,  // Sulfur
};

export function createMolecule(data: PubChemResponse): THREE.Group {
    const compound = data.PC_Compounds[0]
    const atomPositions = getAtomPositions(compound)

    const molecule = new THREE.Group()

    // Create atom meshes
    compound.atoms.element.forEach((element: number, i) => {
        const radius = ATOM_SIZES[element] || 0.5
        const color = ATOM_COLORS[element] || 0xffc0cb

        const geometry = new THREE.SphereGeometry(radius, 32, 32);
        const material = new THREE.MeshLambertMaterial({ color: color});
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(...atomPositions[i])
        molecule.add(sphere)
    })

    // Create bond meshes
    compound.bonds.aid1.forEach((aid1, i) => {
        const aid2 = compound.bonds.aid2[i]
        const order = compound.bonds.order[i]

        const pos1 = new THREE.Vector3(...atomPositions[aid1 - 1])
        const pos2 = new THREE.Vector3(...atomPositions[aid2 - 1])

        const direction = new THREE.Vector3().subVectors(pos2, pos1)
        const length = direction.length()
        const midpoint = new THREE.Vector3().addVectors(pos1, pos2).multiplyScalar(0.5);
        
        for (let b = 0; b < order; b++) {
            const offset = (order > 1) ? (b - (order - 1) / 2) * 0.2 : 0;
            
            const geometry = new THREE.CylinderGeometry(0.1, 0.1, length, 8);
            const material = new THREE.MeshLambertMaterial({ color: 0xcccccc });
            const cylinder = new THREE.Mesh(geometry, material);

            cylinder.position.copy(midpoint);
            if (offset !== 0) {
                const perpendicular = new THREE.Vector3(1, 0, 0);
                if (Math.abs(direction.dot(perpendicular)) > 0.9) {
                perpendicular.set(0, 1, 0);
                }
                perpendicular.cross(direction).normalize();
                cylinder.position.add(perpendicular.multiplyScalar(offset));
            }

            cylinder.quaternion.setFromUnitVectors(
                new THREE.Vector3(0, 1, 0),
                direction.normalize()
            );

            molecule.add(cylinder);
        }
    })
    return molecule;
}


function getAtomPositions(compound: Compound): [number, number, number][] {
    
    // Get 3D coordinates
    const coords = compound.coords[0].conformers[0];
    const x = coords.x;
    const y = coords.y;
    const z = coords.z;

    // Calculate center of molecule
    let centerX = 0, centerY = 0, centerZ = 0;
    const numAtoms = x.length;
    
    for (let i = 0; i < numAtoms; i++) {
        centerX += x[i];
        centerY += y[i];
        centerZ += z?.[i] ?? 0;
    }
    
    centerX /= numAtoms;
    centerY /= numAtoms;
    centerZ /= numAtoms;

    const atomPositions = x.map((xi, i) => [
        xi - centerX, 
        y[i] - centerY, 
        (z?.[i] ?? 0) - centerZ
    ]);

    return atomPositions as [number, number, number][];
}

