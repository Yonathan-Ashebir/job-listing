import type { SortOption } from '../types';
import { colors } from '../theme/colors';
import { dimensions } from '../theme/dimensions';
import { fonts } from '../theme/fonts';
import { typography } from '../theme/typography';

type HeadlineProps = {
    resultsCount: number;
    sortBy: SortOption;
    onSortChange: (sortBy: SortOption) => void;
};

const Sort = ({ sortBy, onSortChange }: { sortBy: SortOption; onSortChange: (sortBy: SortOption) => void }) => {
    return (
        <div className="flex flex-nowrap items-center" style={{ gap: dimensions.spacing.md, flexShrink: 0 }}>
            <span
                className="text-right whitespace-nowrap"
                style={{
                    fontFamily: fonts.epilogue,
                    fontWeight: typography.fontWeights.regular,
                    fontSize: typography.fontSizes.sm,
                    lineHeight: typography.lineHeights.normal,
                    letterSpacing: typography.letterSpacing.none,
                    height: dimensions.heights.sortLabel,
                    color: colors.gray.medium,
                    flexShrink: 0,
                }}
            >
                Sort By:
            </span>
            <div className="relative flex items-center flex-nowrap" style={{ gap: dimensions.spacing.sm, flexShrink: 0 }}>
                <select
                    value={sortBy}
                    onChange={(e) => {
                        onSortChange(e.target.value as SortOption);
                    }}
                    className="appearance-none bg-transparent font-medium text-gray-900 cursor-pointer focus:outline-none border-none whitespace-nowrap"
                    style={{
                        fontFamily: fonts.epilogue,
                        fontWeight: typography.fontWeights.medium,
                        fontSize: typography.fontSizes.sm,
                        lineHeight: typography.lineHeights.normal,
                        letterSpacing: typography.letterSpacing.none,
                        height: dimensions.heights.sortLabel,
                        flexShrink: 0,
                    }}
                >
                    <option value="Most relevant">Most relevant</option>
                    <option value="Most recent">Most recent</option>
                </select>
                <div className="pointer-events-none flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.6667 5.66663L8 10.3333L3.33333 5.66663" stroke={colors.primary.blue} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12.6667 5.66663L8 10.3333L3.33333 5.66663" stroke={colors.black} strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12.6667 5.66663L8 10.3333L3.33333 5.66663" stroke={colors.black} strokeOpacity="0.2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
            </div>
        </div>
    );
};

const Headline = ({ resultsCount, sortBy, onSortChange }: HeadlineProps) => {
    return (
        <div className="flex justify-between items-center mb-8">
            <div className='flex flex-col'>
                <h1
                    className="font-black text-gray-900 mb-1"
                    style={{
                        fontFamily: fonts.poppins,
                        fontWeight: typography.fontWeights.black,
                        fontSize: typography.fontSizes.lg,
                        lineHeight: typography.lineHeights.tight,
                        letterSpacing: typography.letterSpacing.none,
                    }}
                >
                    Opportunities
                </h1>

                <p
                    style={{
                        fontFamily: fonts.epilogue,
                        fontWeight: typography.fontWeights.regular,
                        fontSize: typography.fontSizes.sm,
                        lineHeight: typography.lineHeights.normal,
                        letterSpacing: typography.letterSpacing.none,
                        color: colors.gray.medium,
                    }}
                >
                    Showing {resultsCount} results
                </p>
            </div>

            <div className="flex items-center" style={{ gap: dimensions.spacing.lg, marginLeft: '20px' }}>
                <Sort sortBy={sortBy} onSortChange={onSortChange} />

                <div
                    className="opacity-10"
                    style={{
                        width: '0px',
                        height: dimensions.sizes.divider.height,
                        borderLeft: `1px solid ${colors.blackOpacity}`,
                    }}
                />
            </div>
        </div>
    );
};

export default Headline;

