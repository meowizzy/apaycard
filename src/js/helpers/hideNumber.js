export function hideNumber(props) {
    const {
        phone,
        replaceTo = '*',
        elemsHide = 4,
        sliceFromBack = 4
    } = props;
    const rangeStart = sliceFromBack;
    const rangeEnd = sliceFromBack + elemsHide;

    if (!phone) {
        return "";
    }

    return Array.from(phone).reduceRight((ctx, char) => {
        const isDigit = char >= '0' && char <= '9';
        const offset = ctx.offset + (isDigit ? 1 : 0);
        const filteredChar = isDigit && (offset >= rangeStart && offset < rangeEnd) ? replaceTo : char;
        const filtered = filteredChar + ctx.filtered;
        return { offset, filtered };
    }, { offset: -1, filtered: '' }).filtered;
}