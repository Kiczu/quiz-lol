/**
 * Shared sizing helpers for the app shell.
 *
 * #root and main are flex columns (see index.css), so a view fills the space
 * left below the navigation by growing into it, instead of guessing with a
 * viewport unit. Guessing with 100vh always overflows by the height of the
 * navigation and leaves a scrollbar on pages that fit.
 */

/**
 * Grows into any spare space but never shrinks below its own content.
 * `1 0 auto` rather than `1`: a zero flex-basis would make the box ignore how
 * tall its children actually are, letting long content spill outside it.
 */
export const fillColumn = {
    display: "flex",
    flexDirection: "column",
    flex: "1 0 auto",
};

/** As fillColumn, without imposing a layout on its children. */
export const fill = {
    flex: "1 0 auto",
};
