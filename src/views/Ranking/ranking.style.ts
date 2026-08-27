import { colors } from "../../theme/colors"
import { fill, fillColumn } from "../../theme/layout";
import { getMultiColumnGradientSx } from "../../utils/gradient";

export const rankingContainer = {
    backgroundColor: colors.background,
    color: colors.textPrimary,
    ...fillColumn,
}

export const rankignOverlay = {
    ...fill,
    backdropFilter: "blur(4px)",
    backgroundColor: colors.overlayBackground,
    padding: {
        xs: "20px 0",
        sm: "20px 24px",
        md: "20px 60px",
        lg: "20px 80px"
    },
}

export const rankingHeader = {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    textAlign: "center",
    m: 4,
}

export const getRankingWrapperSx = (columns: number, idx: number, border = 2) => ({
    ...getMultiColumnGradientSx(columns, idx, colors.accentGradient),
    borderRadius: 0,
    p: `${border}px`,
    boxSizing: "border-box",
});

export const rankingTable = {
    background: colors.backgroundSecondary,
    borderRadius: 5,
    overflowX: "auto",
};

/**
 * The minimum width belongs on the table, not on its scroll container:
 * a min-width on the container stops it from shrinking to the screen, so it
 * bursts out of its frame instead of scrolling its contents.
 */
export const rankingTableContent = {
    minWidth: 380,
};

export const rankingTableCell = {
    color: "#F0E6D2",
    fontWeight: "bold",
    fontSize: 18,
}

export const rankingTableRow = {
    border: "none",
}

export const getRankCellSx = (index: number) => ({
    color:
        index === 0
            ? colors.gold3
            : index === 1
                ? colors.textPrimary
                : index === 2
                    ? colors.blue2
                    : colors.textSecondary,
    fontWeight: index < 3 ? "bold" : "normal",
});

export const getUsernameCellSx = {
    color: colors.textSecondary,
    display: "flex",
    alignItems: "center",
};

export const getAvatarSx = (index: number) => ({
    width: 46,
    height: 46,
    border:
        index === 0
            ? `2px solid ${colors.gold3}`
            : index === 1
                ? `2px solid ${colors.textPrimary}`
                : index === 2
                    ? `2px solid ${colors.blue2}`
                    : `2px solid ${colors.grey2}`,
    mr: 2,
    bgcolor: colors.gradientBlue,
});

export const getScoreCellSx = (index: number) => ({
    color: colors.gold2,
    fontWeight: index < 3 ? "bold" : "normal",
    fontSize: 19,
});

export const getRowMotionProps = (index: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: index * 0.08 },
    style: { display: "table-row" },
});

export const getTableRowSx = (isLast: boolean) => ({
    borderBottom: isLast ? "none" : "1.5px solid #32281E",
    transition: "background 0.2s",
    "&:hover": {
        background: "rgba(200,170,62,0.10)",
    },
});
