import { Orb } from "./orbs";

export type Spell = {
    name: string;
    image: string;
    orbComposition: Map<Orb, number>; 
};

export type CastedSpell = {
    spell: Spell;
    orbSequence: [Orb, Orb, Orb]; 
};

export const COLD_SNAP: Spell = {
    name: "Cold Snap",
    image: "images/Cold_Snap_icon.webp",
    orbComposition: new Map([
        [Orb.Quas, 3],
        [Orb.Wex, 0],
        [Orb.Exort, 0],
    ])
};

export const GHOST_WALK: Spell = {
    name: "Ghost Walk",
    image: "images/Ghost_Walk_icon.webp",
    orbComposition: new Map([
        [Orb.Quas, 2],
        [Orb.Wex, 1],
        [Orb.Exort, 0],
    ])
};

export const ICEWALL: Spell = {
    name: "Ice Wall",
    image: "images/Ice_Wall_icon.webp",
    orbComposition: new Map([
        [Orb.Quas, 2],
        [Orb.Wex, 0],
        [Orb.Exort, 1],
    ])
};

export const EMP: Spell = {
    name: "EMP",
    image: "images/E.M.P._icon.webp",
    orbComposition: new Map([
        [Orb.Quas, 0],
        [Orb.Wex, 3],
        [Orb.Exort, 0],
    ])
};

export const TORNADO: Spell = {
    name: "Tornado",
    image: "images/Tornado_icon.webp",
    orbComposition: new Map([
        [Orb.Quas, 1],
        [Orb.Wex, 2],
        [Orb.Exort, 0],
    ])
};

export const ALACRITY: Spell = {
    name: "Alacrity",
    image: "images/Alacrity_icon.webp",
    orbComposition: new Map([
        [Orb.Quas, 0],
        [Orb.Wex, 2],
        [Orb.Exort, 1],
    ])
};

export const SUNSTRIKE: Spell = {
    name: "Sun Strike",
    image: "images/Sun_Strike_icon.webp",
    orbComposition: new Map([
        [Orb.Quas, 0],
        [Orb.Wex, 0],
        [Orb.Exort, 3],
    ])
};

export const FORGE_SPIRIT: Spell = {
    name: "Forge Spirit",
    image: "images/Forge_Spirit_icon.webp",
    orbComposition: new Map([
        [Orb.Quas, 1],
        [Orb.Wex, 0],
        [Orb.Exort, 2],
    ])
};

export const CHAOS_METEOR: Spell = {
    name: "Chaos Meteor",
    image: "images/Chaos_Meteor_icon.webp",
    orbComposition: new Map([
        [Orb.Quas, 0],
        [Orb.Wex, 1],
        [Orb.Exort, 2],
    ])
};

export const DEAFENING_BLAST: Spell = {
    name: "Deafening Blast",
    image: "images/Deafening_Blast_icon.webp",
    orbComposition: new Map([
        [Orb.Quas, 1],
        [Orb.Wex, 1],
        [Orb.Exort, 1],
    ])
};


export const ALL_SPELLS = [
    SUNSTRIKE,
    CHAOS_METEOR,
    COLD_SNAP,
    EMP,
    DEAFENING_BLAST,
    ALACRITY,
    ICEWALL,
    FORGE_SPIRIT,
    TORNADO,
    GHOST_WALK
];


export function isOfTypeCastedSpell(object: any): object is CastedSpell {
    return typeof object === 'object' &&
        object !== null &&
        'spell' in object &&
        typeof object.spell === 'object' &&
        'orbSequence' in object &&
        Array.isArray(object.orbSequence) &&
        object.orbSequence.length === 3;
}
