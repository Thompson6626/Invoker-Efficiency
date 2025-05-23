"use client"

import { useEffect, useState } from "react"
import { Orb } from "./constants/orbs"
import { ALL_SPELLS, type CastedSpell, isOfTypeCastedSpell, type Spell } from "./constants/spells"
import { areMapsEqual } from "./utils/utils"
import "./App.css"

function createEmptyComposition(): Map<Orb, number> {
    return new Map<Orb, number>([
        [Orb.Quas, 0],
        [Orb.Wex, 0],
        [Orb.Exort, 0],
    ])
}

function App() {
    const [orbs, setOrbs] = useState<Orb[]>([Orb.Nothing, Orb.Nothing, Orb.Nothing]);
    const [inputs, setInputs] = useState<(CastedSpell | Orb)[]>([]);
    const [started, setStarted] = useState(false);
    const [efficiency, setEfficiency] = useState<string[]>([]);
    const [latestEfficiency, setLatestEfficiency] = useState<string>("0.00");
    const [averageEfficiency, setAverageEfficiency] = useState<string>("0.00");

    const getSpellFromCombination = (currentOrbs: Orb[]): Spell | null => {
        const composition = currentOrbs.reduce((map, orb) => {
            if (orb !== Orb.Nothing) {
                map.set(orb, (map.get(orb) ?? 0) + 1);
            }
            return map;
        }, createEmptyComposition());

        return ALL_SPELLS.find((spell) => areMapsEqual(spell.orbComposition, composition)) ?? null;
    };

    const pushOrb = (orb: Orb) => {
        setOrbs((prevOrbs) => [...prevOrbs.slice(1), orb]);
    };

    const calculateEfficiency = (updatedInputs: (CastedSpell | Orb)[]) => {
        const inputLength = updatedInputs.length;
        const lastSpell = updatedInputs[inputLength - 1] as CastedSpell;

        const lastSpellComposition = createEmptyComposition();
        for (const orb of lastSpell.orbSequence) {
            if (orb !== Orb.Nothing) {
                lastSpellComposition.set(orb, lastSpellComposition.get(orb)! + 1);
            }
        }

        const orbInputsBetweenSpells: Orb[] = [];
        let offset = 2;

        while (inputLength - offset >= 0 && !isOfTypeCastedSpell(updatedInputs[inputLength - offset])) {
            const inputOrb = updatedInputs[inputLength - offset] as Orb;
            orbInputsBetweenSpells.push(inputOrb);
            offset++;
        }

        if (inputLength - offset < 0) return;

        const previousSpell = updatedInputs[inputLength - offset] as CastedSpell;

        let remainingOrbs = 2;
        while (remainingOrbs >= 0) {
            const orb = previousSpell.orbSequence[remainingOrbs];
            const count = lastSpellComposition.get(orb);
            if (!count) break;
            lastSpellComposition.set(orb, count - 1);
            remainingOrbs--;
        }

        const optimalKeyPresses = remainingOrbs + 1;
        const actualKeyPresses = orbInputsBetweenSpells.length;
        const efficiencyPercentage = (optimalKeyPresses / actualKeyPresses) * 100;
        const latestEfficiency = efficiencyPercentage.toFixed(2);

        const newEfficiency = [...efficiency,latestEfficiency];
        setEfficiency(newEfficiency);
        setLatestEfficiency(latestEfficiency);

        const sum = newEfficiency.reduce((acc, val) => acc + parseFloat(val), 0);
        setAverageEfficiency((sum / newEfficiency.length).toFixed(2));
    };

    const handleStart = () => {
        setStarted(true);
        setOrbs([Orb.Nothing, Orb.Nothing, Orb.Nothing]);
        setInputs([]);
        setEfficiency([]);
        setAverageEfficiency("0.00");
    };

    const getCurrentSpell = (): Spell | null => {
        return getSpellFromCombination(orbs);
    };

    useEffect(() => {
        if (!started) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key.toLowerCase()) {
                case "q":
                    pushOrb(Orb.Quas);
                    setInputs((prevInputs) => [...prevInputs, Orb.Quas]);
                    break;
                case "w":
                    pushOrb(Orb.Wex);
                    setInputs((prevInputs) => [...prevInputs, Orb.Wex]);
                    break;
                case "e":
                    pushOrb(Orb.Exort);
                    setInputs((prevInputs) => [...prevInputs, Orb.Exort]);
                    break;
                case "r": {
                    const spell = getSpellFromCombination(orbs);
                    if (spell !== null) {
                        const newCastedSpell: CastedSpell = { spell, orbSequence: [...orbs] as [Orb,Orb,Orb] };
                        setInputs((prevInputs) => {
                            const updatedInputs = [...prevInputs, newCastedSpell];
                            if (prevInputs.some(isOfTypeCastedSpell)) {
                                calculateEfficiency(updatedInputs);
                            }
                            return updatedInputs;
                        });
                    }
                    break;
                }
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [started, orbs, efficiency]);

    const currentSpell = getCurrentSpell();

    const recentSpells = inputs
        .filter(isOfTypeCastedSpell)
        .map((input) => input as CastedSpell)
        .slice(-5)
        .reverse();

    const getOrbIcon = (orb: Orb) => {
        return orb === Orb.Nothing ? "" : `images/${orb}_icon.webp`;
    };

    return (
        <div className="dota-app">
            <div className="dota-header">
                <h1>Invoker Trainer</h1>
            </div>

            {!started ? (
                <div className="dota-start-screen">
                    <div className="dota-start-content">
                        <h2>Master the Art of Invocation</h2>
                        <p>Press Q, W, E to invoke orbs and R to cast spells</p>
                        <button className="dota-button" onClick={handleStart}>
                            Start Training
                        </button>
                    </div>
                </div>
            ) : (
                <div className="dota-game-ui">
                    <div className="dota-orbs-container">
                        {orbs.map((orb, index) => (
                            <div key={index} className={`dota-orb ${orb.toLowerCase()}`} title={orb !== Orb.Nothing ? orb : "Empty"}>
                                {orb !== Orb.Nothing && (
                                    <>
                                        <img
                                            src={getOrbIcon(orb) || "/placeholder.svg"}
                                            alt={orb}
                                            className="orb-icon"
                                            onError={(e) => {
                                                // Fallback if image fails to load
                                                e.currentTarget.style.display = "none"
                                                const parent = e.currentTarget.parentElement
                                                if (parent) {
                                                    const span = document.createElement("span")
                                                    span.className = "orb-key"
                                                    span.textContent = orb === Orb.Quas ? "Q" : orb === Orb.Wex ? "W" : "E"
                                                    parent.appendChild(span)
                                                }
                                            }}
                                        />
                                        <span className="orb-key-label">{orb === Orb.Quas ? "Q" : orb === Orb.Wex ? "W" : "E"}</span>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="dota-spell-container">
                        <div className="dota-current-spell">
                            {currentSpell ? (
                                <>
                                    <div className="spell-icon">
                                        <img
                                            src={currentSpell.image || "/placeholder.svg"}
                                            alt={currentSpell.name}
                                            className="spell-image"
                                            onError={(e) => {
                                                // Fallback if image fails to load
                                                e.currentTarget.style.display = "none"
                                                const parent = e.currentTarget.parentElement
                                                if (parent) {
                                                    const span = document.createElement("span")
                                                    span.className = "spell-name"
                                                    span.textContent = currentSpell.name
                                                    parent.appendChild(span)
                                                }
                                            }}
                                        />
                                        <span className="spell-name">{currentSpell.name}</span>
                                    </div>
                                    <div className="spell-key">R</div>
                                </>
                            ) : (
                                <div className="spell-icon empty">
                                    <span className="spell-name">No Spell</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="dota-stats-container">
                        <div>
                            <div className="dota-efficiency">
                                <h3>Casting Efficiency</h3>
                                <div className="efficiency-value">{averageEfficiency}%</div>
                                <div className="efficiency-label">Average</div>
                            </div>
                            <div className="dota-efficiency">
                                <h3>Latest Efficiency</h3>
                                <div className="efficiency-value">{latestEfficiency}%</div>
                            </div>
                        </div>


                        <div className="dota-spell-history">
                            <h3>Recent Spells</h3>
                            <div className="spell-history-list">
                                {recentSpells.length > 0 ? (
                                    recentSpells.map((castedSpell, index) => (
                                        <div key={index} className="spell-history-item">
                                            <div className="spell-history-info">
                                                <img
                                                    src={castedSpell.spell.image || "/placeholder.svg"}
                                                    alt={castedSpell.spell.name}
                                                    className="spell-history-image"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = "none"
                                                    }}
                                                />
                                                <span className="spell-history-name">{castedSpell.spell.name}</span>
                                            </div>
                                            <div className="spell-history-orbs">
                                                {castedSpell.orbSequence.map((orb, orbIndex) => (
                                                    <div key={orbIndex} className={`history-orb ${orb.toLowerCase()}`} title={orb}>
                                                        {orb !== Orb.Nothing && (
                                                            <img
                                                                src={getOrbIcon(orb) || "/placeholder.svg"}
                                                                alt={orb}
                                                                className="history-orb-icon"
                                                                onError={(e) => {
                                                                    e.currentTarget.style.display = "none"
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-spells">No spells cast yet</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="dota-controls">
                        <button className="dota-button" onClick={handleStart}>
                            Reset
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default App
