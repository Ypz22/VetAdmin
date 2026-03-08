export function getSpeciesColor(species) {
    let hash = 0;

    for (let i = 0; i < species.length; i++) {
        hash = species.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;

    return {
        bg: `hsla(${hue}, 70%, 60%, 0.1)`,
        text: `hsl(${hue}, 70%, 40%)`,
    };
}