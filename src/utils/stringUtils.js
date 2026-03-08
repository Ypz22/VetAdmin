export function getInitials(name) {
    if (!name) return "";
    const words = name.trim().split(" ");
    if (words.length === 1) {
        return words[0].charAt(0).toUpperCase() + (words[0].length > 1 ? words[0].charAt(1).toUpperCase() : "");
    }
    return words[0].charAt(0).toUpperCase() + words[1].charAt(0).toUpperCase();;
}

export function toCapitalizeCase(text) {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export const shortId = (id, length = 6) => {
    if (!id) return "";
    return id.replace(/-/g, "").slice(0, length).toUpperCase();
};

export function toTitleCase(text) {
    if (!text) return "";

    return text
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}