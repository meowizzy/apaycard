export const cleanPhoneNumber = (phone) => {
    return phone.replace(/[^+\d]+/g, "");
};

export const normalizePhoneNumber = (phone) => {
    if (!phone) return "";

    const cleaned = phone.replace(/[^\d+*•]/g, "");

    return cleaned.replace(
        /^(\+998)(\d{2})(\d)(.{2})(.{2})(.{2})$/,
        "$1 $2 $3$4 $5 $6"
    );
};